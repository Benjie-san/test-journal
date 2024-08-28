import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'
import Modal from "react-native-modal";

import React,{useState, useEffect} from 'react'
import * as SQLite from 'expo-sqlite';
import {useTheme, RadioButton} from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

//bibles
import asv from '../constants/asv.json';
import esv from '../constants/esv.json';
import tagalog from '../constants/tagab.json';

export default function Bible({navigation}) {
const theme = useTheme();


//HEADER
useEffect(() => {
  navigation.setOptions({
      headerStyle: {backgroundColor: theme.colors.primary, justifyContent: 'space-between'},

    headerLeft: () => (
        <Feather name="menu" size={24} color={theme.colors.textColor} />
    ),
    headerTitle: () => (

      <View style={{flexDirection: 'row', alignItems: "center",gap:10}}>
        <Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize}}>
          Romans 1 ESV
        </Text>

      </View>

    ),
    headerRight: () => (

      <View style={{flexDirection: 'row', alignItems: "center", gap:10, }}>
        <MaterialIcons name="search" size={24} color={theme.colors.textColor} />
      
      </View>

    ),
      
  });
}, []);

    return (
        <>

            <View style={[styles.container, {backgroundColor: theme.colors.secondary}]}>
                <Text>BIBLE</Text>
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

})
