import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'
import Modal from "react-native-modal";

import React,{useState, useEffect} from 'react'
import * as SQLite from 'expo-sqlite';
import {useTheme, RadioButton} from 'react-native-paper';

import asv from '../constants/asv.json';
import esv from '../constants/esv.json';
import tagalog from '../constants/tagab.json';

export default function Bible({navigation}) {
const theme = useTheme();

    return (
        <>

            <View style={styles.container}>
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
