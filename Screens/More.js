import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import Modal from "react-native-modal";

export default function More({visible, handleModal, darkMode, handleDarkMode, globalStyle, backUp, restore}) {


   return (
      <>
      <Modal 
         isVisible={visible}
         animationIn="slideInLeft"
         animationOut="slideOutLeft"
         hasBackdrop={true}
         avoidKeyboard={false}
         propagateSwipe
         onBackButtonPress={ ()=> handleModal() }
         onBackdropPress={() => handleModal() }
         style={{
            flex:1, 
            margin: 0, 
            top: 0,
            left: 0,
            position: 'absolute',
            width: "50%",
            height: "100%",
         }}
      >
         <View style={styles.container}>
            <View style={{backgroundColor: globalStyle?.bgHeader, padding: 10, gap: 10, alignItems:'center', flexDirection: 'column', height: "100%", width: '100%', justifyContent: 'start'}}>

               <Text style={{color:globalStyle?.color, textAlign: 'left', fontSize: 17,}}>Menu</Text>

               {darkMode ?
                  (
                     <TouchableOpacity onPress={ () => handleDarkMode() } style={[styles.touchable, {backgroundColor: globalStyle?.bgBody, borderColor: globalStyle?.borderColor}]} >
                        <Fontisto name="day-sunny" size={24} color={globalStyle?.color} />
                        <Text style={{color: globalStyle?.color}} >Theme</Text>
                     </TouchableOpacity>
                  )
                  :
                  (
                     <TouchableOpacity  onPress={ () => handleDarkMode() } style={[styles.touchable, {backgroundColor: globalStyle?.bgBody, borderColor: globalStyle?.borderColor}]} >
                        <Fontisto name="night-clear" size={24} color={globalStyle?.color} />
                        <Text style={{color: globalStyle?.color}} >Theme</Text>
                     </TouchableOpacity>
                  )
               }

               {/* <TouchableOpacity onPress={ ()=> backUp() }  style={[styles.touchable, {backgroundColor: globalStyle?.bgBody, borderColor: globalStyle?.borderColor}]} >
                  <MaterialIcons name="settings-backup-restore" size={24} color={globalStyle?.color} />
                  <Text style={{color: globalStyle?.color}} >Backup</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={ ()=> restore() }  style={[styles.touchable, {backgroundColor: globalStyle?.bgBody, borderColor: globalStyle?.borderColor}]} >
                  <MaterialIcons name="restore" size={24} color={globalStyle?.color} />
                  <Text style={{color: globalStyle?.color}} >Restore</Text>
               </TouchableOpacity> */}

            </View>

         </View>
      </Modal>
   
      </>
   )
}

const styles = StyleSheet.create({
   touchable:{
      width: '100%',
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      gap: 10,
      padding: 10,
      borderRadius: 15,
   },
})