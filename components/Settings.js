import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import Fontisto from '@expo/vector-icons/Fontisto';
import { RadioButton } from 'react-native-paper'; 

import SettingsModal from './SettingsModal';

export default function Settings({navigation, darkMode, handleDarkMode, globalStyle}) {

  const [themeModal, setThemeModal] = useState(false);
  const [theme, setTheme] = useState(globalStyle?.name);
  const [checked, setChecked] = useState(globalStyle?.name);

  const handleTheme = (name, item) =>{
		setChecked(name);
		setTheme(name);
    setThemeModal(false);
    handleDarkMode(item);
	}

  const handleThemeModal = (item) =>{
    setThemeModal(item);
  }
  
  return (
    <>
    <View style={[styles.container, {backgroundColor: globalStyle?.bgBody}]}>
      
      <View style={styles.settings}>

          <View style={[styles.itemSettings]} > 
            <Text style={{color: globalStyle?.settingsColor, fontSize: 20}} >General</Text>

            <TouchableOpacity onPress={() => handleThemeModal(true)}>
              <Text  style={{fontSize: globalStyle?.fontSize+2, color: globalStyle?.color}} >Default Theme</Text>
              <Text  style={{fontSize: globalStyle?.fontSize, color: globalStyle?.color, opacity: 0.8}} >{theme}</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text  style={{fontSize: globalStyle?.fontSize+2, color: globalStyle?.color}} >Default Font Size</Text>
              <Text  style={{fontSize: globalStyle?.fontSize, color: globalStyle?.color, opacity: 0.8}} >Small</Text>
            </TouchableOpacity>
            
          </View>

        <View style={[styles.hr]}></View>

        
          <View style={[styles.itemSettings]} >
            <Text style={{color: globalStyle?.settingsColor, fontSize: 20}} >Sort</Text>

            <TouchableOpacity>
              <Text  style={{fontSize: globalStyle?.fontSize+2, color: globalStyle?.color}} >Default Entries Sort Order</Text>
              <Text  style={{fontSize: globalStyle?.fontSize, color: globalStyle?.color, opacity: 0.8}} >Last Modified</Text>
            </TouchableOpacity>

          </View>

        <View style={[styles.hr]}></View>

          <View style={[styles.itemSettings]} >
            <Text style={{color: globalStyle?.settingsColor, fontSize: 20}} >Reminder</Text>
            <TouchableOpacity>
              <Text  style={{fontSize:  globalStyle.fontSize+2, color: globalStyle.color}} >Default Notification Time</Text>
              <Text  style={{fontSize: globalStyle.fontSize, color: globalStyle.color, opacity: 0.8}} >6 AM</Text>
            </TouchableOpacity>
          </View>

      </View>

    </View>

    <SettingsModal visible={themeModal} handleModal={handleThemeModal} globalStyle={globalStyle} >

      <Text style={{fontSize: globalStyle?.fontSize+2, color: globalStyle?.color, paddingBottom: 10,}}>Set Theme:</Text>
      
      <TouchableOpacity style={styles.selectionBtn} onPress={() => handleTheme("Light", "light")}>
        <RadioButton
          uncheckedColor={globalStyle?.color}
          value={"Light"} 
          onPress={ () => handleTheme("Light", "light") } 
          status={ checked == "Light" ? 'checked' : 'unchecked' }
        />
        <Text style={{fontSize: globalStyle?.fontSize, color: globalStyle?.color}}>Light Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.selectionBtn} onPress={() => handleTheme("Dark", "dark")} >
        <RadioButton
          uncheckedColor={globalStyle?.color}
          value={"Dark"} 
          onPress={ () => handleTheme("Dark", "dark") } 
          status={ checked == "Dark" ? 'checked' : 'unchecked' }
        />
        <Text style={{fontSize: globalStyle?.fontSize, color: globalStyle?.color}}>Dark Mode</Text>
      </TouchableOpacity>
    </SettingsModal>

    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    justifyContent: "start",
    textAlign: 'left',

  },
  touchable:{
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    gap: 10,
    padding: 12,
    borderRadius: 15,
  },
  settings:{
    flex: 1,
    textAlign: 'left',
    borderWidth: 1,
    width: '100%',
  },
  itemSettings:{
    padding: 10,
    gap: 15,
  },  
  hr:{
    width:"100%",
    borderWidth:1,
    height: 1,
    borderColor: '#cccccc'
  },
  selectionBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
})