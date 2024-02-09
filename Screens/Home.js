//import for react stuffs
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, ActivityIndicator, Platform } from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import Modal from "react-native-modal";
import {Asset} from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';

// import for components
import Navbar from '../components/Navbar';
import AddEntry from '../components/AddEntry';
import DisplayEntry from '../components/DisplayEntry';

import TopBar from '../components/TopBar';

//import vector-icons
import AntDesign from '@expo/vector-icons/AntDesign';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const AddModal = ({visible, type, handleModal, globalStyle}) => {
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
      >
      
        <View style={{
            backgroundColor: globalStyle?.bgHeader,
            borderWidth: 1,
            borderColor: globalStyle?.borderColor,
            padding: 20,
            borderRadius: 10,
            alignItems:'left',
            flexDirection:'column',
            justifyContent:"center",
        }} >
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <MaterialIcons name="post-add" size={28} color={globalStyle?.color} />           
            <Text style={{fontSize: 25,  color: globalStyle?.color, }}>Add</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => handlePress()} 
            style={[styles.btn, {alignItems: "left", backgroundColor: globalStyle?.bgBody, flexDirection: 'row', gap: 5}]}
          >
            <Entypo name="book" size={26} color={globalStyle?.color} />
            <Text style={{fontSize: 18, color: globalStyle?.color, textAlign:'right'}}>Journal Entry/Sermon Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handlePress("opm")} 
            style={[styles.btn, {alignItems: "left", flexDirection: 'row', gap: 10, backgroundColor: globalStyle?.bgBody}]}
          >
            <Entypo name="open-book" size={26} color={globalStyle?.color} />
            <Text style={{fontSize: 18,  color: globalStyle?.color,}}>OPM Reflection</Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </>
  );
}

// const HomeScreen = () => (
//   <View style={styles.flex}>
//     <Text>HomeScreen</Text>
//   </View>
// );

// const SettingScreen = () => (
//   <View style={styles.flex}>
//     <Text>SettingScreen</Text>
//   </View>
// );

export default function Home({navigation, route, darkMode, handleDarkMode, globalStyle}) {

  // import for data
  const [db, setDb] = useState( SQLite.openDatabase('_journal_database.db') );

  const [notes, setNotes] = useState([]);// showing all the data
  const [notesJournal, setNotesJournal] = useState([]);// showing all the data
  const [notesOPM, setNotesOPM] = useState([]);// showing all the data

  const [notesId, setNotesId] = useState([]);

  const isFocused = useIsFocused();

  //states for passing props in the modals

  const [scripture, setScripture] = useState("");


  //states for sorting
  const [allCount, setAllCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [opmCount, setOpmCount] = useState(0);
  const [sermonCount, setSermonCount] = useState(0);
  const sortButtonCount = [allCount, journalCount, sermonCount, opmCount];


  //for dates
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const todayDate = new Date();
  const today ={
    day:todayDate.getDate(),
    month: months[todayDate.getMonth()],
    year: todayDate.getFullYear(),
  };

  //const todayVerse = data[today.month][today.day-1]["verse"]; // for setting today's verse
  const [visibleAddModal, setVisibleAddModal] = useState(false); // add modal
  const [todayVerse, setTodayVerse] = useState("");

  //states for loading indicators
  const [noteListLoading, setNoteListLoading] = useState(true);
  const [verseLoading, setVerseLoading] = useState(true);

  // NAVIGATION FUNCTIONS

  const openBrp = () => {
    navigation.navigate("BRP");
  }

  const openAddEntry = (type, scripture) => {
    navigation.navigate("AddEntry", {
      verse: scripture,
      type: type,
      index: months.indexOf(todayVerse?.month),
      itemId: todayVerse?.id,

    });
  }
  const openDisplayEntry = (item) => {
    navigation.navigate("DisplayEntry", {
      entry: item,
    });
  }

  //HANDLE FUNCTIONS


  // when add write button is clicked
  const handleAddButton = (item) => {
    if(item == "today"){
      setScripture(todayVerse.verse);
      if(todayVerse.verse == "Sermon Notes"){
        openAddEntry("sermon", "");
      }else{
        openAddEntry("journal", scripture);
      }

    } 
    else {
      if(item == "opm"){
        openAddEntry("opm", "");
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

  const getJournalCount = (type = "journal") => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries  WHERE type = ? ORDER BY modifiedDate DESC;",
        [type],
        (_, result) => {
          const rows = result.rows;
          setJournalCount(rows.length);
        },
        (_, error) => {
          console.error('Error querying data:', error);
        }
      );
    });
  }

  const getOpmCount = (type = "opm") => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries  WHERE type = ? ORDER BY modifiedDate DESC;",
        [type],
        (_, result) => {
          const rows = result.rows;
          setOpmCount(rows.length);
        },
        (_, error) => {
          console.error('Error querying data:', error);
        }
      );
    });
  }

  const getSermonCount = (type = "sermon") => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries  WHERE type = ? ORDER BY modifiedDate DESC;",
        [type],
        (_, result) => {
          const rows = result.rows;
          setSermonCount(rows.length);
        },
        (_, error) => {
          console.error('Error querying data:', error);
        }
      );
    });
  }

  const fetchData = (type) => {
    if(type == "journal"){
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM entries WHERE type = ? OR type = ? ORDER BY modifiedDate DESC;",
          ["journal", "sermon"],
          (_, result) => {
            const rows = result.rows;
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
          "SELECT * FROM entries WHERE type = ? ORDER BY modifiedDate DESC;",
          ["opm"],
          (_, result) => {
            const rows = result.rows;
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
    console.log("Fetched All Data")
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries ORDER BY modifiedDate DESC;",
        [],
        (txObj, result) => {
          const rows = result.rows;
          const dataArray = [];
          const dataArray2 = [];

          setAllCount(rows.length);
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(item);
            dataArray2.push(item.dataId);

          }
          setNotes(dataArray);
          setNotesId(dataArray2);
          setNoteListLoading(false);

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
                'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, title TEXT, question TEXT, scripture TEXT, observation TEXT, application TEXT, prayer TEXT, status TEXT, type TEXT, modifiedDate TEXT, dataId INTEGER, month TEXT);',
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


  const formatLastModified = (timestamp) => {
    const lastModifiedTime = new Date(timestamp);
    const now = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = now - lastModifiedTime;

    // Convert milliseconds to seconds, hours, or days as needed
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Choose the appropriate format based on the time difference
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } 
    else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } 
    else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  // USE EFFECTS
  // for creating the db

  useEffect(() => {
    //openBrpDatabase()
    setupEntriesDatabase();

  }, []);

  useEffect(() => {
    if(isFocused){
      fetchAllData();
      fetchData("journal");
      fetchData("opm");
      getJournalCount();
      getOpmCount();
      getSermonCount();
    }
  }, [isFocused]);


  
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            gap: 10,
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: globalStyle?.bgBody,
            borderRadius: 20,
            paddingLeft: 10,
            paddingRight: 10,
            padding: 5,
          }}
        >
          <FontAwesome5
            name="fire"
            size={20}
            color={globalStyle?.borderColor}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: globalStyle?.borderColor,
            }}
          >
            0
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
  <>
    {/*MAIN VIEW*/}
    <View style={[styles.homeContainer]}>
      {/*Todays passage*/}
      <View style={[styles.passageToday, {backgroundColor:globalStyle?.bgHeader,  borderTopColor: globalStyle.borderColor, borderTopWidth: 1}]}>

        { verseLoading ? <ActivityIndicator style={{width: '40%'}} /> : (
          <View style={[{flexDirection: 'column'}]}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: globalStyle?.color,}}>Today's Passage</Text>
            <Text style={{fontSize: 19, color:  globalStyle?.color}}>{todayVerse.verse}</Text>
            <Text style={{fontSize: 18 , color: globalStyle?.color}}>{today.month + " " + today.day}</Text>
          </View>

        ) }

        { notesId.includes(todayVerse?.id) ?
          (<Pressable disabled style={[styles.addEntryShortcut,]}>
              <AntDesign name="check" size={20} color="white" />
              <Text style={{fontSize: 18, color: "#fff",  paddingRight: 5}}>Entry Added</Text>
          </Pressable>)
          :
          (  <TouchableOpacity onPress={ ()=>handleAddButton("today")}
        style={[styles.addEntryShortcut, { paddingRight: 10}]}>
            <AntDesign name="plus" size={20} color="white" />
            <Text style={{fontSize: 18, color: "#fff", paddingRight: 5}}>Add Entry</Text>

          </TouchableOpacity>)
        }

      </View>
    </View>

    <TopBar globalStyle={globalStyle} notes={notes} notesJournal={notesJournal} notesOPM={notesOPM} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} sortButtonCount={sortButtonCount} fetchAllData={fetchAllData} fetchData={fetchData} formatLastModified={formatLastModified} />
    
    <Navbar onPressAddEntry={handleVisibleAddModal} />

    {/*MODALSS*/}

    {/*modal for displaying add entry*/}
    <AddModal visible={visibleAddModal} type={handleAddButton} handleModal={handleVisibleAddModal}  globalStyle={globalStyle}/>


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