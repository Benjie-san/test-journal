import { Text, View, TextInput, TouchableOpacity, Keyboard, AppState, ActivityIndicator, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as SQLite from 'expo-sqlite';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from 'react-native-paper';

// Navigation
import { useIsFocused } from '@react-navigation/native';

// JSON bibles
import asv from '../constants/asv.json';
import esv from '../constants/esv.json';
import tagalog from '../constants/tagab.json';

// Icons
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

//Component Imports
import MenuModal from './entryComponents/MenuModal';
import AlertModal from './entryComponents/AlertModal'; // small box that shows up for informing if saved or updated
import styles from '../styles/entryStyle';

const db = SQLite.openDatabase('_journal_database.db');
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const Input = ({type, textTitleParam, inputPlaceHolderParam,changeText, param, item, minHeight }) => {
	const [isFocused, setIsFocused] = useState(false);
	const theme = useTheme(); //for theme

	const basicStyles = {
		fonts:{
			color: theme.colors.textColor,  
			fontSize: theme.fonts.fontSize,
			fontWeight: 'bold',
			
		}
	}
	return(
		<View style={[styles.inputContainer,{gap: 5,}]}>
			<Text  style={[basicStyles.fonts,]}>{type === "sermon" ? textTitleParam[0]: type == "opm" ? textTitleParam[1] : textTitleParam[2]}</Text>
			<TextInput
				onFocus={() => setIsFocused(true)}
				style={[styles.input, {
					borderColor: isFocused ? theme.colors.altColor : "#cccccc",
					color: theme.colors.textColor,
					minHeight: minHeight,
					fontSize: theme.fonts.fontSize,
					backgroundColor: theme.colors.primary,
					textAlignVertical: param == "title" ? 'center' : param == "question" ? "center" : "top"}
				]} 
				placeholder={type === "sermon" ? 
					inputPlaceHolderParam[0]:  
					type == "opm" ? 
					inputPlaceHolderParam[1] : 
					inputPlaceHolderParam[2]
				}
				placeholderTextColor="#cccccc"
				editable onChangeText={ text => changeText(text, param) } 
				value={item} 
				multiline={true} 
			/>
		</View>
	);
}

export default function Entry({navigation, route }){
const theme = useTheme(); //for theme
const isFocused = useIsFocused(); // checking for when entry is focused on the screen
const {entryId, verse, entryType, index, itemId, state, entry} = route.params;

//themes
const basicStyles = {
	fonts:{
		color: theme.colors.textColor,  
		fontSize: theme.fonts.fontSize,
	}
}

//for showing modals
const [menuVisible, setMenuVisible] = useState(false);

//data fields
const [id, setId] = useState(0);
const [dataId, setDataId] = useState(0);

const [date, setDate] = useState(new Date().toDateString());
const [scripture, setScripture] = useState(verse);
const [title, setTitle] = useState();
const [observation, setObservation] = useState("");
const [application, setApplication] = useState("");
const [prayer, setPrayer] = useState("");
const [question, setQuestion] = useState("");

const [type, setType] = useState(entryType);
const [status, setStatus] = useState("");

const [passage, setPassage] = useState(""); 
const [passageTranslation, setPassageTranslation] = useState("ESV")

const [currentState, setCurrentState] = useState(state); //handling state in saving
const [settingState, setSettingState] = useState(""); // for setting the state in archive

//const [entriesId, setEntriesId] = useState([]);

const [entryLoading, setEntryLoading] = useState(true);

const changed = useRef(false); // checking if there are changes in the text inputs

//for animatiuion of expandable
const [height, setHeight] = useState(0);
const [show, setShow] = useState(false);

//for system buttons
const appState = useRef(AppState.currentState);
const [appCurrentState, setAppCurrentState] = useState(appState.current);


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

		if( scripture.indexOf(':') > -1 ){ // clever way to find a missing character in a string
			
			splitVerse = scripture.split(":");
			let regex2 = /Psalms|Psalm/g;
			let regexFound = splitVerse[0].match(regex2) // on an array when found
			if(regexFound == "Psalm" || regexFound == "Psalms"){
				book = splitVerse[0].slice(0, splitVerse[0].length-3).trim(); // for hundreds in chapter
				chapter = splitVerse[0].slice(splitVerse[0].length-3, splitVerse[0].length).trim();
			}else{
				book = splitVerse[0].slice(0, splitVerse[0].length-2).trim(); // for tens in chapter limit is 99
				chapter = splitVerse[0].slice(splitVerse[0].length-2, splitVerse[0].length).trim();
			}

			let checkStartVerse = splitVerse[1].split("-");
			if( checkStartVerse[0] !== splitVerse[1]){
				range = splitVerse[1].split("-"); //range of the verse
				start = parseInt(range[0]); // the number start of the verse
				end = parseInt(range[1]); // the number at the end of the verse range
			} else{
				start = parseInt(splitVerse[1]);
			
			}
			if(book == 'Psalm'){
				book = 'Psalms'
			}

			//outputs the verses in range
			translation.verses.forEach(function (item) {
				if(item.book_name === book && item.chapter === parseInt(chapter) ){
		
					if(end !== 0){
							
						if(item.verse >= start && item.verse <= end){
							passage.push(`${item.verse} ${item.text}`);
						}
					} else if(start == null && end == null){
						passage.push(`${item.chapter}`);
					}	
					else{
						if (item.verse == start) {
							passage.push(`${item.verse} ${item.text}`);
						}
					}
				}
			});

		}
		else{
			
			let splitScripture = scripture.split(" ");
			if(splitScripture.length == 2){
				book = splitScripture[0];
				chapter = splitScripture[1];
			}else if (splitScripture.length == 3){
				book = splitScripture[0]+" "+splitScripture[1];
				chapter = splitScripture[2];
			}
			//outputs the whole chapter
			translation.verses.forEach(function (item) {
				if(item.book_name === book && item.chapter === parseInt(chapter) ){
					passage.push(`${item.verse} ${item.text}`);
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

// for alerts
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

const handleDiscardModal = (item) =>{
	setDiscardModal(item)
}


// HANDLE FUNCTIONS

// when closed is pressed


const handleChangeDate = (item) =>{
	setDate(item);
}

const handleChangeText = (text, valueFor) =>{
	changed.current = true;
	switch(valueFor){
		case 'title': setTitle(text) ;break;
		case 'question': setQuestion(text) ;break;
		case 'scripture': setScripture(text), setShow(false), setShow(true) ;break;
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

const entrySaver = (type, entryId, message) => {
	console.log(entryId)
	db.transaction((tx) => {
		tx.executeSql(
		'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month, createdDate, settingState, year ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
		[date, title, question, scripture, observation, application, prayer, '#8CFF31', type, Date.now(), parseInt(entryId), months[index], Date.now(), "normal", new Date().getFullYear()],
		(tx, results) => {
				console.log(message);
				fetchEntry(entryId);
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

//saving entry
const saveEntry = () => {
	// adding entry to db
	let isEmpty = [title, question, observation, application, prayer];
	if(!isEmpty.every((item)=>item=="")){

		if(type=="journal" || type == "sermon"){
			entrySaver(type, itemId, "Journal Entry Saved");
		}
		else{
			entrySaver(type, dataId, "OPM Entry Saved");
		}
	}

}
//fetching the entry
const fetchEntry = (id) =>{
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM entries WHERE dataId = ?;",[id],
            (_, result) => {
                const rows = result.rows;
                let dataArray = [];
                for (let i = 0; i < rows.length; i++) {
                    const item = rows.item(i);
                    dataArray.push(item);
                }
                setItems(...dataArray);
            },
            (_, error) => {
                console.log("fetch error: ", error)
            }
        );
    });
}

const setItems = (dataArray) => {
    setDataId(Number(dataArray?.dataId));
    setDate(dataArray?.date);
    setTitle(dataArray?.title);
    setScripture(dataArray?.scripture);
    setQuestion(dataArray?.question);
    setObservation(dataArray?.observation);
    setApplication(dataArray?.application);
    setPrayer(dataArray?.prayer);
    setType(dataArray?.type);
    setStatus(dataArray?.status);
    setSettingState(dataArray?.settingState);
	changed.current = false;
	setEntryLoading(false);
}

const handleEntry = () => {
    setDisableSave(true);
    if(currentState == "add"){
        saveEntry();
		handleAlertModalVisible(true);
    }
    else{
        if( changed.current){  
            updateEntry();
			handleAlertModalVisible(true);
        }
    }
    
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
			flexBasis: 'auto',
		};
}, [show, height]);

//USE EFFECTS

//getting scripture once entry is loaded
useEffect(() => {
	getVerse(scripture, esv);
}, [scripture]);

//for setting OPM dataId
useEffect(() => {
	let date = new Date();
    if(type == "opm"){
		setDataId( parseInt(String(date.getMonth()+1) + String(date.getDate())  + String(date.getHours())  + String(date.getMinutes())) );
    }

}, []);

// //for loading when opened
useEffect(() => {
	if(entryLoading == true){
		
		if(currentState == "update"){
			setItems(entry);
		}else{
			setEntryLoading(false);
		}
	}
}, [entry, setItems, entryLoading])


// //for loading when opened
// useEffect(() => {
//     const interval = setTimeout(() => {
//         if(entryLoading == true){
//             if(currentState == "update"){
//                 setItems(entry);
//             }else{
//                 setEntryLoading(false);
//             }
//         }       
//     }, 1000)

//     return () => {
//     clearTimeout(interval)
//     }

// }, [currentState, entryLoading, fetchEntry,]);

//for small modal
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
    nextAppState === 'active' && changed.current == false) {
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

//for back button
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

}),[navigation, changed,]);

//for hiding bottom tab
useEffect(() => {
	navigation.getParent()?.setOptions({
		tabBarStyle: {
			display: 'none',
			backgroundColor: theme.colors.primary
		}
	});
	return () => {
	navigation.getParent()?.setOptions({
		tabBarStyle: {
			display: 'flex',
			backgroundColor: theme.colors.primary
		}
	});
	}
}, [])

//HEADER
useEffect(() => {
    navigation.setOptions({
		headerShadowVisible: false,
        headerStyle: {backgroundColor: theme.colors.primary, elevation: 0,
			shadowOpacity: 0,
			borderBottomWidth: 0,},
	
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


//
console.log(entryType)
//


return (
	<>

	
	<View style={{ flex: 1,margin: 0, backgroundColor: theme.colors.primary, }} >

	{ entryLoading ? (<ActivityIndicator style={[styles.flex]} size={'large'}/>) : (
		<View style={[styles.modal, {backgroundColor: theme.colors.primary,}]}>
			
			<KeyboardAwareScrollView
				style={{ backgroundColor: theme.colors.primary }}
				resetScrollToCoords={{ x: 0, y: 0 }}
				scrollEnabled={true}
			> 
				{/*SCRIPTURE*/}
				<View style={[styles.inputContainer, {gap:5}]}>
					<Text  style={[basicStyles.fonts, {fontWeight: 'bold'}]}>
						{type === "sermon" ? "Text:" : type == "opm" ? 'OPM Passage' : 'Scripture' }
					</Text>
					
					<TouchableOpacity style={{padding: 10, backgroundColor: theme.colors.primary, borderRadius: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems:'center', borderColor: '#cccccc', borderWidth: 1,}} onPress={ () => handleExpandable() }>

						<TextInput  placeholderTextColor="#cccccc" placeholder="Enter Text here" style={[{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, }]} editable onChangeText={ text => handleChangeText(text, "scripture") } value={scripture}/>

						{ !show ? ( 
						<View >
							<Entypo name="chevron-small-up" size={18} color="#cccccc" />
							<Entypo name="chevron-small-down" size={18} color="#cccccc" />
						</View>) : 
						(<TouchableOpacity onPress={ () => handlePassageTranslation() } style={{padding: 5,}}>
							<Text style={{color: theme.colors.altColor, fontSize: theme.fonts.fontSize}}>{passageTranslation}</Text>
						</TouchableOpacity> ) }

					</TouchableOpacity>

				
					<Animated.View style={[animatedStyle, { borderRadius: 10, borderColor: show ? '#cccccc' : theme.colors.primary, borderWidth: 1,}]}>
					
						<View onLayout={onLayout} style={{width: '100%', position: 'absolute', borderRadius: 10, gap: 5, padding: 10,  backgroundColor: theme.colors.primary, flexBasis: 'auto', minHeight: 50,}}>

							{ passage.length > 0 ? 
								(
									passage?.map( (item, key) => (
										<Text key={key} style={{
											fontSize: theme.fonts.fontSize, 
											marginBottom: 0, color: 
											theme.colors.textColor}} >{item}
										</Text>
									))
								):
								(<Text>No Verse Found</Text>)
							}
							
						</View>
					
					</Animated.View>

				</View>

				{/*THEME / TITLE*/}
				<Input type={type} textTitleParam={["Theme", "OPM Theme", "Title"]}
				inputPlaceHolderParam={["Write the Theme", "Write the OPM Theme", "What is the title?"]}
				changeText={handleChangeText} param="title" item={title} minHeight={50} />

				{/*QUESTION*/}
				{ entryType != "journal" ?
					(
				
						<Input type={type} textTitleParam={["Question", "Question", "Question"]}
						inputPlaceHolderParam={["Write the Question", "Write the Question", "What is the question?"]}
						changeText={handleChangeText} param="question" item={question} minHeight={50}/>

					) : null
				}
				
				{/* OBSERVATION / SERMON POINTS */}
				<Input type={type} 
				textTitleParam={["Sermon Points", "Key Points", "Observation"]} 
				inputPlaceHolderParam={["Write the Sermon Points..", "Write the Key Points..", "What are your observations?"]}
				changeText={handleChangeText} param="observation" item={observation} minHeight={120} />

				{/*APPLICATION / RECOMMENDATIONS*/}
				<Input type={type} 
				textTitleParam={["Propositions", "Recommendations", "Application"]}
				inputPlaceHolderParam={["Write the propositions..", "Write the recommendations..", "How will you apply this?"]}
				changeText={handleChangeText} param="application" item={application} minHeight={120}/>

				{/*PRAYER / REFLECTION*/}							

				<Input type={type} 
				textTitleParam={["Reflection", "Reflection/Realization", "Prayer"]} 
				inputPlaceHolderParam={["Write your reflection..", "Enter your reflection/realization..", "Write your prayer.."]}
				changeText={handleChangeText} param="prayer" item={prayer} minHeight={120} />
			
			</KeyboardAwareScrollView>

			{/* {isKeyboardVisible ? (
				<View style={{minHeight: 50, backgroundColor: theme.colors.primary, position: 'sticky', bottom: 0}}>
					<Text style={styles.border}>TAB</Text>
					<Text>TAB</Text>
					<Text>TAB</Text>

				</View>
			) : null} */}
				
		</View>

	)
	}

		<AlertModal message={message} visible={alertModalVisible} />
		
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