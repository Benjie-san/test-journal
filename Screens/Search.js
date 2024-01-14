import { StyleSheet, Text, View, TextInput, FlatList, Pressable, Image, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
const db = SQLite.openDatabase('_journal_database.db');
import * as SQLite from 'expo-sqlite';
import DisplayEntry from '../components/DisplayEntry';
import Modal from "react-native-modal";
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Search({visible, handleModal, globalStyle}) {
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
            'SELECT * FROM entries WHERE date LIKE ? OR scripture LIKE ? OR title LIKE ? OR  question LIKE ? OR observation LIKE ? OR application LIKE ? OR prayer LIKE ?',
            [`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`],
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
      <Modal 
         isVisible={visible}
         animationIn="slideInRight"
         animationOut="slideOutRight"
         hasBackdrop={true}
         avoidKeyboard={false}
         propagateSwipe
         onBackButtonPress={ ()=> handleModal() }
         onBackdropPress={() => handleModal()}
         style={{
            flex:1, 
            margin: 0, 
            top: 0,
            right: 0,
            position: 'absolute',
            width: "80%",
            height: "100%",
         }}
      >
         <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10,  borderBottomColor: '#cccccc', borderBottomWidth:1 , backgroundColor: globalStyle.bgHeader}}>
               <TouchableOpacity  onPress={ () => handleModal() } styles={[{width: 30, height: 30}]}>
                  <Ionicons name="arrow-back-outline" size={30} color={globalStyle.color}/>
               </TouchableOpacity>
               <TextInput style={[{width: '85%', fontSize: 20, color: globalStyle.color, }]} placeholderTextColor={globalStyle.color} placeholder='Search...' onChangeText={(text)=> handleTextChange(text)} value={searchItem}/>
            </View>
            <View style={[styles.searchedlist, {backgroundColor: globalStyle.bgBody}]}>
            {searchedResult.length === 0 ? (
               <Text style={{fontSize: 30, paddingBottom: 150}}></Text>
            ) : (
               <>
                  <FlatList
                  style={{width: '100%'}}
                  data={searchedResult}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                  
                     <TouchableOpacity style={[styles.entry, {backgroundColor: globalStyle.noteList, borderColor: globalStyle.borderColor, borderWidth:1}]} onPress={ ()=> handleDisplayEntryFetch(item.dataId) }>
                        <Text style={{color: globalStyle.color}}>{`${item.date}`}</Text>
                        <Text style={{color: globalStyle.color}}>{`${item.scripture}`}</Text>
                        <View style={[styles.border, {width: 30, height: 30, backgroundColor: item.status}]}></View>

                     </TouchableOpacity>
                  )}
               /> 
               </>        
            )}
         </View>


         </View>
      </Modal>
      {/*For displaying the component*/}
      <DisplayEntry visible={displayEntryVisible} handleModal={handleDisplayEntryModal} currentEntry={currentEntry} handleEntry={handleCurrentEntry} handleType={handleType} globalStyle={globalStyle}/>
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
      backgroundColor: '#fff',
   },
   searchedlist:{
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
   
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