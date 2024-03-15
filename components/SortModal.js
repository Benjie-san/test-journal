
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React,{ useState, useEffect } from 'react';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import styles from '../styles/passageStyle';

const Tab = createMaterialTopTabNavigator();

export default function SortModal({visible, handleModal,}) {
    const theme = useTheme();

    const toggleModal = () =>{
        handleModal(!visible)
    }

	const RenderFilter = () =>{
		return(
			<View style={[styles.flex, {backgroundColor: theme.colors.primary, borderTopColor: theme.colors.borderColor, borderTopWidth: 1, padding: 0, margin: 0}]}>
				<Text>Filter</Text>
			</View>
		);
	}
	
	const RenderSort = () =>{
		return(
			<View style={styles.flex}>
				<Text>Sort</Text>
			</View>
		);
	}
	
	const RenderDisplay = () => {
		(
			<View style={styles.flex}>
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
			<View style={[styles.modalContent, {backgroundColor: theme.colors.primary,}]}>
				<Tab.Navigator
					screenOptions={{
						tabBarStyle:{
							width: '100%',
							elevation: 0,
							shadowColor: "#000000",
							shadowOffset: { width: 0, height: 10 }, // change this for more shadow
							shadowOpacity: 0.4,
							shadowRadius: 6,
						},
					}}
				>
					<Tab.Screen tabBarLabel="Filter" name="filter" component={RenderFilter} />
					<Tab.Screen tabBarLabel="Sort" name="sort" component={RenderSort} />
					<Tab.Screen tabBarLabel="Display" name="display" component={RenderDisplay} />
				</Tab.Navigator>
			</View>

		</Modal>
    )
}
