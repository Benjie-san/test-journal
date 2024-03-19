import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React,{ useState, useEffect } from 'react';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/passageStyle';
const Tab = createMaterialTopTabNavigator();
import { useNavigation } from '@react-navigation/native';

export default function SortModal({visible, handleModal }) {

    const theme = useTheme();
	const [currentFilter, setCurrentFilter] = useState("All");
	const [checked, setChecked] = useState(true);
	const [selected, setSelected] = useState(true);
	const [currentSort, setCurrentSort] = useState("By Month");

	const [height, setHeight] = useState(250);

	const handleheight = (item) =>{
		setHeight(item)
	}

	const [iconName, setIconName] = useState("arrowdown");


    const toggleModal = () =>{
        handleModal(!visible)
    }

	const renderStyles = {
		style:{
			backgroundColor: theme.colors.primary, 
			borderTopColor: theme.colors.borderColor, 
			borderTopWidth: 1,
			padding: 10, 
			margin: 0,
			height: '100%',
			paddingTop: 20,
		}
	}

	const RenderFilter = () =>{
		const navigation = useNavigation();

		const handleFilter = (name) =>{
			setChecked(true);
			setCurrentFilter(name);
		}

		const FilterItem = ({name}) => (
			<TouchableOpacity 
				onPress={ ()=>handleFilter(name) }
				style={{flexDirection: 'row', alignItems: 'center'}}
			>
				<Checkbox
					status={ checked ? name == currentFilter ? 'checked' : 'unchecked' : 'unchecked' }
					onPress={ () => handleFilter(name) }
					color={theme.colors.altColor}
					uncheckedColor={theme.colors.textColor}
				/>
				<Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize}} >{name}</Text>
			</TouchableOpacity>
		);

		useEffect(() => {
			const unsubscribe = navigation.addListener('tabPress', (e) => {
				// let splitTarget = e.target.split("-")
				// console.log("First Screen Index:", splitTarget[0]);
				handleheight(250);
			});
		
			return unsubscribe;
		}, [navigation]);
		
	
		return(
			<View style={renderStyles.style}>
					<FilterItem name="All" />
					<FilterItem name="Journal" />
					<FilterItem name="Sermon Notes" />
					<FilterItem name="OPM Reflection" />
			</View>
		);
	}
	
	const RenderSort = () =>{
		const navigation = useNavigation();

		const handleSortItem = (name) =>{
			setSelected(true);
			setCurrentSort(name);
			if(selected && name == currentSort){
				if(iconName == "arrowdown"){
					setIconName("arrowup");
				}else{
					setIconName("arrowdown");
				}
			}
		}

		const SortItem = ({ name,  }) => (
			<TouchableOpacity 
				onPress={ ()=>handleSortItem(name) }
				style={{flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10}}
			>
				<AntDesign name={iconName} size={24} color={ name == currentSort ? theme.colors.textColor : theme.colors.altTextColor} />
				<Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize}} >{name}</Text>
			</TouchableOpacity>
		);
		useEffect(() => {
			const unsubscribe = navigation.addListener('tabPress', (e) => {
				// let splitTarget = e.target.split("-")
				// console.log("Second Screen Index:", splitTarget[0]);
				handleheight(250);

			});
	
		return unsubscribe;
		}, [navigation]);
		

		return(
			<View style={renderStyles.style}>
				<SortItem name="By Month" />
				<SortItem name="By Modified Time"/>
				<SortItem name="By Created Time" />
			</View>
		);
	}
	
	const RenderDisplay = () => {
		const navigation = useNavigation();
		const handleDisplayItem = () =>{
			console.log("change layout")
		}

		const DisplayItem = ({ name, icon  }) => (
			<TouchableOpacity 
				onPress={ ()=>handleDisplayItem(name) }
				style={{flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10,}}
			>	
				{icon}
				<Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize}} >{name}</Text>
			</TouchableOpacity>
		);

		useEffect(() => {
			const unsubscribe = navigation.addListener('tabPress', (e) => {
				handleheight(300)
			});
	
		return unsubscribe;
		}, [navigation]);

		return(
			<View style={renderStyles.style}>
				<DisplayItem name="List" icon={ <Foundation name="list" size={30} color={theme.colors.textColor} /> }/>
				<DisplayItem name="Details" icon={<FontAwesome5 name="equals" size={24} color={theme.colors.textColor} />} />
				<DisplayItem name="Grid" icon={<Fontisto name="nav-icon-grid" size={24} color={theme.colors.textColor} />} />
				<DisplayItem name="Large Grid" icon={<MaterialCommunityIcons name="view-grid" size={24} color={theme.colors.textColor}  />} />	
			</View>
		);
	}




    return (
        <Modal
			onBackdropPress={() => handleModal(false)}
			onBackButtonPress={() => handleModal(false)}
			isVisible={visible}
			animationIn="bounceInUp"
			animationOut="bounceOutDown"
			swipeDirection="down"
			onSwipeComplete={toggleModal}
			animationInTiming={900}
			animationOutTiming={500}
			backdropTransitionInTiming={1000}
			backdropTransitionOutTiming={1000}
			animated
            hideModalContentWhileAnimating
			style={[styles.modal,]}
		>
			<View style={[styles.modalContent, {backgroundColor: theme.colors.primary, height: height}]}>
				<Tab.Navigator
					screenOptions={{
						style:{backgroundColor: theme.colors.primary,},
						tabBarLabelStyle:{color: theme.colors.textColor,},
						tabBarStyle:{
							width: '100%',
							elevation: 0,
							shadowColor: "#000000",
							shadowOffset: { width: 0, height: 10 }, // change this for more shadow
							shadowOpacity: 0.4,
							shadowRadius: 6,
							backgroundColor: theme.colors.primary,
							color: theme.colors.textColor,
						},
						swipeEnabled: false,
					}}
				>
					<Tab.Screen headerTitle="Filter" name="filter" component={RenderFilter}/>
					<Tab.Screen headerTitle="Sort" name="sort" component={RenderSort} />
					<Tab.Screen headerTitle="Display" name="display" component={RenderDisplay}/ >
				
				</Tab.Navigator>
			</View>

		</Modal>
    )
}
