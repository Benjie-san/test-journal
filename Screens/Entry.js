import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Share} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import data from '../constants/journal-data.json'
import React, {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import { AntDesign } from '@expo/vector-icons'; 

const DeleteConfirmationModal = ({visible, deleteEntry, id, handleModal}) => {
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
              <Pressable  style={[styles.deleteButtons, {backgroundColor: 'red',}]} onPress={() => deleteEntry(id)}>
                <Text style={{color: 'white'}}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const MenuModal = ({visible, handleCloseModal, deleteEntry, id, statusColor, status, entry, type}) => {
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
    else if(item == "#fff"){
      statusColor("#8CFF31");
      alert("Marked as done");
    }
    else if(item == "#8CFF31"){
      statusColor("#fff");
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
                <Text style={{fontSize: 18}}>{status == "#077E8C" ? "Unmark as done" : "Mark as done"}</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <DeleteConfirmationModal visible={deleteModal} deleteEntry={deleteEntry} id={id} handleModal={handleDeleteModal} />
    </>
  );
}

export default function Entry({visible, handleButton, handleChangeText, date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, handleDelete, itemId, handleScripture, currentStatus, statusColor, handleChangeDate, modifyDate, currentEntry, update}) {

  const [scriptureModalVisible, setScriptureModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [errorColor, setErrorColor] = useState("transparent")
  const months = ["Select Month","January","February","March","April","May","June","July","August","September","October","November","December"];
  const [menuVisible, setMenuVisible] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date());

  const currentDate = new Date(modifiedDate).toISOString();
  const currentDay = new Date(currentDate).toLocaleDateString();
  const currentTime = new Date(currentDate).toLocaleTimeString();

  const [editMode, setEditMode] = useState(false)

  const handleDateModal = () => {
    setDateModalVisible(!dateModalVisible)
  }

  const handleMenuVisible = ()=>{
    setMenuVisible(!menuVisible);
  }

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  }
  
  const handleChangeDay = (day) =>{
    let date = new Date();
    let year = date.getFullYear();
    let monthValue = months.indexOf(month);
    let num = daysInMonth(monthValue, year);
    if(month !== "" && month !== "Select Month"){
      if(day > 0 && day <= num){
        setDay(day - 1);
        setErrorColor("#88ff4d");
      }
      else{
        setErrorColor("#ff3333");
        handleScripture("");
      }
    }else{
      setErrorColor("#ff3333");
    }
  }

  const handleBackButton = () =>{
    setEditMode(false);
    modifyDate()
    handleButton();
    setErrorColor("#fff");
    setScriptureModalVisible(false);
  }

  const handleEditMode = () => {
    setEditMode(!editMode)
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

  const entryToBeShared = {
    date: date,
    scripture: scripture,
    title: title,
    question: question,
    observation: observation,
    application: application,
    prayer: prayer,
  }

  useEffect(() => {
    if(editMode == true  && currentStatus == "ongoing"){
      if(currentEntry.date !== date || currentEntry.scripture !== scripture || currentEntry.title !== title || currentEntry.question !== question || currentEntry.observation !== observation || currentEntry.application !== application || currentEntry.prayer !== prayer || currentEntry.status !== status ){
        modifyDate(new Date().toString());
        update(date, title, question, scripture, observation, application, prayer, status, type, modifiedDate, itemId, currentStatus);
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
  
  }, [date, title, question, scripture, observation, application, prayer, status, type, itemId, currentStatus, currentEntry, modifiedDate, editMode])
  

  useEffect(() => {
    
    const handleFetchVerse = () => {
      const verse = data[month][day]["verse"];
      handleScripture(verse);
    }
    if(month !== '' && day !== ''){
      if(month != "Select Month"){
        if(day >= 0){
          const interval = setInterval( ()=>{
            handleFetchVerse();
          }, 1000);
          return () => clearInterval(interval);
          
        }
      }else{
        handleScripture("");
      }
      setScriptureModalVisible(false);
      
    }
  }, [month, day])

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
          {/* <Image style={{width: 20, height: 20, transform:[{rotate: '180deg'}],}} source={require("../assets/arrow-right.png")}/> */}
          <AntDesign name="close" size={30} color="black" />
        </Pressable>

        <Text style={{fontSize: 20}}>{type == "sermon" ? "Sermon Note" : type == "journal" ? "Journal Entry" : "OPM Reflection"}</Text>

        {currentStatus != "add" ? 
        (
        <View style={{flexDirection: 'row', alignItems: "center"}}>
          <Pressable style={[styles.btn]} onPress={handleEditMode}>
            <Image style={{width:20, height: 20,}} source={require("../assets/edit.png")}/>
          </Pressable>

          <Pressable style={[styles.btn]} onPress={handleMenuVisible}>
            <Image style={{width:25, height: 25,}} source={require("../assets/three-dots-menu.png")}/>
          </Pressable>
        </View>
    
        )
        : (<View></View>)
        }

      </View>
      
      {/*MODAL FOR HEADER MENU*/}
      <MenuModal visible={menuVisible} handleCloseModal={handleMenuVisible} deleteEntry={handleDelete} id={itemId} statusColor={statusColor} status={status} entry={entryToBeShared} type={type}/>

      {/*FORMS*/}
      <KeyboardAvoidingView behavior='height' style={[styles.modal]}>
      { currentStatus == "ongoing" ? !editMode ? (
        <View 
        style={{
          flex:1,
          width: '100%',
          height: '100%',
          zIndex: 2,
          backgroundColor: 'transparent',
          position: "absolute",
        }}></View>

      ): null :null}
      
        <ScrollView>
        {currentStatus == 'ongoing' ?
        editMode 
        ? 
        (<View style={[styles.editModeContainer]}>
        <Text>Editing</Text>
        <Text></Text>
        </View>) 
        :
        (<View style={[styles.editModeContainer]}>
          <Text>{currentDay}</Text>
          <Text>{currentTime}</Text>
        </View>)
        :
        null}
          
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
                <Text>{type === "sermon" ? "Text:": type == "opm" ? 'OPM Passage:' : 'Scripture:' }</Text>
                { type === "sermon" ?
                  <TextInput style={styles.touchable} editable onChangeText={ text => handleChangeText(text, "scripture") } value={scripture}/> 
                  : type == "opm" ?
                  <TextInput style={styles.touchable} editable onChangeText={ text => handleChangeText(text, "scripture") } value={scripture}/>
                  :
                  <TouchableOpacity style={styles.touchable} onPress={() => setScriptureModalVisible(true)}> 
                    <Text>{scripture}</Text>
                  </TouchableOpacity>
                }
              </View>

            </View>

              {/*SCRIPTURE MODAL?*/}
              {scriptureModalVisible == true ?
                (
                  <>
                  <View style={styles.scriptureSelector}>
                    <View style={styles.scripturePicker} >
                      <Picker style={{width: "100%"}} mode="dropdown" selectedValue={month} onValueChange={ item => setMonth(item)} >
                        {
                          months.map( (item, index) => {
                            return <Picker.Item label={item} value={item} key={index}/>
                          })
                        }
                      </Picker>
                    </View>
                  
                    <TextInput maxLength={2} style={[styles.scriptureDay,{borderColor: errorColor, borderWidth: 2}]} placeholder='Day' onChangeText={text => handleChangeDay(text)} />
                  </View>
                  </>
                )
                : null
              }


            <View style={styles.inputContainer}>
              <Text>{type === "sermon" ? "Theme:": type == "opm" ? 'OPM Theme:' : 'Title:'}</Text>
              <TextInput style={[styles.input, {minHeight: 50, maxHeight: 100}]} editable onChangeText={ text => handleChangeText(text, "title") } value={title} multiline={true} />
            </View>

            { type != "journal" ?
              (
                <View style={styles.inputContainer}>
                  <Text>Question:</Text>
                  <TextInput style={[styles.input, {minHeight: 50, maxHeight: 100}]} editable onChangeText={ text => handleChangeText(text, "question") } value={question} multiline={true} />
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

const styles = StyleSheet.create({
  header:{
    height: 60,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    flexDirection: 'row',
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    backgroundColor: '#f2f2f2',
    zIndex: 1,
  },
  flex:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn:{
    padding: 10,
    alignItems: 'center',
  },
  btn2:{
    padding: 5,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  modal:{
    flex:1,
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
    padding: "10",
    height: '100%',
  },
  inputContainer:{
    width: "80%",
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'left',
  },
  touchableContainer:{
    width: "80%",
    flexDirection: 'row',
    textAlign: 'left',
    justifyContent: 'space-between',
    alignItems: 'left',
    margin: 5,
  },
  inputSubContainer:{
    width: "48%",
    marginTop: 20,
  },
  input:{    
    borderRadius: 5,
    backgroundColor: '#bfbfbf',
    width: "100%",
    minHeight: 100,
    maxHeight: 300,
    padding: 10,
    marginBottom: 10,
  },
  border:{
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  scriptureModalInner:{
    backgroundColor: '#f2f2f2',
    width: '80%',
    padding: 10,
    margin: 100,
    borderRadius: 5,
  },
  modalInput:{
    backgroundColor: '#bfbfbf',
    width: "100%",
    borderRadius: 10,
  },
  touchable:{
    borderRadius: 5,
    backgroundColor: '#bfbfbf',
    width: "100%",
    height: 40,
    alignItems: 'center',
    flexDirection:'row',
    padding: 5,
  },
  scriptureSelector:{
    width: "80%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: 'space-between',
    margin: 5,
  },
  scripturePicker:{
    width:'65%', 
    borderRadius: 5, 
    borderWidth: 0,
    backgroundColor: '#bfbfbf',
    overflow: 'hidden',
  },
  scriptureDay:{
    width: '30%', 
    backgroundColor: '#bfbfbf',
    borderRadius: 5,
    padding: 10,
    height: 53,
  },
  menuPopup:{
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    position: 'absolute',
    top: 50,
    right: 10,
  },
  menuItems:{
    fontSize: 50, 
    padding: 10, 
    alignItems:'flex-end', 
    borderBottomColor: '#ccc', 
    borderBottomWidth: 1,
  },
  deleteButtons:{
    padding: 15,
    borderRadius: 10,
    margin: 5,
  },
  editModeContainer:{
    width: "100%", 
    height: '5%', 
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'absolute',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 3,
  },
})