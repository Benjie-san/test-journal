import { StyleSheet, Text, View, TextInput, FlatList, Pressable, Image, Modal, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
const db = SQLite.openDatabase('_journal_database.db');
import * as SQLite from 'expo-sqlite';
import DisplayEntry from '../components/DisplayEntry';

export default function Search() {
   const [searchItem, setSearchItem] = useState("");
   const [searchedResult, setsSearchedResult] = useState([]);
   const [displayEntryVisible, setDisplayEntryVisible] = useState(false)
   const [currentEntry, setCurrentEntry] = useState([]);

   const handleDisplayEntryModal =  (item) =>{
      setDisplayEntryVisible(item);
   }

   const handleCurrentEntry = (item) =>{
      setCurrentEntry(item);
   }

   const handleType = (item) => {
      setType(item)
   }

   const handleTextChange = (text) =>{
      setSearchItem(text)
      searchData(text)
   }

   const searchData = (term) => {
      db.transaction((tx) => {
         tx.executeSql(
            'SELECT * FROM entries WHERE scripture LIKE ?',
            [`%${term}%`],
            (_, result) => {
            const rows = result.rows;
            const dataArray = [];
            for (let i = 0; i < rows.length; i++) {
               const item = rows.item(i);
               dataArray.push(item);
            }
            setsSearchedResult(dataArray);
            },
            (_, error) => {
            console.error('Error querying data:', error);
            }
         );
      });
   };

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

   return (
      <>
      <View style={styles.container}>
         <Text>Search</Text>
         <TextInput onChangeText={(text)=> handleTextChange(text)} value={searchItem}/>

         <View style={styles.searchedlist}>
         {searchedResult.length === 0 ? (
            <Text style={{fontSize: 30, paddingBottom: 150}}>No Entry Yet</Text>
         ) : (
            <>
               <FlatList
               style={{width: '100%'}}
               data={searchedResult}
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


      </View>

      {/*For displaying the component*/}
      <DisplayEntry visible={displayEntryVisible} handleModal={handleDisplayEntryModal} currentEntry={currentEntry} handleEntry={handleCurrentEntry} handleType={handleType}/>
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
   container:{
      flex:1,
      paddingTop:20,
   },
   searchedlist:{
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
})