import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Modal from "react-native-modal";

export default function SettingsModal({visible, handleModal, children, globalStyle}) {
  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      style={{ flex: 1, margin: 0 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={() => handleModal(false)}
      onBackButtonPress={handleModal}
      backdropOpacity={0.4}
    >
      <View style={styles.flex} >
        <View
          style={[
            styles.container,
            {
              backgroundColor: globalStyle?.bgBody,
              borderColor: globalStyle?.borderColor,
            },
          ]}
        >
          {children}
    
        </View>
  
      </View>
      
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container:{
    padding: 10,
    width: "70%", 
    height:"20%",
    padding: 20,
    borderRadius: 10,
    flexDirection:'column',
    justifyContent:"center",
    borderWidth: 1,
  }
});