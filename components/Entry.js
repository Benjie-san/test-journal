import { Text, View, TextInput, TouchableOpacity, Share, AppState, ActivityIndicator, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import * as SQLite from 'expo-sqlite';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from 'react-native-paper';

// JSON bibles
import asv from '../constants/asv.json';
import esv from '../constants/esv.json';
import tagalog from '../constants/tagab.json';

// Icons
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { MaterialIcons } from '@expo/vector-icons';

// Navigation
import { useIsFocused } from '@react-navigation/native';

//Component Imports
import MenuModal from './MenuModal';
import PassageBottomSheet from './PassageBottomSheet';
import AlertModal from './AlertModal'; // small box that shows up for informing if saved or updated
import styles from '../styles/entryStyle';


const db = SQLite.openDatabase('_journal_database.db');
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function Entry({navigation, route }){
const theme = useTheme(); //for theme
const isFocused = useIsFocused();
const {entryId, verse, entryType, index, itemId, state} = route.params;

//themes

const basicStyles = {
	fonts:{
		color: theme.colors.textColor,  
		fontSize: theme.fonts.fontSize,
	}
}


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
//
const [type, setType] = useState(entryType);
const [status, setStatus] = useState("");

const [passage, setPassage] = useState(""); 
const [passageTranslation, setPassageTranslation] = useState("ESV")

const [currentEntry, setCurrentEntry] = useState();

const [currentState, setCurrentState] = useState(state); //handling state in saving
const [settingState, setSettingState] = useState(""); // for setting the state in archive

//const [entriesId, setEntriesId] = useState([]);

const [entryLoading, setEntryLoading] = useState(false);

const changed = useRef(false); // checking if there are changes in the text inputs

//for animatiuion of expandable
const [height, setHeight] = useState(0);
const [show, setShow] = useState(false);

//for system buttons
const appState = useRef(AppState.currentState);
const [appCurrentState, setAppCurrentState] = useState(appState.current);

//for dates
const [entryDate, setEntryDate] = useState(new Date());

//for sharing
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

// bible functions
const handlePassage = (item) => {
	setPassage(item);
}

const handleExpandable = () =>{
	setShow(!show)
}

const getVerse = (scripture = "Genesis 1:1-3", translation) => {
	let splitVerse = [], range = [], passage = [];
	let book = "";
	let chapter = 0, start = 0, end = 0;
	if(scripture !== '' && scripture !== undefined && scripture !== null){
		let checkVerse = scripture.split(":");
		if( checkVerse[0] !== scripture ){
		
			splitVerse = scripture.split(":");
			let regex = /\b/;
			console.log(splitVerse[0].match(regex))
			// if(splitVerse[0].match(regex)){
			// 	book = splitVerse[0].slice(0, splitVerse[0].length-3).trim();
			// 	chapter = splitVerse[0].slice(splitVerse[0].length-3, splitVerse[0].length).trim();
			// }

			book = splitVerse[0].slice(0, splitVerse[0].length-2).trim();
			chapter = splitVerse[0].slice(splitVerse[0].length-2, splitVerse[0].length).trim();
	
			console.log(book);
			console.log(chapter);


			let checkStartVerse = splitVerse[1].split("-");
			if( checkStartVerse[0] !== splitVerse[1]){
				range = splitVerse[1].split("-");
				start = parseInt(range[0]);
				end = parseInt(range[1]);
			} else{
				start = parseInt(splitVerse[1]);
			
			}
			if(book == 'Psalm'){
				book = 'Psalms'
			}

			translation.verses.forEach(function (item) {
				if(item.book_name === book && item.chapter === parseInt(chapter) ){
		
					if(end !== 0){
							
						if(item.verse >= start && item.verse <= end){
							passage.push(`${item.verse} ${item.text}`);
						}
					} else{
						if (item.verse == start) {
							passage.push(`${item.verse} ${item.text}`);
						}
					}
				}
			});

		}

	handlePassage(passage);
	}

}

const handlePassageTranslation = () =>{

	if(passageTranslation == 'ESV'){
		getVerse(scripture, asv);
		setPassageTranslation('ASV');
	}
	else if(passageTranslation == 'ASV'){
		getVerse(scripture, tagalog);
		setPassageTranslation('Tagalog');
	}
	else if(passageTranslation  == 'Tagalog'){
		getVerse(scripture, esv);
		setPassageTranslation('ESV');
	}
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
		case 'scripture': setScripture(text), setShow(false) ;break;
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

//For Animation of SCRIPTURE EXPANDABLE

const animatedHeight = useSharedValue(0);

const onLayout = (event) => {
	const layoutHeight = event.nativeEvent.layout.height;
		if(layoutHeight > 0 && layoutHeight !== height){
			setHeight(layoutHeight);
		}
}

const animatedStyle = useAnimatedStyle( ()=>{
	animatedHeight.value = show ? withTiming(height) : withTiming(0);

		return{
			height: animatedHeight.value,
			overflow: 'hidden',
		};
}, [show]);

//USE EFFECTS

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

}, [alertModalVisible]);

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
		<View style={{ flex: 1,margin: 0, backgroundColor: theme.colors.secondary, }} >
		
			{ !entryLoading ? (<ActivityIndicator style={[styles.flex]} size={'large'}/>) : (
				<View style={[styles.modal, {backgroundColor: theme.colors.secondary,}]}>
					
						<KeyboardAwareScrollView
							style={{ backgroundColor: theme.colors.secondary }}
							resetScrollToCoords={{ x: 0, y: 0 }}
							scrollEnabled={true}
						> 
							{/*SCRIPTURE*/}
							<View style={[styles.inputContainer, ]}>
								<Text  style={basicStyles.fonts}>
									{type === "sermon" ? "Text:" : type == "opm" ? 'OPM Passage:' : 'Scripture:' }
								</Text>
								
								<TouchableOpacity style={{padding: 10, backgroundColor:'#bfbfbf', borderRadius: 5, justifyContent: 'space-between', flexDirection: 'row', alignItems:'center', }} onPress={ () => handleExpandable() }>

								{/* <Text style={{fontSize: theme.fonts.fontSize}}>{scripture}</Text> */}

									<TextInput style={[{fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "scripture") } value={scripture}/>

									<TouchableOpacity onPress={ () => handlePassageTranslation() } style={{padding: 5,}}>
										<Text style={{color: theme.colors.altColor, fontSize: theme.fonts.fontSize}}>{passageTranslation}</Text>
									</TouchableOpacity>

								</TouchableOpacity>

								<Animated.View style={[animatedStyle, { borderRadius: 5, }]}>
								
									<View onLayout={onLayout} style={{width: '100%', position: 'absolute', marginTop: 10,borderRadius: 5, gap: 5, padding: 10,  backgroundColor:'#bfbfbf', flexBasis: 'auto', minHeight: 50 }}>

										{ passage.length > 0 ? 
											(
												passage?.map( (item, key) => (
													<Text key={key} style={{fontSize: theme.fonts.fontSize, marginBottom: 10}} >{item}</Text>
												))
											):
											(<Text>No Verse Found</Text>)
										}
										
									</View>
								
								</Animated.View>

							</View>

							<View style={[styles.inputContainer,]}>
								<Text  style={basicStyles.fonts}>{type === "sermon" ? "Theme:": type == "opm" ? 'OPM Theme:' : 'Title:'}</Text>
								<TextInput style={[styles.input, {minHeight: 50, fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "title") } value={title} multiline={true} />
							</View>

							{ entryType != "journal" ?
								(
									<View style={styles.inputContainer}>
									<Text  style={basicStyles.fonts}>Question:</Text>
									<TextInput style={[styles.input, {minHeight: 50, fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "question") } value={question} multiline={true} />
									</View>
								) : null
							}
							<View style={[styles.inputContainer, {}]}>
								<Text  style={basicStyles.fonts}>{type === "sermon" ? "Sermon Points:": type == "opm" ? 'Key Points:' : 'Observation:'}</Text>
								<TextInput 
									style={[styles.input, { fontSize: theme.fonts.fontSize}]} 
									editable 
									onChangeText={ text => handleChangeText(text, "observation") } 
									value={observation}  
									multiline={true} 	
									
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text  style={basicStyles.fonts}>{type === "sermon" ? "Recommendations:": type == "opm" ? 'Recommendations:' : 'Application:'}</Text>
								<TextInput style={[styles.input,{ fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "application")} value={application}  multiline={true} />
							</View>

							<View style={styles.inputContainer} >
								<Text style={basicStyles.fonts}>{type == "sermon" ? "Reflection:": type == "opm" ? 'Reflection/Realization:' : 'Prayer:'}</Text>
								<TextInput style={[styles.input, { fontSize: theme.fonts.fontSize}]} editable onChangeText={ text => handleChangeText(text, "prayer") } value={prayer}  multiline={true} />

								{/* <View style={[styles.flex,{paddingTop: 20,}]}>
									<TouchableOpacity 
										style={[styles.border, {  backgroundColor: theme.colors.secondary, borderColor: theme.colors.borderColor,alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', padding: 10, gap: 5, width: 100,elevation: 5 }]} 
										onPress={ () => handlePassageVisible(true) }
									>
									<FontAwesome5 name="bible" size={24} color={theme.colors.textColor} />
									<Text style={{color: theme.colors.textColor , fontSize: theme.fonts.fontSize}}>Bible</Text>

									</TouchableOpacity>
								</View> */}

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