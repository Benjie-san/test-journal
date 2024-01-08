//import for react stuffs
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Image, Modal, AppState } from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';

import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';

// import for data
import data from '../constants/2023.json';
const db = SQLite.openDatabase('_journal_database.db');

// import for components
import Navbar from '../components/Navbar'

import AddEntry from '../components/AddEntry';
import DisplayEntry from '../components/DisplayEntry';


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
  console.log("called?")
}


const AddModal = ({visible, type, handleModal}) => {
  const handlePress = (item) =>{
    type(item);
    handleModal();
  }

  return(
    <>
      <Modal animationType="fade" transparent={true} visible={visible}>
        <TouchableOpacity style={[styles.flex,{backgroundColor: '#000000aa'}]} 
        onPress={handleModal}>
          <View style={{
              backgroundColor: "#fff", 
              width: "80%", 
              height:"40%",
              padding: 30,
              borderRadius: 10,
              alignItems:'left',
              flexDirection:'column',
              justifyContent:"center",
          }} >
            <Text style={{fontSize: 20}}>Add</Text>
            <Pressable onPress={() => handlePress()} style={[styles.btn, {alignItems: "left"}]}>
              <Text style={{fontSize: 18}}>Journal Entry or Sermon Notes</Text>
            </Pressable>

            <Pressable onPress={() => handlePress("opm")} style={[styles.btn, {alignItems: "left"}]}>
              <Text style={{fontSize: 18}}>OPM Reflection</Text>
            </Pressable>

          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default function Home({navigation}) {
  
  const [notes, setNotes] = useState([]);// showing all the data

  //states for modal
  const [addEntryVisible, setAddEntryVisible] = useState(false)
  const [displayEntryVisible, setDisplayEntryVisible] = useState(false)

  //states for passing props in the modals
  const [type, setType] = useState("");
  const [currentEntry, setCurrentEntry] = useState([]);
  const [scripture, setScripture] = useState("");
  const [item, setItem] = useState("");
  const [index, setIndex] = useState(0)

  //states for sorting
  const [allCount, setAllCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [opmCount, setOpmCount] = useState(0);
  const [sermonCount, setSermonCount] = useState(0);
  const sortButtons = ["All", "Journal", "OPM", "Sermon"];
  const sortButtonCount = [allCount, journalCount, opmCount, sermonCount];
  const [currentSortBtn, setCurrentSortBtn] = useState("");
  const [isSelected, setIsSelected] = useState(false);

  //for dates
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const todayDate = new Date();
  const today ={
    day:todayDate.getDate(),
    month: months[todayDate.getMonth()],
    year: todayDate.getFullYear(),
  };
  const todayVerse = data[today.month][today.day-1]["verse"]; // for setting today's verse
  const [visibleAddModal, setVisibleAddModal] = useState(false); // add modal

  // NAVIGATION FUNCTIONS

  const openBrp = () => {
    navigation.navigate("BRP");
  }

  //HANDLE FUNCTIONS

  //handles opening adding modal
  const handleAddEntryModal =  (item) =>{
    setAddEntryVisible(item);
    if(item == false){
      fetchAllData();
    }
  }
  //handles opening display modal
  const handleDisplayEntryModal =  (item) =>{
    setDisplayEntryVisible(item);
    if(item == false){
      fetchAllData();
    }
  }

  const handleDisplayEntryFetch = (id) =>{
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries WHERE dataId = ? ;",
        [id],
        (_, result) => {
            const rows = result.rows;
            const dataArray = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              dataArray.push(item);
            }
            setCurrentEntry(...dataArray);
        },
        (_, error) => {
            alert("No Entry yet")
            console.error('Error querying data:', error);
        }
      );
    });
    handleDisplayEntryModal(true);
  }
  
  const handleScripture = (item) => {
      setScripture(item)
  }

  const handleType = (item) => {
      setType(item)
  }
  
  const handleItem = (item) =>{
    setItem(item)
  }

  const handleEntry = (item) => {
      setEntry(item)
  }

  const handleCurrentEntry = (item) =>{
      setCurrentEntry(item);
  }

  // when add write button is clicked
  const handleAddButton = (type) => {
    if(type == "today"){
      setType("journal");
      setIndex(today.month);
      setItem(today.day-1);
      setScripture(todayVerse);
      handleAddEntryModal(true);
    } else {  
      if(type == "opm"){
        setType("opm");
        handleAddEntryModal(true);
      }else{
        openBrp()
      }
    }
  
}

  const handleVisibleAddModal = () => {
    setVisibleAddModal(!visibleAddModal);
  }

  const handleSortButtons = (item) =>{
    
    let type = item.toLowerCase();

    if(currentSortBtn == ""){
      setCurrentSortBtn(item);
      setIsSelected(true);
    } else if(type != currentSortBtn){
      setCurrentSortBtn(item);
      setIsSelected(true);
    }

    if(type=="all"){
      fetchAllData();
    }else{
      fetchData(type);
    }
  }


  // DB FUNCTION

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
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries WHERE type = ? ORDER BY modifiedDate DESC;",
        [type],
        (_, result) => {
          const rows = result.rows;
          const dataArray = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(item);
          }
          setNotes(dataArray);
        },
        (_, error) => {
          console.error('Error querying data:', error);
        }
      );
    });
  };
  const fetchAllData = () => {
    setCurrentSortBtn("All");
    setIsSelected(true);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM entries ORDER BY modifiedDate DESC;",
        [],
        (_, result) => {
          const rows = result.rows;
          const dataArray = [];
          setAllCount(rows.length);
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(item);
          }
          setNotes(dataArray);
        },
        (_, error) => {
          console.error('Error querying data:', error);
        }
      );
    });
  };

  //creating the table
  const setupDatabase = () => {
    // Check if the table exists
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
                  console.log('Table created successfully');
                },
                (_, error) => {
                  console.error('Error creating table:', error);
                }
              );
            });
          } else {
            console.log('Table already exists');
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

  // PUSH NOTIFICATION FUNCTIONS

  const scheduleNotifications = async () => {
    const morningNotificationTime = setNotificationTime(6, 0);
    const eveningNotificationTime = setNotificationTime(18, 0);

    // Schedule morning notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Morning Notification',
        body: 'Good morning! Time to check your tasks.',
      },
      trigger: { hour: morningNotificationTime.hours, minute: morningNotificationTime.minutes, repeats: true },
    });

    // Schedule evening notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Evening Notification',
        body: 'Good evening! Have you completed your tasks today?',
      },
      trigger: { hour: eveningNotificationTime.hours, minute: eveningNotificationTime.minutes, repeats: true },
    });
  };

  const setNotificationTime = (hours, minutes) => {
    const now = new Date();
    const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
    const currentTime = now.getTime();
    const notificationDateTime = notificationTime.getTime();

    // If the notification time has already passed for today, schedule it for the same time tomorrow
    const scheduledTime = notificationDateTime > currentTime ? notificationDateTime : notificationDateTime + 24 * 60 * 60 * 1000;

    const scheduledDate = new Date(scheduledTime);

    return {
      hours: scheduledDate.getHours(),
      minutes: scheduledDate.getMinutes(),
    };
  };

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  };

  const handleNotification = (notification) => {
    // Handle the received notification
    console.log(notification);
  };

  // USE EFFECTS

  // for creating the db
  useEffect(() => {
    openBrpDatabase()
    setupDatabase();
    fetchAllData();
    getJournalCount();
    getOpmCount();
    getSermonCount();
  }, [openBrpDatabase]);

  //for push notifications
  useEffect(() => {
    scheduleNotifications();

    // Set up an interval to schedule notifications every day
    const intervalId = setInterval(() => {
      scheduleNotifications();
    }, 24 * 60 * 60 * 1000); // Schedule notifications every 24 hours

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Handle notifications when the app is open
    Notifications.addNotificationReceivedListener(handleNotification);
  }, []);

  return (
  <>
    {/*MAIN VIEW*/}
    <TouchableOpacity style={styles.btn}title="Send Notification" onPress={()=> deleteAllEntries()}>
      <Text>DELETE ALL</Text>  
    </TouchableOpacity>

    <View style={[styles.homeContainer]}>
      {/*HEADER - Todays passage*/}
      <View style={[styles.passageToday,{width: "100%", height: 'auto', padding: 15, paddingTop: 10, flexDirection: 'column'}]}>

        <Text style={{padding: 5, fontSize: 20, textAlign: "center", fontWeight: 'bold'}}>Journal { today.year }</Text>

        <View style={[{flexDirection: 'row', gap: 60, alignItems: 'center', justifyContent:'space-between'}]} >
          <View style={[{flexDirection: 'column'}]}>
            <Text style={{fontSize: 21, fontWeight: 'bold'}}>Today's Passage</Text>
            <Text style={{fontSize: 20, color: '#4d4d4d'}}>{todayVerse}</Text>
            <Text style={{fontSize: 18 , color: '#808080'}}>{today.month + " " + today.day}</Text>
          </View>

          <Pressable onPress={ ()=>handleAddButton("today")} 
          style={[styles.addEntryShortcut]}>
              <Text style={{fontSize: 20, color: "#fff"}}>Add Entry</Text>
              <Image style={{width: 17, height: 17,}} source={require("../assets/add.png")}/>
          </Pressable>
        </View>
      </View>

      {/*Sorting Buttons*/}
      <View style={styles.sortingButtons}>

        { 
          sortButtons.map( (item, index) => {

          return  <Pressable key={index} onPress={ () => handleSortButtons(item) }  style={[styles.sortingBtn, 
          {borderBottomColor: currentSortBtn == item ? isSelected ? "#1d9bf0" : '#transparent' : 'transparent',}]}>
            
                <Text 
                  style={[styles.sortBtnText,
                    {color: currentSortBtn == item ? isSelected ? "#1d9bf0" : '#808080' : '#808080',}]}>
                    {item == "Sermon" ? "Sermon Notes" : item }
                </Text>

                <View style={[styles.itemCount, 
                  {backgroundColor: currentSortBtn == item ? isSelected ? "#1d9bf0" : '#808080' : '#808080', }]}>
                  <Text style={{textAlign: 'center', color:  currentSortBtn == item ?  isSelected ? "#fff" : '#f5f5f5' : '#f5f5f5'}}>
                    {sortButtonCount[index]}
                  </Text>
                </View>
              </Pressable>

            })
        }   
      </View>

      {/*Displaying items*/}
      <View style={styles.notelist}>
        {notes.length === 0 ? (
          <Text style={{fontSize: 30, paddingBottom: 150}}>No Entry Yet</Text>
        ) : (
          <>
            <FlatList
              style={{width: '100%'}}
              data={notes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
              
                <TouchableOpacity style={[styles.entry, styles.shadowProp]} onPress={ ()=> handleDisplayEntryFetch(item.dataId) }>
                  <Text>{`${item.date}`}</Text>
                  <Text>{`${item.dataId}`}</Text>
                  <View style={[styles.border, {width: 30, height: 30, backgroundColor: item.status}]}></View>

                </TouchableOpacity>
              )}
            /> 
          </>        
        )}
      </View>

      {/*Navbar*/}
      <Navbar onPressAddEntry={handleVisibleAddModal} />

    </View>

    {/*MODALSS*/}

    {/*ADD ITEM MODAL*/}
    <AddEntry visible={addEntryVisible} handleModal={handleAddEntryModal} verse={scripture} type={type} status="#ffad33" index={index} item={item} handleType={handleType}/>

    {/*For displaying the component*/}
    <DisplayEntry visible={displayEntryVisible} handleModal={handleDisplayEntryModal} currentEntry={currentEntry} handleEntry={handleCurrentEntry} handleType={handleType}/>

    {/*modal for displaying add entry*/}
    <AddModal visible={visibleAddModal} type={handleAddButton} handleModal={handleVisibleAddModal}/>

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
    borderBottomWidth:1,
    borderBottomColor: 'black',
    padding: 15,
    alignItems: 'center',
    margin: 5,
  },
  homeContainer:{
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff',
    flexDirection: 'column',
    paddingTop: 20,
  },
  passageToday:{
    justifyContent:"space-between", 
    alignItems: "center", 
    flexDirection: 'row',
    // borderBottomColor: '#737373',
    // borderBottomWidth: 1,
    padding: 5,
  },
  addEntryShortcut:{
    width: "35%",
    height: "70%", 
    padding: 10, 
    backgroundColor: "#1d9bf0", 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    borderRadius: 5
  },
  sortingButtons:{
    width: '100%',
    height: '8%',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-evenly',
  },
  sortingBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderBottomWidth: 2,
    width: "auto",
    padding: 5,
    gap: 5,
  },
  sortBtnText:{
    fontSize: 12, 
  },
  itemCount:{
    paddingRight: 12,
    paddingLeft: 12,
    borderRadius: 10,
  },
  notelist:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccccc',
    padding:10,
  },
  entry:{
    marginBottom: 5,
    borderRadius: 5,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
})