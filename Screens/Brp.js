import { StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Image, Dimensions, UIManager, FlatList} from 'react-native'
import React, {useState, useEffect, useRef} from 'react';
import Entypo from '@expo/vector-icons/Entypo'; 

import data from '../constants/journal-data.json'

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

const ExpandableComponent = ({onRef, item, index, onClickFunction}) =>{
   const [layoutHeight, setlayoutHeight] = useState(0);
   const [show, setShow] = useState(false);

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
         <TouchableOpacity onPress={onClickFunction} style={styles.months}>
            <Text style={{fontSize: 20}}>{item.category_name}</Text> 
            <Entypo name={show ? "chevron-thin-up" : "chevron-thin-down"} size={28} color="black" />
         </TouchableOpacity>

         <View style={{ flex:1, height: layoutHeight}}>
            { show ? 
            (
            item.subcategory.map((item, key) => (
            <TouchableOpacity
               style={styles.dailyEntry}
               key={key}>

                  <Text style={{fontSize: 17, paddingLeft: 10,}}>{item.verse}</Text>
                  <View style={[styles.check, styles.border]}></View>

               </TouchableOpacity>
            ))
            
            // <>
            // <FlatList
            //    data={item.subcategory}
            //    keyExtractor={(item, index) => index.toString()}
            //    renderItem={ ({item, index}) =>
            //       <TouchableOpacity

            //       style={styles.dailyEntry}
            //       key={index}>
   
            //          <Text style={{fontSize: 17, paddingLeft: 10,}}>{item.verse}</Text>
            //          <View style={[styles.check, styles.border]}></View>
   
            //       </TouchableOpacity>
            //    }
            // /> 
            // </>
            ): null
         }

         </View>
      </View>
   </>
   );
}

export default function Brp({navigation}){

   UIManager.setLayoutAnimationEnabledExperimental(true);
   const [listData, setListData] = useState(content); // state that populates the items from data
   const flatListRef = useRef(null);

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

   return (
   <>
   <View style={styles.container}>
   
         <View style={{ flex:1, width: Dimensions.get("screen").width-20,}}>

            <FlatList
               ref={flatListRef}
               data={listData}
               keyExtractor={(item, index) => index.toString()}
               renderItem={ ({item, index}) =>
                  <ExpandableComponent
                     onRef={flatListRef}
                     key={item.category_name}
                     item={item}
                     index={index}
                     onClickFunction={()=>{ updateLayout(index)}}
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
      padding: 10,
      flex:1,
      backgroundColor: "#fff",
      gap: 10,
   },
   border:{
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 5,
   },
   write:{
      height: 70,
      padding: 10,
      justifyContent:"center",

   },
   contentContainer:{
      padding: 10,
   },
   months:{
      padding: 10,
      height: 50,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      borderColor: "black",
      borderBottomWidth: 1,
   },
   caretIcon:{
      width: 20,
      height: 13,
      resizeMode: "cover",
   },
   flip:{
      width: 20,
      height: 13,
      resizeMode: "cover",
      transform:[{rotate: '180deg'}],
   },

   dailyEntry:{
      
      padding: 10,
      height: 50,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      borderColor: "black",
      borderBottomWidth: 0.1,
      backgroundColor: '#f1f1f1',

   },
   check:{
      width: 25,
      height: 25,
   },
})
