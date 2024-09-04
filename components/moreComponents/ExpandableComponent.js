import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState, useEffect} from 'react';
import { useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import Entypo from '@expo/vector-icons/Entypo'; 

export default function ExpandableComponent({title, children}) {
    const theme = useTheme();
    const [show, setShow] = useState(false);
    const [height, setHeight] = useState(0);

    const onLayout = (event) => {
    const layoutHeight = event.nativeEvent.layout.height;

    if(layoutHeight > 0 && layoutHeight !== height){
        setHeight(layoutHeight);
        }
    }
        
    const animatedStyle = useAnimatedStyle( ()=>{
    const animatedHeight = show ? withTiming(height) : withTiming(0);
    return{
        height: animatedHeight,
        overflow: 'hidden',
        flexBasis: 'auto',
    }
    });
    
    return(
    <View >
        <TouchableOpacity 
        onPress={() => setShow(!show)} 
        style={[styles.expandableContainer,{  borderBottomWidth: 1, borderColor: theme.colors.textColor, }]}
        >
        <Text style={{fontSize: theme.fonts.fontSize+1, color: theme.colors.textColor}}>{title}</Text> 

        <Entypo name={show ? "chevron-thin-up" : "chevron-thin-down"} size={28} color={theme.colors.textColor}/>

        </TouchableOpacity>

        <Animated.View style={animatedStyle}>

        <View onLayout={onLayout} style={{position: 'absolute', width: '100%', padding:10, gap: 10, borderBottomWidth: 1, borderColor: theme.colors.textColor,}} >
            {children}  
        </View>
        
        </Animated.View>
        
    </View>
    );
}
const styles = StyleSheet.create({
    expandableContainer:{
        width: '100%',
        padding: 12,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        boderBottomWidth: 1,
    }
})