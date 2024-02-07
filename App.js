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
    if (mode == "dark") {
      setGlobalStyle(darkModeStyle);
    } else {
      setGlobalStyle(lightModeStyles); //false then lightMode
    }
  };

  const handleDarkMode = (darkMode) => {
    updateSettingsDb(darkMode);
    fetchDefaultSettings();
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
          },
          animation:'slide_from_right',
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
          },
          headerTintColor: globalStyle?.color,
          animation:'slide_from_right',
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
    //console.log("called");
    dbSettings.transaction((tx) => {
      tx.executeSql(
      'SELECT * FROM settings WHERE id = ?',
      [1],
      (_, result) => {
          const rows = result.rows;
          const dataArray = [];
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            dataArray.push(item);
          
          }
          //console.log(dataArray)
          handleGlobalStyle(dataArray[0].currentTheme);
          //console.log("Settings are fetched")
        
        },
        (_, error) => {
          console.error('Error querying data:', error);
        }
      );
    });
  }

  const insertDefaultSettings = () => {
    console.log("insert called")
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
    console.log(theme);
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'UPDATE settings SET currentTheme = ?, fontSize = ?, defaultSort = ?, notifTime = ? WHERE id = ?;',
        [theme, "16", "modifiedDate", "7", 1],
        (_, result) => {
          console.log('Data SETTINGS updated successfully');
          handleGlobalStyle(theme);
        },
        (_, error) => {
          console.error('Error updating SETTINGS data:', error);
        }
        );
    });
  }

  
  // PUSH NOTIFICATION FUNCTIONS

  const scheduleNotifications = async () => {
    const morningNotificationTime = setNotificationTime(8, 0);
    const eveningNotificationTime = setNotificationTime(21, 0);

    // Schedule morning notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Good Morning!',
        body: `Have you completed your journal passage for today?`,
      },
      trigger: { hour: morningNotificationTime.hours, minute: morningNotificationTime.minutes, repeats: false},
    });

    // Schedule evening notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Good Evening',
        body: `Have you fisnished your Journal today?`,
      },
      trigger: { hour: eveningNotificationTime.hours, minute: eveningNotificationTime.minutes, repeats: false },
    });
  };

  const setNotificationTime = (hours, minutes) => {
    const now = new Date();
    const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
    const currentTime = now.getTime();
    const notificationDateTime = notificationTime.getTime();

    // If the notification time has already passed for today, schedule it for the same time tomorrow
    const scheduledTime = notificationDateTime > currentTime ? notificationDateTime : notificationDateTime + 24 * 60 * 60 * 1000;

    const scheduledDate = new Date(scheduledTime);

    return {
      hours: scheduledDate.getHours(),
      minutes: scheduledDate.getMinutes(),
    };
  };

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  };

    // for push notifications
    useEffect(() => {
      scheduleNotifications();
  
      // Set up an interval to schedule notifications every day
      const intervalId = setInterval(() => {
        scheduleNotifications();
      }, 24 * 60 * 60 * 1000); // Schedule notifications every 24 hours
  
      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }, []);
  
    useEffect(() => {
      registerForPushNotificationsAsync();
  
      // Handle notifications when the app is open
      Notifications.addNotificationReceivedListener(handleNotification);
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
