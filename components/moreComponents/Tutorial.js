import { StyleSheet, Text, View, TouchableOpacity,  } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTheme } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo'; 


export default function Tutorial() {
    return (
      <View>
      <Text>Tutorial</Text>

      <View style={[{flex:1}]}>
        <TouchableOpacity 
          onPress={() => handleMonthPress()} 
          style={[styles.months, { borderBottomWidth: 1, borderColor: theme.colors.textColor, }]}
        >
          <Text style={{fontSize: theme.fonts.fontSize+3, color: theme.colors.textColor}}>{item.category_name}</Text> 

          {show ? (<Text style={{fontSize: theme.fonts.fontSize, paddingLeft: 10,  color: theme.colors.textColor, }}>{theme2024[index]}</Text>):null}

          <Entypo name={show ? "chevron-thin-up" : "chevron-thin-down"} size={28} color={theme.colors.textColor}/>

        </TouchableOpacity>

        <Animated.View style={animatedStyle}>
    
          <View onLayout={onLayout} style={{position: 'absolute', width: '100%', paddingLeft:5, paddingRight:5}}>

              {
                currentMonthEntries.map((item, key) => (
    
                    <TouchableOpacity
                      onPress={()=>handleItemPress(item, key)}
                      style={[styles.dailyEntry, {backgroundColor: theme.colors.primary, borderBottomColor: theme.colors.borderColor, }]}
                      key={key}>
                          <View style={{flexDirection: 'row'}}> 
                            <Text style={{fontSize: theme.fonts.fontSize+1, color: theme.colors.textColor}}>{getThatDay(item.day)},</Text>
                            <Text style={{fontSize: theme.fonts.fontSize+1, color: theme.colors.textColor}}> {item.day}  -</Text>
                            <Text style={{fontSize: theme.fonts.fontSize+1, paddingLeft: 10,  color: theme.colors.textColor}}>{item.verse}</Text>
                          </View>

                          <View style={[styles.check, styles.border,
                            {backgroundColor: idArray.includes(item.id) ? idComplete.includes(item.id) ? "#8CFF31":'#fff': '#fff'}]}>
                          </View>
                
                    </TouchableOpacity>
          
                ))
              }
          </View>
        
        </Animated.View>
              
      </View>

      </View>
    )
}

const styles = StyleSheet.create({})