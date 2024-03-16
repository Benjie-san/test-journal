import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React,{ useState, useEffect } from 'react';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Checkbox } from 'react-native-paper';

import styles from '../styles/passageStyle';

const Tab = createMaterialTopTabNavigator();

export default function SortModal({visible, handleModal, }) {

    const theme = useTheme();
	const [currentFilter, setCurrentFilter] = useState("");
	const [checked, setChecked] = useState(false);
    const toggleModal = () =>{
        handleModal(!visible)
    }

	const renderStyles = {
		style:{
			backgroundColor: theme.colors.primary, 
			borderTopColor: theme.colors.borderColor, 
			borderTopWidth: 1,
			height: '100%',
			padding: 10, 
			margin: 0
		}
	}

	const RenderFilter = () =>{

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

		const SortItem = ({name}) => (
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

		return(
			<View  style={renderStyles.style}>
				<Text>Sort</Text>
			</View>
		);
	}
	
	const RenderDisplay = () => {


		return(
			<View style={renderStyles.style}>
				<Text>Display</Text>
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
			<View style={[styles.modalContent, {backgroundColor: theme.colors.primary, height: 300}]}>
				<Tab.Navigator
					screenOptions={{
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
					<Tab.Screen headerTitle="Filter" name="filter" component={RenderFilter} />
					<Tab.Screen headerTitle="Sort" name="sort" component={RenderSort} />
					<Tab.Screen headerTitle="Display" name="display" component={RenderDisplay} />
				</Tab.Navigator>
			</View>

		</Modal>
    )
}
