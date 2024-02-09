import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
header:{
   height: 60,
   padding: 10,
   justifyContent: "space-between",
   alignItems: "center",
   alignContent: "center",
   flexDirection: 'row',
   borderBottomWidth: 1,
   zIndex: 1,
   width: '100%',
},
flex:{
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
},
btn:{
   padding: 10,
   alignItems: 'center',
},
btn2:{
   padding: 5,
   alignItems: 'center',
   backgroundColor: 'red',
},
modal:{
   flex:1,
   textAlign: 'left',
   height: '100%',
},
inputContainer:{
   width: "100%",
   textAlign: 'left',
   justifyContent: 'center',
   alignItems: 'left',
   padding: 10,
},
touchableContainer:{
   width: "100%",
   flexDirection: 'row',
   textAlign: 'left',
   justifyContent: 'space-between',
   alignItems: 'left',
   margin: 5,
   padding: 10,
},
inputSubContainer:{
   width: "48%",
},
input:{    
   borderRadius: 5,
   backgroundColor: '#bfbfbf',
   width: "100%",
   minHeight: 100,
   padding: 10,
   marginBottom: 10,
},
border:{
   borderRadius: 10,
   borderWidth: 1,
   borderColor: 'black',
},
scriptureModalInner:{
   backgroundColor: '#f2f2f2',
   width: '80%',
   padding: 10,
   margin: 100,
   borderRadius: 5,
},
modalInput:{
   backgroundColor: '#bfbfbf',
   width: "100%",
   borderRadius: 10,
},
touchable:{
   borderRadius: 5,
   backgroundColor: '#bfbfbf',
   width: "100%",
   height: 40,
   alignItems: 'center',
   flexDirection:'row',
   padding: 5,

},
menuPopup:{
   borderRadius: 8,
   borderColor: '#333',
   borderWidth: 1,
   backgroundColor: '#fff',
   paddingHorizontal: 10,
   position: 'absolute',
   top: 50,
   right: 10,
},
menuItems:{
   fontSize: 50, 
   padding: 10, 
   alignItems:'flex-end', 
   borderBottomColor: '#ccc', 
   borderBottomWidth: 1,
},
deleteButtons:{
   padding: 15,
   borderRadius: 10,
   margin: 5,
},
editModeContainer:{
   width: "100%", 
   height: '5%', 
   alignItems: 'center',
   justifyContent: 'space-between',
   flexDirection: 'row',
   paddingLeft: 10,
   paddingRight: 10,
   paddingBottom: 10,
},
contentContainer: {
   flex: 1,
   alignItems: 'center',
},
containerHeadline: {
   fontSize: 24,
   fontWeight: '600',
   padding: 20,
},
});

export default styles;