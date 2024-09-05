import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper'

export default function More({navigation}) {
  const theme = useTheme();
  const handleOpenSettings = () =>{
    navigation.navigate("Settings");
  }
  const handleOpenArchive = () =>{
    navigation.navigate("Archive");
  }
  const handleOpenTrash = () =>{
    navigation.navigate("Trash");
  }
  const handleOpenTutorial = () =>{
    navigation.navigate("Tutorial");
  }
  const handleOpenAbout = () =>{
    navigation.navigate("About");
  }

  return (
    <>
      <View style={[styles.container, {backgroundColor: theme.colors.secondary}]}>

        <View style={styles.moreViewRow} >
          <TouchableOpacity style={styles.moreBtn} onPress={ ()=> handleOpenArchive() } >
              <Feather name="archive" size={28}  color={theme.colors.textColor} />
              {/* <Entypo name="archive" size={28} color={theme.colors.textColor} /> */}
              <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}} >Archive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.moreBtn} onPress={ ()=> handleOpenTrash() }>
              <Feather name="trash" size={28}  color={theme.colors.textColor} />
              {/* <Entypo name="trash" size={28} color={theme.colors.textColor} /> */}
              <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}} >Trash</Text>
          </TouchableOpacity>

          <TouchableOpacity  style={styles.moreBtn} onPress={handleOpenSettings} >
              <Feather name="settings" size={28} color={theme.colors.textColor} />
              {/* <FontAwesome5 name="cogs" size={28} color={theme.colors.textColor} /> */}
              <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}} >Settings</Text>
          </TouchableOpacity>
          
        </View>

        <View style={styles.moreViewRow}>
          <TouchableOpacity style={styles.moreBtn} onPress={handleOpenTutorial}>
              <Entypo name="open-book" size={28} color={theme.colors.textColor} />
              <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}} >Tutorial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.moreBtn} onPress={handleOpenAbout}>
              <Feather name="info" size={28}  color={theme.colors.textColor} />
              <Text  style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}} >About</Text>
          </TouchableOpacity>

          <TouchableOpacity disabled style={styles.moreBtn} >
              <Feather name="settings" size={28} color={theme.colors.secondary} />
              <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.secondary}} >Settings</Text>
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