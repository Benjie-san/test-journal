import Modal from "react-native-modal";
import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Share} from 'react-native';
import styles from "../styles/entryStyle";

const AlertModal = ({visible, message, globalStyle}) =>{   

   return(
      <Modal
         isVisible={visible}
         style={[styles.flex, {margin: 0, flex:1, paddingTop: 400,}]}
         animationIn="fadeIn"
         animationOut="fadeOut"
         backdropOpacity={0}
      >
         <View style={{backgroundColor: globalStyle?.bgBody, padding: 10, borderRadius: 10, borderWidth:1, borderColor: globalStyle?.borderColor, elevation: 5}}>
            <Text style={{color: globalStyle?.color}}>{message}</Text>
         </View>
      </Modal>
   );
}

export default AlertModal;