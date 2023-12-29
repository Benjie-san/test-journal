import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Share, AppState} from 'react-native';
import data from '../constants/journal-data.json'
import React, {useState, useEffect, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import AntDesign from '@expo/vector-icons/AntDesign';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('_journal_2023.db');


import styles from '../styles/entryStyle'

const DeleteConfirmationModal = ({visible, deleteEntry, id, handleModal}) => {
   const handleDelete = () =>{
      deleteEntry(id);
      handleModal();
   }
   return(
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
            backgroundColor: "#fff", 
            width: "50%", 
            height:"20%",
            padding: 20,
            borderRadius: 10,
            alignItems:'center',
            flexDirection:'column',
            justifyContent:"center",
         }}>

            <Text style={{textAlign: 'center'}}>Are you sure want to delete this Enrty?</Text>
            <View style={{
            margin:5,
            alignItems:'center',
            flexDirection:'row'}}>
            <Pressable style={[styles.deleteButtons, {borderColor: "#000", borderWidth: 1,}]} onPress={handleModal}>
               <Text>Cancel</Text>
            </Pressable>
            <Pressable  style={[styles.deleteButtons, {backgroundColor: 'red',}]} onPress={() => handleDelete()}>
               <Text style={{color: 'white'}}>Delete</Text>
            </Pressable>
            </View>
         </View>
      </View>
      </Modal>
   </>
);
}

const MenuModal = ({visible, handleCloseModal, deleteEntry, id, statusColor, status, entry, type, handleStatus}) => {
const [deleteModal, setDeleteModal] = useState(false);

const handleDeleteModal = () => {
   setDeleteModal(!deleteModal);
} 

const onShare = async () => {
   let message = "";
   if(type == "journal"){
      message =  `Date:\n${entry.date}\n\nScripture:\n${entry.scripture}\n\nTitle:\n${entry.title}\n\nObservation:\n${entry.observation}\n\nApplication:\n${entry.application}\n\nPrayer:\n${entry.prayer}\n`
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
   else if(item == "#ffad33"){
      handleStatus("#8CFF31");
      alert("Marked as done");
   }
   else if(item == "#8CFF31"){
      handleStatus("#ffad33");
      alert("Unmarked as done");
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
         <View style={styles.menuPopup} >

            <TouchableOpacity 
            style={styles.menuItems}  
            onPress={() => handlePressBtn("Share")} 
            > 
            <View style={{flexDirection: 'row', alignItems: "center"}}>
               <Image style={{width: 20, height: 20, marginRight: 10}} source={require("../assets/share.png")}/>                   
               <Text style={{fontSize: 18}}>Share</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.menuItems}  
            onPress={() => handlePressBtn("Delete")} 
            > 
            <View  style={{flexDirection: 'row', alignItems: "center"}}>   
               <Image style={{width: 25, height: 25, marginRight: 10}} source={require("../assets/trash.png")}/>                  
               <Text style={{color: '#FA5252', fontSize: 18}}>Delete</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.menuItems}  
            onPress={() => handlePressBtn(status)} 
            > 
            <View  style={{flexDirection: 'row', alignItems: "center"}}> 
               <Image style={{width: 25, height: 25, marginRight: 10}} source={require("../assets/check.png")}/>                    
               <Text style={{fontSize: 18}}>{status == "#8cff31" ? "Unmark as done" : "Mark as done"}</Text>
            </View>
            </TouchableOpacity>

         </View>
      </View>
      </Modal>

      <DeleteConfirmationModal visible={deleteModal} deleteEntry={deleteEntry} id={id} handleModal={handleDeleteModal} />
   </>
);
}

export default function DisplayEntry({visible, index, handleModal, type, handleType, currentEntry, handleEntry, fetchData, handleCurrentEntry}) {
//for showing modals
const [dateModalVisible, setDateModalVisible] = useState(false);
const [menuVisible, setMenuVisible] = useState(false);

//data fields
const [id, setId] = useState(0);
const [date, setDate] = useState("");
const [title, setTitle] = useState("");
const [scripture, setScripture] = useState("");
const [observation, setObservation] = useState("");
const [application, setApplication] = useState("");
const [prayer, setPrayer] = useState("");
const [question, setQuestion] = useState("");
const lastModified = useRef(new Date());
const [modifiedDate, setModifiedDate] = useState(lastModified.current.toString());
const [status, setStatus] = useState("");

//showing and hiding of editmode
const [editMode, setEditMode] = useState(false);
const [editModeCount, setEditModeCount] = useState(0);

//for system buttons
const appState = useRef(AppState.currentState)
const [appCurrentState, setAppCurrentState] = useState(appState.current)

//for dates
const [entryDate, setEntryDate] = useState(new Date());
const currentDate = new Date(currentEntry?.modifiedDate).toString();
const currentDay = new Date(currentDate).toLocaleDateString();
const currentTime = new Date(currentDate).toLocaleTimeString();

const entryToBeShared = {
   date: date,
   scripture: scripture,
   title: title,
   question: question,
   observation: observation,
   application: application,
   prayer: prayer,
}


// HANDLE FUNCTIONS
const handleDateModal = () => {
   setDateModalVisible(!dateModalVisible)
}
// when closed is pressed
const handleBackButton = () =>{
   if(currentEntry?.date !== date || currentEntry?.scripture !== scripture || currentEntry?.title !== title || currentEntry?.question !== question || currentEntry?.observation !== observation || currentEntry?.application !== application || currentEntry?.prayer !== prayer || currentEntry?.status !== status ){   
      setEditMode(false);
      updateEntry();
      handleModal(false);
      cleanStates();

   }else{
      handleModal(false);
      setEditMode(false);
      cleanStates();
   }
   fetchData(index);
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

const handleEditMode = () => {
   setEditModeCount(editModeCount+1);
   setEditMode(!editMode)
}

const handleMenuVisible = ()=>{
   setMenuVisible(!menuVisible);
}

const handleStatus = (item) =>{
   setStatus(item)
}

const cleanStates = () =>{
   setDate("");
   setTitle("");
   setQuestion("");
   setScripture("");
   setObservation("");
   setApplication("");
   setPrayer("");
   handleType("");
   setEditMode(0);
   handleEntry([]);
   handleCurrentEntry([]);
}

const handleDelete = (id) => {
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
   
}

//updating the entry
const updateEntry = () => {

      db.transaction((tx) => {
         tx.executeSql(
         'UPDATE entries SET date = ?, title = ?, question = ?, scripture = ?, observation = ?, application = ?, prayer = ?, status = ?, modifiedDate = ? WHERE id = ?;',
         [date, title, question, scripture, observation, application, prayer, status, modifiedDate, id ],
         (_, result) => {
            console.log('Data updated successfully');
            getItems();
         },
         (_, error) => {
            console.error('Error updating data:', error);
         }
         );
      });
   // }
}

// gets the item from present data
const getItems = () => {
   setId(currentEntry?.id);
   setDate(currentEntry?.date);
   setTitle(currentEntry?.title);
   setScripture(currentEntry?.scripture);
   setQuestion(currentEntry?.question);
   setObservation(currentEntry?.observation);
   setApplication(currentEntry?.application);
   setPrayer(currentEntry?.prayer);
   setModifiedDate(currentEntry?.modifiedDate);
   setStatus(currentEntry?.status);
}


useEffect(() => {
   getItems();
}, [currentEntry])

// EDIT MODE
useEffect(() => {
   if(editMode == true && editModeCount > 1){
      if(currentEntry?.date !== date || currentEntry?.scripture !== scripture || currentEntry?.title !== title || currentEntry?.question !== question || currentEntry?.observation !== observation || currentEntry?.application !== application || currentEntry?.prayer !== prayer || currentEntry?.status !== status ){
         setModifiedDate(new Date().toString());
         updateEntry();
         currentEntry.date = date;
         currentEntry.scripture = scripture;
         currentEntry.title = title;
         currentEntry.question = question;
         currentEntry.observation = observation;
         currentEntry.application = application;
         currentEntry.prayer = prayer;
         currentEntry.status = status;
         currentEntry.modifiedDate = modifiedDate;
         
      }
   }

}, [date, title, question, scripture, observation, application, prayer, status, type, id, currentEntry, modifiedDate, editMode])

//for autosave
// useEffect(() => {
//    if(visible == true){

//    const autosaveInterval = setInterval( () => {
//       if(currentEntry?.date !== date || currentEntry?.scripture !== scripture || currentEntry?.title !== title || currentEntry?.question !== question || currentEntry?.observation !== observation || currentEntry?.application !== application || currentEntry?.prayer !== prayer || currentEntry?.status !== status ){
   
//          updateEntry();
//          currentEntry?.date = date;
//          currentEntry?.scripture = scripture;
//          currentEntry?.title = title;
//          currentEntry?.question = question;
//          currentEntry?.observation = observation;
//          currentEntry?.application = application;
//          currentEntry?.prayer = prayer;
//          currentEntry?.status = status;
//          currentEntry?.modifiedDate = modifiedDate;
//       }
//    }, 10000);//timer for autosave to execute

//    return () => clearInterval(autosaveInterval);
//    }
// }, [date, title, question, scripture, observation, application, prayer, status, type, currentEntry, modifiedDate, id]);

//for drawer when pressed
useEffect(() => {
   const subscription = AppState.addEventListener('change', nextAppState => {

   if (appState.current.match(/inactive|background/) &&
   nextAppState === 'active') {
      return    
   }else{
      if(visible === true){
         updateEntry();
      }
   }

   appState.current = nextAppState;
   setAppCurrentState(appState.current);
   });

   return () => {
   subscription.remove();
   };
}, [visible, date, title, question, scripture, observation, application, prayer, status, type, id, modifiedDate]);


return (
   <>
   <Modal 
      coverScreen={true} 
      isVisible={visible}
      onBackButtonPress={ ()=> handleBackButton() }
      animationIn="slideInRight"
      animationOut="slideOutRight"
      transparent={true}
      style={{flex:1, margin: 0}}
      hasBackdrop={false}
      avoidKeyboard={false}
      propagateSwipe
   >
      {/*HEADER*/}
      <View style={styles.header}> 

      {/*CLOSE BUTTON*/}
      <Pressable onPress={()=> handleBackButton()}>
         <AntDesign name="close" size={30} color="black" />
      </Pressable>
      
      {/*HEADER TITLE*/}
      <Text style={{fontSize: 20}}>{type == "sermon" ? "Sermon Note" : type == "journal" ? "Update Entry" : "OPM Reflection"}</Text>

      <View style={{flexDirection: 'row', alignItems: "center"}}>
         <Pressable style={[styles.btn]} onPress={handleEditMode}>
         <Image style={{width:20, height: 20,}} source={require("../assets/edit.png")}/>
         </Pressable>

         <Pressable style={[styles.btn]} onPress={handleMenuVisible}>
         <Image style={{width:25, height: 25,}} source={require("../assets/three-dots-menu.png")}/>
         </Pressable>
      </View>

      </View>

      {/*FORMS*/}
      <KeyboardAvoidingView behavior='height' style={[styles.modal]}>
   
      { 
      !editMode ? (
      <View 
      style={{
         flex:1,
         width: '100%',
         height: '100%',
         zIndex: 2,
         backgroundColor: 'transparent',
         position: "absolute",
      }}></View>

      ): null
      }
      

      <ScrollView>

         {
         editMode 
         ? 
         (<View style={[styles.editModeContainer]}>
         <Text>Editing</Text>
         <Text></Text>
         </View>) 
         :
         (<View style={[styles.editModeContainer]}>
            <Text>{currentDay ?? ''}</Text>
            <Text>{currentTime ?? ''}</Text>
         </View>)
         }

         <View style={[styles.flex]}> 
            <View style={styles.touchableContainer}>
            
               {/*DATE*/}
               <View style={styles.inputSubContainer}>
                  <Text>Date:</Text>
                  <Pressable style={styles.touchable} onPress={handleDateModal}>
                     <TextInput
                     style={{color: 'black'}}
                     value={date}
                     onChangeText={handleChangeDate}
                     editable={false}
                     />
                  </Pressable>
               </View>

               {/*DATE MODAL?*/}
               { dateModalVisible && (<DateTimePicker mode="date" display="spinner" value={entryDate} onChange={onChangeDate}/>) }

               {/*SCRIPTURE*/}
               <View style={styles.inputSubContainer}>
                  <Text>{type === "sermon" ? "Text:" : 'Scripture:' }</Text>

                  <TextInput style={styles.touchable} editable onChangeText={ text => handleChangeText(text, "scripture") } value={scripture}/>

               </View>

            </View>

            {/*TITLE*/}
            <View style={styles.inputContainer}>
            <Text>{type === "sermon" ? "Theme:": 'Title:'}</Text>
            <TextInput style={[styles.input, {minHeight: 50}]} editable onChangeText={ text => handleChangeText(text, "title") } value={title} multiline={true} />
            </View>

            {/*QUESTION*/}
            { type != "journal" ?
               (
                  <View style={styles.inputContainer}>
                  <Text>Question:</Text>
                  <TextInput style={[styles.input, {minHeight: 50}]} editable onChangeText={ text => handleChangeText(text, "question") } value={question} multiline={true} />
                  </View>
               ) : null
            }

            {/*OBSERVATION*/}
            <View style={styles.inputContainer}>
            <Text>{type === "sermon" ? "Sermon Points:": type == "opm" ? 'Key Points:' : 'Observation:'}</Text>
            <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "observation") } value={observation}  multiline={true} />
            </View>

            {/*APPLICATION*/}
            <View style={styles.inputContainer}>
            <Text>{type === "sermon" ? "Recommendations:": type == "opm" ? 'Recommendations:' : 'Application:'}</Text>
            <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "application")} value={application}  multiline={true} />
            </View>

            {/*PRAYER*/}
            <KeyboardAvoidingView behavior='padding' style={styles.inputContainer} >
            <Text>{type == "sermon" ? "Reflection:": type == "opm" ? 'Reflection/Realization:' : 'Prayer:'}</Text>
            <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "prayer") } value={prayer}  multiline={true} />
            </KeyboardAvoidingView>

         </View>

      </ScrollView>
      </KeyboardAvoidingView>
      

   </Modal>

   
      <MenuModal visible={menuVisible} handleCloseModal={handleMenuVisible} deleteEntry={handleDelete} id={id} status={status} handleStatus={handleStatus} entry={entryToBeShared} type={type}/>
      
</>
)
}
