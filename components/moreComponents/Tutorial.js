import { StyleSheet, Text, View,  } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';
import content from '../../constants/content.json'
import ExpandableComponent from './ExpandableComponent';

export default function Tutorial() {
  const theme = useTheme();
  
  return (
    <View>
      <Text>Tutorial</Text>


    </View>
  )
}

const styles = StyleSheet.create({})