import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React,{useState, useEffect} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import FlatListItems from './FlatListItems';

const Tab = createMaterialTopTabNavigator();

const FlatListComponent = ({notes, noteListLoading, globalStyle,handleDisplayEntryFetch }) => (
  <View style={styles.flex}>
    {noteListLoading ? <ActivityIndicator style={styles.flex} size={'large'}/> :
    (<View style={[ styles.notelist, {backgroundColor: globalStyle?.bgBody}]}>
      {notes.length === 0 ?
        (<Text style={{fontSize: 30, paddingBottom: 150, color: globalStyle?.color}}>No Entries Found</Text>)
        :
        ( <FlatList
            style={{width: '100%'}}
            data={ notes } 
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <FlatListItems item={item} handleDisplayEntryFetch={handleDisplayEntryFetch} globalStyle={globalStyle}/>
            )}
          />)
      }
    </View>)
    } 
  </View>
);

const AllEntries = ({notes, noteListLoading, globalStyle, handleDisplayEntryFetch, }) => {

  return(  
    <FlatListComponent notes={notes} noteListLoading={noteListLoading} globalStyle={globalStyle} handleDisplayEntryFetch={handleDisplayEntryFetch}  />
  );

};

const JournalEntries = ({notesJournal, noteListLoading, globalStyle, handleDisplayEntryFetch, formatLastModified, }) => {

  return(
    <FlatListComponent notes={notesJournal} noteListLoading={noteListLoading} globalStyle={globalStyle} handleDisplayEntryFetch={handleDisplayEntryFetch} />
  );
};
  
const OPMEntries = ({notesOPM, noteListLoading, globalStyle, handleDisplayEntryFetch, }) => {
  
  return(
    <FlatListComponent notes={notesOPM} noteListLoading={noteListLoading} globalStyle={globalStyle} handleDisplayEntryFetch={handleDisplayEntryFetch} />
  );
};

const SortBtn = ({name, count, focused, globalStyle}) => (
  <View style={[styles.sortingBtn]}>
    <Text style={[styles.sortBtnText, {color: focused ? "#1d9bf0" : globalStyle?.color}]}>
        {name}
    </Text>

    <View style={[styles.itemCount,{backgroundColor: focused ? "#1d9bf0" : '#808080'  }]}>
        <Text style={{textAlign: 'center', color: focused ? '#fff' : '#f5f5f5'}}>
          {count}
        </Text>
    </View>
  </View>
);

const TopBar = ({ globalStyle, notes, notesJournal, notesOPM, noteListLoading, handleDisplayEntryFetch, sortButtonCount}) => {

  const RenderAll = () => <AllEntries globalStyle={globalStyle} notes={notes} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} />

  const RenderJournal = () => <JournalEntries globalStyle={globalStyle} notesJournal={notesJournal} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} sortButtonCount={sortButtonCount[1]}  />

  const RenderOPM = () => <OPMEntries globalStyle={globalStyle}  notesOPM={notesOPM} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} sortButtonCount={sortButtonCount[2]}   />
  

  return (
    <>
    <Tab.Navigator
        initialRouteName='All'
        barStyle={{width:"100%"}}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarIconStyle: {
              alignItems:'center',
              justifyContent: 'center',
              width:"100%",
          },
          tabBarStyle:{
            backgroundColor: globalStyle?.bgHeader,
          },
        }}
    >
        <Tab.Screen 
          name="All" 
          component={RenderAll} 
          options={{
              tabBarIcon: ({ focused })=>{
                return( < SortBtn name="All" count={sortButtonCount[0]} focused={focused} globalStyle={globalStyle} /> )
              },
          }}
        />
        <Tab.Screen 
          name="Journal" 
          component={RenderJournal} 
          options={{
              tabBarIcon: ({ focused })=>{
                return( < SortBtn name="Journal" count={sortButtonCount[1] + sortButtonCount[2]} focused={focused} globalStyle={globalStyle} /> )
              },
          }}
        />
        <Tab.Screen 
          name="OPM" 
          component={RenderOPM} 
          options={{
              tabBarIcon: ({ focused })=>{
                return( < SortBtn name="OPM" count={sortButtonCount[3]} focused={focused} globalStyle={globalStyle} /> )
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
    padding:10,
  },
  entry:{
    marginBottom: 5,
    borderRadius: 5,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

});