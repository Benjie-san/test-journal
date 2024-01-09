import { StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Image, Dimensions, UIManager, FlatList, Pressable} from 'react-native'
import React, {useState, useEffect, useRef} from 'react';
import Entypo from '@expo/vector-icons/Entypo'; 
import data from '../constants/2023.json' 
import AddEntry from '../components/AddEntry';
import DisplayEntry from '../components/DisplayEntry';
import Ionicons from '@expo/vector-icons/Ionicons';
const dbJournal = SQLite.openDatabase("_journal_database.db");
import * as SQLite from 'expo-sqlite';

import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';
//const dbBrp = SQLite.openDatabase("brpDatabase.db");

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const theme2024 =["SYSTEMS IMPROVEMENT", "SYSTEMS IMPROVEMENT", "MACRO-EVANGELISM","MACRO-EVANGELISM", 'ACCOUNT SETTLEMENT', 'ACCOUNT SETTLEMENT', "RELATIONAL DISCIPLESHIP", "RELATIONAL DISCIPLESHIP", "TRAINING-CENTERED", "TRAINING-CENTERED", "CHURCH", "CHURCH"];

let content = Object.keys(data).map( (key, index) =>
   (
      {
      isExpanded: false,
      category_name: Object.keys(data)[index],
      }
   )
);


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
}
const ExpandableComponent = ({onRef, item, index, onClickFunction, handleAddEntry, handleDisplayEntryModal, handleScripture, handleType, handleIndex, handleEntry, handleItemId}) =>{
   
   const [layoutHeight, setlayoutHeight] = useState(0);
   const [show, setShow] = useState(false);
   const [currentMonthEntries, setCurrentMonthEntries] = useState([])
   const [monthCompletion, setMonthCompletion] = useState([]);
   const [idArray, setIdArray] = useState([]);
   const [idPending, setIdpending] = useState([]);
   const [idComplete, setIdcomplete] = useState([]);


   const handleItemPress = (item) => {
      handleItemId(item.id)
      handleIndex(index)


      if( idArray.includes(item.id) ){                  
         fetchCurrentEntry(item.id)
         handleDisplayEntryModal(true)
      } else {
         handleType( item.verse !== 'Sermon Notes' ? 'journal':'sermon' );
         handleScripture( item.verse !=='Sermon Notes' ? item.verse: '' );
         handleAddEntry(true)
      }
      setMonthCompletion([])
   }
   
   // const fetchCurrentMonth =   (item) => {
   //    dbBrp.transaction((tx) => {
   //       tx.executeSql('SELECT * FROM brp2024 WHERE month = ?', [item],
   //       (_, result) => {
   //          const rows = result.rows;
   //          const dataArray = [];
   //          for (let i = 0; i < rows.length; i++) {
   //             const item = rows.item(i);
   //             dataArray.push(item);
   //          }
   //          setCurrentMonthEntries([...dataArray]);
   //       },
   //       (_, error) => {
   //             alert("No Entry yet")
   //             console.error('Error querying data:', error);
   //       }
   //       );
   //    })


   // }
   const fetchCurrentMonth = async (item) => {
      const dbBrp = await openBrpDatabase();
      return new Promise( () => {
         dbBrp.transaction((tx) => {
            tx.executeSql('SELECT * FROM brp2024 WHERE month = ?', [item],
            (_, result) => {
               const rows = result.rows;
               const dataArray = [];
               for (let i = 0; i < rows.length; i++) {
                  const item = rows.item(i);
                  dataArray.push(item);
               }
               setCurrentMonthEntries([...dataArray]);
            },
            (_, error) => {
                  alert("No Entry yet")
                  console.error('Error querying data:', error);
            }
            );
         })
      });
   }


   const fetchMonthCompletion = (item) =>{

      dbJournal.transaction((tx) => {
         tx.executeSql(
            "SELECT * FROM entries WHERE month = ? ;",
            [item],
            (_, result) => {
               const rows = result.rows;
               const dataArray = [];
               const dataArray2 = [];
               const dataArray3  = [];
               const dataArray4  = [];

               for (let i = 0; i < rows.length; i++) {
                  const item = rows.item(i);
                  dataArray.push(item);
                  dataArray2.push(item.dataId);
                  if(item.status == '#ffad33'){
                     dataArray3.push(item.dataId);
                  }else if(item.status == '#8CFF31'){
                     dataArray4.push(item.dataId);
                  }
               }
               setMonthCompletion(dataArray);
               setIdArray(dataArray2);
               setIdpending(dataArray3);
               setIdcomplete(dataArray4);
            },
            (_, error) => {
               alert("No Entry yet")
               console.error('Error querying data:', error);
            }
         );
      });
   }

   const fetchCurrentEntry = (id) =>{
   
      dbJournal.transaction((tx) => {
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
               handleEntry(...dataArray);
            },
            (_, error) => {
               alert("No Entry yet")
               console.error('Error querying data:', error);
            }
         );
      });
   }

   const handleMonthPress = () =>{
      onClickFunction()
      fetchCurrentMonth(item.category_name);
      fetchMonthCompletion(item.category_name);
   }


   useEffect(() => {

   if(item.isExpanded){
      onRef.current.scrollToIndex({ index, animated: true });
      setlayoutHeight(null);
      setShow(true);
   } else{ 
      setlayoutHeight(0);
      setShow(false);
   }

   }, [item.isExpanded])


   return (
   <>
      <View style={{flex:1,  flexGrow:1}}>
         <TouchableOpacity onPress={() => handleMonthPress()} style={[styles.months, {
      borderBottomWidth: show ? 0:1,}]}>
            <Text style={{fontSize: 20}}>{item.category_name}</Text> 
         
            <Entypo name={show ? "chevron-thin-up" : "chevron-thin-down"} size={28} color="black" />
         </TouchableOpacity>

         <View style={{ height: layoutHeight, overflow:'hidden'}}>
         { show ?  (<Text style={{fontSize: 17, paddingLeft: 10,}}>{theme2024[index]}</Text>) : null }
            { show ? 
            (
            
            currentMonthEntries.map((item, index) => (
   
               <TouchableOpacity
                  onPress={()=>handleItemPress(item, index)}
                  style={styles.dailyEntry}
                  key={index}>
                     <View style={{flexDirection: 'row'}}> 
                        <Text style={{fontSize: 17, paddingLeft: 10,}}>{item.day},</Text>
                        <Text style={{fontSize: 17, paddingLeft: 10,}}>{item.verse}</Text>
                     </View>

                     <View style={[styles.check, styles.border,
                        {backgroundColor: idArray.includes(item.id) ? idPending.includes(item.id) ?  "#ffad33" : idComplete.includes(item.id) ? "#8CFF31":'#f5f5f5' : '#fff'}]}>

                     </View>
            
               </TouchableOpacity>
         
            ))

            ): null

         }

         </View>
      </View>
   </>
   );
}

export default function Brp({navigation}){

   UIManager.setLayoutAnimationEnabledExperimental;
   const [listData, setListData] = useState(content); // state that populates the items from data
   const [addEntryVisible, setAddEntryVisible] = useState(false)
   const [displayEntryVisible, setDisplayEntryVisible] = useState(false)
   const flatListRef = useRef(null);
   const [scripture, setScripture] = useState("");
   const [type, setType] = useState("");
   const [currentEntry, setCurrentEntry] = useState([]);
   const [index, setIndex] = useState(0)
   const [entry, setEntry] = useState([]);
   const [itemId, setItemId] = useState(0);

   const updateLayout = async (index) => {

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const array = [...listData];
      array.map((value, placeIndex)=>{
         if(placeIndex === index){
            (array[placeIndex]['isExpanded']) = !array[placeIndex]['isExpanded']
         }else{
            (array[placeIndex]['isExpanded']) = false
         }
      });
      setListData(array);
   }

   const handleAddEntryModal =  (item) =>{
      setAddEntryVisible(item);
   }
   const handleDisplayEntryModal =  (item) =>{
      setDisplayEntryVisible(item);
   }
   
   const handleScripture = (item) => {
      setScripture(item)
   }

   const handleType = (item) => {
      setType(item)
   }

   const handleIndex = (item) =>{
      setIndex(item);
   }


   const handleEntry = (item) => {
      setEntry(item)
   }

   const handleCurrentEntry = (item) =>{
      setCurrentEntry(item);
   }

   const handleItemId = (item) =>{
      setItemId(item);
   }


   const handleBRPBackButton = () =>{
      navigation.navigate("Home");
   }


useEffect(() => {
   // Use `setOptions` to update the button that we previously specified
   // Now the button includes an `onPress` handler to update the count
   navigation.setOptions({
   headerLeft: () => (
      <Pressable title="BrpBackButton" onPress={ ()=>handleBRPBackButton() }>
         <Ionicons name="chevron-back-sharp" size={30} color="black" />
      </Pressable>
   ),
   });
}, [navigation]);

useEffect(() => {
}, [])


   return (
   <>
   
   <View style={styles.container}>
   
         <View style={{ flex:1, width: Dimensions.get("screen").width-20,}}>

            <FlatList
               ref={flatListRef}
               data={listData}
               keyExtractor={(item, index) => index.toString()}
               initialScrollIndex={0}  
               onScrollToIndexFailed={info => {
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                     flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                  });
               }}
               renderItem={ ({item, index}) =>
                  <ExpandableComponent
                     onRef={flatListRef}
                     key={item.category_name}
                     item={item}
                     index={index}
                     onClickFunction={()=>{ updateLayout(index)}}
                     handleAddEntry={handleAddEntryModal}
                     handleDisplayEntryModal={handleDisplayEntryModal}
                     handleScripture={handleScripture}
                     handleType={handleType}
                     handleIndex={handleIndex}
                     currentEntry={currentEntry}
                     handleEntry={handleEntry}
                     handleCurrentEntry={handleCurrentEntry}
                     handleItemId={handleItemId}
            
                  />
               }
            />
         </View>
   </View>

   <AddEntry visible={addEntryVisible} handleModal={handleAddEntryModal} verse={scripture} type={type} status="#ffad33" handleType={handleType} itemId={itemId} index={index}/>

   <DisplayEntry visible={displayEntryVisible} handleModal={handleDisplayEntryModal} currentEntry={entry} handleEntry={handleEntry} itemId={itemId}  />

   </>
   )
}

const styles = StyleSheet.create({
   container:{
      padding: 10,
      flex:1,
      backgroundColor: "#fff",
      gap: 10,
      paddingTop: 30,
   },
   border:{
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 5,
   },
   months:{
      padding: 12,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      borderColor: "gray",
   },

   dailyEntry:{
      padding: 14,
      height: 50,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      borderColor: "gray",
      borderBottomWidth: 1,

   },
   check:{
      width: 25,
      height: 25,
   },
})
