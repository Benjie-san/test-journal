import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';

const Navbar = ({ onPressAddEntry,}) => {
   const theme = useTheme();
   return(
   <View style={[styles.navbar]}>
      <View style={{borderRadius: 50, width: 60, height: 60, padding: 10,
      margin: 10, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={ () => onPressAddEntry() } style={[styles.addEntry, {backgroundColor: theme.colors.altColor}]}>
         {/* <Image style={{width: 30, height: 30,}} source={require("../assets/write.png")}/> */}
         <Feather name="plus" size={30} color="white" />
      </TouchableOpacity>
      </View>
   </View>
   )
}

const styles = StyleSheet.create({
   navbar:{
      right: 0,
      bottom: 0,
      position: "absolute",
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
      alignItems: 'center',
   },
   addEntry:{
      borderRadius: 50,
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
   },
});


export default Navbar;