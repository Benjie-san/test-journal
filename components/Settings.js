import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import SettingsModal from './SettingsModal';
import { useTheme, RadioButton } from 'react-native-paper';

export default function Settings({currentTheme, currentFontSize, handleTheme, handleFontSize}) {
  const theme = useTheme();
  const [themeModal, setThemeModal] = useState(false);
  const [fontSizeModal, setFontSizeModal] = useState(false);
  const [themeSetting, setThemeSetting] = useState(currentTheme)
  const [checked, setChecked] = useState(currentTheme);
  const [fontSize, setFontSize] = useState(currentFontSize);
  const [fontSizeChecked, setfontSizeChecked] = useState(currentFontSize);

  const handleThemeSetting = (name, item) =>{
		setChecked(item);
    handleTheme(item);
    setThemeSetting(item);
    setThemeModal(false);

	}

  const handleFontSizeSettings = (item) =>{
    handleFontSize(item.toLowerCase());
    setfontSizeChecked(item);
    setFontSize(item);
    setFontSizeModal(false)
  }

  const handleThemeModal = (item) =>{
    setThemeModal(item);
  }
  const handleFontSizeModal = (item) =>{
    setFontSizeModal(item);
  }
  
  return (
    <>
    <View style={[styles.container, {backgroundColor: theme.colors.secondary}]}>
      
      <View style={styles.settings}>

          <View style={[styles.itemSettings]} > 
            <Text style={{color: theme.colors.altColor, fontSize: theme.fonts.fontSize+2}} >General</Text>

            <TouchableOpacity onPress={() => handleThemeModal(true)}>
              <Text  style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}} >Default Theme</Text>
              <Text  style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, opacity: 0.8}} >{themeSetting}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleFontSizeModal(true)}>
              <Text  style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}} >Default Font Size</Text>
              <Text  style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, opacity: 0.8}} >{fontSize}</Text>
            </TouchableOpacity>
            
          </View>

        <View style={[styles.hr]}></View>
        
          <View style={[styles.itemSettings]} >
            <Text style={{color: theme.colors.altColor, fontSize:  theme.fonts.fontSize+2}} >Sort</Text>

            <TouchableOpacity>
              <Text  style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}} >Default Entries Sort Order</Text>
              <Text  style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, opacity: 0.8}} >Last Modified</Text>
            </TouchableOpacity>

          </View>

        <View style={[styles.hr]}></View>

          <View style={[styles.itemSettings]} >
            <Text style={{color: theme.colors.altColor, fontSize: theme.fonts.fontSize}} >Reminder</Text>
            <TouchableOpacity>
              <Text  style={{fontSize:  theme.fonts.fontSize, color: theme.colors.textColor}} >Default Notification Time</Text>
              <Text  style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, opacity: 0.8}} >6 AM</Text>
            </TouchableOpacity>
          </View>

      </View>

    </View>

    {/*modal for theme*/}
    <SettingsModal visible={themeModal} handleModal={handleThemeModal} >

      <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, paddingBottom: 10,}}>Set Theme:</Text>
      
      <TouchableOpacity style={styles.selectionBtn} onPress={() => handleThemeSetting("Light", "light")}>
        <RadioButton
          color={theme.colors.altColor}
          value={"light"} 
          onPress={ () => handleThemeSetting("Light", "light") } 
          status={ checked == "light" ? 'checked' : 'unchecked' }
          unchecked={theme.colors.textColor}
        />
        <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}}>Light Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.selectionBtn} onPress={() => handleThemeSetting("Dark", "dark")} >
        <RadioButton
          value={"dark"} 
          color={theme.colors.altColor}
          onPress={ () => handleThemeSetting("Dark", "dark") } 
          status={ checked == "dark" ? 'checked' : 'unchecked' }
          unchecked={theme.colors.textColor}
        />
        <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}}>Dark Mode</Text>
      </TouchableOpacity>
    </SettingsModal>

    {/*modal for fontsize*/}
    <SettingsModal visible={fontSizeModal} handleModal={handleFontSizeModal} >
      <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, paddingBottom: 10,}}>Set Font Size:</Text>

      <TouchableOpacity style={styles.selectionBtn} onPress={() => handleFontSizeSettings("Small")}>
        <RadioButton
          value={"small"} 
          color={theme.colors.altColor}
          onPress={ () => handleFontSizeSettings("Small") } 
          status={ fontSizeChecked == "small" ? 'checked' : 'unchecked' } 
          unchecked={theme.colors.textColor}
          />
        <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}}>Small</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.selectionBtn} onPress={() => handleFontSizeSettings("Medium")}>
        <RadioButton
          value={"medium"}
          color={theme.colors.altColor}
          onPress={ () => handleFontSizeSettings("Medium") } 
          status={ fontSizeChecked == "medium" ? 'checked' : 'unchecked' }
          unchecked={theme.colors.textColor}
        />
        <Text style={{fontSize: theme.fonts.fontSize, color:  theme.colors.textColor}}>Medium</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.selectionBtn} onPress={() => handleFontSizeSettings("Large")}>
        <RadioButton
          value={"large"} 
          color={theme.colors.altColor}
          onPress={ () => handleFontSizeSettings("Large") } 
          status={ fontSizeChecked == "large" ? 'checked' : 'unchecked' }
          unchecked={theme.colors.textColor}
        />
        <Text style={{fontSize: theme.fonts.fontSize, color:  theme.colors.textColor}}>Large</Text>
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