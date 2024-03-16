//import for react stuffs
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, ActivityIndicator, Platform } from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from "react-native-modal";
import {Asset} from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

// import for components
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import SortModal from '../components/SortModal';

//import vector-icons
import AntDesign from '@expo/vector-icons/AntDesign';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const dbSettings = SQLite.openDatabase("settings4.db");
const db = SQLite.openDatabase('_journal_database.db');

const AddModal = ({visible, type, handleModal}) => {
  const theme = useTheme();

  const handlePress = (item) =>{
    type(item);
    handleModal();
  }

  return(
    <>
      <Modal
        isVisible={visible}
        style={[styles.flex, {margin: 0, flex:1,}]}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackButtonPress={handleModal}
        onBackdropPress={handleModal}
        backdropOpacity={0.5}
        animated
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
      >
      
        <View style={{
            backgroundColor: theme.colors.primary,
            borderWidth: 1,
            borderColor: theme.colors.borderColor,
            padding: 20,
            borderRadius: 10,
            alignItems:'left',
            flexDirection:'column',
            justifyContent:"center",
            width: '70%',
        }} >
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <MaterialIcons name="post-add" size={28} color={theme.colors.textColor} />           
            <Text style={{fontSize: theme.fonts.fontSize+6,  color: theme.colors.textColor, }}>Add</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => handlePress()} 
            style={[styles.btn, {alignItems: "left", backgroundColor: theme.colors.secondary, flexDirection: 'row', gap: 5}]}
          >
            <Entypo name="book" size={26} color={theme.colors.textColor} />
            <Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor, textAlign:'right'}}>Journal Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handlePress("opm")} 
            style={[styles.btn, {alignItems: "left", flexDirection: 'row', gap: 10, backgroundColor:  theme.colors.secondary}]}
          >
            <Entypo name="open-book" size={26} color={theme.colors.textColor} />
            <Text style={{fontSize: theme.fonts.fontSize+2,  color: theme.colors.textColor,}}>OPM Reflection</Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </>
  );
}

export default function Home({navigation, route}) {
  const theme = useTheme();
  // import for data
  const [notes, setNotes] = useState([]);// showing all the data
  const [notesJournal, setNotesJournal] = useState([]);// showing all the data
  const [notesOPM, setNotesOPM] = useState([]);// showing all the data

  const [notesId, setNotesId] = useState([]);

  const isFocused = useIsFocused();

  //states for sorting
  const [allCount, setAllCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [opmCount, setOpmCount] = useState(0);
  const sortButtonCount = [allCount, journalCount, opmCount];

  //for dates
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const todayDate = new Date();
  const today ={
    day: todayDate.getDate(),
    month: months[todayDate.getMonth()],
    year: todayDate.getFullYear(),
  };

  //const todayVerse = data[today.month][today.day-1]["verse"]; // for setting today's verse
  const [visibleAddModal, setVisibleAddModal] = useState(false); // add modal
  const [todayVerse, setTodayVerse] = useState("");

  //states for loading indicators
  const [noteListLoading, setNoteListLoading] = useState(true);
  const [verseLoading, setVerseLoading] = useState(true);

  //Sort Bottom Sheet
  const [sortModal, setSortModal] = useState(false);

  const handleSortModal = (item) =>{
    setSortModal(item)
  }


  // //FUNCTIONS FOR DAILY STREAK
  // const [streakCount, setStreakCount] = useState(0); 
  // const [streakDate, setStreakDate] = useState();


  // const fetchStreakCount = () =>{
  //   dbSettings.transaction((tx) => {
  //     tx.executeSql(
  //     'SELECT dailyStreak, dailyStreakDate FROM settings WHERE id = ?',
  //     [1],
  //     (_, result) => {
  //         const rows = result.rows;
  //         const dataArray = [];
  //         for (let i = 0; i < rows.length; i++) {
  //           const item = rows.item(i);
  //           dataArray.push(item);
          
  //         }
  //         setStreakCount(dataArray[0].dailyStreak);
  //         setStreakDate(dataArray[0].dailyStreakDate);  
        
  //         console.log("Daily Streak Fetched");
          
  //       },
  //       (_, error) => {
  //         console.error('Error querying data:', error);
  //       }
  //     );
  //   });
  // };

  const updateStreakCount = (count, date) =>{
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'UPDATE settings SET dailyStreak = ?, dailyStreakDate = ? WHERE id = ?;',
        [count, date, 1],
        (_, result) => {
          console.log('Data SETTINGS:dailyStreak updated successfully');
          fetchStreakCount();
        },
        (_, error) => {
          console.error('Error updating SETTINGS:dailyStreak data:', error);
        }
        );
    });
  }

  // NAVIGATION FUNCTIONS

  const openBrp = () => {
    navigation.navigate("BRP");
  }

  const openEntry = (type, scripture) => {
    navigation.navigate("Home", {
      screen: 'Entry',
      params: {
        verse: scripture,
        entryType: type,
        index: months.indexOf(todayVerse?.month),
        itemId: todayVerse?.id,
        state: 'add',
      },
    });
  }

  const openDisplayEntry = (item) => {
    navigation.navigate("Home", {
      screen: 'Entry',
      params: {
        entryId: item.dataId,
        entryType: item.type,
        state: 'update',
      },
    });
  }

  //HANDLE FUNCTIONS


  // when add write button is clicked
  const handleAddButton = (item) => {

    if(item == "today"){
      if(todayVerse.verse == "Sermon Notes"){
        openEntry("sermon", "");
      }else{
        openEntry("journal", todayVerse.verse);
      }

    } 
    else {
      if(item == "opm"){
        openEntry("opm", "");
      }else{
        openBrp()
      }
    }
  
  }

  const handleVisibleAddModal = () => {
    setVisibleAddModal(!visibleAddModal);
  }

  // DB and FETCH FUNCTION

  const handleDisplayEntryFetch = (item) =>{
    openDisplayEntry(item);
  }

  const fetchData = (type) => {
    if(type == "journal"){
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM entries WHERE settingState = ? AND type = ? OR type = ? ORDER BY modifiedDate DESC;",
          [ "normal", "journal", "sermon"],
          (_, result) => {
            const rows = result.rows;
            setJournalCount(rows.length);
            const dataArray = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              dataArray.push(item);
            }
            setNotesJournal(dataArray);
          },
          (_, error) => {
            console.error('Error querying data:', error);
          }
        );
      });
      
    } else{
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM entries WHERE type = ? AND settingState = ? ORDER BY modifiedDate DESC;",
          ["opm", "normal"],
          (_, result) => {
            const rows = result.rows;
            setOpmCount(rows.length);
            const dataArray = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              dataArray.push(item);
            }
            setNotesOPM(dataArray);
          },
          (_, error) => {
            console.error('Error querying data:', error);
          }
        );
      });
    }
  };

  const fetchAllData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries WHERE settingState = ? ORDER BY modifiedDate DESC;",
        ["normal"],
        (txObj, result) => {
          const rows = result.rows;
          const dataArray = [];
          const dataArray2 = [];

          setAllCount(rows.length);
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(item);
            dataArray2.push(parseInt(item.dataId));

          }
          setNotes(dataArray);
          setNotesId(dataArray2);
          setNoteListLoading(false);
          console.log("Fetched All Data")
        },
        (_, error) => {
          console.error('Error querying data:', error);
        }
      );
    });
  };

  const fetchTodayVerse = async () => {
    const dbBrp = await openBrpDatabase();
    return new Promise( () => {
      dbBrp.transaction((tx) => {
          tx.executeSql('SELECT * FROM brp2024 WHERE month = ? AND day = ?', [today.month, today.day],
          (_, result) => {
            const rows = result.rows;
            const dataArray = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              dataArray.push(item);
            }
            setTodayVerse(...dataArray);
            
            setVerseLoading(false);
          },
          (_, error) => {
                console.error('Error querying data:', error);
          }
          );
      })
    });
  };


  async function openBrpDatabase() {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
      }
    else{
      await FileSystem.downloadAsync(
            Asset.fromModule(require('../assets/brpDatabase.db')).uri,
            FileSystem.documentDirectory + 'SQLite/brpDatabase.db'
      );
  }
    return SQLite.openDatabase("brpDatabase.db");
  };

  //creating the table
  const setupEntriesDatabase = () => {
    // Check if the table exists
    setNoteListLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT name FROM sqlite_master WHERE type="table" AND name="entries";',
        [],
        (_, result) => {
          const tableExists = result.rows.length > 0;

          if (!tableExists) {
            // Table doesn't exist, create it
            db.transaction((tx) => {
              tx.executeSql(
                'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, title TEXT, question TEXT, scripture TEXT, observation TEXT, application TEXT, prayer TEXT, status TEXT, type TEXT, modifiedDate TEXT, dataId TEXT, month TEXT, settingState TEXT);',
                [],
                (_, result) => {
                  console.log('Table entries: created successfully');
                  fetchTodayVerse();
                },
                (_, error) => {
                  console.error('Error creating table entries:', error);
                }
              );
            });
          } else {
            console.log('Table entries: already exists');
            fetchTodayVerse();
            //fetchStreakCount();
          }
        },

      );
    });
  };
  //option for deleting all entries
  const deleteAllEntries = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM entries;',
        [],
        (_, result) => {
          console.log('All entries deleted successfully');
          fetchAllData();
        },
        (_, error) => {
          console.error('Error deleting entries:', error);
        }
      );
    });
  };


  // USE EFFECTS
  
  //for checking if the entry today is created
  // useEffect(() => {
  
  //   const prevDate = new Date(streakDate).getDate();
  //   if( today.day - prevDate == 1 || streakDate == "none" ){
  //     if(notesId.includes(todayVerse?.id)){
  //       updateStreakCount(streakCount + 1, Date.now());
  //     }
  //   }
  //   else if(today.day - prevDate > 2){
  //     setStreakCount(0);
  //   }
    
  // }, [streakCount, streakDate, notesId, updateStreakCount, today.day]);


  useEffect(() => {
    setupEntriesDatabase();

  }, []);

  useEffect(() => {
    if(isFocused){
      fetchAllData();
      fetchData("journal");
      fetchData("opm");
    }
  }, [isFocused]);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         style={{
  //           gap: 10,
  //           alignItems: "center",
  //           flexDirection: "row",
  //           backgroundColor: globalStyle?.bgBody,
  //           borderRadius: 20,
  //           paddingLeft: 12,
  //           paddingRight: 12,
  //           padding: 5,
  //         }}
  //       >
  //         <FontAwesome5 name="fire" size={20} color={globalStyle?.borderColor}
  //         />
  //         <Text
  //           style={{ fontSize: 20, fontWeight: "bold", color: globalStyle?.borderColor,}}
  //         >{streakCount}
  //         </Text>
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation, streakCount]);

  
  return (
  <>
    {/*MAIN VIEW*/}
    <View style={[styles.homeContainer]}>
      {/*Todays passage*/}
      <View style={[styles.passageToday, {backgroundColor: theme.colors.primary,  borderTopColor: theme.colors.borderColor, borderTopWidth: 1}]}>

        { verseLoading ? <ActivityIndicator style={{width: '40%'}} /> : (
          <View style={[{flexDirection: 'column'}]}>
            <Text style={{fontSize: theme.fonts.fontSize+4, fontWeight: 'bold', color: theme.colors.textColor,}}>Today's Passage</Text>
            <Text style={{fontSize: theme.fonts.fontSize+3, color:  theme.colors.textColor}}>{todayVerse.verse}</Text>
            <Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor}}>{today.month + " " + today.day}</Text>
          </View>

        ) }

        { notesId.includes(todayVerse?.id) ?
          (<Pressable disabled style={[styles.addEntryShortcut,]}>
              <AntDesign name="check" size={20} color="white" />
              <Text style={{fontSize: theme.fonts.fontSize+2, color: "#ffffff",  paddingRight: 5}}>Entry Added</Text>
          </Pressable>)
          :
          (  <TouchableOpacity onPress={ () => handleAddButton("today")}
        style={[styles.addEntryShortcut, { paddingRight: 10,}]}>
            <AntDesign name="plus" size={20} color="white" />
            <Text style={{fontSize: theme.fonts.fontSize+2, color: "#ffffff", paddingRight: 5}}>Add Entry</Text>
          </TouchableOpacity>)
        }

      </View>
    </View>

      <TopBar navigation={navigation} route={route} notes={notes} notesJournal={notesJournal} notesOPM={notesOPM} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} sortButtonCount={sortButtonCount} sortModal={sortModal} handleSortModal={handleSortModal} />
      
      <Navbar onPressAddEntry={handleVisibleAddModal} />

      {/*MODALSS*/}

      {/*modal for displaying add entry*/}
      <AddModal visible={visibleAddModal} type={handleAddButton} handleModal={handleVisibleAddModal} />

      <SortModal visible={sortModal} handleModal={handleSortModal} navigation={navigation} />
        

    </>
  )
}

const styles = StyleSheet.create({
  flex:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  border:{
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  btn:{
    padding: 15,
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  homeContainer:{
    alignItems: "center",
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  passageToday:{
    justifyContent:"space-between",
    alignItems: "center",
    flexDirection: 'row',
    width: "100%", 
    height: 'auto', 
    padding: 15,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'space-between'
  },
  addEntryShortcut:{
    padding: 10,
    backgroundColor: "#1d9bf0",
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 5,
    gap: 10,
    elevation: 3,
  },
})