//import for react stuffs
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import React, {useEffect, useState} from 'react';
import {Asset} from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

// import for components
import Navbar from '../components/homeComponents/Navbar';
import TopBar from '../components/homeComponents/TopBar';
import AddModal from '../components/homeComponents/AddModal';

//import vector-icons
import AntDesign from '@expo/vector-icons/AntDesign';
//import { usePushNotifications } from '../components/usePushNotifications';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const db = SQLite.openDatabase('_journal_database.db');

export default function Home({navigation, route, currentSort, currentDisplay, currentFilter,}) {
  //for theme
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // import for data
  const [notes, setNotes] = useState([]);// showing all the data
  const [notesJournal, setNotesJournal] = useState([]);// showing all the data
  const [notesOPM, setNotesOPM] = useState([]);// showing all the data

  //const [notesId, setNotesId] = useState([]);
  const [entriesId, setEntriesId] = useState([]);

  const isFocused = useIsFocused();

  //states for sorting
  const [allCount, setAllCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [opmCount, setOpmCount] = useState(0);
  const sortButtonCount = [allCount, journalCount, opmCount];

  //for dates
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const todayDate = new Date();
  const today = {
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

  // NAVIGATION FUNCTIONS

  const openBrp = () => {
    navigation.navigate("BRP");
  }

  //Function for opening the entry in add entry button
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

  //Function for opening the entry in home screen
  const openDisplayEntry = (item) => {
    navigation.navigate("Home", {
      screen: 'Entry',
      params: {
        entryId: item.dataId,
        entryType: item.type,
        state: 'update',
        entry: item,
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

  //for fetching todays passage
  async function openBrpDatabase() {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
      }
    else{
      await FileSystem.downloadAsync(
            Asset.fromModule(require('../assets/brpDatabase2025.db')).uri,
            FileSystem.documentDirectory + 'SQLite/brpDatabase2025.db'
      );
  }
    return SQLite.openDatabase("brpDatabase2025.db");
  };

  const fetchTodayVerse = async () => {
    const dbBrp = await openBrpDatabase();
    return new Promise( () => {
      dbBrp.transaction((tx) => {
          tx.executeSql('SELECT * FROM brp2025 WHERE month = ? AND day = ?', [today.month, today.day],
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

  //for fetching entries of Journal & OPM
  const dataFetcher = (query, dependencies, type) => {
    db.transaction((tx) => {
      tx.executeSql(
        query, dependencies,
        (_, result) => {
          const rows = result.rows;
          if(type == "journal"){
            setJournalCount(rows.length);
          }
          else{ setOpmCount(rows.length) }

          const dataArray = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i); //for loop for iterating the objects to an array
            dataArray.push(item);
          }

          if(type == 'opm'){
            setNotesOPM(dataArray);
          }else{
            setNotesJournal(dataArray);
          }

        },
        (_, error) => {
          console.error('DATA FETCHER: Error querying data:', error);
        }
      );
    });
  }

  const fetchData = (type, sort, filter) => {
    let query = 'SELECT * FROM entries WHERE settingState = "normal" AND type="opm" '

    if(type !== "opm"){
      query = 'SELECT * FROM entries WHERE settingState="normal" AND type="journal" OR type="sermon" '
    }
    if(filter == "All"){
      if(sort == "By Modified Time"){
        dataFetcher( query + "ORDER BY modifiedDate DESC;", [], type);
      }
      else{
        dataFetcher( query + "ORDER BY createdDate ASC;", [], type);
      }
    }
    else{
      if(sort == "By Modified Time"){
        dataFetcher( query + "AND month = ? ORDER BY modifiedDate DESC;", [type, filter], type);
      }
      else{
        dataFetcher( query + "AND month = ? ORDER BY createdDate ASC;", [type, filter], type);
      }
    }
  };

  const fetchAllData = (sort, filter) => {
    allEntriesFetcher(); //for checking in today passage
    let query = 'SELECT * FROM entries WHERE settingState="normal" ';
    if(filter == "All"){
      if(sort == "By Modified Time"){
        allDataFetcher( query + "ORDER BY modifiedDate DESC;", [] );
      }
      else{
        allDataFetcher(  query + 'ORDER BY createdDate ASC;', [] );
      }
    }
    else{
      if(sort == "By Modified Time"){
          allDataFetcher(  query + 'AND month = ? ORDER BY modifiedDate DESC', [filter] );
      }
      else{
          allDataFetcher(  query + 'AND month = ? ORDER BY createdDate ASC;', [filter] );
      }
    }
  };

  //for fetching all entries
  const allDataFetcher = (query, dependencies) => {
    db.transaction((tx) => {
      tx.executeSql(
        query, dependencies,
        (txObj, result) => {
          const rows = result.rows;
          const dataArray = [];
          //const dataArray2 = [];

          setAllCount(rows.length);
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(item);
            //dataArray2.push(parseInt(item.dataId));

          }
          setNotes(dataArray);
          //setNotesId(dataArray2);
          setNoteListLoading(false);
          console.log("Fetched All Data")
        },
        (_, error) => {
          console.error('FETCH ALL DATA: Error querying data:', error);
        }
      );
    });
  }

  const allEntriesFetcher = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries", [],
        (txObj, result) => {
          const rows = result.rows;
          const dataArray = [];
          setAllCount(rows.length);
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(parseInt(item.dataId));
          }
          setEntriesId(dataArray);
          console.log("Fetched All Entries ID")
        },
        (_, error) => {
          console.error('FETCH ALL1: Error querying data:', error);
        }
      );
    });
  }


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
                'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, title TEXT, question TEXT, scripture TEXT, observation TEXT, application TEXT, prayer TEXT, status TEXT, type TEXT, modifiedDate TEXT, dataId TEXT, month TEXT, settingState TEXT, createdDate TEXT);',
                [],
                (_, result) => {
                  console.log('Table entries: created successfully');
                  fetchTodayVerse();
                  fetchAllData(currentSort.current, currentFilter.current);
                  fetchData("journal", currentSort.current,  currentFilter.current);
                  fetchData("opm", currentSort.current, currentFilter.current );
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
    },null, null);

    //for altering the table
    db.transaction((tx) => {
      tx.executeSql(
        `PRAGMA table_info('entries');`, 
        [],
        (_, { rows: { _array } }) => { 
          const columnNames = _array.map((column) => column.name);
          if (!columnNames.includes('year')) {
            tx.executeSql(
              `ALTER TABLE entries ADD COLUMN year TEXT;`, 
              [],
              (_, { rowsAffected, insertId }) => {
                console.log('Table altered successfully!', rowsAffected); 
              },
              (_, error) => {
                console.error('Error altering table:', error); 
              }
            );
          } else {
            console.log('Column already exists.');
          }
        },
        (_, error) => {
          console.error('Error checking table info:', error); 
        }
      );
    }, 
    null, 
    null); 
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

  const filterSetter = (filter) =>{
    if(filter !== "All" && filter !== "December"){
      if(filter !== today.month && today.day == 1 ){
        return today.month;
      } 
      else{
        return filter;
      }
    }
    else{
      return filter;
    }
  }

  // USE EFFECTS

  useEffect(() => {
    setupEntriesDatabase();
  }, []);


  useEffect(() => {
    if(isFocused){

      fetchAllData(currentSort.current, filterSetter(currentFilter.current));
      fetchData("journal", currentSort.current, filterSetter(currentFilter.current));
      fetchData("opm", currentSort.current, filterSetter(currentFilter.current) );

    }
  }, [isFocused]);


  return (
  <>
    {/*MAIN VIEW*/}
    <View style={[styles.homeContainer, { 
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }]}
    >
    
      {/*Today's passage*/}
      <View style={[styles.passageToday, {backgroundColor: theme.colors.primary, borderBottomWidth: 1, borderBottomColor: theme.colors.borderColor,}]}>

        { verseLoading ? <ActivityIndicator style={{width: '40%'}} /> : (
          <View style={[{flexDirection: 'column'}]}>
            <Text style={{fontSize: theme.fonts.fontSize+4, fontWeight: 'bold', color: theme.colors.textColor,}}>Today's Passage</Text>
            <Text style={{fontSize: theme.fonts.fontSize+3, color:  theme.colors.textColor}}>{todayVerse.verse}</Text>
            <Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor}}>{today.month + " " + today.day}</Text>
          </View>

        ) }

        { entriesId.includes(todayVerse?.id) ?
          (<Pressable disabled style={[styles.addEntryShortcut, {backgroundColor: theme.colors.altColor}]}>
              <AntDesign name="check" size={20} color="white" />
              <Text style={{fontSize: theme.fonts.fontSize+2, color: "#ffffff",  paddingRight: 5}}>Entry Added</Text>
          </Pressable>)
          :
          (  <TouchableOpacity onPress={ () => handleAddButton("today")}
        style={[styles.addEntryShortcut, { paddingRight: 10, backgroundColor: theme.colors.altColor}]}>
            <AntDesign name="plus" size={20} color="white" />
            <Text style={{fontSize: theme.fonts.fontSize+2, color: "#ffffff", paddingRight: 5}}>Add Entry</Text>
          </TouchableOpacity>)
        }

      </View>
        
      {/* <View style={{backgroundColor: theme.colors.primary, width: "100%", padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.borderColor, borderBottomWidth: 1, borderBottomColor: theme.colors.borderColor, }} > 

        <Text style={{textAlign: 'center', fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor}} >Recent Entries</Text>

        <TouchableOpacity onPress={ ()=> handleSortModal(true) } style={{backgroundColor: theme.colors.secondary, padding: 5, borderRadius: 5,}}>

          <MaterialCommunityIcons name="sort" size={24} color={theme.colors.textColor} />

        </TouchableOpacity>
      </View> */}

    </View>

      <TopBar 
        display={currentDisplay.current}
        navigation={navigation} route={route} 
        notes={notes}  notesJournal={notesJournal}  notesOPM={notesOPM} noteListLoading={noteListLoading} 
        handleDisplayEntryFetch={handleDisplayEntryFetch} sortButtonCount={sortButtonCount}  
      />
      
  
      <Navbar onPressAddEntry={handleVisibleAddModal} />

      {/*MODALSS*/}

      {/*modal for displaying add entry*/}
      <AddModal 
        visible={visibleAddModal} 
        type={handleAddButton} 
        handleModal={handleVisibleAddModal} 
      />

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
    padding: 10,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'space-between'
  },
  addEntryShortcut:{
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 5,
    gap: 10,
    elevation: 3,
  },
})