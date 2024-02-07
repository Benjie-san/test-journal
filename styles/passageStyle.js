import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-end",
		margin: 0,
	},
	modalContent: {
		paddingTop: 12,
		paddingHorizontal: 12,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		height: 500,
		paddingBottom: 30,
	},
	center: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: 'column',		
		gap: 5,
	},
	barIcon: {
		width: 60,
		height: 5,
		borderRadius: 3,
	},
	border:{
		borderColor: '#cccccc',
		borderWidth: 1,
		borderRadius: 10,
	},
	header:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	
		width: '100%',
		height: 50,
		gap: 5,
	},
	headerBtn:{
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
		gap: 10,
	},
	picker:{
		width: '40%',
		justifyContent: 'center',
		borderRadius: 20,
		padding: 10,
		paddingVertical: 10,
		top: 60,
		left: 180,
	},
	verseView:{
		padding: 10,
	},
	verseText:{
		textAlign: 'left',
		fontSize: 16,
	}
});

export default styles;