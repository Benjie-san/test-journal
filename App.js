import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
//RN Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Home, Brp} from './Screens/index'; // all of the screens


//icon imports
// import Ionicons from '@expo/vector-icons/Ionicons'; 
// import MaterialIcons from '@expo/vector-icons/MaterialIcons'; 
// import { render } from 'react-dom';

const Stack = createNativeStackNavigator();

export default function App() {
  
  const [darkMode, setDarkMode] = useState(false);
  const [globalStyle, setGlobalStyle] = useState({});

  const darkModeStyle = {
    bgHeader: '#111315',
    bgBody: '#30353C',
    noteList: '#111315',
    color: '#fff',
    borderColor: '#fff',
    input: '#000',
    verseModal: '#212A3E',
    fontSize: 16,
  };

  const lightModeStyles = {
    bgHeader: '#fff',
    bgBody: '#f2f2f2',   
    noteList: '#fff',
    color: '#000',
    borderColor: '#cccccc',
    input: '#bfbfbf',
    verseModal: '#fff', 
    fontSize: 16,
  };
  
  const handleGlobalStyle= () => {
    if(darkMode){
      setGlobalStyle(darkModeStyle);
    }else{
      setGlobalStyle(lightModeStyles);
    }
  }
  const handleDarkMode = () => {
    handleGlobalStyle()
    setDarkMode(!darkMode);
  }

  const RenderHome = (props) => <Home {...props}  darkMode={darkMode} handleDarkMode={handleDarkMode} globalStyle={globalStyle} />
  const RenderBrp = (props) => <Brp {...props}  globalStyle={globalStyle}/>
  
  useEffect(() => {
    handleGlobalStyle()
  }, [darkMode]);
  

  return (
    <>
      <StatusBar style="light" backgroundColor={"#1a1a1a"} />
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen 
            name="Home" 
            component={RenderHome} 
            options={ ()=> ({
                headerTitle: '',
                headerShown: false,
                animationTypeForReplace: 'push',
                animation:'slide_from_right',
              }
            )}
          />

          <Stack.Screen 
            component={RenderBrp}  
            name="BRP"
            options={ () => ({
              headerTitle: 'Bible Reading Plan',
              animationTypeForReplace: 'push',
              animation:'slide_from_right',
              headerTitleStyle:{
                color: globalStyle.color,
              },
              headerStyle: {
                backgroundColor: globalStyle.bgHeader,
                borderBottomColor: globalStyle.color,
                borderBottomWidth: 1,
              },
              headerTintColor: globalStyle.color,
              })
            }
          
          />

        </Stack.Navigator>
      </NavigationContainer>     
    </>
  );
}

