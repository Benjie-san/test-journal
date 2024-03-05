import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, TouchableWithoutFeedbackComponent } from 'react-native';
import React,{useState, useEffect} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';

import FlatListItems from './FlatListItems';

const Tab = createMaterialTopTabNavigator();

const FlatListComponent = ({notes, noteListLoading, handleDisplayEntryFetch }) => {
  const theme = useTheme();
  return(
  <View style={styles.flex}>
    {noteListLoading ? <ActivityIndicator style={styles.flex} size={'large'}/> :
    (<View style={[ styles.notelist, {backgroundColor: theme.colors.secondary}]}>
      {notes.length === 0 ?
        (<Text style={{fontSize: theme.fonts.fontSize+14, paddingBottom: 150, color: theme.colors.textColor}}>No Entries Found</Text>)
        :
        ( <FlatList
            style={{width: '100%'}}
            data={ notes } 
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <FlatListItems item={item} handleDisplayEntryFetch={handleDisplayEntryFetch}/>
            )}
          />)
      }
    </View>)
    } 
  </View>
)
  }

const AllEntries = ({notes, noteListLoading, handleDisplayEntryFetch, }) => {
  return( 
    <FlatListComponent notes={notes} noteListLoading={noteListLoading}  handleDisplayEntryFetch={handleDisplayEntryFetch}  />
  );

};

const JournalEntries = ({notesJournal, noteListLoading, handleDisplayEntryFetch, }) => {
  return(
    <FlatListComponent notes={notesJournal} noteListLoading={noteListLoading}  handleDisplayEntryFetch={handleDisplayEntryFetch} />
  );
};
  
const OPMEntries = ({notesOPM, noteListLoading, handleDisplayEntryFetch, }) => {
  return(
    <FlatListComponent notes={notesOPM} noteListLoading={noteListLoading}  handleDisplayEntryFetch={handleDisplayEntryFetch} />
  );
};

const SortBtn = ({name, count, focused}) => {
  const theme = useTheme();
  return(
    <View style={[styles.sortingBtn]}>
      <Text style={[{color: focused ? "#1d9bf0" : theme.colors.textColor, fontSize: theme.fonts.fontSize-1}]}>
        {name}
      </Text>

      <View style={[styles.itemCount,{backgroundColor: focused ? "#1d9bf0" : '#808080'  }]}>
          <Text style={{textAlign: 'center', color: focused ? '#fff' : '#f5f5f5'}}>
            {count}
          </Text>
      </View>
    </View>
  )
}

const TopBar = ({ notes, notesJournal, notesOPM, noteListLoading, handleDisplayEntryFetch, sortButtonCount}) => {
  const theme = useTheme();

  const RenderAll = () => <AllEntries  notes={notes} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch} />

  const RenderJournal = () => <JournalEntries  notesJournal={notesJournal} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch}  />

  const RenderOPM = () => <OPMEntries   notesOPM={notesOPM} noteListLoading={noteListLoading} handleDisplayEntryFetch={handleDisplayEntryFetch}  />
  

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