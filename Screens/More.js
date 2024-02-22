import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Feather } from '@expo/vector-icons';

export default function More({darkMode, handleDarkMode, globalStyle, navigation}) {

  const handleOpenSettings = () =>{
    navigation.navigate("Settings");
  }
  const handleOpenArchive = () =>{
    navigation.navigate("Archive");
  }
  const handleOpenTrash = () =>{
    navigation.navigate("Trash");
  }

  return (
    <>
        <View style={[styles.container, {backgroundColor: globalStyle?.bgBody}]}>

          <View style={styles.moreViewRow} >
            <TouchableOpacity style={styles.moreBtn} onPress={ ()=> handleOpenArchive() } >
                <Feather name="archive" size={28}  color={globalStyle?.color} />
                <Text style={{fontSize: globalStyle.fontSize, color: globalStyle.color}} >Archive</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreBtn} onPress={ ()=> handleOpenTrash() }>
                <Feather name="trash" size={28}  color={globalStyle?.color} />
                <Text style={{fontSize: globalStyle.fontSize, color: globalStyle.color}} >Trash</Text>
            </TouchableOpacity>

            <TouchableOpacity  style={styles.moreBtn} onPress={handleOpenSettings} >
                <Feather name="settings" size={28} color={globalStyle?.color} />
                <Text style={{fontSize: globalStyle.fontSize, color: globalStyle.color}} >Settings</Text>
            </TouchableOpacity>
            
          </View>

          <View style={styles.moreViewRow}>
            <TouchableOpacity style={styles.moreBtn}>
                <MaterialIcons name="menu-book" size={28}  color={globalStyle?.color} />
                <Text style={{fontSize: globalStyle.fontSize, color: globalStyle.color}} >Tutorial</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreBtn}>
                <Feather name="info" size={28}  color={globalStyle?.color} />
                <Text  style={{fontSize: globalStyle.fontSize, color: globalStyle.color}} >About</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled style={styles.moreBtn} >
                <Feather name="settings" size={28} color={globalStyle?.bgBody} />
                <Text style={{fontSize: globalStyle.fontSize, color: globalStyle.bgBody}} >Settings</Text>
            </TouchableOpacity>
            

          </View>



        </View>
  
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    justifyContent: "start",
  },
  touchable: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    gap: 10,
    padding: 12,
    borderRadius: 15,
  },
  moreViewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    gap: 10,
  },
  moreBtn: {
    padding: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});