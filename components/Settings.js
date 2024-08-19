import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import SettingsModal from './SettingsModal';
import { useTheme, RadioButton } from 'react-native-paper';

// COMPONENTS FOR SETTINGS

// For settings selection opening their modals
const SettingSelection = ({modal, name, current}) =>{
  const theme = useTheme();
  return(
    <TouchableOpacity onPress={() => modal(true)}>
      <View>
        <Text  style={{ fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor, }} >{name}</Text>
        <Text  style={{ fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor,opacity: 0.5 }} >{current}</Text>
      </View>
  
    </TouchableOpacity>
  );
}

// For settings modal, the items inside them
const SettingsRadioButton = ({settingFunction, status, value, name}) => {
  const theme = useTheme();
  return (
  <TouchableOpacity style={styles.selectionBtn} onPress={() => settingFunction(value)}>
    <RadioButton
      color={theme.colors.altColor}
      uncheckedColor={theme.colors.textColor}
      value={value} 
      onPress={ () => settingFunction(value) } 
      status={ status == value ? 'checked' : 'unchecked' }
    
    />
    <View> 
      <Text style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor}}>{name}</Text>
    </View>
  
  </TouchableOpacity>
)};


export default function Settings({currentTheme, currentFontSize, currentSort, currentFilter, currentDisplay, handleTheme,
  handleFontSize, handleSort, handleFilter, handleDisplay}) {
  const theme = useTheme();

  //USESTATES

  //FOR THEME
  const [themeModal, setThemeModal] = useState(false);
  const [themeSetting, setThemeSetting] = useState(currentTheme);
  const [themeChecked, setThemeChecked] = useState(currentTheme);

  //FOR FONT SIZE
  const [fontSizeModal, setFontSizeModal] = useState(false);
  const [fontSize, setFontSize] = useState(currentFontSize);
  const [fontSizeChecked, setFontSizeChecked] = useState(currentFontSize);

  //FOR SORT 

  const [sortModal, setSortModal] = useState(false);
  const [sort, setSort] = useState(currentSort.current);
  const [sortChecked, setSortChecked] = useState(currentSort.current);

  // //FOR FILTER

  // const [filterModal, setFilterModal] = useState(false);
  // const [filter, setFilter] = useState(currentFilter);
  // const [filterChecked, setFilterChecked] = useState(currentFilter);


  //FOR DISPLAY

  const [displayModal, setDisplayModal] = useState(false);
  const [display, setDisplay] = useState(currentDisplay.current);
  const [displayChecked, setDisplayChecked] = useState(currentDisplay.current);

    //For modals opening and closing
    const handleThemeModal = (item) =>{
      setThemeModal(item);
    }
    const handleFontSizeModal = (item) =>{
      setFontSizeModal(item);
    }
    const handleSortModal = (item) =>{
      setSortModal(item);
    }
    
    // const handleFilterModal = (item) =>{
    //   setFilterModal(item);
    // }

    const handleDisplayModal = (item) =>{
      setDisplayModal(item);
    }

  //functions for setting the settings

  const handleThemeSetting = (name) =>{ 
    handleTheme(name); //function from App.js
    setThemeSetting(name); //setting the state that shows the current
		setThemeChecked(name); // for radio button status
    setThemeModal(false); // setting the modal
	}

  const handleFontSizeSettings = (item) =>{
    handleFontSize(item);
    setFontSize(item);
    setFontSizeChecked(item);
    setFontSizeModal(false);
  }

  const handleSortSettings = (item)=>{
    handleSort(item);
    setSort(item);
    setSortChecked(item);
    setSortModal(false);
  }

  // const handleFilterSettings = ()=>{
  //   handleFilter(item);
  //   setFilter(item);
  //   setFilterChecked(item);
  //   setFilterModal(false);
  // }

  const handleDisplaySettings = (item) =>{
    handleDisplay(item);
    setDisplay(item);
    setDisplayChecked(item);
    setDisplayModal(false);
  }

  /*
    THOUGHT PROCESS RN:

    SET THE STATS, FUNCTIONS OF MODALS AND WHEN RADIO BTNS
    SET THE SETTING SELECTIONS
    THEN SET THE RADIO BUTTONS (SET WITH COMPONENTS MADE ABOVE)
    
    NOTE:
    dont pass functions with paramters, it is immediately called upon render, dunno why

    dont put comments after an element
  */
  
  return (
    <>
    <View style={[styles.container, {backgroundColor: theme.colors.secondary}]}>
      
      <View style={styles.settings}>

        <View style={[styles.itemSettings]} > 
          <Text style={{color: theme.colors.altColor, fontSize: theme.fonts.fontSize+4}} >General</Text>
          
          {/*THEME*/}

          <SettingSelection modal={handleThemeModal} name="Current Theme" current={themeSetting} />

          {/*FONT SIZE*/}
          <SettingSelection modal={handleFontSizeModal} name="Current Font Size" current={fontSize} />
          
        </View>

        {/*DIVIDER*/}
        <View style={[styles.hr]}></View> 

        {/*SORT*/}
        <View style={[styles.itemSettings]} >

          <Text style={{color: theme.colors.altColor, fontSize:  theme.fonts.fontSize+4}} >Sort</Text>

          <SettingSelection modal={handleSortModal} name="Current Sort" current={sort} />

        </View>

        <View style={[styles.hr]}></View> 

        {/*DISPLAY*/}
        <View style={[styles.itemSettings]} >

            <Text style={{color: theme.colors.altColor, fontSize: theme.fonts.fontSize+4}} >Display</Text>

            <SettingSelection modal={handleDisplayModal} name="Current Display" current={display} />
        </View>

      </View>

    </View>

    {/*THEME MODAL*/}
    <SettingsModal visible={themeModal} handleModal={handleThemeModal} header="Set Theme:" >

      <SettingsRadioButton settingFunction={handleThemeSetting} status={themeChecked} value="Light" name="Light Mode" />
      <SettingsRadioButton settingFunction={handleThemeSetting} status={themeChecked} value="Dark" name="Dark Mode" />

    </SettingsModal>

    {/*FONT SIZE MODAL*/}
    <SettingsModal visible={fontSizeModal} handleModal={handleFontSizeModal} header="Set Font Size:" >

      <SettingsRadioButton settingFunction={handleFontSizeSettings} status={fontSizeChecked} value="Small" name="Small" />
      <SettingsRadioButton settingFunction={handleFontSizeSettings} status={fontSizeChecked} value="Medium" name="Medium" />
      <SettingsRadioButton settingFunction={handleFontSizeSettings} status={fontSizeChecked} value="Large" name="Large" />

    </SettingsModal>

    {/*SORT MODAL*/}
    <SettingsModal visible={sortModal} handleModal={handleSortModal} header="Set Sort:" > 

      <SettingsRadioButton settingFunction={handleSortSettings} status={sortChecked} value="By Modified Time" name="By Modified Time" />
      <SettingsRadioButton settingFunction={handleSortSettings} status={sortChecked} value="By Created Time" name="By Created Time" />

    </SettingsModal>

    {/*DISLPAY MODAL*/}
    <SettingsModal visible={displayModal} handleModal={handleDisplayModal} header="Set Display:" > 

      <SettingsRadioButton settingFunction={handleDisplaySettings} status={displayChecked} value="List" name="List" />
      <SettingsRadioButton settingFunction={handleDisplaySettings} status={displayChecked} value="Details" name="Details" />
      <SettingsRadioButton settingFunction={handleDisplaySettings} status={displayChecked} value="Grid" name="Grid" />
      <SettingsRadioButton settingFunction={handleDisplaySettings} status={displayChecked} value="Large Grid" name="Large Grid" />

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
    borderColor: '#cccccc',
    opacity: 0.5,
    marginTop: 10,
  },
  selectionBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
})