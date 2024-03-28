import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper';

export default function SettingsModal({visible, handleModal, children, globalStyle}) {
  const theme = useTheme();

  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      style={{ flex: 1, margin: 0 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={() => handleModal(false)}
      onBackButtonPress={handleModal}
      backdropOpacity={0.5}
      animated
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
    >
      <View style={styles.flex} >
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.textColor,
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
    width: "70%", 
    padding: 20,
    borderRadius: 10,
    flexDirection:'column',
    justifyContent:"center",
    borderWidth: 1,
  }
});