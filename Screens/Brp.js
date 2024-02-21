import { StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Dimensions, UIManager, FlatList, } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Entypo from '@expo/vector-icons/Entypo'; 
import data from '../constants/2023.json' 
import AddEntry from '../components/AddEntry';
import DisplayEntry from '../components/DisplayEntry';
import Ionicons from '@expo/vector-icons/Ionicons';
const dbJournal = SQLite.openDatabase("_journal_database.db");
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';

import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';

import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";


const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const theme2024 =["SYSTEMS IMPROVEMENT", "SYSTEMS IMPROVEMENT", "MACRO-EVANGELISM","MACRO-EVANGELISM", 'ACCOUNT SETTLEMENT', 'ACCOUNT SETTLEMENT', "RELATIONAL DISCIPLESHIP", "RELATIONAL DISCIPLESHIP", "TRAINING-CENTERED", "TRAINING-CENTERED", "CHURCH", "CHURCH"];

const todayDate = new Date();
const today ={
   day:todayDate.getDate(),
   month: months[todayDate.getMonth()],
   year: todayDate.getFullYear(),
};

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

const ExpandableComponent = ({onRef, item, index, navigation, globalStyle}) =>{
   
   //states for showing it
   const [height, setHeight] = useState(0);
   const [show, setShow] = useState(false);

   //states for ancordion
   const [currentMonthEntries, setCurrentMonthEntries] = useState([])

    // for item completion states
   const [idArray, setIdArray] = useState([]);
   const [idComplete, setIdcomplete] = useState([]);
   
   const isFocused = useIsFocused();

   const openAddEntry = (type, scripture, id, index) => {
      navigation.navigate("Home", {
      screen: 'Entry',
      params: {
         verse: scripture,
         entryType: type,
         itemId: id, 
         index: index,
         state: 'add',
      },
      });
   }
   
   const openDisplayEntry = (item) => {
      navigation.navigate("Home", {
      screen: 'Entry',
      params: {
         entryId: item.dataId,
         entryType: item.type,
         state: 'update',
      },
      });
   }
   

   //state for loading

   const handleItemPress = (item) => {
      const type = item.verse !== 'Sermon Notes' ? 'journal':'sermon';
      const scripture = item.verse !=='Sermon Notes' ? item.verse: '';
      // console.log(idArray.includes(item.id))
      if( idArray.includes(item.id) ){             
         fetchCurrentEntry(item.id);
   
      } 
      else {                                          
         openAddEntry(type, scripture, item.id, index);
      
      }

   }
   
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
               const dataArray4  = [];

               for (let i = 0; i < rows.length; i++) {
                  const item = rows.item(i);
                  dataArray.push(item);
                  dataArray2.push(item.dataId);
                  if(item.status == '#8CFF31'){
                     dataArray4.push(item.dataId);
                  }
               }
               setIdArray(dataArray2);
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
               openDisplayEntry(...dataArray);
               //handleEntry(...dataArray);
            },
            (_, error) => {
               alert("No Entry yet")
               console.error('Error querying data:', error);
            }
         );
      });
   }

   const handleMonthPress = () =>{
      fetchCurrentMonth(item.category_name);
      fetchMonthCompletion(item.category_name);
      setShow(!show);
   }

   const onLayout = (event) => {
      const layoutHeight = event.nativeEvent.layout.height;

      if(layoutHeight > 0 && layoutHeight !== height){
         setHeight(layoutHeight);
      }
   }
      
   const animatedStyle = useAnimatedStyle( ()=>{
      const animatedHeight = show ? withTiming(height) : withTiming(0);
      return{
         height: animatedHeight,
         overflow: 'hidden'
      }
   });

   
   const getThatDay = (item)=>{
      //const day = new Date();
      const day = new Date(Date.parse(`${today.year}-${index+1}-${item}`));
      return days[day.getDay()];
   }

   useEffect(() => {
      if(show){
         onRef.current.scrollToIndex({ index, animated: true });
      } 

   }, [show])

   useEffect(() => {
      if(isFocused){
         fetchMonthCompletion(item.category_name);
      }

   }, [isFocused])


   return (
   <>
      <View style={[{flex:1}]}>
         <TouchableOpacity 
            onPress={() => handleMonthPress()} 
            style={[styles.months, { borderBottomWidth: 1, borderColor: globalStyle?.color, }]}
         >
            <Text style={{fontSize: 20, color: globalStyle.color}}>{item.category_name}</Text> 
            {show?(<Text style={{fontSize: 17, paddingLeft: 10,  color: globalStyle?.color, }}>{theme2024[index]}</Text>):null}
            <Entypo name={show ? "chevron-thin-up" : "chevron-thin-down"} size={28} color={globalStyle?.color}/>
         </TouchableOpacity>
         <Animated.View style={animatedStyle}>
      
            <View onLayout={onLayout} style={{position: 'absolute', width: '100%', paddingLeft:5, paddingRight:5}}>

               {
                  currentMonthEntries.map((item, key) => (
      
                  <TouchableOpacity
                     onPress={()=>handleItemPress(item, key)}
                     style={[styles.dailyEntry, {backgroundColor: globalStyle?.bgHeader, borderBottomColor: globalStyle?.borderColor, }]}
                     key={key}>
                        <View style={{flexDirection: 'row'}}> 
                           <Text style={{fontSize: 17,  color: globalStyle?.color}}>{getThatDay(item.day)},</Text>
                           <Text style={{fontSize: 17,   color: globalStyle?.color}}> {item.day}  -</Text>
                           <Text style={{fontSize: 17, paddingLeft: 10,  color: globalStyle?.color}}>{item.verse}</Text>
                        </View>

                        <View style={[styles.check, styles.border,
                           {backgroundColor: idArray.includes(item.id) ? idComplete.includes(item.id) ? "#8CFF31":'#fff': '#fff'}]}>
                        </View>
               
                  </TouchableOpacity>
            
                  ))
               }
            </View>
         
         </Animated.View>
               
      </View>
   </>
   );
}

export default function Brp({navigation, globalStyle}){

   const [listData, setListData] = useState(content); // state that populates the items from data

   const flatListRef = useRef(null);

   return (
   <>
   
   <View style={[styles.container, { backgroundColor: globalStyle.bgHeader, borderTopColor: globalStyle.borderColor, }]}>
   
         <View style={{ flex:1,}}>

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
                     globalStyle={globalStyle}
                     navigation={navigation}
                  />
               }
            />
         </View>
   </View>


   </>
   )
}

const styles = StyleSheet.create({
   container:{
      width: '100%',
      flex:1,
      gap: 10,
   },
   border:{
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 5,
   },
   months:{
      width: '100%',
      padding: 12,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      boderBottomWidth: 1,
   },
   dailyEntry:{
      padding: 10,
      height: 55,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
   },
   check:{
      width: 25,
      height: 25,
   },
})
