import { StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Image, Dimensions, UIManager, FlatList, Pressable} from 'react-native'
import React, {useState, useEffect, useRef} from 'react';
import Entypo from '@expo/vector-icons/Entypo'; 
const db = SQLite.openDatabase('_journal_2023.db');
import * as SQLite from 'expo-sqlite';

import data from '../constants/2023.json'
import AddEntry from '../components/AddEntry';
import DisplayEntry from '../components/DisplayEntry';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { SafeAreaView } from 'react-native-safe-area-context';

let content = Object.keys(data).map( (key, index) =>
   (
      {
      isExpanded: false,
      category_name: Object.keys(data)[index],
      subcategory: [  
         ...data[key]
      ],
      }
   )
);

const ExpandableComponent = ({onRef, item, index, onClickFunction, handleAddEntry, handleDisplayEntryModal, handleScripture, handleType, handleCurrentEntry, handleItem, handleIndex, currentEntry, handleEntry, fetchData}) =>{
   
   const [layoutHeight, setlayoutHeight] = useState(0);
   const [show, setShow] = useState(false);
   const handlePress = (item) => {

      handleItem(item);
      handleIndex(index);
      let newArr = currentEntry.filter( (i) => i.day == item.date-1)

      if(newArr.length == 1){
    
            handleType( item.verse !== 'Sermon Notes' ? 'journal':'sermon' );
            handleEntry(newArr)
            handleDisplayEntryModal(true);
            
         
      } else {
         handleType( item.verse !== 'Sermon Notes' ? 'journal':'sermon' );
         handleScripture( item.verse !=='Sermon Notes' ? item.verse: '' );
         handleAddEntry(true)
 
      }
      handleCurrentEntry([]);
      fetchData(index);
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
         <TouchableOpacity onPress={onClickFunction} style={[styles.months, {
      borderBottomWidth: show ? 0:1,}]}>
            <Text style={{fontSize: 20}}>{item.category_name}</Text> 
         
            <Entypo name={show ? "chevron-thin-up" : "chevron-thin-down"} size={28} color="black" />
         </TouchableOpacity>

         <View style={{ flex:1, height: layoutHeight}}>
            <Text style={{fontSize: 17, paddingLeft: 10,}}>Theme:</Text>
            { show ? 
            (
            item.subcategory.map((item, key) => (
            
            <TouchableOpacity
               onPress={()=>handlePress(item)}
               style={styles.dailyEntry}
               key={key}>
                  <Text style={{fontSize: 17, paddingLeft: 10,}}>{item.verse}</Text>
                  <View style={[styles.check, styles.border,
                     {backgroundColor:currentEntry[key]?.status != "" ? currentEntry[key]?.status :'#f5f5f5'}]}></View>
         
               </TouchableOpacity>
            ))

            ): null

         }
               {console.log(item.date-1)}

         </View>
      </View>
   </>
   );
}

export default function Brp({navigation}){

   UIManager.setLayoutAnimationEnabledExperimental(true);
   const [listData, setListData] = useState(content); // state that populates the items from data
   const [addEntryVisible, setAddEntryVisible] = useState(false)
   const [displayEntryVisible, setDisplayEntryVisible] = useState(false)
   const flatListRef = useRef(null);
   const [scripture, setScripture] = useState("");
   const [type, setType] = useState("");
   const [currentEntry, setCurrentEntry] = useState([]);
   const [item, setItem] = useState("");
   const [index, setIndex] = useState(0)
   const [entry, setEntry] = useState([]);

   const updateLayout = async (index) => {
   
      fetchData(index);
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

   const handleDataId = (item) =>{
      setDataId(item);
   }

   const handleIndex = (item) =>{
      setIndex(item);
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

   const fetchData = (index) => {

      db.transaction((tx) => {
      tx.executeSql(
         "SELECT * FROM entries  WHERE month = ? ;",
         [index],
         (_, result) => {
            const rows = result.rows;
            const dataArray = [];
            for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(item);
            }
            setCurrentEntry(dataArray);
         },
         (_, error) => {
            alert("No Entry yet")
            console.error('Error querying data:', error);
         }
      );
      });
   };

   const handleBRPBackButton = () =>{
      listData[index]['isExpanded'] = false;
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
                     handleDataId={handleDataId}
                     handleIndex={handleIndex}
                     handleItem={handleItem}
                     currentEntry={currentEntry}
                     handleEntry={handleEntry}
                     handleCurrentEntry={handleCurrentEntry}
                     fetchData={fetchData}
                  />
               }
            />
         </View>
   </View>

   <AddEntry visible={addEntryVisible} handleModal={handleAddEntryModal} verse={scripture} type={type} status="#ffad33" index={index} item={item} handleType={handleType}/>

   <DisplayEntry visible={displayEntryVisible} handleModal={handleDisplayEntryModal} currentEntry={entry[0]} handleEntry={handleEntry}/>

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
