//import for react stuffs
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Image, Modal, AppState } from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';

// import for data
import data from '../constants/2023.json'
const db = SQLite.openDatabase('_journal_2023.db');

// import for components
import Entry from './Entry';
import Navbar from '../components/Navbar'

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
            <Pressable onPress={() => handlePress("journal")} style={[styles.btn, {alignItems: "left"}]}>
              <Text style={{fontSize: 18}}>Journal Entry</Text>
            </Pressable>

            <Pressable onPress={() => handlePress("sermon")} style={[styles.btn, {alignItems: "left"}]}>
              <Text style={{fontSize: 18}}>Sermon Notes</Text>
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
  
  const [visible, setVisible] = useState(false);
  const [visibleDisplay, setVisibleDisplay] = useState(false);
  const [notes, setNotes] = useState([]);
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [scripture, setScripture] = useState("");
  const [observation, setObservation] = useState("");
  const [application, setApplication] = useState("");
  const [prayer, setPrayer] = useState("");
  const [status, setStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("");
  const [key, setKey] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("");
  const appState = useRef(AppState.currentState)
  const [appCurrentState, setAppCurrentState] = useState(appState.current)
  const [allCount, setAllCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [opmCount, setOpmCount] = useState(0);
  const [sermonCount, setSermonCount] = useState(0);
  const lastModified = useRef(new Date());
  const [modifiedDate, setModifiedDate] = useState(lastModified.current.toString());
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const todayDate = new Date();
  const today ={
    day:todayDate.getDate(),
    month: months[todayDate.getMonth()],
  };
  const todayVerse = data[today.month][today.day-1]["verse"];
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const sortButtons = ["All", "Journal", "OPM", "Sermon"];
  const sortButtonCount = [allCount, journalCount, opmCount, sermonCount];
  const [currentSortBtn, setCurrentSortBtn] = useState("");
  const [navButtonSelected, setNavButtonSelected] = useState(false);


  // NAVIGATION FUNCTIONS

  const openBrp = () => {
    navigation.navigate("BRP");
  }

  //HANDLE FUNCTIONS

  const handleButton = ()  => {
    if(currentStatus == "ongoing"){
      if(currentEntry.date !== date || currentEntry.scripture !== scripture || currentEntry.title !== title || currentEntry.question !== question || currentEntry.observation !== observation || currentEntry.application !== application || currentEntry.prayer !== prayer || currentEntry.status !== status){   
        updateEntry(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, key, currentStatus);
        setVisibleDisplay(false);
        cleanStates();

      }else{
        setVisibleDisplay(false);
        cleanStates();

      }
    } 
    else if(currentStatus == "today"){
      console.log('called?');
        if(title !== '' || question !== '' || observation !== '' || application !== '' || prayer !== ''){
          saveEntry(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate);
          
        }
        setVisible(false);
        cleanStates();
    }
    else if(currentStatus == "add"){
      console.log('called?2');

      saveEntry(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate);
      setVisible(false);
      cleanStates();
    }
  }
  //handles the display per entry
  const handleChangeText = (text, valueFor) =>{
    switch(valueFor){
      case 'date': setDate(text) ;break;
      case 'title': setTitle(text) ;break;
      case 'question': setQuestion(text) ;break;
      case 'scripture': setScripture(text) ;break;
      case 'observation': setObservation(text) ;break;
      case 'application': setApplication(text) ;break;
      case 'prayer': setPrayer(text) ;break;
      
    }
  }

  //for cleaning states
  const cleanStates = () =>{
    setDate("");
    setTitle("");
    setQuestion("");
    setScripture("");
    setObservation("");
    setApplication("");
    setPrayer("");
    setStatus("");
    setCurrentStatus("");
  }

  //for showing the SELECTED ENTRY
  const handleVisibleModal = (item) => {
    setCurrentStatus("ongoing");
    setVisibleDisplay(true);
    setKey(item.id); 
    setDate(item.date);
    setTitle(item.title);
    setQuestion(item.question);
    setScripture(item.scripture);
    setObservation(item.observation);
    setApplication(item.application);
    setPrayer(item.prayer);
    setStatus(item.status);
    setType(item.type);
    setModifiedDate(item.modifiedDate);
    setCurrentEntry(item);
  };

  // when add write button is clicked
  const handleAddButton = (type) => {
    if(type == "today"){
      const currentDate = todayDate.toDateString();
      setDate(currentDate);
      setScripture(todayVerse);
      setType("journal");
      setCurrentStatus("today");

    } else {  
        if(type == "journal"){
        setType("journal");
      } else if(type == "opm"){
        setType("opm");
      } else if(type == "sermon"){
        setType("sermon");
      }
      setCurrentStatus("add");
    }
  
    setStatus("#fff");
    openBrp()
}

  const handleChangeScripture = (verse) =>{
    setScripture(verse);
  }

  const handleStatusColor = (color) =>{
    setStatus(color);
  }

  const handleChangeDate = (item) =>{
    setDate(item);
  }

  const handleVisibleAddModal = () => {
    setVisibleAddModal(!visibleAddModal);
  }

  const handleModifiedDate = () => {
    setModifiedDate(new Date().toString());
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

  const handleNavButtonSelected = () => {
    setNavButtonSelected(!navButtonSelected);
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
        "SELECT * FROM entries  WHERE type = ? ORDER BY modifiedDate DESC;",
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

  // for deleting the entry
  const handleDelete = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM entries WHERE id = ?;`,
        [id],
        (_, result) => {
          console.log('Data deleted successfully');
        },
        (_, error) => {
          console.error('Error deleting data:', error);
        }
      );
    });
      setNotes((prevData) => prevData.filter((entry) => entry.id !== id));
      fetchAllData();
      getJournalCount();
      getOpmCount();
      getSermonCount();
      setVisibleDisplay(false);
      cleanStates();
  }
  
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
                'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, title TEXT, question TEXT, scripture TEXT, observation TEXT, application TEXT, prayer TEXT, status TEXT, type TEXT, modifiedDate TEXT, month TEXT, day TEXT);',
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

  const saveEntry = (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate) => {
    // adding entry to db
    let isEmpty = [date, title, question, scripture, observation, application, prayer];
    if(!isEmpty.every((item)=>item=="")){
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
          [date, title, question, scripture, observation, application, prayer, status, type, modifiedDate],
          (tx, results) => {
            console.log("Success!!!");
            fetchAllData();
            getJournalCount();
            getOpmCount();
            getSermonCount();
          },
          (error) => {
            // Handle error
            console.log(error);
          }
        );
      });
    }
  }

  const updateEntry = (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, key, currentStatus) => {

    if(currentStatus == "ongoing" && status == "#fff"){
      setStatus("#fff");
    }
    //updating the entry
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE entries SET date = ?, title = ?, question = ?, scripture = ?, observation = ?, application = ?, prayer = ?, status = ?, modifiedDate = ? WHERE id = ?;',
          [date, title, question, scripture, observation, application, prayer, status, modifiedDate, key ],
          (_, result) => {
            console.log('Data updated successfully');
          },
          (_, error) => {
            console.error('Error updating data:', error);
          }
        );
      });
    // }
  }



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

  // const sendNotificationImmediately = async () => {
  // try{
  //   const notificationId = await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: 'Immediate Notification',
  //       body: 'This is an immediate notification!',
  //     },
  //     trigger: null, // null means send immediately
  //   });

  //   console.log('Notification ID:', notificationId);
  // } catch (error) {
  //   console.error('Error scheduling immediate notification:', error);
  // }
  // };



  // USE EFFECTS

  //autosave
  useEffect(() => {
    if(visibleDisplay == true){

      const autosaveInterval = setInterval( () => {
        if(currentEntry.date !== date || currentEntry.scripture !== scripture || currentEntry.title !== title || currentEntry.question !== question || currentEntry.observation !== observation || currentEntry.application !== application || currentEntry.prayer !== prayer  || currentEntry.status !== status){
      
          updateEntry(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, key, currentStatus);
          currentEntry.date = date;
          currentEntry.scripture = scripture;
          currentEntry.title = title;
          currentEntry.question = question;
          currentEntry.observation = observation;
          currentEntry.application = application;
          currentEntry.prayer = prayer;
          currentEntry.status = status;
          currentEntry.modifiedDate = modifiedDate;
        }
      }, 10000);//timer for autosave to execute

      return () => clearInterval(autosaveInterval);
    }
  }, [date, title, question, scripture, observation, application, prayer, status, type, key, currentStatus, currentEntry, modifiedDate]);

  //for drawer when pressed
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {

      if (appState.current.match(/inactive|background/) &&
      nextAppState === 'active') {
        return    
      }else{
        if(visibleDisplay === true){
          updateEntry(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, key, currentStatus);
        }
      }

      appState.current = nextAppState;
      setAppCurrentState(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [visibleDisplay, date, title, question, scripture, observation, application, prayer, status, type, key, currentStatus, modifiedDate]);

  // for creating the db
  useEffect(() => {
    setupDatabase();
    fetchAllData();
    getJournalCount();
    getOpmCount();
    getSermonCount();
  }, []);

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
    {/* <Pressable style={styles.btn}title="Send Notification" onPress={()=> sendNotificationImmediately()}>
      <Text>Notification</Text>  
    </Pressable> */}

    <View style={[styles.homeContainer]}>
      {/*HEADERR - Todays passage*/}
      <View style={[styles.passageToday,{width: "100%", height: 'auto', padding: 15, paddingTop: 10, flexDirection: 'column'}]}>

        <Text style={{padding: 5, fontSize: 20, textAlign: "center", fontWeight: 'bold'}}>Journal 2023</Text>

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

      {/*Showing Present items*/}
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
              
                <TouchableOpacity style={[styles.entry, styles.shadowProp]} onPress={ ()=> handleVisibleModal(item) }>
                  <Text>{`${item.title}`}</Text>
                  <Text>{`${item.date}`}</Text>
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

    {/*ADD ITEM MODAL*/}
    <Entry visible={visible} handleButton={handleButton} handleChangeText={handleChangeText} date={date} title={title} question={question} scripture={scripture} observation={observation} application={application} prayer={prayer} status={status} type={type} modifiedDate={modifiedDate} itemId={key}
    handleScripture={handleChangeScripture} currentStatus={currentStatus} handleChangeDate={handleChangeDate} modifyDate={handleModifiedDate} currentEntry={currentEntry} update={updateEntry}/>

    {/*For displaying the component*/}
    <Entry visible={visibleDisplay} handleButton={handleButton} handleChangeText={handleChangeText} date={date} title={title} question={question} scripture={scripture} observation={observation} application={application} prayer={prayer} status={status} type={type} modifiedDate={modifiedDate} handleDelete={handleDelete} itemId={key} handleScripture={handleChangeScripture}
    statusColor={handleStatusColor} currentStatus={currentStatus} handleChangeDate=
    {handleChangeDate} modifyDate={handleModifiedDate} currentEntry={currentEntry} update={updateEntry}
    />

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