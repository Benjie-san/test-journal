import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";



//RN Navigation Imports
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Brp, Search, More } from "./Screens/index"; // all of the screens

import Settings from "./components/Settings";

//icon imports
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import * as SQLite from 'expo-sqlite';
import { createIconSetFromFontello } from "react-native-vector-icons";

const dbSettings = SQLite.openDatabase("settings4.db");

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const BrpStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [globalStyle, setGlobalStyle] = useState({});

  const darkModeStyle = {
    header: '#000',
    bgHeader: "#111315",
    bgBody: "#30353C",
    noteList: "#111315",
    color: "#fff",
    borderColor: "#fff",
    input: "#000",
    verseModal: "#212A3E",
    fontSize: 16,
    settingsColor: '#1d9bf0',
    name: 'Dark',
  };

  const lightModeStyles = {
    header: '#fff',
    bgHeader: "#fff",
    bgBody: "#f2f2f2",
    noteList: "#fff",
    color: "#000",
    borderColor: "#cccccc",
    input: "#bfbfbf",
    verseModal: "#fff",
    fontSize: 16,
    settingsColor: '#1d9bf0',
    name: 'Light',
  };

  const handleGlobalStyle = (mode) => {
    console.log("mode: " + mode);

    if (mode == "dark") {
      setGlobalStyle(darkModeStyle);
    } else {
      setGlobalStyle(lightModeStyles); //false then lightMode
    }
  };

  const handleDarkMode = (darkMode) => {
    console.log("darkMode: " + darkMode);
    handleGlobalStyle(darkMode);
    updateSettingsDb(darkMode);
  };

  const RenderHome = (props) => (
    <Home
      {...props}
      darkMode={darkMode}
      handleDarkMode={handleDarkMode}
      globalStyle={globalStyle}
    />
  );

  const RenderBrp = (props) => <Brp {...props} globalStyle={globalStyle} />;

  const RenderSearch = (props) => (
    <Search {...props} globalStyle={globalStyle} />
  );

  const RenderMore = (props) => (
    <More
      {...props}
      globalStyle={globalStyle}
      handleDarkMode={handleDarkMode}
    />
  );

  const RenderSettings = (props) => (
    <Settings
      {...props}
      darkMode={darkMode}
      globalStyle={globalStyle}
      handleDarkMode={handleDarkMode}
    />
  );


  const StackHome = () => (
    <HomeStack.Navigator>
      <HomeStack.Screen
        options={{
          headerTitle: "Journal 2024",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: globalStyle?.bgHeader,
          },
          headerTitleStyle:{
            color: globalStyle?.color,
          }
        }}
        name="HomeStack"
        component={RenderHome}
      />
    </HomeStack.Navigator>
  );

  const StackBrp = () => (
    <BrpStack.Navigator>
      <BrpStack.Screen
        options={{
          headerTitle: "Bible Reading Plan",
          headerStyle: {
            backgroundColor: globalStyle?.bgHeader,
          },
          headerTitleStyle:{
            color: globalStyle?.color,
          }
        }}
        name="BrpStack"
        component={RenderBrp}
      />
    </BrpStack.Navigator>
  );

  const StackSearch = () => (
    <SearchStack.Navigator>
      <SearchStack.Screen
        options={{
          headerTitle: "Search",
          headerStyle: {
            backgroundColor: globalStyle?.bgHeader,
          },
          headerTitleStyle:{
            color: globalStyle?.color,
          }
        }}
        name="SearchStack"
        component={RenderSearch}
      />
    </SearchStack.Navigator>
  );

  const StackMore = () => (
    <MoreStack.Navigator>
      <MoreStack.Screen
        options={{
          headerTitle: "More",
          headerStyle: {
            backgroundColor: globalStyle?.bgHeader,
          },
          headerTitleStyle:{
            color: globalStyle?.color,
          }
        }}
        name="MoreStack"
        component={RenderMore}
      />
      <MoreStack.Screen
        options={{
          headerTitle: "Settings",
          headerStyle: {
            backgroundColor: globalStyle?.bgHeader,
          },
          headerTitleStyle:{
            color: globalStyle?.color,
          }
        }}
        name="Settings"
        component={RenderSettings}
      />
    </MoreStack.Navigator>
  );

  const setupSettingsDatabase = () => {
    // Check if the table exists
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'SELECT name FROM sqlite_master WHERE type="table" AND name="settings";',
        [],
        (_, result) => {
          const tableExists = result.rows.length > 0;

          if (!tableExists) {
            // Table doesn't exist, create it
            dbSettings.transaction((tx) => {
              tx.executeSql(
                'CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, currentTheme TEXT, fontSize TEXT, defaultSort TEXT, notifTime TEXT);',
                [],
                (_, result) => { 
                  console.log('Table Settings: created successfully'); 
                  insertDefaultSettings();

                },
                (_, error) => { console.error('Error creating table Settings:', error); }
              );
            });
          } else {
            console.log('Table Settings: already exists');
            fetchDefaultSettings();
          }
        },

      );
    });
  };

  const fetchDefaultSettings = () =>{
    console.log("called")
    dbSettings.transaction((tx) => {
      tx.executeSql(
      'SELECT * FROM settings',
      [],
      (_, result) => {
          const rows = result.rows;
          const dataArray = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(item);
          
          }
          console.log(dataArray)
          handleGlobalStyle(dataArray[0].currentTheme);
          console.log("Settings are fetched")
        
        },
        (_, error) => {
          console.error('Error querying data:', error);
        }
      );
    });
  }

  const insertDefaultSettings = () => {
    dbSettings.transaction((tx) => {
      tx.executeSql(
      'INSERT INTO settings (currentTheme, fontSize, defaultSort, notifTime) VALUES (?, ?, ?, ?);',
      ["light", "16", "modifiedDate", "6"],
      (tx, results) => {
        handleGlobalStyle("light");
        console.log("Success default Settings are SET!!!");
      },
      (error) => {
         // Handle error
        console.log(error);
      }
      );
    });
  }

  const updateSettingsDb = (theme) =>{
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'UPDATE settings SET currentTheme = ?, fontSize = ?, defaultSort = ?, notifTime = ? WHERE id = ?;',
        [theme, "16", "modifiedDate", "6", 0],
        (_, result) => {
          console.log('Data SETTINGS updated successfully');
        },
        (_, error) => {
          console.error('Error updating SETTINGS data:', error);
        }
        );
    });
  }

  useEffect(() => {
    setupSettingsDatabase();
  }, []);

  useEffect(() => {
    setupSettingsDatabase();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor={"#1a1a1a"} />
      {/* <NavigationContainer>
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

        

        </Stack.Navigator>
      </NavigationContainer>      */}
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          activeColor="#1d9bf0"
          barStyle={{ backgroundColor: globalStyle?.bgHeader }}
          
        >
          <Tab.Screen
            component={StackHome}
            name="Home"
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ focused }) => {
                return (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Ionicons
                      name={focused ? "md-home" : "md-home-outline"}
                      size={24}
                      color="#1d9bf0"
                    />
                  </View>
                  // {color="#1d9bf0"}
                );
              },
              tabBarHideOnKeyboard: true,
            }}
          />

          <Tab.Screen
            component={StackBrp}
            name="BRP"
            options={() => ({
              headerTitle: "Bible Reading Plan",
              title: "Bible Reading Plan",
              tabBarLabel: "BRP",
              headerLeft: () => (
                <Pressable
                  title="BrpBackButton"
                  onPress={() => handleBRPBackButton()}
                >
                  <Ionicons
                    name="chevron-back-sharp"
                    size={30}
                    color="1d9bf0"
                  />
                </Pressable>
              ),

              tabBarIcon: ({ focused }) => {
                return (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Ionicons
                      name={focused ? "md-book" : "md-book-outline"}
                      size={24}
                      color="#1d9bf0"
                    />
                  </View>
                );
              },
              tabBarHideOnKeyboard: true,
            })}
          />
          <Tab.Screen
            component={StackSearch}
            name="Search"
            options={{
              title: "Search",
              tabBarIcon: ({ focused }) => {
                return (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Ionicons
                      name={focused ? "md-search" : "md-search-outline"}
                      size={24}
                      color="#1d9bf0"
                    />
                  </View>
                );
              },
              tabBarHideOnKeyboard: true,
            }}
          />

          <Tab.Screen
            component={StackMore}
            name="More"
            options={{
              title: "More",
              tabBarIcon: ({ focused }) => {
                return (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <MaterialIcons
                      name={focused ? "more" : "more-horiz"}
                      size={24}
                      color="#1d9bf0"
                    />
                  </View>
                );
              },
              tabBarHideOnKeyboard: true,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
