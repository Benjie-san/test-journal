import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('JournalDatabase.db');
import Entry from './Entry';

export default function Home() {

  const [visible, setVisible] = useState(false);
  const [visibleDisplay, setVisibleDisplay] = useState(false);
  const [notes, setNotes] = useState([]);
  const [date, setDate] = useState("date");
  const [scripture, setScripture] = useState("");
  const [observation, setObservation] = useState("");
  const [application, setApplication] = useState("");
  const [prayer, setPrayer] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [entry, setEntry] = useState([]);
  const [key, setKey] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("");



  const handleButton = (date, scripture, observation, application, prayer, status, type, itemId, currentStatus)  => {

    if (date == "" && scripture == "" && observation == "" && application == "" && prayer == ""){
      return setVisible(false);
    } 
    // adding entry to db
    if(currentStatus == "add"){

      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO entries (date, scripture, observation, application, prayer, status, type) VALUES (?, ?, ?, ?, ?, ?, ?);',
          [date, scripture, observation, application, prayer, status, type],
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
      if(date != entry.date ||  scripture != entry.scripture || observation != entry.observation || application != entry.application || prayer != entry.prayer || status != entry.status){
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE entries SET date = ?, scripture = ?, observation = ?, application = ?, prayer = ?, status = ? WHERE id = ?;',
            [date, scripture, observation, application, prayer, status, itemId ],
            (_, result) => {
              console.log('Data updated successfully');
            },
            (_, error) => {
              console.error('Error updating data:', error);
            }
          );
        });
      }
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
      case 'date': 
            setDate(text) ;break;
      case 'scripture': setScripture(text) ;break;
      case 'observation': setObservation(text) ;break;
      case 'application': setApplication(text) ;break;
      case 'prayer': setPrayer(text) ;break;
      
    }
  }

  //for cleaning states
  const cleanStates = () =>{
    setDate("");
    setScripture("");
    setObservation("");
    setApplication("");
    setPrayer("");
    setEntry([]);
  }

  //for showing the SELECTED ENTRY
  const handleVisibleModal = (item) => {
    setCurrentStatus("ongoing");
    setVisibleDisplay(true);
    setKey(item.id); 
    setDate(item.date);
    setScripture(item.scripture);
    setObservation(item.observation);
    setApplication(item.application);
    setPrayer(item.prayer);
    setEntry(item);
  };

  const handleAddButton = () => {
    setCurrentStatus("add");
    setStatus("#F7CB73");
    setType("journal");
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
      fetchData();
      setVisibleDisplay(false);
  }
  // getting the data in the db
  const fetchData = () => {
    setNotes([]);
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
                'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, scripture TEXT, observation TEXT, application TEXT, prayer TEXT, status TEXT, type TEXT);',
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

  useEffect(() => {
    setupDatabase();
    fetchData();
  }, []);

  return (
  <>
    {/*MAIN VIEW*/}
    <View style={[styles.homeContainer, styles.flex]}>
      <Text>Journal Entries</Text>

      <View style={styles.notelist}>
        {notes.length === 0 ? (
          <Text style={{fontSize: 30,}}>No data available</Text>
        ) : (
          <FlatList
            style={{width:"100%",}}
            data={notes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            
              <TouchableOpacity style={styles.entry} onPress={ ()=> handleVisibleModal(item) }>
                {/* <Text>{`${item.date}`}</Text> */}
                <Text>date</Text>
                <Text>{` ${item.scripture}`}</Text>
                {/* <Text>{`${item.status}`}</Text> */}
                <View style={[styles.border, {width: 30, height: 30, backgroundColor: item.status}]}></View>

              </TouchableOpacity>
            )}
          /> 
        )}
      </View>



      <View style={styles.navbar}>
        <Pressable onPress={ ()=>handleAddButton() } style={styles.addEntry}>
        <Image style={{width: 20, height: 20, transform:[{rotate: '180deg'}],}} source={require("../assets/plus.png")}/>
        </Pressable>
      </View>

      {/* <Pressable onPress={ ()=>deleteAllEntries() } style={styles.btn}>
          <Text>Reset Table</Text>
      </Pressable> */}
    </View>

    {/*ADD ITEM MODAL*/}
    <Entry visible={visible} handleButton={handleButton} handleChangeText={handleChangeText} date={date} scripture={scripture} observation={observation} application={application} prayer={prayer} status={status} type={type} itemId={key}
    handleScripture={handleChangeScripture} currentStatus={currentStatus}/>
    {/*For displaying the component*/}
    <Entry visible={visibleDisplay} handleButton={handleButton} handleChangeText={handleChangeText} date={date} scripture={scripture} observation={observation} application={application} prayer={prayer} status={status} type={type} handleDelete={handleDelete} itemId={key} handleScripture={handleChangeScripture}
    statusColor={handleStatusColor}  currentStatus={currentStatus}/>

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
  btn:{
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'cyan',
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
    height: "75%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  entry:{
    borderColor: "#0c0c0c",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addEntry:{
    borderRadius: 50,
    backgroundColor: 'cyan',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbar:{
    width: "90%", 
    height: "10%",
    borderColor: "#0c0c0c",
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})