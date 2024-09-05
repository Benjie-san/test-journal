import React, {memo} from 'react';
import { TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import { useTheme } from 'react-native-paper';


const FlatListItems = ({item, handleDisplayEntryFetch, display}) => {
    const theme = useTheme();
    const themeFontSize = theme.fonts.fontSize;
    const themeTextColor =  theme.colors.textColor;
    const renderLayout = {
        list:{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        details:{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            flexGrow: 0,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            textAlign: 'left',
        },
        grid:{
            width: '31%',
            flexGrow: 0,
            flexWrap: 'wrap',
            flexDirection: 'column',
            alignItems: 'flex-start',

        },
        largeGrid:{
            width: '48%',
            flexGrow: 0,
            flexWrap: 'wrap',
            flexDirection: 'column',
            alignItems: 'flex-start',        
            padding: 2,
        },
	};

    const formatLastModified = (timestamp) => {
        const lastModifiedTime = new Date(timestamp);
        const now = new Date();
    
        // Calculate the difference in milliseconds
        const timeDifference = now - lastModifiedTime;
    
        // Convert milliseconds to seconds, hours, or days as needed
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(timeDifference / (1000 * 60));
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
        // Choose the appropriate format based on the time difference
        if (seconds < 60) {
            return `${seconds} ${seconds == 1 ? 'second' : 'seconds'} ago`;
        } 
        else if (minutes < 60) {
            return `${minutes} ${minutes == 1 ? 'minute' : 'minutes'} ago`;
        } 
        else if (hours < 24) {
            return `${hours} ${hours == 1 ? 'hour' : 'hours'} ago`;
        } else {
            return `${days} ${days == 1 ? 'day' : 'days'} ago`;
        }
    };

    return (

        <TouchableOpacity
            style={ [
                display == "List" ? renderLayout.list : 
                display == "Details" ? renderLayout.details : 
                display == "Grid" ? renderLayout.grid : 
                display == "Large Grid" ? renderLayout.largeGrid : null, 
                {
                    backgroundColor: theme.colors.primary, 
                    elevation: 2, 
                    gap: 5,
                    padding: 14,
                    margin: 3,
                    borderRadius: 5,
                    overflow:'hidden',

                }
            ]}
            onPress={ ()=> handleDisplayEntryFetch(item) }
        >           
            { 
            display == "List" ? 
                (<>
                    <Text style={{color: themeTextColor, fontSize: themeFontSize, overflow:'hidden', flex: 1}}>{item.title}</Text>
                    <Text style={{color: themeTextColor, fontSize: themeFontSize-1, overflow:'hidden',}}>{formatLastModified(Number(item.modifiedDate))}</Text>
                </>) 
            :
            display == "Grid" ? 
                (<>
                    <Text style={{color: themeTextColor, fontSize: themeFontSize, overflow:'hidden', flex: 1}}>{item.title}</Text>
                    <Text style={{color: themeTextColor, fontSize: themeFontSize-2, overflow:'hidden',}}>{formatLastModified(Number(item.modifiedDate))}</Text>
                </>) 
            :
            display == "Details" ? 
                (<>
                    <Text style={{color: theme.colors.textColor, fontSize: themeFontSize, overflow:'hidden', flex: 1, fontWeight: 'bold'}}>{item.scripture}</Text>
                    <Text style={{color: themeTextColor, fontSize: themeFontSize-1, overflow:'hidden', flex: 1, }}>{item.title}</Text>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: themeTextColor, fontSize: themeFontSize-2, overflow:'hidden', opacity: 0.7}}>{item.date}</Text>
                        <Text style={{color: themeTextColor, fontSize: themeFontSize-2, overflow:'hidden', opacity: 0.7}}>{formatLastModified(Number(item.modifiedDate))}</Text>
                    </View>
                
                </>) 
            :
            display == "Large Grid" ? 
                (<>
                    <Text style={{color: themeTextColor, fontSize: themeFontSize+1, overflow:'hidden', flex: 1, fontWeight: 'bold'}}>{item.scripture}</Text>
                    <Text style={{color: themeTextColor, fontSize: themeFontSize, overflow:'hidden', flex: 1}}>{item.title}</Text>
                    <Text style={{color: themeTextColor, fontSize: themeFontSize-1, overflow:'hidden',}}>{formatLastModified(Number(item.modifiedDate))}</Text>
                </>) 
            : null
            }
            
        </TouchableOpacity>
    )

}

export default memo(FlatListItems);

const styles = StyleSheet.create({
    flex:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    entry:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

});