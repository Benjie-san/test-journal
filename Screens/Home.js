import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Image, Modal, AppState } from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import * as SQLite from 'expo-sqlite';
import data from '../constants/journal-data.json'
const db = SQLite.openDatabase('new_database_journal_2023.db');
import Entry from './Entry';

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

export default function Home() {

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


  const handleButton = ()  => {
    if(currentStatus == "ongoing"){
      if(currentEntry.date !== date || currentEntry.scripture !== scripture || currentEntry.title !== title || currentEntry.question !== question || currentEntry.observation !== observation || currentEntry.application !== application || currentEntry.prayer !== prayer){   
        updateEntry(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, key, currentStatus);
        console.log(modifiedDate)
        setVisibleDisplay(false);
        cleanStates();

      }else{
        setVisibleDisplay(false);
        cleanStates();

      }
    }
    else if(currentStatus == "add"){
      saveEntry(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate);
      setVisible(false);
      cleanStates();
    }
    fetchData();

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
    setModifiedDate(new Date().toString())
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

  // when add/ write button is clicked
  const handleAddButton = (type) => {
    if(type == "today"){
      const currentDate = todayDate.toDateString();
      setDate(currentDate);
      setScripture(todayVerse);
      setType("journal");
    } else if(type == "journal"){
      setType("journal");
    } else if(type == "opm"){
      setType("opm");
    } else if(type == "sermon"){
      setType("sermon");
    }
    setCurrentStatus("add");
    setStatus("#F7CB73");
    setVisible(true);
  }

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
      cleanStates();
      fetchData();
      setVisibleDisplay(false);
  }
  // getting the data in the db


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

  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM entries;',
        [],
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
                'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, title TEXT, question TEXT, scripture TEXT, observation TEXT, application TEXT, prayer TEXT, status TEXT, type TEXT, modifiedDate TEXT);',
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
          fetchData();
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
            fetchData();
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

    if(currentStatus == "ongoing" && status == "#F7CB73"){
      setStatus("#F7CB73");
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

  //autosave
  useEffect(() => {
    if(visibleDisplay == true){

      const autosaveInterval = setInterval( () => {
        if(currentEntry.date !== date || currentEntry.scripture !== scripture || currentEntry.title !== title || currentEntry.question !== question || currentEntry.observation !== observation || currentEntry.application !== application || currentEntry.prayer !== prayer ){
      
          updateEntry(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, key, currentStatus);
          currentEntry.date = date;
          currentEntry.scripture = scripture;
          currentEntry.title = title;
          currentEntry.question = question;
          currentEntry.observation = observation;
          currentEntry.application = application;
          currentEntry.prayer = prayer;
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
    fetchData();
  }, []);


  return (
  <>
    {/*MAIN VIEW*/}
    <View style={[styles.homeContainer]}>

      {/*Todays passage*/}
      <View style={[{width: "100%", height: 'auto', padding: 15, paddingTop: 10}]}>

        <Text style={{padding: 10, fontSize: 20, textAlign: "center"}}>Journal 2023</Text>
        <View style={styles.passageToday}>
          <View style={[{flexDirection: 'column'}]}>
            <Text style={{fontSize: 21, fontWeight: 'bold'}}>Today's Passage</Text>
            <Text style={{fontSize: 20, color: '#4d4d4d'}}>{todayVerse}</Text>
            <Text style={{fontSize: 18 , color: '#808080'}}>{today.month + " " + today.day}</Text>
          </View>

          <Pressable onPress={ ()=>handleAddButton("today")} 
          style={[{
            width: "40%",
            height: "auto", 
            padding: 10, 
            backgroundColor: "#00ff99", 
            alignItems: 'center', 
            flexDirection: 'row', 
            justifyContent: 'space-evenly', 
            borderRadius: 5}]}>
              <Text style={{fontSize: 20, color: "#fff"}}>Add Entry</Text>
              <Image style={{width: 17, height: 17,}} source={require("../assets/add.png")}/>
          </Pressable>
        </View>
      </View>

      {/*Showing Present items*/}
      <View style={styles.notelist}>

          <View style={styles.sortingButtons}>
            <Pressable style={styles.sortingBtn}>
              <Text style={{fontSize: 12, color: '#00ff99',}}>All</Text>
              <View style={styles.itemCount}>
                <Text style={{color: '#fff'}}>0</Text>
              </View>
            </Pressable>

            <Pressable style={styles.sortingBtn}>
              <Text style={{fontSize: 12}}>Journal</Text>
              <View style={styles.itemCount}>
                <Text style={{color: '#fff'}}>0</Text>
              </View>
            </Pressable>

            <Pressable  style={styles.sortingBtn}>
              <Text style={{fontSize: 12}}>Opm</Text>
              <View style={styles.itemCount}>
                <Text style={{color: '#fff'}}>0</Text>
              </View>
            </Pressable>

            <Pressable  style={styles.sortingBtn}>
              <Text style={{fontSize: 12}}>Sermon Notes</Text>
              <View style={styles.itemCount}>
                <Text style={{fontSize: 12 ,color: '#fff'}}>0</Text>
              </View>
            </Pressable>

          
          </View>

        {notes.length === 0 ? (
          <Text style={{fontSize: 30, paddingTop: 200}}>No Entry Yet</Text>
        ) : (
          <>

            <FlatList
              style={{width:"100%",}}
              data={notes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
              
                <TouchableOpacity style={styles.entry} onPress={ ()=> handleVisibleModal(item) }>
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
      <View style={[styles.navbar, styles.border]}>
        <Pressable style={[ styles.navBarBtn,styles.border]}>
          <Text>Home</Text>
        </Pressable>

        <Pressable style={[ styles.navBarBtn,styles.border]}>
          <Text>BRP</Text>
        </Pressable>

        <Pressable onPress={ ()=>handleVisibleAddModal() } style={styles.addEntry}>
        <Image style={{width: 30, height: 30,}} source={require("../assets/write.png")}/>
        </Pressable>

        <Pressable style={[ styles.navBarBtn,styles.border]}>
          <Text>Search</Text>
        </Pressable>
        
        <Pressable onPress={deleteAllEntries} style={[ styles.navBarBtn,styles.border]}>
          <Text>Delete All</Text>
        </Pressable>

      </View>

      {/* <Pressable onPress={ ()=>deleteAllEntries() } style={styles.btn}>
          <Text>Reset Table</Text>
      </Pressable> */}
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
  homeContainer:{
    flex: 1,
    alignItems: "center",
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
    paddingTop: 20,
  },
  passageToday:{
    justifyContent:"space-between", 
    alignItems: "center", 
    flexDirection: 'row'
  },
  btn:{
    borderBottomWidth:1,
    borderBottomColor: 'black',
    padding: 15,
    alignItems: 'center',
    margin: 5,
  },
  btn2:{
    backgroundColor: 'red',
    width: 100,
    height: 100,
  },
  modal:{
    flex:1,
  },
  input:{
    backgroundColor: 'gray',
  },
  border:{
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  notelist:{
    width: "95%",
    height: "auto",
    justifyContent: 'center',
    alignItems: 'center',
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
  addEntry:{
    borderRadius: 50,
    backgroundColor: '#1d9bf0',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 70,
  },
  navbar:{
    width: "100%", 
    height: "10%",
    bottom: 0,
    position: "absolute",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex:1,
    backgroundColor: '#fff',
  },
  navBarBtn:{
    padding: 10,
    margin: 10,
  },
  sortingButtons:{
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-evenly'
  },
  sortingBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: "auto",
    padding: 5,
    gap: 5,
  },
  itemCount:{
    backgroundColor: "#00ff99", 
    paddingRight: 12,
    paddingLeft: 12,
    borderRadius: 10,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
})