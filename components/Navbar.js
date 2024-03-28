import { StyleSheet, View, Pressable, Image, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';

const Navbar = ({ onPressAddEntry,}) => {

   return(
   <View style={[styles.navbar]}>
      <View style={{borderRadius: 50, width: 60, height: 60, padding: 10,
      margin: 10, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={ ()=>onPressAddEntry() } style={[styles.addEntry]}>
         <Image style={{width: 30, height: 30,}} source={require("../assets/write.png")}/>
      </TouchableOpacity>
      </View>
   </View>
   )
}

const styles = StyleSheet.create({
   navbar:{
      right: 0,
      bottom: 0,
      position: "absolute",
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
      alignItems: 'center',
   },
   addEntry:{
      borderRadius: 50,
      backgroundColor: '#1d9bf0',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
   },
});


export default Navbar;