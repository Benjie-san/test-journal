import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react';
import { useTheme } from 'react-native-paper';
import content from '../../constants/content.json'
import ExpandableComponent from './ExpandableComponent';

export default function Tutorial() {
  const theme = useTheme();
  const boldIndex = [0, 2, 11, 18, 22]
  return (
    <View style={{flex: 1, backgroundColor: theme.colors.secondary,}}>
      <ScrollView>
        <ExpandableComponent title={content.howtouse.title}>
          {
            content.howtouse.items.map( (item, index) => (
              <Text key={index} style={{
                fontSize: theme.fonts.fontSize, 
                color: theme.colors.textColor, 
                fontWeight: boldIndex.includes(index) ? "bold" : "normal",
                paddingLeft: !boldIndex.includes(index) ? 10 : 0,
                gap: 10
              }}>
                {item}
              </Text>  
            ))
          }
        </ExpandableComponent>
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({})