import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, Pressable } from 'react-native';
import React,{ useState, useEffect, useRef, memo } from 'react';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/passageStyle';
const months = ["All", "Jan", "Feb", "Mar", "Apr", "May",  "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

export default function SortModal({visible, handleModal, fetchData, fetchAllData, currentSortSetting, currentDisplaySetting, currentFilterSetting, handleSort, handleDisplay, handleFilter }) {
    const theme = useTheme();
	const [selectedSort, setSelectedSort] = useState(true);
	const [currentSort, setCurrentSort] = useState("By Modified Time");
	const [currentDisplay, setCurrentDisplay] = useState("List");
	const [currentFilter, setCurrentFilter] = useState("All");
	const [iconName, setIconName] = useState("arrowup");
	const [data, setData] = useState(months)
	const ref = useRef(null);
	const [index, setIndex] = useState(0);
	const [btnType, setBtnType] = useState("");

    const toggleModal = () =>{
        handleModal(!visible)
    }

	const renderStyles = {
		style:{
			backgroundColor: theme.colors.primary, 
			padding: 10, 
			margin: 0,
			gap: 10,
		}
	}

	const handleSortItem = (name) =>{
		setSelectedSort(true);
		setCurrentSort(name);
		setBtnType("sort");
		if(selectedSort && name == currentSort){
			if(iconName == "arrowup"){
				setIconName("arrowdown");
			}else{
				setIconName("arrowup");
			}
		}
	}

	const SortItem = ({ name,  }) => (
		<Pressable 
			onPress={ ()=>handleSortItem(name) }
			style={{flexDirection: 'row', alignItems: 'center', padding: 10, gap:10}}
		>
			<AntDesign name={iconName} size={20} color={ name == currentSort ? theme.colors.textColor : theme.colors.altTextColor} />
			<Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize}} >{name}</Text>
		</Pressable>
	);

	
	const RenderSort = () =>{

		return(
			<View style={renderStyles.style}>
				<SortItem name="By Modified Time"/>
				<SortItem name="By Created Time" />
			</View>
		);
	}

	const handleDisplayItem = (name) =>{
		if(name !== currentDisplay){
			setCurrentDisplay(name);
			setBtnType("display");
		}
	}

	const DisplayItem = ({ name, icon  }) => (
		<Pressable 
			onPress={ ()=>handleDisplayItem(name) }
			style={{flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10, borderWidth: 1, borderRadius: 10, paddingLeft: 15, paddingRight: 15, 
			backgroundColor: currentDisplay == name ? theme.colors.altColor : theme.colors.altTextColor,
			borderColor:  currentDisplay == name ? '#fff' : theme.colors.borderColor,
		}}
		>	
			{icon}
			<Text style={{color: currentDisplay == name ? theme.colors.altTextColor : theme.colors.textColor, fontSize: theme.fonts.fontSize}} >{name}</Text>
		</Pressable>
	);
	
	const RenderDisplay = () => {
	

		return(
			<View style={[renderStyles.style, {flexWrap: 'wrap', flexDirection: 'row', marginBottom: 10}]}>
		
				<DisplayItem name="List" icon={ <Foundation name="list" size={20} color={currentDisplay == "List" ? theme.colors.altTextColor : theme.colors.textColor} /> }/>
				<DisplayItem name="Details" icon={<FontAwesome5 name="equals" size={20} color={currentDisplay == "Details" ? theme.colors.altTextColor : theme.colors.textColor} />} />
				<DisplayItem name="Grid" icon={<Fontisto name="nav-icon-grid" size={16} color={currentDisplay == "Grid" ? theme.colors.altTextColor : theme.colors.textColor} />} />
				<DisplayItem name="Large Grid" icon={<MaterialCommunityIcons name="view-grid" size={22} color={currentDisplay == "Large Grid"  ? theme.colors.altTextColor : theme.colors.textColor}  />} />	
			</View>
		);
	}

	const handleFilterItem = (month, index) =>{
		if(currentFilter !== month){
			setCurrentFilter(month);
			// console.log(index)
			setIndex(index);
			setBtnType("filter");
		}
	}


	useEffect(() => {
		if(visible){
			ref.current?.scrollToIndex({
				index: index,
				animated: true,
			
			});
		}
	
	}, [index, visible])

	// const RenderFilter = memo(() => {

	

	
	
	// 	return(
	// 		<View style={[renderStyles.style, { marginBottom: 10,}]}>
	// 			<FlatList 
	// 				ref={ref}
	// 				initialNumToRender={13}
	// 				keyExtractor={(item, index) => index.toString()}
	// 				showsHorizontalScrollIndicator={false}
	// 				onScrollToIndexFailed={info => {
	// 					const wait = new Promise(resolve => setTimeout(resolve, 500));
	// 					wait.then(() => {
	// 						ref.current?.scrollToIndex({ index: info.index, animated: true,
	// 						});
	// 					});
	// 				}}
					
	// 				data={data} 
	// 				horizontal
	// 				renderItem={ ({item, index:findex})=>(
						
	// 						<TouchableOpacity 
	// 							key={findex}
	// 							onPress={ ()=>{handleFilterItem(item) } } 
	// 							style={{
	// 								borderWidth: 1, borderRadius: 10, 
	// 								padding: 10, marginRight: 7, 
	// 								paddingLeft: 15, paddingRight: 15,
	// 								backgroundColor: currentFilter == item ? theme.colors.altColor : theme.colors.altTextColor,
	// 								borderColor:  currentDisplay == item ? '#fff' : theme.colors.borderColor,
	// 							}}
	// 						> 	
	// 							<View>
	// 							<Text style={{color: currentFilter == item ? theme.colors.altTextColor : theme.colors.textColor, fontSize: theme.fonts.fontSize,}} >{item}</Text>

	// 							</View>
	// 						</TouchableOpacity>
						
	// 				) }
	// 			/>
	// 		</View>	
	// 	);
		
	// });

	
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
			<View style={[styles.modalContent, {backgroundColor: theme.colors.primary, height: 450}]}>
				<View style={{backgroundColor: theme.colors.borderColor, width: 60, height: 5, borderRadius: 3, alignSelf: 'center'}} ></View>
				<View style={{padding: 10}}>
					<Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize + 2, fontWeight: 'bold'}} >Sort</Text>
					<RenderSort />
					<Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize + 2, fontWeight: 'bold'}}>Display</Text>
					<RenderDisplay />
					<Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize + 2, fontWeight: 'bold'}}>Filter by Month</Text>
					{/* <RenderFilter /> */}

					<View style={[renderStyles.style, { marginBottom: 10,}]}>
						<FlatList 
							ref={ref}
							initialScrollIndex={0}
							showsHorizontalScrollIndicator={false}
							onScrollToIndexFailed={info => {
								const wait = new Promise(resolve => setTimeout(resolve, 500));
								wait.then(() => {
									ref.current?.scrollToIndex({ index: info.index, animated: true,
									});
								});
							}}
							
							data={data} 
							horizontal
							renderItem={ ({item, index:findex})=>(
								
								<TouchableOpacity 
									key={findex}
									onPress={ ()=>{handleFilterItem(item, findex) } } 
									style={{
										borderWidth: 1, borderRadius: 10, 
										padding: 10, marginRight: 7, 
										paddingLeft: 15, paddingRight: 15,
										backgroundColor: currentFilter == item ? theme.colors.altColor : theme.colors.altTextColor,
										borderColor:  currentDisplay == item ? '#fff' : theme.colors.borderColor,
									}}
								> 	
									<View>
									<Text style={{color: currentFilter == item ? theme.colors.altTextColor : theme.colors.textColor, fontSize: theme.fonts.fontSize,}} >{item}</Text>

									</View>
								</TouchableOpacity>
								
							) }
						/>
					</View>	
				</View>
				
			</View>

		</Modal>
    )
}
