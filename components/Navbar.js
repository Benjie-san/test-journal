import { StyleSheet, View, Pressable, Image } from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather'; 

const Navbar = ({path, onPress, onPressAddEntry, isSelected, openBrp}) => {

   const handlePress = () => {
      openBrp();
      onPress();
   }

   return(
   <View style={[styles.navbar]}>

      {/* <Pressable style={[ styles.navBarBtn,]} onPress={() => onPress()}>
         <Ionicons name={isSelected ? "md-home" : "md-home-outline"} size={24} color="#1d9bf0" />
      </Pressable>

      <Pressable style={[ styles.navBarBtn,]} onPress={() => handlePress()}>
         <Ionicons name={isSelected ? "md-book" : "md-book-outline"} size={24} color="#1d9bf0" />

      </Pressable> */}

      <Pressable onPress={ ()=>onPressAddEntry() } style={[styles.addEntry]}>
         <Image style={{width: 30, height: 30,}} source={require("../assets/write.png")}/>
      </Pressable>

      {/* <Pressable style={[ styles.navBarBtn,]}>
         <Ionicons name="md-search-outline" size={24} color="#1d9bf0" />
      </Pressable>
      
      <Pressable style={[ styles.navBarBtn,]}>
        <Feather name="more-horizontal" size={24} color="#1d9bf0" /> 
      </Pressable>  */}
   

   </View>
   )
}

const styles = StyleSheet.create({
   navbar:{
      width: "100%", 
      height: "10%",
      bottom: 0,
      position: "absolute",
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      zIndex:1,
      backgroundColor: 'transparent',
      margin: 10,
      padding: 10,
   },
   navBarBtn:{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      margin: 10,
   },
   addEntry:{
      borderRadius: 50,
      backgroundColor: '#1d9bf0',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
   },
   shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
   },
});


export default Navbar;