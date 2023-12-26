import { StyleSheet } from "react-native";

const twtColor = '#1d9bf0';

const styles = StyleSheet.create({
   flex:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   btn:{
      borderBottomWidth:1,
      borderBottomColor: 'black',
      padding: 15,
      alignItems: 'center',
      margin: 5,
   },
   border:{
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'black',
   },
   homeContainer:{
      flex: 1,
      alignItems: "center",
      backgroundColor: '#f5f5f5',
      flexDirection: 'column',
      paddingTop: 20,
   },
   passageToday:{
      justifyContent:"space-between", 
      alignItems: "center", 
      flexDirection: 'row'
   },
   notelist:{
      width: "95%",
      height: "auto",
      justifyContent: 'center',
      alignItems: 'center',
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
   addEntry:{
      borderRadius: 50,
      backgroundColor: twtColor,
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 70,
   },
   navbar:{
      width: "100%",
      height: "10%",
      bottom: 0,
      position: "absolute",
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      zIndex:1,
      backgroundColor: '#fff',
   },
   sortingButtons:{
      width: '100%',
      height: '8%',
      flexDirection: 'row',
      alignItems:'center',
      justifyContent: 'space-evenly',
   },
   sortingBtn:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: "auto",
      padding: 5,
   gap: 5,
   },
   itemCount:{
      backgroundColor: twtColor, 
      paddingRight: 12,
      paddingLeft: 12,
      borderRadius: 10,
   },
   navBarBtn:{
      padding: 10,
      margin: 10,
   },
   
   shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
   },
})
   
export default styles;