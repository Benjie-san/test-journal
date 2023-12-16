import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Image, Modal } from 'react-native';
import React, {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite';
import data from '../constants/journal-data.json'
const db = SQLite.openDatabase('database_journal.db');
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
              height:"30%",
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
  const [question, setQuestion] = useState("")
  const [type, setType] = useState("");
  const [key, setKey] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const todayDate = new Date();
  const today ={
    day:todayDate.getDate(),
    month: months[todayDate.getMonth()],
  };
  const todayVerse = data[today.month][today.day-1]["verse"];
  const [visibleAddModal, setVisibleAddModal] = useState(false);

  const handleButton = (date, title, question, scripture, observation, application, prayer, status, type, itemId, currentStatus)  => {
    if (date == "" && scripture == "" && observation == "" && application == "" && prayer == "" && title == ""){
      return setVisible(false);
    } 

    if(currentStatus == "ongoing" && status == "#F7CB73"){
      setStatus("#F7CB73");
    }

    // adding entry to db
    if(currentStatus == "add"){
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
          [date, title, question, scripture, observation, application, prayer, status, type],
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
      cleanStates();
    }

    if(currentStatus == "ongoing"){
      //updating the entry
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE entries SET date = ?, title = ?, question = ?, scripture = ?, observation = ?, application = ?, prayer = ?, status = ? WHERE id = ?;',
            [date, title, question, scripture, observation, application, prayer, status, itemId ],
            (_, result) => {
              console.log('Data updated successfully');
            },
            (_, error) => {
              console.error('Error updating data:', error);
            }
          );
        });
      // }
      setVisibleDisplay(false);
      cleanStates();
      fetchData();
    }else{
      setVisible(false);
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
  }

  //for showing the SELECTED ENTRY
  const handleVisibleModal = (item) => {
    setCurrentStatus("ongoing");
    setVisibleDisplay(true);
    setKey(item.id); 
    setDate(item.date);
    setTitle(item.title);
    setTitle(item.question);
    setScripture(item.scripture);
    setObservation(item.observation);
    setApplication(item.application);
    setPrayer(item.prayer);
    setStatus(item.status);
    setType(item.type);
  };

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
                'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, title TEXT, question TEXT, scripture TEXT, observation TEXT, application TEXT, prayer TEXT, status TEXT, type TEXT);',
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
        (_, error) => {
          console.error('Error checking table existence:', error);
        }
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

  useEffect(() => {
    setupDatabase();
    fetchData();
  }, []);

  return (
  <>
    {/*MAIN VIEW*/}
    <View style={[styles.homeContainer, styles.flex]}>

      {/*Todays passage*/}
      <View style={[{width: "90%", height: "20%", top: 0, position: "absolute", marginTop: 30}]}>
      <Text style={{padding: 10, fontSize: 20, textAlign: "center"}}>Journal 2023</Text>
        <View style={[styles.passageToday, {marginBottom:5}]}>
          <Text style={{fontSize: 17}}>Today's Passage</Text>
          <Text style={{fontSize: 17}}>{today.month + " " + today.day}</Text>
        </View>
        <Pressable onPress={ ()=>handleAddButton("today")} style={[styles.border, styles.passageToday, {height: "60%", padding: 10}]}>
          <Text style={{fontSize: 20}}>{todayVerse}</Text>
          <Image style={{width: 30, height: 30,}} source={require("../assets/arrow-right.png")}/>
        </Pressable>
      </View>


      <View style={styles.notelist}>
        {notes.length === 0 ? (
          <Text style={{fontSize: 30,}}>No data available</Text>
        ) : (
          <>
          <View style={[styles.passageToday, {width: "100%", height: "10%",}]}>
            <Text style={{fontSize:17}}>Recent Entries</Text>
            <View></View>
          </View>
            <FlatList
              style={{width:"100%",}}
              data={notes}
              inverted={true}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
              
                <TouchableOpacity style={styles.entry} onPress={ ()=> handleVisibleModal(item) }>
                  <Text>{`${item.date}`}</Text>
                  <Text>{` ${item.scripture}`}</Text>
                  <View style={[styles.border, {width: 30, height: 30, backgroundColor: item.status}]}></View>

                </TouchableOpacity>
              )}
            /> 
        
          </>        
        )}
      </View>


      <View style={styles.navbar}>
        <Pressable onPress={ ()=>handleVisibleAddModal() } style={styles.addEntry}>
        <Image style={{width: 30, height: 30,}} source={require("../assets/write.png")}/>
        </Pressable>
      </View>

      {/* <Pressable onPress={ ()=>deleteAllEntries() } style={styles.btn}>
          <Text>Reset Table</Text>
      </Pressable> */}
    </View>

    {/*ADD ITEM MODAL*/}
    <Entry visible={visible} handleButton={handleButton} handleChangeText={handleChangeText} date={date} title={title} question={question} scripture={scripture} observation={observation} application={application} prayer={prayer} status={status} type={type} itemId={key}
    handleScripture={handleChangeScripture} currentStatus={currentStatus} handleChangeDate={handleChangeDate}/>

    {/*For displaying the component*/}
    <Entry visible={visibleDisplay} handleButton={handleButton} handleChangeText={handleChangeText} date={date} title={title} question={question} scripture={scripture} observation={observation} application={application} prayer={prayer} status={status} type={type} handleDelete={handleDelete} itemId={key} handleScripture={handleChangeScripture}
    statusColor={handleStatusColor} currentStatus={currentStatus} handleChangeDate={handleChangeDate}/>

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
    backgroundColor: '#f9f9f9',
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  notelist:{
    width: "90%",
    height: "60%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
  },
  entry:{
    borderColor: "#0c0c0c",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addEntry:{
    borderRadius: 50,
    backgroundColor: '#1d9bf0',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbar:{
    width: "90%", 
    height: "10%",
    bottom: 0,
    position: "absolute",
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})