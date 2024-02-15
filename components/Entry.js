import { Text, View, TextInput, Pressable, TouchableOpacity, ScrollView, KeyboardAvoidingView, Share, AppState} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('_journal_database.db');
import PassageBottomSheet from './PassageBottomSheet';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AlertModal from './AlertModal';
import styles from '../styles/entryStyle';
import { useIsFocused } from '@react-navigation/native';

const BackConfirmationModal = ({visible, handleModal, globalStyle, updateEntry, }) => {

const handleSave = () =>{
    handleModal(false);
}
const handleClose = () =>{
    handleModal(false);
}
return (
<>
    <Modal
    isVisible={visible}
    coverScreen={true}
    style={{ flex: 1, margin: 0 }}
    animationIn="fadeIn"
    animationOut="fadeOut"
    onBackdropPress={() => handleModal(false)}
    onBackButtonPress={handleModal}
    >
        <View style={[styles.flex]}>
            <View
            style={{
                backgroundColor: globalStyle?.bgBody,
                width: "50%",
                height: "20%",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                borderColor: globalStyle?.borderColor,
                borderWidth: 1,
            }}
            >
            <Text style={{ textAlign: "center", color: globalStyle?.color }}>
                Are you sure want to exit?
            </Text>
            <View
            style={{
                margin: 5,
                alignItems: "center",
                flexDirection: "row",
                }}
            >
            <TouchableOpacity
                style={[
                    styles.deleteButtons,
                    {
                    borderColor: globalStyle?.borderColor,
                    borderWidth: 1,
                    backgroundColor: globalStyle?.bgHeader,
                    },
                ]}
                onPress={()=>handleModal(false)}
            >
                <Text style={{ color: globalStyle?.color }}>NO</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                styles.deleteButtons,
                    {
                    backgroundColor: "red",
                    borderColor: globalStyle?.borderColor,
                    borderWidth: 1,
                    },
                ]}
                onPress={() => handleClose()}
            >
            <Text style={{ color: "white" }}>YES</Text>
            </TouchableOpacity>
            </View>
            </View>
            </View>
        </Modal>
    </>
);
}

const DeleteConfirmationModal = ({visible, deleteEntry, handleModal, globalStyle}) => {

const handleDelete = () =>{
    deleteEntry();
    handleModal();
}
return (
    <>
        <Modal
        isVisible={visible}
        coverScreen={true} 
        style={{flex:1, margin: 0}}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => handleModal()}
        onBackButtonPress={handleModal}
        >

        <View
            style={[styles.flex]}
        >
            <View style={{
            backgroundColor: globalStyle?.bgBody, 
            width: "50%", 
            height:"20%",
            padding: 20,
            borderRadius: 10,
            alignItems:'center',
            flexDirection:'column',
            justifyContent:"center",
            borderColor: globalStyle?.borderColor,
            borderWidth: 1,
            }}>

            <Text style={{textAlign: 'center', color: globalStyle?.color}}>Are you sure want to delete this Enrty?</Text>
            <View style={{
            margin:5,
            alignItems:'center',
            flexDirection:'row'}}>
            <TouchableOpacity style={[styles.deleteButtons,{ borderColor: globalStyle?.borderColor, borderWidth: 1, backgroundColor: globalStyle?.bgHeader}]} onPress={handleModal}>
                <Text style={{ color: globalStyle?.color}} >Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.deleteButtons, {backgroundColor: 'red', borderColor: globalStyle?.borderColor,  borderWidth: 1,}]} onPress={() => handleDelete()}>
                <Text style={{color: 'white'}}>Delete</Text>
            </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    </>
);
}

const MenuModal = ({visible, handleCloseModal, deleteEntry, status, entry, type, handleStatus, globalStyle}) => {
const [deleteModal, setDeleteModal] = useState(false);

const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
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
        handleDeleteModal();
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
            style={styles.menuItems}  
            > 
                <View style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>
                    <Feather name="archive" size={20} color={globalStyle?.color} />        
                    <Text style={{fontSize: 18, color: globalStyle?.color}}>Archive</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.menuItems}  
            onPress={() => handlePressBtn("Delete")} 
            > 
            <View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>   
                <Feather name="trash" size={20} color="#FA5252" />               
                <Text style={{color: '#FA5252', fontSize: 18}}>Delete</Text>
            </View>
            </TouchableOpacity>

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

        <DeleteConfirmationModal visible={deleteModal} deleteEntry={deleteEntry} handleModal={handleDeleteModal}  globalStyle={globalStyle} />
    </>
);
}

export default function Entry({navigation, route, globalStyle }){

const {entry, verse, entryType, index, itemId} = route.params;
const isFocused = useIsFocused();
//for showing modals
const [dateModalVisible, setDateModalVisible] = useState(false);
const [menuVisible, setMenuVisible] = useState(false);

//data fields
const [id, setId] = useState(0);
const [dataId, setDataId] = useState(0);

const [date, setDate] = useState("");
const [title, setTitle] = useState("");
const [scripture, setScripture] = useState("");
const [observation, setObservation] = useState("");
const [application, setApplication] = useState("");
const [prayer, setPrayer] = useState("");
const [question, setQuestion] = useState("");
const [type, setType] = useState(entryType);
const [status, setStatus] = useState("");
const [month, setMonth] = useState("");
const [day, setDay] = useState("");
const [passage, setPassage] = useState(""); 

const [currentEntry, setCurrentEntry] = useState(entry);

const [currentState, setCurrentState] = useState("add");

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

    if( currentEntry?.scripture !== scripture || currentEntry?.title !== title || currentEntry?.question !== question || currentEntry?.observation !== observation || currentEntry?.application !== application || currentEntry?.prayer !== prayer){   
        setMessage("Entry Updated");
        setAlertModalVisible(item);
    } else if(currentEntry?.status !== status){
        setMessage(status === "#8CFF31" ? "Marked as done" : "Unmarked as done" );
        setAlertModalVisible(item);
    }
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


const handleMenuVisible = ()=>{
    setMenuVisible(!menuVisible);
}

const handleStatus = (item) =>{
    setStatus(item);
    handleAlertModalVisible(true);
}

const cleanStates = () =>{
    setDate("");
    setTitle("");
    setQuestion("");
    setScripture("");
    setObservation("");
    setApplication("");
    setPrayer("");
    setStatus("");
}

const handleDelete = () => {

    if(type == "opm"){
        db.transaction((tx) => {
            tx.executeSql(
            `DELETE FROM entries WHERE id = ?;`,
            [id],
            (_, result) => {
            console.log('Data deleted successfully');
            },
            (_, error) => {
            console.error('Error deleting data:', error);
            }
            );
        });
    }else{
        db.transaction((tx) => {
            tx.executeSql(
            `DELETE FROM entries WHERE dataId = ?;`,
            [dataId],
            (_, result) => {
            console.log('Data deleted successfully');
            },
            (_, error) => {
            console.error('Error deleting data:', error);
            }
            );
        });
    }
    if(route.name == "Home"){
        fetchAllData();
    }
}

//updating the entry
const updateEntry = () => {
    
    if(type=='opm'){
        db.transaction((tx) => {
            tx.executeSql(
            'UPDATE entries SET date = ?, title = ?, question = ?, scripture = ?, observation = ?, application = ?, prayer = ?, status = ?, modifiedDate = ? WHERE id = ?;',
            [date, title, question, scripture, observation, application, prayer, status, Date.now(), id ],
            (_, result) => {
            console.log('Data updated successfully');
            },
            (_, error) => {
            console.error('Error updating data:', error);
            }
            );
        });
    }else{
        console.log(application);
        db.transaction((tx) => {
            tx.executeSql(
            'UPDATE entries SET date = ?, title = ?, question = ?, scripture = ?, observation = ?, application = ?, prayer = ?, status = ?, modifiedDate = ? WHERE dataId = ?;',
            [date, title, question, scripture, observation, application, prayer, status, Date.now(), dataId ],
            (_, result) => {
            console.log('Data updated successfully');
            },
            (_, error) => {
            console.error('Error updating data:', error);
            }
            );
        });
    }
}

const handleEntry = () => {
    if(currentState == "add"){
        saveEntry();
    }else{
        updateEntry();
    }
    
    handleAlertModalVisible(true);
}

// gets the item from present data

const setItems = () =>{
    setId(currentEntry?.id);
    setDataId(currentEntry?.dataId);
    setDate(currentEntry?.date);
    setTitle(currentEntry?.title);
    setScripture(currentEntry?.scripture);
    setQuestion(currentEntry?.question);
    setObservation(currentEntry?.observation);
    setApplication(currentEntry?.application);
    setPrayer(currentEntry?.prayer);
    setType(currentEntry?.type);
    setStatus(currentEntry?.status);
    setMonth(currentEntry?.month);
    setDay(currentEntry?.day);
}
const saveEntry = () => {
    // adding entry to db
    let isEmpty = [date, title, question, observation, application, prayer];
    if(!isEmpty.every((item)=>item=="")){

    if(type=="journal" || type == "sermon"){
        db.transaction((tx) => {
            tx.executeSql(
            'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
            [date, title, question, scripture, observation, application, prayer, '#8CFF31', type, Date.now(), itemId, months[index]],
            (tx, results) => {
                console.log("Success added entry to DB!!!");
                setCurrentState("update");
            },
            (error) => {
            // Handle error
            console.log(error);
            }
            );
        });
    }else{
        db.transaction((tx) => {
            tx.executeSql(
            'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
            [date, title, question, scripture, observation, application, prayer,  '#8CFF31', type, Date.now(), null, months[index]],
            (tx, results) => {
            console.log("Success!!!");
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

useEffect(() => {
if(entryType == 'journal'){
    setScripture(verse);
}
}, [verse, scripture]);

useEffect(() => { 
    if(currentState == "update"){
        setItems();
    }
    
}, [currentEntry, currentState]);

useEffect(() => {
    if(alertModalVisible == true){
        console.log("work??")
        const interval = setTimeout(() => {
            // After 3 seconds set the show value to false
            handleAlertModalVisible(false);
            currentEntry.date = date;
            currentEntry.scripture = scripture;
            currentEntry.title = title;
            currentEntry.question = question;
            currentEntry.observation = observation;
            currentEntry.application = application;
            currentEntry.prayer = prayer;
            currentEntry.status = status;
        }, 1000)

        return () => {
        clearTimeout(interval)
        }
    }

}, [alertModalVisible, date, title, question, scripture, observation, application, prayer, status, currentEntry ])


//for drawer when pressed
useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {

    if (appState.current.match(/inactive|background/) &&
    nextAppState === 'active') {
        return;
    }else{
        if(isFocused === true){
            updateEntry();
            currentEntry.date = date;
            currentEntry.scripture = scripture;
            currentEntry.title = title;
            currentEntry.question = question;
            currentEntry.observation = observation;
            currentEntry.application = application;
            currentEntry.prayer = prayer;
            currentEntry.status = status;
        }
    }

    appState.current = nextAppState;
    setAppCurrentState(appState.current);
    });

    return () => {
    subscription.remove();
    };
}, [isFocused, date, title, question, scripture, observation, application, prayer, status, currentEntry]);

//HEADER
useEffect(() => {
    navigation.setOptions({
        headerStyle: {backgroundColor: globalStyle?.bgHeader},
        headerTitle: () => (
            <Text style={{fontSize: 20, color:globalStyle?.color}}>{type == "sermon" ? "Sermon Note" : type == "journal" ? "Journal Entry" : "OPM Reflection"}</Text>
        ),
        headerRight: () => (

            <View style={{flexDirection: 'row', alignItems: "center", gap:10}}>
                <TouchableOpacity onPress={ () => handleEntry()}>
                    {/* <MaterialCommunityIcons name="content-save-edit-outline" size={30} color={globalStyle?.color}/> */}
                    <Text style={{color: globalStyle?.settingsColor}} > SAVE </Text>
                </TouchableOpacity>

                {currentState == "update" ? (
                    <TouchableOpacity onPress={() => handleMenuVisible()}>
                        <Feather name="more-vertical" size={25} color={globalStyle?.color} />
                    </TouchableOpacity>
                ) : null}
            
            </View>

        ),
        
    });
}, [navigation, type, handleEntry, currentState]);


return (
    <>

        <View style={{flex:1, margin: 0}} >
        
            {/*FORMS*/}
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
                        style={[styles.border, {  backgroundColor: globalStyle?.bgHeader, borderColor: globalStyle?.borderColor ,alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'column', padding: 10, gap: 5, width: 200 }]} 
                        onPress={ () => handlePassageVisible(true) }
                        >

                        <Entypo name="chevron-thin-up" size={24} color={globalStyle?.color} />
                        
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>

            
            </View>

            </ScrollView>

            </View>

            <AlertModal message={message} visible={alertModalVisible} globalStyle={globalStyle} />
            
            <PassageBottomSheet visible={passageModalVisble} handleModal={handlePassageVisible} globalStyle={globalStyle} scripture={scripture} type={entryType} handlePassage={handlePassage} />
        

        </View>

        <BackConfirmationModal message={message} visible={backConfirmVisible} handleModal={handleBackConfirmModal}  updateEntry={updateEntry} globalStyle={globalStyle}  />
    
        <MenuModal visible={menuVisible} handleCloseModal={handleMenuVisible} deleteEntry={handleDelete} id={id} status={status} handleStatus={handleStatus} entry={entryToBeShared} type={entryType}  globalStyle={globalStyle} updateEntry={updateEntry} />
        
    </>
)

}