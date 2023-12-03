import { StyleSheet, Text, View } from 'react-native';
import React, {useEffect} from 'react';
import Home from './Screens/Home';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  return (
    <>
      <StatusBar style="light" backgroundColor={"#1a1a1a"} />
      <Home />
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
