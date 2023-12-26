import { StyleSheet, Text, View } from 'react-native';
import React, {useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Brp from "./Screens/Brp";
import Home from './Screens/Home';


const Stack = createNativeStackNavigator();


export default function App() {

  const RenderHome = (props) => <Home {...props}  />
  const RenderBrp = (props) => <Brp {...props} />
//  const RenderEntry = (props) => <EntryScreen {...props} />


  return (
    <>
      <StatusBar style="light" backgroundColor={"#1a1a1a"} />

      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen 
          options={{headerTitle: '', headerTransparent: true}} 
          component={RenderHome} 
          name="Home"/>

          <Stack.Screen component={RenderBrp} name="BRP"/>

        </Stack.Navigator>
      </NavigationContainer>
    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
