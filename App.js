
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider,  MD3LightTheme as DefaultTheme,  } from 'react-native-paper'; //if there's no provider it returns an error

//RN Navigation Imports
import { NavigationContainer } from "@react-navigation/native";

import * as SQLite from 'expo-sqlite';

//for DB of settings
const dbSettings = SQLite.openDatabase("settings.db");

// Expo Splash Screen

import * as SplashScreen from 'expo-splash-screen';
import NavigationIndex from "./Screens/NavigationIndex";

import LightScheme from "./styles/lightScheme";
import DarkScheme from "./styles/darkScheme";

SplashScreen.preventAutoHideAsync();

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);
  // Styles
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("small");
  const [sort, setSort] = useState("modifiedTime");
  const [display, setDisplay] = useState("list");
  const [filter, setFilter] = useState("All");

  const customTheme = theme == "light" 
    ? {
        ...DefaultTheme,
        colors: {...LightScheme,},
        fonts:{ fontSize: fontSize == "small" ? 16 : fontSize == "medium" ? 18 : 20},
        animation: { scale: 1.0, },
      }
    :  
      {
      ...DefaultTheme,
      colors: {...DarkScheme,},
      fonts:{ fontSize: 16,},
      animation: { scale: 1.0, },
      };

  
  const handleTheme = (mode) => {
    updateTheme(mode);
    fetchDefaultSettings();
  };

  const handleFontSize = (item) =>{
    updateFontSize(item);
    fetchDefaultSettings();
  }
  
  const handleSort = (item) => {
    updateSort(item);
    setSort(item)
  }
  
  const handleDisplay = (item) => {
    updateDisplay();
    setDisplay(item)
  }
  
  const handleFilter = (item) => {
    updateFilter(item);
    setFilter(item)
  }
  
 // =================== DB FOR SETTINGS ==============================================
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
                'CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, currentTheme TEXT, fontSize TEXT, defaultSort TEXT, deafaultDisplay TEXT, defaultFilter TEXT, notifTime TEXT);',
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
    console.log("called");
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
          setTheme(dataArray[0].currentTheme);
          setFontSize(dataArray[0].fontSize);
          setAppIsReady(true);
          console.log("Settings are fetched")
        
        },
        (_, error) => {
          console.error('Error Fetching Settings:', error);
        }
      );
    });
  }

  const insertDefaultSettings = () => {
    console.log("insert called")
    dbSettings.transaction((tx) => {
      tx.executeSql(
      'INSERT INTO settings (currentTheme, fontSize, defaultSort, defaultDisplay, defaultFilter, notifTime) VALUES (?, ?, ?, ?, ?, ?);',
      ["light", "small", "modifiedDate", "list", "All", "6",],
      (tx, results) => {
        console.log("Success default Settings are SET!!!");
      },
      (error) => {
         // Handle error
        console.log(error);
      }
      );
    });
  }

  const updateTheme = (theme) =>{
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'UPDATE settings SET currentTheme = ? WHERE id = ?;',
        [theme, 1],
        (_, result) => {
          console.log('Theme updated successfully');
          setTheme(theme);
        },
        (_, error) => {
          console.error('Error updating Theme:', error);
        }
        );
    });
  }
  const updateFontSize = (fontSize) =>{
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'UPDATE settings SET fontSize = ? WHERE id = ?;',
        [fontSize, 1],
        (_, result) => {
          console.log('FontSize updated successfully');
          setFontSize(fontSize);  
        },
        (_, error) => {
          console.error('Error updating FontSize:', error);
        }
        );
    });
  }
  const updateSort = (sort) =>{
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'UPDATE settings SET defaultSort = ? WHERE id = ?;',
        [sort, 1],
        (_, result) => {
          console.log('Sort updated successfully');
          setSort(sort);  
        },
        (_, error) => {
          console.error('Error updating Sort:', error);
        }
        );
    });
  }
  const updateDisplay = (display) =>{
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'UPDATE settings SET defaultDisplay = ? WHERE id = ?;',
        [display, 1],
        (_, result) => {
          console.log('Display updated successfully');
          setDisplay(display);  
        },
        (_, error) => {
          console.error('Error updating Display:', error);
        }
        );
    });
  }
  const updateFilter = (filter) =>{
    dbSettings.transaction((tx) => {
      tx.executeSql(
        'UPDATE settings SET defaultFilter = ? WHERE id = ?;',
        [filter, 1],
        (_, result) => {
          console.log('Filter updated successfully');
          setFilter(filter);  
        },
        (_, error) => {
          console.error('Error updating Filter:', error);
        }
        );
    });
  }


 // ===============================  USE EFFECTS ==============================================

  
  //for splash screen
  useEffect(() => {
    if(appIsReady){
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  //for settings DB initialization
  useEffect(() => {
    setupSettingsDatabase();
  }, []);

  return (
    <>

      <PaperProvider theme={customTheme}>
      <StatusBar/>
        <NavigationContainer>
          <NavigationIndex 
            currentTheme={theme} 
            currentFontSize={fontSize}
            currentSort={sort}
            currentDisplay={display}
            currentFilter={filter}
            handleTheme={handleTheme} 
            handleFontSize={handleFontSize} 
            handleSort={handleSort} 
            handleDisplay={handleDisplay} 
            handleFilter={handleFilter} 
          />
        </NavigationContainer>
      </PaperProvider>
    </>
  );
}

