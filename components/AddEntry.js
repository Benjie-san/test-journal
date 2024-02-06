import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity, ScrollView, KeyboardAvoidingView, AppState} from 'react-native';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import styles from '../styles/entryStyle';
import PassageBottomSheet from './PassageBottomSheet';
import AlertModal from './AlertModal';


const db = SQLite.openDatabase('_journal_database.db');
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const BackConfirmationModal = ({visible, handleModal, handleMainModal, globalStyle, saveEntry, }) => {

   const handleSave = () =>{
      saveEntry();
      handleModal(false);
      handleMainModal(false);
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
                  Are you sure want to discard your entry?
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
                  onPress={()=>handleMainModal()}
               >
                  <Text style={{ color: globalStyle?.color }}>DISCARD</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style={[
                  styles.deleteButtons,
                     {
                     backgroundColor: globalStyle?.settingsColor,
                     borderColor: globalStyle?.borderColor,
                     borderWidth: 1,
                     },
                  ]}
                  onPress={() => handleSave()}
               >
               <Text style={{ color: "white" }}>SAVE</Text>
               </TouchableOpacity>
               </View>
            </View>
            </View>
         </Modal>
      </>
   );
}

export default function AddEntry({visible, handleModal, verse, type, status, itemId, index, globalStyle, fetchAllData, route}) {

   const [entryDate, setEntryDate] = useState(new Date());
   const [date, setDate] = useState(new Date().toDateString());
   const [title, setTitle] = useState("");
   const [scripture, setScripture] = useState("");
   const [observation, setObservation] = useState("");
   const [application, setApplication] = useState("");
   const [prayer, setPrayer] = useState("");
   const [question, setQuestion] = useState("");

   const [dateModalVisible, setDateModalVisible] = useState(false);
   const [passageModalVisble, setPassageModalVisible] = useState(false);
   const [alertModalVisible, setAlertModalVisible] = useState(false);

   const [message, setMessage] = useState("");
   const appState = useRef(AppState.currentState);
   const [appCurrentState, setAppCurrentState] = useState(appState.current);

   const [passage, setPassage] = useState(""); 



   const handlePassage = (item) => {
      setPassage(item);
   }

   const [backConfirmVisible, setBackConfirmVisible] = useState(false);

   const handleBackConfirmModal = (item) =>{
      setBackConfirmVisible(item);
      if(item == false){
         cleanStates();
         if(route.name == "Home" ){
            fetchAllData();
         }
      }
     
   }

   const handleAlertModalVisible = (item) =>{
      setMessage("Entry Saved");
      setAlertModalVisible(item);
   }

   const handlePassageVisible = (item) => {
      setPassageModalVisible(item);
   }

   const handleDateModal = () => {
      setDateModalVisible(!dateModalVisible)
   }

   const handleBackButton = () =>{
      handleModal(false);
      cleanStates();

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

   const cleanStates = () =>{
      setDate(new Date().toDateString());
      setTitle("");
      setQuestion("");
      setScripture("");
      setObservation("");
      setApplication("");
      setPrayer("");
   }

   const handleSave = () =>{
      saveEntry();
      handleAlertModalVisible(true);
      cleanStates();
   }

   const saveEntry = () => {
      // adding entry to db
      let isEmpty = [date, title, question, observation, application, prayer];
      if(!isEmpty.every((item)=>item=="")){

         if(type=="journal" || type == "sermon"){
            db.transaction((tx) => {
               tx.executeSql(
               'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
               [date, title, question, scripture, observation, application, prayer, status, type, Date.now(), itemId, months[index]],
               (tx, results) => {
                  console.log("Success!!!");
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
               [date, title, question, scripture, observation, application, prayer, status, type, Date.now(), null, months[index]],
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
      if(type == 'journal'){
         setScripture(verse);
      }else{
         setScripture("");
      }
   }, [verse, scripture]);

   useEffect(() => {
      if(alertModalVisible == true){

         const interval = setTimeout(() => {
            // After 3 seconds set the show value to false
            handleAlertModalVisible(false);
            handleModal(false);
            cleanStates();
            if(route.name == "Home" ){
               fetchAllData();
            }

         }, 1000)
   

         return () => {
         clearTimeout(interval)
         }
      }

   }, [alertModalVisible])

useEffect(() => {
   const subscription = AppState.addEventListener('change', nextAppState => {

   if (appState.current.match(/inactive|background/) &&
   nextAppState === 'active') {
      return;
   }else{
      if(visible === true){
         handleSave();
      }
   }

   appState.current = nextAppState;
   setAppCurrentState(appState.current);
   });

   return () => {
   subscription.remove();
   };
}, [visible, date, title, question, scripture, observation, application, prayer, status]);


   return (
         <Modal 
            coverScreen={true} 
            isVisible={visible}
            onBackButtonPress={ ()=> handleBackConfirmModal(true) }
            animationIn="slideInRight"
            animationOut="slideOutRight"
            transparent={true}
            style={{flex:1, margin: 0, height: '100%'}}
            hasBackdrop={false}
            avoidKeyboard={false}
            propagateSwipe
         >
            {/*HEADER*/}
            <View style={[styles.header, {backgroundColor: globalStyle?.bgHeader, borderBottomColor: globalStyle?.borderColor ,}]}> 

               <Text style={{fontSize: 20, color:globalStyle?.color}}>{type == "sermon" ? "Sermon Note" : type == "journal" ? "Journal Entry" : "OPM Reflection"}</Text>

               <TouchableOpacity onPress={ ()=>handleSave() }>
                  {/* <MaterialCommunityIcons name="content-save-check-outline" size={30} color={globalStyle?.color} /> */}
                  <Text style={{color: globalStyle?.settingsColor}} > SAVE </Text>
               </TouchableOpacity>

            </View>

            {/*FORMS*/}
            <View style={[styles.modal, {backgroundColor: globalStyle?.bgBody, }]}>
         
            
            <ScrollView style={{flex:1}}>
         
               <View style={[styles.flex]}> 
            
                  <View style={styles.touchableContainer}>
                  
                     <View style={styles.inputSubContainer}>
                        <Text style={{color:globalStyle?.color, fontSize: globalStyle?.fontSize}}>Date:</Text>
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
                     {
                        dateModalVisible &&
                        (
                           <DateTimePicker 
                           mode="date" 
                           display="spinner" 
                           value={entryDate}
                           onChange={onChangeDate}
                           />
                  
                        ) 
                     }

                     <View style={styles.inputSubContainer}>
                        <Text  style={{color:globalStyle?.color , fontSize: globalStyle?.fontSize}}>{type === "sermon" ? "Text:": type == "opm" ? 'OPM Passage:' : 'Scripture:'}</Text>

                           <TextInput style={[styles.touchable, {fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "scripture") } value={scripture}/>
               
                     </View>

                  </View>

                  <View style={styles.inputContainer}>
                     <Text  style={{color:globalStyle?.color, fontSize: globalStyle?.fontSize}}>{type === "sermon" ? "Theme:": type == "opm" ? 'OPM Theme:' : 'Title:'}</Text>
                     <TextInput style={[styles.input, {minHeight: 50, fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "title") } value={title} multiline={true} />
                  </View>

                  { type != "journal" ?
                     (
                        <View style={styles.inputContainer}>
                        <Text  style={{color:globalStyle?.color, fontSize: globalStyle?.fontSize}}>Question:</Text>
                        <TextInput style={[styles.input, {minHeight: 50, fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "question") } value={question} multiline={true} />
                        </View>
                     ) : null
                  }

                  <View style={styles.inputContainer}>
                     <Text  style={{color:globalStyle?.color, fontSize: globalStyle?.fontSize}}>{type === "sermon" ? "Sermon Points:": type == "opm" ? 'Key Points:' : 'Observation:'}</Text>
                     <TextInput style={[styles.input, {fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "observation") } value={observation}  multiline={true} />
                  </View>

                  <View style={styles.inputContainer}>
                     <Text  style={{color:globalStyle?.color , fontSize: globalStyle?.fontSize}}>{type === "sermon" ? "Recommendations:": type == "opm" ? 'Recommendations:' : 'Application:'}</Text>
                     <TextInput style={[styles.input, {fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "application")} value={application}  multiline={true} />
                  </View>

                  <KeyboardAvoidingView behavior='padding' style={styles.inputContainer} >
                     <Text  style={{color:globalStyle?.color , fontSize: globalStyle?.fontSize}}>{type == "sermon" ? "Reflection:": type == "opm" ? 'Reflection/Realization:' : 'Prayer:'}</Text>
                     <TextInput style={[styles.input, {fontSize: globalStyle?.fontSize}]} editable onChangeText={ text => handleChangeText(text, "prayer") } value={prayer}  multiline={true} />

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

            <BackConfirmationModal message={message} visible={backConfirmVisible} handleModal={handleBackConfirmModal} handleMainModal={handleModal} saveEntry={saveEntry} globalStyle={globalStyle}  />

            <AlertModal message={message} visible={alertModalVisible} globalStyle={globalStyle} />

            <PassageBottomSheet visible={passageModalVisble} handleModal={handlePassageVisible} globalStyle={globalStyle} scripture={scripture} type={type} handlePassage={handlePassage}/>
         
         </Modal>
   )
}
