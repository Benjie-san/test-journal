import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React,{useState, useEffect} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import FlatListItems from './FlatListItems';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

const RenderFlatlist = ({notes, noteListLoading, handleDisplayEntryFetch, display}) => {
  const theme = useTheme();
  return(
    <>
    {noteListLoading ? <ActivityIndicator style={styles.flex} size={'large'}/> :
      (<View style={[ styles.notelist, {backgroundColor: theme.colors.secondary}]}>
        {notes.length === 0 ?
          (<Text style={{fontSize: theme.fonts.fontSize+14, paddingBottom: 150, color: theme.colors.textColor}}>No Entries Found</Text>)
          :
          ( <FlatList
              style={{width:'100%',}}
              contentContainerStyle={{
                flexGrow: 1/2,
                alignContent:'flex-start',
              }}
              data={ notes } 
              keyExtractor={(item, index) => index.toString()}
              numColumns={ 
                display == "Grid" ? 3 :
                display == "Large Grid" ? 2 : 1
              }
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <FlatListItems item={item} handleDisplayEntryFetch={handleDisplayEntryFetch} display={display}/>
              )}
            />)
        }
      </View>)
      } 
    </>
  );
}
<RenderFlatlist />
const FlatListComponent = ({notes, noteListLoading, handleDisplayEntryFetch, display }) => {
  const theme = useTheme();
  return(
    <View style={[styles.flex, {backgroundColor: theme.colors.tertiary}]}>
      
      { display == "List" ?
        (<RenderFlatlist notes={notes} display={display} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} />) 
      : display == "Details" ? 
        (<RenderFlatlist notes={notes} display={display} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} />) 
      : display == "Grid" ? 
        (<RenderFlatlist notes={notes} display={display} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} />) 
      : display == "Large Grid" ? 
        (<RenderFlatlist notes={notes} display={display} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} />) 
      : null
      }
      
    </View>
  )
  }

const AllEntries = ({notes, noteListLoading, handleDisplayEntryFetch,  display}) => {
  return( 
    <FlatListComponent display={display} notes={notes} noteListLoading={noteListLoading}  handleDisplayEntryFetch={handleDisplayEntryFetch} />
  );

};

const JournalEntries = ({notesJournal, noteListLoading, handleDisplayEntryFetch, display }) => {
  return(
    <FlatListComponent display={display} notes={notesJournal} noteListLoading={noteListLoading}  handleDisplayEntryFetch={handleDisplayEntryFetch}/>
  );
};
  
const OPMEntries = ({notesOPM, noteListLoading, handleDisplayEntryFetch, display }) => {
  return(
    <FlatListComponent display={display} notes={notesOPM} noteListLoading={noteListLoading}  handleDisplayEntryFetch={handleDisplayEntryFetch}  />
  );
};

const SortBtn = ({name, count, focused}) => {
  const theme = useTheme();
  return(
    <View style={[styles.sortingBtn]}>
      <Text style={[{color: focused ? theme.colors.altColor : theme.colors.borderColor, fontSize: theme.fonts.fontSize-1}]}>
        {name}
      </Text>

      <View style={[styles.itemCount,{backgroundColor: focused ? "#1d9bf0" : '#cccccc'}]}>
          <Text style={{textAlign: 'center', 
            color: theme.name == "light" ? focused ? '#fff' : '#f5f5f5' : 
            focused ? '#fff':'#767676'}}>
            {count}
          </Text>
      </View>
    </View>
  )
}

const TopBar = ({navigation, route, notes, notesJournal, notesOPM, noteListLoading, handleDisplayEntryFetch, sortButtonCount, display}) => {
  const theme = useTheme();

  const RenderAll = () => <AllEntries display={display} notes={notes} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch}  />

  const RenderJournal = () => <JournalEntries display={display} notesJournal={notesJournal} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} />

  const RenderOPM = () => <OPMEntries  display={display} notesOPM={notesOPM} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch}/>
  
  return (
    <>
    <Tab.Navigator
        initialRouteName='All'
        barStyle={{width:"100%"}}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
              alignItems:'center',
              justifyContent: 'center',
              width:"100%",
          },
          tabBarStyle:{
            backgroundColor: theme.colors.primary,
          },
        }}
    >
        <Tab.Screen 
          name="All" 
          component={RenderAll} 
          options={{
              tabBarIcon: ({ focused })=>{
                return( < SortBtn name="All" count={sortButtonCount[0]} focused={focused}  /> )
              },
          }}
        />
        <Tab.Screen 
          name="Journal" 
          component={RenderJournal} 
          options={{
              tabBarIcon: ({ focused })=>{
                return( < SortBtn name="Journal" count={sortButtonCount[1]} focused={focused}  /> )
              },
          }}
        />
        <Tab.Screen 
          name="OPM" 
          component={RenderOPM} 
          options={{
              tabBarIcon: ({ focused })=>{
                return( < SortBtn name="OPM" count={sortButtonCount[2]} focused={focused} /> )
              },
          }}
        />

    </Tab.Navigator>

    </>

  )
};

export default TopBar;

const styles = StyleSheet.create({
  flex:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortingBtn:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    gap: 5,
  },
  sortBtnText:{
    fontSize: 17,
  },
  itemCount:{
    width: 30,
    borderRadius: 10,
  },
  notelist:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding:5,
  },

});