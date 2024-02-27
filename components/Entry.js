import { Text, View, TextInput, Pressable, TouchableOpacity, ScrollView, KeyboardAvoidingView, Share, AppState, ActivityIndicator} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import * as SQLite from 'expo-sqlite';

// Icons
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

// Navigation
import { useIsFocused } from '@react-navigation/native';

//Component Imports
import PassageBottomSheet from './PassageBottomSheet';
import AlertModal from './AlertModal';
import ConfirmationModal from './ConfirmationModal';
import styles from '../styles/entryStyle';

const db = SQLite.openDatabase('_journal_database.db');
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const MenuModal = ({visible, handleCloseModal, status, entry, type, handleStatus, globalStyle, handleSettingState, settingState}) => {

    const [confirmationModal, setConfirmationModal] = useState(false);
    const [confirmationTitle, setConfirmationTitle] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState("");

    const handleTrashModal = (item) => {
        setConfirmationModal(item);
        if(item == true){
            if(settingState == "trash"){
                setConfirmationTitle("Restore");
                setConfirmationMessage("Are you sure want to restore the entry from trash?");
    
            }else{
                setConfirmationTitle("Trash");
                setConfirmationMessage("Are you sure want to move the entry to trash?");
    
            }
        }
    } 

    const handleArchiveModal = (item) => {
        setConfirmationModal(item);
        if(item == true){
            if(settingState == "archive"){
                setConfirmationTitle("Unarchive");
                setConfirmationMessage("Are you sure want to remove the entry from archive?");
            }else{
                setConfirmationTitle("Archive");
                setConfirmationMessage("Are you sure want to move the entry to archive?");
            }
        }
    
    } 

    const handleDeleteModal = (item) => {
        setConfirmationModal(item);
        if(item == true){
            setConfirmationTitle("Delete");
            setConfirmationMessage("Are you sure want to permanently delete the entry?");
        }

    } 

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
            handleDeleteModal(true);
        }
        else if(item == "Archive"){
            handleArchiveModal(true);
        }
        else if(item == "Trash"){
            handleTrashModal(true);
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
            <View style={[styles.menuPopup, {backgroundColor: globalStyle?.bgHeader}]} >

            <TouchableOpacity 
                style={[styles.menuItems]}  
                onPress={() => handlePressBtn(status)} 
            > 
            <View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}> 
                <AntDesign name="checksquareo" size={20} color={globalStyle?.color} />        
                <Text style={{fontSize: 18,  color: globalStyle?.color}}>{status === "#8CFF31" ? "Unmark as done" : "Mark as done"}</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => handlePressBtn("Archive")} 
                style={styles.menuItems}  
            > 
                <View style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>
                    <Feather name="archive" size={20} color={globalStyle?.color} />        
                    <Text style={{fontSize: 18, color: globalStyle?.color}}>{settingState == "archive" ? "Unarchive" : "Archive"}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.menuItems}  
            onPress={() => handlePressBtn("Trash")} 
            > 
            <View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}> 
                {settingState == "trash" ? 
                (    <MaterialIcons name="restore" size={24} color={globalStyle?.color} />) 
                :
                ( <Feather name="trash" size={20} color={globalStyle?.color} /> )}
                <Text style={{color:  globalStyle?.color, fontSize: 18}}>{settingState == "trash" ? "Restore" : "Trash"}</Text>
            </View>
            </TouchableOpacity>

            {settingState == "trash" ? (
                <TouchableOpacity 
                    style={styles.menuItems}  
                    onPress={() => handlePressBtn("Delete")} 
                > 
                <View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>   
                    <Feather name="trash" size={20} color="#FA5252" />          
                    <Text style={{color: '#FA5252', fontSize: 18}}>Delete</Text>
                </View>
                </TouchableOpacity>

            ) : null }

            <TouchableOpacity 
                style={[styles.menuItems, {borderBottomColor: 'transparent'}]}  
                onPress={() => handlePressBtn("Share")} 
            > 
                <View style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>
                    <Feather name="share-2" size={20} color={globalStyle?.color} />        
                    <Text style={{fontSize: 18, color: globalStyle?.color}}>Share</Text>
                </View>
            </TouchableOpacity>

            </View>
        </View>
        </Modal>

        {/* Modals */}

        {/*Trash*/}
        <ConfirmationModal visible={confirmationModal} title={confirmationTitle} message={confirmationMessage} settingState="trash" handleSettingState={handleSettingState} handleModal={handleTrashModal} globalStyle={globalStyle} />
        
        {/*Delete*/}
        <ConfirmationModal visible={confirmationModal} title={confirmationTitle} message={confirmationMessage} settingState="delete" handleSettingState={handleSettingState} handleModal={handleDeleteModal} globalStyle={globalStyle} />
        
        {/*Archive*/}
        <ConfirmationModal visible={confirmationModal} title={confirmationTitle} message={confirmationMessage} settingState="archive" handleSettingState={handleSettingState} handleModal={handleArchiveModal} globalStyle={globalStyle} />


    </>
);
}

export default function Entry({navigation, route, globalStyle }){

const {entryId, verse, entryType, index, itemId, state} = route.params;
const isFocused = useIsFocused();
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

const [backConfirmVisible, setBackConfirmVisible] = useState(false);

const [disableSave, setDisableSave] = useState(false);

const handleBackConfirmModal = (item) =>{

    if( currentEntry?.scripture !== scripture || currentEntry?.title !== title || currentEntry?.question !== question || currentEntry?.observation !== observation || currentEntry?.application !== application || currentEntry?.prayer !== prayer || currentEntry?.status !== status ){   
        setBackConfirmVisible(item);
    }

}

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

    if (currentState == "add"){
        setMessage("Entry Saved");
        
    } 
    if (currentState == "update"){
        setMessage("Entry Updated");
        
    }
    setAlertModalVisible(item);
}

// HANDLE FUNCTIONS
const handleDateModal = () => {
    setDateModalVisible(!dateModalVisible)
}

// when closed is pressed
const handleBackButton = () =>{
    if( currentEntry?.scripture !== scripture || currentEntry?.title !== title || currentEntry?.question !== question || currentEntry?.observation !== observation || currentEntry?.application !== application || currentEntry?.prayer !== prayer || currentEntry?.status !== status ){   

        updateEntry();
        handleModal(false);
    }else{
        handleModal(false);

    }
    if(route.name == "Home" ){
        fetchAllData();
    }
}

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
        'UPDATE entries SET date = ?, title = ?, question = ?, scripture = ?, observation = ?, application = ?, prayer = ?, status = ?, modifiedDate = ?, settingState = ? WHERE dataId = ?;',
        [date, title, question, scripture, observation, application, prayer, status, Date.now(), settingState, dataId ],
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

}

//saving entry
const saveEntry = () => {
    // adding entry to db
    let isEmpty = [date, title, question, observation, application, prayer];
    if(!isEmpty.every((item)=>item=="")){

        if(type=="journal" || type == "sermon"){
            db.transaction((tx) => {
                tx.executeSql(
                'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month, settingState) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [date, title, question, scripture, observation, application, prayer, '#8CFF31', type, Date.now(), itemId, months[index], "normal"],
                (tx, results) => {
                    console.log("Success added entry to DB!!!");
                    fetchEntry(itemId);
                    setCurrentState("update");
                    setDisableSave(false);
                },
                (error) => {
                // Handle error
                console.log(error);
                }
                );
            });
        }
        else{
            db.transaction((tx) => {
                tx.executeSql(
                'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month, settingState) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [date, title, question, scripture, observation, application, prayer,  '#8CFF31', type, Date.now(), dataId, months[index], "normal"],
                (tx, results) => {
                console.log("Success!!!");
                    fetchEntry(dataId);
                    setCurrentState("update");
                    setDisableSave(false);

                },
                (error) => {
                // Handle error
                console.log(error);
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
            },
            (_, error) => {
                console.log("fetch error: ", error)
            }
        );
    });
}

const setItems = (currentEntry) => {
    setDataId(currentEntry?.dataId);
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

const checker = () =>{
    idChecker();
    let num = "opm"+Math.floor(Math.random() * 300);
    if(!entriesId.includes(num)){
        return setDataId(num);
    }else{
        return checker();
    }
}

const idChecker = () =>{
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM entries;",
        [],
            (_, result) => {
                const rows = result.rows;
                let dataArray2 = [];
                for (let i = 0; i < rows.length; i++) {
                    const item = rows.item(i);
                    dataArray2.push(item.dataId);
                }
                setEntriesId(dataArray2);
            
            },
            (_, error) => {
                console.log("id checker error: " + error)
            }
        );
    });
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

useEffect(() => {
    if(currentState == "opm"){
        idChecker();
        checker();
    }
}, [])

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

//HEADER
useEffect(() => {
    navigation.setOptions({
        headerStyle: {backgroundColor: globalStyle?.bgHeader},
        headerTitle: () => (
            <Text style={{fontSize: 20, color:globalStyle?.color}}>{entryType == "sermon" ? "Sermon Note" : entryType == "journal" ? "Journal Entry" : "OPM Reflection"}</Text>
        ),
        headerRight: () => (

            <View style={{flexDirection: 'row', alignItems: "center", gap:10}}>
                <TouchableOpacity disable={disableSave} onPress={ () => handleEntry()}>
                    {/* <MaterialCommunityIcons name="content-save-edit-outline" size={30} color={globalStyle?.color}/> */}
                    <Text style={{color: globalStyle?.settingsColor}}>SAVE</Text>
                </TouchableOpacity>

                {currentState == "update" ? (
                    <TouchableOpacity onPress={() => handleMenuVisible()}>
                        <Feather name="more-vertical" size={25} color={globalStyle?.color} />
                    </TouchableOpacity>
                ) : null}
            
            </View>

        ),
        
    });
}, [navigation, entryType, handleEntry, currentState]);


return (
    <>

        <View style={{flex:1, margin: 0}} >
        
            {/*FORMS*/}
            { entryLoading ? (
                <View style={[styles.modal, {backgroundColor: globalStyle?.bgBody,}]}>

                <ScrollView style={{flex: 1}} >
    
                <View style={[styles.flex]}> 
            
                    <View style={styles.touchableContainer}>
                
                        {/*DATE*/}
                        <View style={styles.inputSubContainer}>
                            <Text  style={{color:globalStyle?.color,  fontSize: globalStyle?.fontSize}}>Date:</Text>
                            <Pressable style={styles.touchable} onPress={handleDateModal}>
                            <TextInput
                            style={{color: 'black', fontSize: globalStyle?.fontSize}}
                            value={date}
                            onChangeText={handleChangeDate}
                            editable={false}
                            />
                            </Pressable>
                        </View>
    
                        {/*DATE MODAL?*/}
                        { dateModalVisible ? (<DateTimePicker mode="date" display="spinner" value={entryDate} onChange={onChangeDate}/>) : null }
    
                        {/*SCRIPTURE*/}
                        <View style={styles.inputSubContainer}>
                            <Text  style={{color:globalStyle?.color,  fontSize: globalStyle?.fontSize}}>{type === "sermon" ? "Text:" : type == "opm" ? 'OPM Passage:' : 'Scripture:' }</Text>
    
                            <TextInput style={[styles.touchable, { fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "scripture") } value={scripture}/>
    
                        </View>
    
                    </View>
    
                    {/*TITLE*/}
                    <View style={styles.inputContainer}>
                        <Text  style={{color:globalStyle?.color,  fontSize: globalStyle?.fontSize}}>{type === "sermon" ? "Theme:": type == "opm" ? 'OPM Theme:' : 'Title:'}</Text>
                        <TextInput style={[styles.input, {minHeight: 50, fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "title") } value={title} multiline={true} />
                    </View>
    
                    {/*QUESTION*/}
                    { entryType != "journal" ?
                        (
                            <View style={styles.inputContainer}>
                            <Text  style={{color:globalStyle?.color, fontSize: globalStyle?.fontSize}}>Question:</Text>
                            <TextInput style={[styles.input, {minHeight: 50, fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "question") } value={question} multiline={true} />
                            </View>
                        ) : null
                    }
    
                    {/*OBSERVATION*/}
                    <View style={styles.inputContainer}>
                        <Text  style={{color:globalStyle?.color,  fontSize: globalStyle?.fontSize}}>{type === "sermon" ? "Sermon Points:": type == "opm" ? 'Key Points:' : 'Observation:'}</Text>
                        <TextInput style={[styles.input, { fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "observation") } value={observation}  multiline={true} />
                    </View>
    
                    {/*APPLICATION*/}
                    <View style={styles.inputContainer}>
                        <Text  style={{color:globalStyle?.color,  fontSize: globalStyle?.fontSize}}>{type === "sermon" ? "Recommendations:": type == "opm" ? 'Recommendations:' : 'Application:'}</Text>
                        <TextInput style={[styles.input,{ fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "application")} value={application}  multiline={true} />
                    </View>
    
                    {/*PRAYER*/}
                    <KeyboardAvoidingView behavior='padding' style={styles.inputContainer} >
                        <Text style={{color:globalStyle?.color , fontSize: globalStyle?.fontSize}}>{type == "sermon" ? "Reflection:": type == "opm" ? 'Reflection/Realization:' : 'Prayer:'}</Text>
                        <TextInput style={[styles.input, { fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "prayer") } value={prayer}  multiline={true} />
    
                        <View style={[styles.flex,{paddingTop: 20,}]}>
                            <TouchableOpacity 
                            style={[styles.border, {  backgroundColor: globalStyle?.bgHeader, borderColor: globalStyle?.borderColor ,alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', padding: 10, gap: 5, width: 100,elevation: 5 }]} 
                            onPress={ () => handlePassageVisible(true) }
                            >
                            {/* <Entypo name="chevron-thin-up" size={24} color={globalStyle?.color} /> */}
                            <FontAwesome5 name="bible" size={24} color={globalStyle?.color} />
                            <Text style={{color:globalStyle?.color , fontSize: globalStyle?.fontSize}}>Bible</Text>
          
                            </TouchableOpacity>
                        </View>
    
                    </KeyboardAvoidingView>
    
                
                </View>
    
                </ScrollView>
    
                </View>

            ) : (<ActivityIndicator style={styles.flex} size={'large'}/>) }
            

            <AlertModal message={message} visible={alertModalVisible} globalStyle={globalStyle} />
            
            <PassageBottomSheet visible={passageModalVisble} handleModal={handlePassageVisible} globalStyle={globalStyle} scripture={scripture} type={entryType} handlePassage={handlePassage} />
        

        </View>

        {/* <BackConfirmationModal message={message} visible={backConfirmVisible} handleModal={handleBackConfirmModal}  updateEntry={updateEntry} globalStyle={globalStyle}  /> */}
    
        <MenuModal visible={menuVisible} handleCloseModal={handleMenuVisible} deleteEntry={deleteEntry} status={status} handleStatus={handleStatus} entry={entryToBeShared} type={entryType}  globalStyle={globalStyle} handleSettingState={handleSettingState}  settingState={settingState}/>
        
    </>
)

}