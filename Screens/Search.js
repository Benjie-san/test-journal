import { StyleSheet, Text, View, TextInput, FlatList, Pressable, Image, TouchableOpacity, Dimensions } from 'react-native'
import React,{useState, useLayoutEffect} from 'react'
import * as SQLite from 'expo-sqlite';
import {useTheme} from 'react-native-paper';
const db = SQLite.openDatabase('_journal_database.db');


const SearchBar = ({searchItem, handleTextChange}) => {
   const theme = useTheme();
   return(
      <View style={{width: Dimensions.get('window').width-30, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary}}>

         <TextInput autoFocus={true} style={[{fontSize: theme.fonts.fontSize+4, color: theme.colors.textColor, }]} placeholderTextColor="#cccccc" placeholder='Search...' onChangeText={(text)=> handleTextChange(text)} value={searchItem}/>
      
      </View>
   );
};

export default function Search({navigation}) {
   const theme = useTheme();
   const [searchItem, setSearchItem] = useState("");
   const [searchedResult, setsSearchedResult] = useState([]);

   const openDisplayEntry = (item) => {
      navigation.navigate("Search", {
         screen: 'SearchEntry',
         params: {
            entryId: item.dataId,
            entryType: item.type,
            state: 'update',
         },
      });
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

   const formatLastModified = (timestamp) => {
         const lastModifiedTime = new Date(timestamp);
         const now = new Date();
   
         // Calculate the difference in milliseconds
         const timeDifference = now - lastModifiedTime;
   
         // Convert milliseconds to seconds, hours, or days as needed
         const seconds = Math.floor(timeDifference / 1000);
         const minutes = Math.floor(timeDifference / (1000 * 60));
         const hours = Math.floor(timeDifference / (1000 * 60 * 60));
         const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
   
         // Choose the appropriate format based on the time difference
         if (seconds < 60) {
            
            return `${seconds} ${seconds == 1 ? 'second' : 'seconds'} ago`;
         } 
         else if (minutes < 60) {
            return `${minutes} ${minutes == 1 ? 'minute' : 'minutes'} ago`;
         } 
         else if (hours < 24) {
            return `${hours} ${hours == 1 ? 'hour' : 'hours'} ago`;
         } else {
            return `${days} ${days == 1 ? 'day' : 'days'} ago`;
         }
   };

   //HEADER
   useLayoutEffect(() => {
      navigation.setOptions({
         headerStyle: {
            backgroundColor: theme.colors.primary,
            
         },
         headerTitleStyle:{
            color: theme.colors.textColor,
         },
         headerTitle: ()=> <SearchBar searchItem={searchItem} handleTextChange={handleTextChange}/> ,

      
      });
   }, [navigation, handleTextChange]);


   return (
      <>

         <View style={styles.container}>

            <View style={[styles.searchedlist, {backgroundColor: theme.colors.secondary}]}>
            {searchedResult.length === 0 ? (
               <Text style={{fontSize: theme.fonts.fontSize+14, paddingBottom: 150}}></Text>
            ) : (
               <>
                  <FlatList
                     style={{width: '100%'}}
                     data={searchedResult}
                     contentInsetAdjustmentBehavior="automatic"
                     keyExtractor={(item) => item.id.toString()}
                     renderItem={({ item }) => (
                  
                     <TouchableOpacity
                        style={ [styles.entry, {backgroundColor: theme.colors.primary, elevation: 2, gap: 5}] }
                        onPress={ ()=> openDisplayEntry(item) }
                     >
                        <Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize-2, overflow:'hidden', flex: 1}}>{item.title}</Text>

                        <Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize-2, overflow:'hidden',}}>{formatLastModified(Number(item.modifiedDate))}</Text>

                     </TouchableOpacity>
                  )}
               /> 
               </>        
            )}
            </View>

         </View>
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
      padding: 10,
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