import Modal from "react-native-modal";
import { StyleSheet, Text, View,} from 'react-native';
import styles from "../styles/entryStyle";
import {useTheme} from 'react-native-paper';

const AlertModal = ({visible, message, globalStyle}) =>{   
   const theme = useTheme();

   return(
      <Modal
         isVisible={visible}
         style={[styles.flex, {margin: 0, flex:1, paddingTop: 400,}]}
         animationIn="fadeIn"
         animationOut="fadeOut"
         backdropOpacity={0}
      >
         <View style={{backgroundColor: theme.colors.secondary , padding: 10, borderRadius: 10, borderWidth:1, borderColor: theme.colors.borderColor, elevation: 5}}>
            <Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize}}>{message}</Text>
         </View>
      </Modal>
   );
}

export default AlertModal;