import React, {memo} from 'react';
import { TouchableOpacity, Text, StyleSheet} from 'react-native';


const FlatListItems = ({item, globalStyle, handleDisplayEntryFetch}) => {

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
            return `${seconds} seconds ago`;
        } 
        else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } 
        else if (hours < 24) {
            return `${hours} hours ago`;
        } else {
            return `${days} days ago`;
        }
        };
        

    return (

        <TouchableOpacity
            style={ [styles.entry, {backgroundColor: globalStyle?.noteList, elevation: 2, gap: 5}] }
            onPress={ ()=> handleDisplayEntryFetch(item) }
        >
    
            <Text style={{color: globalStyle?.color, fontSize: 14, overflow:'hidden'}}>{item.title}</Text>
    
            <Text style={{color: globalStyle?.color, fontSize: 14, overflow:'hidden'}}>{formatLastModified(Number(item.modifiedDate))}</Text>
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