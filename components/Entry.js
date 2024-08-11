import { Text, View, TextInput, Pressable, TouchableOpacity, ScrollView, KeyboardAvoidingView, Share, AppState, ActivityIndicator, Alert, useWindowDimensions} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import * as SQLite from 'expo-sqlite';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTheme } from 'react-native-paper';

// Icons
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Navigation
import { useIsFocused } from '@react-navigation/native';

//Component Imports
import PassageBottomSheet from './PassageBottomSheet';
import AlertModal from './AlertModal';
import styles from '../styles/entryStyle';

const db = SQLite.openDatabase('_journal_database.db');
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const MenuModal = ({visible, handleCloseModal, status, entry, type, handleStatus, handleSettingState, settingState}) => {
    const theme = useTheme(); //for theme
    
	const alertModal = (title, message) => 	Alert.alert(
		title,
		message,
		[
		{ text: "Cancel", style: 'cancel', onPress: () => {} },
		{
			text: 'Confirm',
			style: 'destructive',
			// If the user confirmed, then we dispatch the action we blocked earlier
			// This will continue the action that had triggered the removal of the screen
			onPress: () => handleSettingState(title),
		},
		]
	);

    const onShare = async () => {
        let message = "";
        if(type == "journal"){
            message =  `Date:\n${entry.date}\n\nScripture:\n${entry.scripture}\n\n${entry.passage.toString()}\n\nTitle:\n${entry.title}\n\nObservation:\n${entry.observation}\n\nApplication:\n${entry.application}\n\nPrayer:\n${entry.prayer}\n`
        }else if(type == "opm"){
            message =  `Date:\n${entry.date}\n\nOPM Passage:\n${entry.scripture}\n\nTheme:\n${entry.title}\n\nQuestion:\n${entry.question}\n\nKey Points:\n${entry.observation}\n\nRecommendations:\n${entry.application}\n\nReflection/Realization:\n${entry.prayer}\n\n`
        } else if(type == "sermon"){
            message =  `Date:\n${entry.date}\n\nText:\n${entry.scripture}\n\nTheme:\n${entry.title}\n\nQuestion:\n${entry.question}\n\nSermon Points:\n${entry.observation}\n\nRecommendations:\n${entry.application}\n\nReflection:\n${entry.prayer}\n\n`
        }

        try {
            const result = await Share.share({
            message: message,
            });
            if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
            } else if (result.action === Share.dismissedAction) {
            // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const handlePressBtn = (item) =>{
        if(item == "Delete"){
            //handleDeleteModal(true);
			alertModal("Delete", "Are you sure want to permanently delete the entry?")

        }
        else if(item == "Archive"){
            //handleArchiveModal(true);
			if(settingState == "archive"){
				alertModal("Unarchive", "Are you sure want to remove the entry from archive?")
            }else{
				alertModal("Archive", "Are you sure want to move the entry to archive?")
            }
        }
        else if(item == "Trash"){
            //handleTrashModal(true);
			if(settingState == "trash"){
				alertModal("Restore", "Are you sure want to restore the entry from trash?")    
            }else{
				alertModal("Trash", "Are you sure want to move the entry to trash?")        
            }
        }
        else if(item == "#fff"){
            handleStatus("#8CFF31");
        }
        else if(item == "#8CFF31"){
            handleStatus("#fff");
        }
        else if(item == "Share"){
            onShare();
        }

        handleCloseModal();
    }

return(
	<>
		<Modal 
			isVisible={visible}
			style={{margin: 0}}
			animationIn="fadeIn"
			animationOut="fadeOut"
			onBackButtonPress={handleCloseModal}
			onBackdropPress={handleCloseModal}
			backdropOpacity={0}
		>
		<View style={{flex: 1}} >
				<View style={[styles.menuPopup, {backgroundColor: theme.colors.primary}]} >

				<TouchableOpacity 
					style={[styles.menuItems]}  
					onPress={() => handlePressBtn(status)} 
				> 
					<View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}> 
						<AntDesign name="checksquareo" size={theme.fonts.fontSize+4} color={ theme.colors.textColor} />        
						<Text style={{fontSize: theme.fonts.fontSize+2,  color:  theme.colors.textColor}}>{status === "#8CFF31" ? "Unmark as done" : "Mark as done"}</Text>
					</View>
					
				</TouchableOpacity>

				<TouchableOpacity 
					onPress={() => handlePressBtn("Archive")} 
					style={styles.menuItems}  
				> 
					<View style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>
						<Feather name="archive" size={theme.fonts.fontSize+4} color={theme.colors.textColor} />        
						<Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor}}>{settingState == "archive" ? "Unarchive" : "Archive"}</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.menuItems}  
					onPress={() => handlePressBtn("Trash")} 
				> 
					<View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}> 
						{settingState == "trash" ? 
						(<MaterialIcons name="restore" size={theme.fonts.fontSize+8} color={theme.colors.textColor} />) 
						:
						( <Feather name="trash" size={theme.fonts.fontSize+4} color={theme.colors.textColor} /> )}
						<Text style={{color:  theme.colors.textColor, fontSize: theme.fonts.fontSize+2}}>{settingState == "trash" ? "Restore" : "Trash"}</Text>
					</View>
				</TouchableOpacity>

				{settingState == "trash" ? (
					<TouchableOpacity 
							style={styles.menuItems}  
							onPress={() => handlePressBtn("Delete")} 
					> 
						<View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>   
								<Feather name="trash" size={theme.fonts.fontSize+4} color="#FA5252" />          
								<Text style={{color: '#FA5252', fontSize: theme.fonts.fontSize+2}}>Delete</Text>
						</View>
					</TouchableOpacity>

				) : null }

				<TouchableOpacity 
					style={[styles.menuItems, {borderBottomColor: 'transparent'}]}  
					onPress={() => handlePressBtn("Share")} 
				> 
					<View style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>
						<Feather name="share-2" size={theme.fonts.fontSize+4} color={theme.colors.textColor} />        
						<Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor}}>Share</Text>
					</View>
				</TouchableOpacity>

				</View>
		</View>
		</Modal>
	</>
);
}

export default function Entry({navigation, route }){
const theme = useTheme(); //for theme
const isFocused = useIsFocused();
const {entryId, verse, entryType, index, itemId, state} = route.params;


//for showing modals
const [dateModalVisible, setDateModalVisible] = useState(false);
const [menuVisible, setMenuVisible] = useState(false);

//data fields
const [id, setId] = useState(0);
const [dataId, setDataId] = useState(0);

const [date, setDate] = useState(new Date().toDateString());
const [title, setTitle] = useState("");
const [scripture, setScripture] = useState(verse);
const [observation, setObservation] = useState("");
const [application, setApplication] = useState("");
const [prayer, setPrayer] = useState("");
const [question, setQuestion] = useState("");
const [type, setType] = useState(entryType);
const [status, setStatus] = useState("");
const [month, setMonth] = useState("");
const [day, setDay] = useState("");
const [passage, setPassage] = useState(""); 

const [currentEntry, setCurrentEntry] = useState();

const [currentState, setCurrentState] = useState(state);
const [settingState, setSettingState] = useState("");

const [entriesId, setEntriesId] = useState([]);

const [entryLoading, setEntryLoading] = useState(false);

const changed = useRef(false);

//for animatiuion of expandable
const [height, setHeight] = useState(0);
const [show, setShow] = useState(false);

//for system buttons
const appState = useRef(AppState.currentState);
const [appCurrentState, setAppCurrentState] = useState(appState.current);

//for dates
const [entryDate, setEntryDate] = useState(new Date());

const entryToBeShared = {
    date: date,
    scripture: scripture,
    title: title,
    question: question,
    observation: observation,
    application: application,
    prayer: prayer,
    passage: passage,
}

const [disableSave, setDisableSave] = useState(false);

const handlePassage = (item) => {
	setPassage(item);
}

const [passageModalVisble, setPassageModalVisible] = useState(false);

const handlePassageVisible = (item) => {
    setPassageModalVisible(item);
}

const [alertModalVisible, setAlertModalVisible] = useState(false);

const [message, setMessage] = useState("");

const handleAlertModalVisible = (item) =>{
	let isEmpty = [title, question, observation, application, prayer];
	if (currentState == "add" && !isEmpty.every((item)=>item=="") ){
		setMessage("Entry Saved");
		setAlertModalVisible(item);

	} 
	if (currentState == "update"){
		setMessage("Entry Updated");
		setAlertModalVisible(item);

	}
}

const [discardModal, setDiscardModal] = useState(false);
const eventDiscard = useRef(null);

const handleDiscardModal = (item) =>{
	setDiscardModal(item)
}

const handleDiscard = (item) =>{
	return item
}

// HANDLE FUNCTIONS
const handleDateModal = () => {
	setDateModalVisible(!dateModalVisible)
}


// when closed is pressed

const onChangeDate = ({type}, selectedDate) =>{
	if(type == "set"){   
		setDateModalVisible(false);
		const currentDate = selectedDate;
		setEntryDate(currentDate);
		handleChangeDate(currentDate.toDateString());
	} else{
		handleDateModal();
	}
}

const handleChangeDate = (item) =>{
	setDate(item);
}

const handleChangeText = (text, valueFor) =>{
	changed.current = true;
	switch(valueFor){
		case 'title': setTitle(text) ;break;
		case 'question': setQuestion(text) ;break;
		case 'scripture': setScripture(text) ;break;
		case 'observation': setObservation(text) ;break;
		case 'application': setApplication(text) ;break;
		case 'prayer': setPrayer(text) ;break;
		
	}
}

// showing the menu modal
const handleMenuVisible = ()=>{
    setMenuVisible(!menuVisible);
}

const handleStatus = (item) =>{
    setStatus(item);
    handleAlertModalVisible(true);
}

const handleSettingState = (item) =>{
	if(item == "Delete"){
		deleteEntry();
	}else if(item == "Trash" || item == "Archive"){
		db.transaction((tx) => {
			tx.executeSql(
			'UPDATE entries SET settingState = ? WHERE dataId = ?;',
			[item.toLowerCase(), dataId],
			(_, result) => {
				console.log('Data updated successfully');
				fetchEntry(dataId);         
				setDisableSave(false);
			},
			(_, error) => {
					console.error('Error updating data:', error);
			}
			);
		});
		navigation.pop();

	}
	else if(item == "Restore" || item == "Unarchive"){
		db.transaction((tx) => {
			tx.executeSql(
			'UPDATE entries SET settingState = ? WHERE dataId = ?;',
			["normal", dataId],
			(_, result) => {
				console.log('Data updated successfully');
				fetchEntry(dataId);         
				setDisableSave(false);
			},
			(_, error) => {
					console.error('Error updating data:', error);
			}
			);
		});
		navigation.pop();
	}
}

//deleting entry
const deleteEntry = () => {
	db.transaction((tx) => {
		tx.executeSql(
		`DELETE FROM entries WHERE dataId = ?;`,
		[dataId],
		(_, result) => {
				console.log('Data deleted successfully');
				navigation.pop();
		},
		(_, error) => {
		console.error('Error deleting data:', error);
		}
		);
	});
}
//updating the entry
const updateEntry = () => {
	db.transaction((tx) => {
			tx.executeSql(
			'UPDATE entries SET date = ?, title = ?, question = ?, scripture = ?, observation = ?, application = ?, prayer = ?, status = ?, modifiedDate = ? WHERE dataId = ?;',
			[date, title, question, scripture, observation, application, prayer, status, Date.now(), parseInt(dataId)],
			(_, result) => {
				console.log('Data updated successfully');
				fetchEntry(dataId);         
				setDisableSave(false);
				changed.current = false;
			},
			(_, error) => {
					console.error('Error updating data:', error);
			}
			);
	});
}
//saving entry
const saveEntry = () => {
	// adding entry to db
	let isEmpty = [title, question, observation, application, prayer];
	if(!isEmpty.every((item)=>item=="")){

		if(type=="journal" || type == "sermon"){
			db.transaction((tx) => {
				tx.executeSql(
				'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month, createdDate, settingState ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
				[date, title, question, scripture, observation, application, prayer, '#8CFF31', type, Date.now(), parseInt(itemId), months[index], Date.now(), "normal"],
				(tx, results) => {
						console.log("Success added Journal entry!!!");
						fetchEntry(itemId);
						setCurrentState("update");
						setDisableSave(false);
						changed.current = false;
				},
				(error) => {
				// Handle error
				console.log("Save Entry ERROR:", error);
				}
				);
			});
		}
		else{
			db.transaction((tx) => {
				tx.executeSql(
				'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month, createdDate, settingState) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
				[date, title, question, scripture, observation, application, prayer, '#8CFF31', type, Date.now(), parseInt(dataId), months[index], Date.now(), "normal"],
				(tx, results) => {
				console.log("Success added OPM entry!!!");
					fetchEntry(dataId);
					setCurrentState("update");
					setDisableSave(false);
					changed.current = false;


				},
				(error) => {
				// Handle error
				console.log( "Save Entry ERROR:", error);
				}
				);
			});
		}
	}

}
//fetching the entry
const fetchEntry = (id) =>{
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM entries WHERE dataId = ?;",
        [id],
            (_, result) => {
                const rows = result.rows;
                let dataArray = [];
                for (let i = 0; i < rows.length; i++) {
                    const item = rows.item(i);
                    dataArray.push(item);
                }
                setEntryLoading(true);
                setItems(...dataArray);
				changed.current = false;
            },
            (_, error) => {
                console.log("fetch error: ", error)
            }
        );
    });
}

const setItems = (currentEntry) => {
    setDataId(Number(currentEntry?.dataId));
    setId(currentEntry?.id);
    setDate(currentEntry?.date);
    setTitle(currentEntry?.title);
    setScripture(currentEntry?.scripture);
    setQuestion(currentEntry?.question);
    setObservation(currentEntry?.observation);
    setApplication(currentEntry?.application);
    setPrayer(currentEntry?.prayer);
    setType(currentEntry?.type);
    setStatus(currentEntry?.status);
    setSettingState(currentEntry?.settingState);
}

const handleEntry = () => {
    setDisableSave(true);
    if(currentState == "add"){
        saveEntry();
    }
    else{
        if( currentEntry?.scripture !== scripture || currentEntry?.title !== title || currentEntry?.question !== question || currentEntry?.observation !== observation || currentEntry?.application !== application || currentEntry?.prayer !== prayer || currentEntry?.status !== status ){  
            updateEntry();
        }
    }
    handleAlertModalVisible(true);
    
}


const onLayout = (event) => {
	//const layoutHeight = event.nativeEvent.layout.height;
	const layoutHeight = passage.toString().length / 1.6;

		if(layoutHeight > 0 && layoutHeight !== height){
			setHeight(layoutHeight);
		}
}

const animatedStyle = useAnimatedStyle( ()=>{
	const animatedHeight = show ? withTiming(height) : withTiming(0);
		return{
			height: animatedHeight,
			overflow: 'hidden'
		}
});



useEffect(() => {
	let date = new Date();
    if(type == "opm"){
		setDataId( parseInt(String(date.getMonth()+1) + String(date.getDate())  + String(date.getHours())  + String(date.getMinutes())) );
    }

}, []);

useEffect(() => {
    const interval = setTimeout(() => {
        if(entryLoading == false){
            if(currentState == "update"){
                fetchEntry(entryId);
            }else{
                setEntryLoading(true);
            }
        }       
    }, 1000)

    return () => {
    clearTimeout(interval)
    }

}, [currentState, entryLoading, fetchEntry]);

useEffect(() => {
    if(alertModalVisible == true){
        const interval = setTimeout(() => {
            handleAlertModalVisible(false);
        }, 1000)

        return () => {
        clearTimeout(interval)
        }
    }

}, [alertModalVisible ]);

//for drawer when pressed
useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {

    if (appState.current.match(/inactive|background/) &&
    nextAppState === 'active') {
        return;
    }else{
        if(isFocused === true){
            if(currentState == "add"){
                saveEntry();
            }else{
                updateEntry();
            }
        
        }
    }

    appState.current = nextAppState;
    setAppCurrentState(appState.current);
    });

    return () => {
    subscription.remove();
    };
}, [isFocused, currentState, saveEntry, updateEntry]);

useEffect( () =>
	navigation.addListener('beforeRemove', (e) => {
	if (changed.current == false) {
		// If we don't have unsaved changes, then we don't need to do anything
		return;
	}

	// Prevent default behavior of leaving the screen
	e.preventDefault();
	handleDiscardModal(true);

	// Prompt the user before leaving the screen
	Alert.alert(
		'Discard Entry?',
		'You have unsaved changes. Are you sure to discard them and leave the screen?',
		[
		{ text: "Don't leave", style: 'cancel', onPress: () => {} },
		{
			text: 'Discard',
			style: 'destructive',
			// If the user confirmed, then we dispatch the action we blocked earlier
			// This will continue the action that had triggered the removal of the screen
			onPress: () => navigation.dispatch(e.data.action),
		},
		]
	);

}),[navigation, changed, ]);


//HEADER
useEffect(() => {
    navigation.setOptions({
        headerStyle: {backgroundColor: theme.colors.primary},
	
        headerTitle: () => (
            <Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor, fontWeight: 'bold'}}>{entryType == "sermon" ? "Sermon Note" : entryType == "journal" ? "Journal Entry" : "OPM Reflection"}</Text>
        ),
        headerRight: () => (

            <View style={{flexDirection: 'row', alignItems: "center", gap:10}}>
                <TouchableOpacity disable={disableSave} onPress={ () => handleEntry()}>
                    <Text style={{color: theme.colors.altColor}}>SAVE</Text>
                </TouchableOpacity>

                {currentState == "update" ? (
                    <TouchableOpacity onPress={() => handleMenuVisible()}>
                        <Feather name="more-vertical" size={25} color={theme.colors.textColor} />
                    </TouchableOpacity>
                ) : null}
            
            </View>

        ),
        
    });
}, [navigation, entryType, handleEntry, currentState]);


return (
	<>
		<View style={{ 
				flex: 1,
				margin: 0, 
				backgroundColor: theme.colors.secondary, 
			}} 
		>
		
			{ !entryLoading ? (<ActivityIndicator style={[styles.flex]} size={'large'}/>) : (
				<View style={[styles.modal, {backgroundColor: theme.colors.secondary,}]}>
					
						<KeyboardAwareScrollView
							style={{ backgroundColor: theme.colors.secondary }}
							resetScrollToCoords={{ x: 0, y: 0 }}
							scrollEnabled={true}
						> 
							
							<View style={[styles.inputContainer, {borderRadius: 5} ]}>
								<Text  style={{color: theme.colors.textColor,  fontSize: theme.fonts.fontSize}}>
									{type === "sermon" ? "Text:" : type == "opm" ? 'OPM Passage:' : 'Scripture:' }
								</Text>
								
									<TouchableOpacity style={{padding: 10, backgroundColor:'#bfbfbf', borderRadius: 5, justifyContent: 'space-between', flexDirection: 'row', alignItems:'center'}} onPress={ () => setShow(!show) }>
										<Text style={{fontSize: theme.fonts.fontSize}}>{scripture}</Text>

										<TouchableOpacity style={{padding: 5,}}>
											<Text style={{color: theme.colors.altColor, fontSize: theme.fonts.fontSize}}>ESV</Text>
										</TouchableOpacity>
									</TouchableOpacity>

							
								<Animated.View style={[animatedStyle, {marginTop: 10, borderRadius: 5, backgroundColor:'#bfbfbf'}]}>
    
									<View onLayout={onLayout} style={{width: '100%', height: height, gap: 10, padding: 10}}>

										{
											passage.map( (item, key) => (
												<Text key={key} style={{fontSize: theme.fonts.fontSize}} >{item}</Text>
											) )
										}
										
									</View>

								</Animated.View>

							

							</View>

							<View style={styles.inputContainer}>
								<Text  style={{color: theme.colors.textColor,  fontSize: theme.fonts.fontSize}}>{type === "sermon" ? "Theme:": type == "opm" ? 'OPM Theme:' : 'Title:'}</Text>
								<TextInput style={[styles.input, {minHeight: 50, fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "title") } value={title} multiline={true} />
							</View>

							{ entryType != "journal" ?
								(
									<View style={styles.inputContainer}>
									<Text  style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize}}>Question:</Text>
									<TextInput style={[styles.input, {minHeight: 50, fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "question") } value={question} multiline={true} />
									</View>
								) : null
							}
							<View style={[styles.inputContainer, {}]}>
								<Text  style={{color: theme.colors.textColor,  fontSize: theme.fonts.fontSize}}>{type === "sermon" ? "Sermon Points:": type == "opm" ? 'Key Points:' : 'Observation:'}</Text>
								<TextInput 
									style={[styles.input, { fontSize: theme.fonts.fontSize}]} 
									editable 
									onChangeText={ text => handleChangeText(text, "observation") } 
									value={observation}  
									multiline={true} 	
									
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text  style={{color: theme.colors.textColor,  fontSize: theme.fonts.fontSize}}>{type === "sermon" ? "Recommendations:": type == "opm" ? 'Recommendations:' : 'Application:'}</Text>
								<TextInput style={[styles.input,{ fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "application")} value={application}  multiline={true} />
							</View>

							<View style={styles.inputContainer} >
								<Text style={{color: theme.colors.textColor, fontSize: theme.fonts.fontSize}}>{type == "sermon" ? "Reflection:": type == "opm" ? 'Reflection/Realization:' : 'Prayer:'}</Text>
								<TextInput style={[styles.input, { fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "prayer") } value={prayer}  multiline={true} />

								<View style={[styles.flex,{paddingTop: 20,}]}>
									<TouchableOpacity 
										style={[styles.border, {  backgroundColor: theme.colors.secondary, borderColor: theme.colors.borderColor,alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', padding: 10, gap: 5, width: 100,elevation: 5 }]} 
										onPress={ () => handlePassageVisible(true) }
									>
									<FontAwesome5 name="bible" size={24} color={theme.colors.textColor} />
									<Text style={{color: theme.colors.textColor , fontSize: theme.fonts.fontSize}}>Bible</Text>

									</TouchableOpacity>
								</View>

							</View>

						
						
						</KeyboardAwareScrollView>
						
				</View>

			)
			}
		
			<AlertModal message={message} visible={alertModalVisible} />
			
			<PassageBottomSheet 
				visible={passageModalVisble} handleModal={handlePassageVisible} 
				scripture={scripture} type={entryType} handlePassage={handlePassage} 
			/>
			
		</View>

		<MenuModal 
			visible={menuVisible} handleCloseModal={handleMenuVisible} 
			deleteEntry={deleteEntry} 
			status={status} handleStatus={handleStatus} 
			entry={entryToBeShared} type={entryType} 
			handleSettingState={handleSettingState} settingState={settingState}
		/>
	</>
)

}