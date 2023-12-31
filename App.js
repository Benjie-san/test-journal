import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, {useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
//RN Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {Home, Brp, Search, More} from './Screens/index'; // all of the screens

//icon imports
import Ionicons from '@expo/vector-icons/Ionicons'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; 

const Tab = createMaterialBottomTabNavigator();


const RenderHome = (props) => <Home {...props}  />
const RenderBrp = (props) => <Brp {...props} />
const RenderSearch = (props) => <Search {...props} />
const RenderMore = (props) => <More {...props} />

export default function App() {
  
  return (
    <>
      <StatusBar style="light" backgroundColor={"#1a1a1a"} />

      <NavigationContainer>
        <Tab.Navigator 
        initialRouteName="Home"
        activeColor='#1d9bf0'
        barStyle={{ backgroundColor: '#fff',}}>
          <Tab.Screen 
            component={RenderHome}
            name="Home"
            options={{
              tabBarLabel: "Home",

              tabBarIcon: ({focused})=>{
                return(
                  <View style={{alignItems: 'center', justifyContent: 'center', }}>
                    <Ionicons name={focused ? "md-home" : "md-home-outline"} size={24} color="#1d9bf0" />
                  </View>
                  // {color="#1d9bf0"}
                )
              },
              tabBarHideOnKeyboard: true,
            }} 
          />

          <Tab.Screen 
            component={RenderBrp}
            name="BRP"
            options={() => ({
              title: 'Bible Reading Plan',
              tabBarLabel: "BRP",
              headerLeft: () => (
                <Pressable title="BrpBackButton" onPress={ ()=>handleBRPBackButton() }>
                    <Ionicons name="chevron-back-sharp" size={30} color="1d9bf0" />
                </Pressable>
              ),
          
              tabBarIcon: ({focused})=>{
                return(
                  <View style={{alignItems: 'center', justifyContent: 'center',}}>
                    <Ionicons name={focused ? "md-book" : "md-book-outline"} size={24} color="#1d9bf0" />
                  </View>
                )
              },
              tabBarHideOnKeyboard: true,
            })}
          />
          <Tab.Screen
            component={RenderSearch}
            name="Search"
            options={{
              title: 'Search',
              tabBarIcon: ({focused})=>{
                return(
                  <View style={{alignItems: 'center', justifyContent: 'center', }}>
                    <Ionicons name={focused ? "md-search" : "md-search-outline"} size={24} color="#1d9bf0" />
                  </View>
                )
              },
              tabBarHideOnKeyboard: true,
            }}
          />

          <Tab.Screen
            component={RenderMore}
            name="More"
            options={{
              title: 'More',
              tabBarIcon: ({focused})=>{
                return(
                  <View style={{alignItems: 'center', justifyContent: 'center',}}>
                    <MaterialIcons name={focused ? 'more' : "more-horiz"} size={24} color="#1d9bf0" />

                  </View>
                )
              },
              tabBarHideOnKeyboard: true,
            }}
          />
        </Tab.Navigator>
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
