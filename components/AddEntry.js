import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Share} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import { AntDesign } from '@expo/vector-icons';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('_journal_database.db');

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
import styles from '../styles/entryStyle'

export default function AddEntry({visible, handleModal, verse, type, status, handleType, itemId, index}) {

const [dateModalVisible, setDateModalVisible] = useState(false)
const [entryDate, setEntryDate] = useState(new Date());
const [date, setDate] = useState("");
const [title, setTitle] = useState("");
const [scripture, setScripture] = useState(verse);
const [observation, setObservation] = useState("");
const [application, setApplication] = useState("");
const [prayer, setPrayer] = useState("");
const [question, setQuestion] = useState("");
const lastModified = useRef(new Date());
const [modifiedDate, setModifiedDate] = useState(lastModified.current.toString());

const handleDateModal = () => {
   setDateModalVisible(!dateModalVisible)
}

const handleBackButton = () =>{
   setModifiedDate(new Date().toString());
   
   saveEntry();

   handleModal(false);
   cleanStates();
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
      case 'prayer': setPrayer(prayer = text) ;break;
      
   }
}

const cleanStates = () =>{
   setDate("");
   setTitle("");
   setQuestion("");
   setScripture("");
   setObservation("");
   setApplication("");
   setPrayer("");
}

const saveEntry = () => {
   // adding entry to db
   let isEmpty = [date, title, question, scripture, observation, application, prayer];
   if(!isEmpty.every((item)=>item=="")){
      db.transaction((tx) => {
         tx.executeSql(
         'INSERT INTO entries (date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, dataId, month) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
         [date, title, question, verse, observation, application, prayer, status, type, modifiedDate, itemId, months[index]],
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

      <Pressable onPress={()=> handleBackButton()}>
         <AntDesign name="close" size={30} color="black" />
      </Pressable>

      <Text style={{fontSize: 20}}>{type == "sermon" ? "Sermon Note" : type == "journal" ? "Journal Entry" : "OPM Reflection"}</Text>

      <View></View>

      </View>

      {/*FORMS*/}
      <KeyboardAvoidingView behavior='height' style={[styles.modal]}>
   
      
      <ScrollView>
   
         <View style={[styles.flex]}> 
      
            <View style={styles.touchableContainer}>
            
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
                  <Text>{type === "sermon" ? "Text:": type == "opm" ? 'OPM Passage:' : 'Scripture:'}</Text>

                     <TextInput style={styles.touchable} editable onChangeText={ text => handleChangeText(text, "scripture") } value={verse}/>
         
               </View>

            </View>

            <View style={styles.inputContainer}>
            <Text>{type === "sermon" ? "Theme:": type == "opm" ? 'OPM Theme:' : 'Title:'}</Text>
            <TextInput style={[styles.input, {minHeight: 50}]} editable onChangeText={ text => handleChangeText(text, "title") } value={title} multiline={true} />
            </View>

            { type != "journal" ?
               (
                  <View style={styles.inputContainer}>
                  <Text>Question:</Text>
                  <TextInput style={[styles.input, {minHeight: 50}]} editable onChangeText={ text => handleChangeText(text, "question") } value={question} multiline={true} />
                  </View>
               ) : null
            }

            <View style={styles.inputContainer}>
            <Text>{type === "sermon" ? "Sermon Points:": type == "opm" ? 'Key Points:' : 'Observation:'}</Text>
            <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "observation") } value={observation}  multiline={true} />
            </View>

            <View style={styles.inputContainer}>
            <Text>{type === "sermon" ? "Recommendations:": type == "opm" ? 'Recommendations:' : 'Application:'}</Text>
            <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "application")} value={application}  multiline={true} />
            </View>

            <KeyboardAvoidingView behavior='padding' style={styles.inputContainer} >
            <Text>{type == "sermon" ? "Reflection:": type == "opm" ? 'Reflection/Realization:' : 'Prayer:'}</Text>
            <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "prayer") } value={prayer}  multiline={true} />
            </KeyboardAvoidingView>

         </View>

      </ScrollView>
      </KeyboardAvoidingView>
      

   </Modal>
</>
)
}
