import { StyleSheet, Text, View, Modal, TextInput, Pressable, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Share} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import data from '../constants/journal-data.json'
import React, {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const DeleteConfirmationModal = ({visible, deleteEntry, id, handleModal}) => {
  return(
    <>
      <Modal animationType="fade" transparent={true} visible={visible}>

        <TouchableOpacity
          style={[styles.flex,{flex: 1, backgroundColor: '#000000aa'}]}
          onPress={handleModal}
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
        
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const MenuModal = ({visible, handleCloseModal, deleteEntry, id, statusColor, entry}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const menuItems = ["Share", "Delete", "Mark as Done"];

  const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  } 

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          `Date:\n ${entry.date}\n Scripture:\n ${entry.scripture}\n Title:\n ${entry.title}\n Observation:\n ${entry.observation}\n Application:\n ${entry.application}\n Prayer:\n ${entry.prayer}\n `,
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
    else if(item == "Mark as Done"){
      statusColor("#077E8C");
      alert("Marked as done")
    }
    else if(item == "Share"){
      onShare();
    }
  }


  return(
    <>
      <Modal animationType='fade' visible={visible} transparent={true}>
        <TouchableOpacity style={{flex: 1}} onPress={handleCloseModal}>
          <View style={styles.menuPopup} >
            
              {
                menuItems.map((item, index) => 
                  (
                  <TouchableOpacity 
                    style={{
                      fontSize: 50, 
                      padding: 10, 
                      alignItems:'flex-end', 
                      borderBottomColor: '#ccc', 
                      borderBottomWidth: 1,
                    }}  
                    key={index} 
                    onPress={() => handlePressBtn(item)} 
                  > 
                    <View style={{borderBottomColor: '#ccc'}}>                   
                      <Text styles={{color: 'black', fontSize: 20,}}>
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  )
                )
              }
          </View>
        </TouchableOpacity>
      </Modal>

      <DeleteConfirmationModal visible={deleteModal} deleteEntry={deleteEntry} id={id} handleModal={handleDeleteModal} />
    </>
  );
}

export default function Entry({visible, handleButton, handleChangeText, date, title, scripture, observation, application, prayer, status, type, handleDelete, itemId, handleScripture, currentStatus, statusColor, handleChangeDate}) {

  const [scriptureModalVisible, setScriptureModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [errorColor, setErrorColor] = useState("#ffffffaa")
  const months = ["Select Month","January","February","March","April","May","June","July","August","September","October","November","December"];
  const [menuVisible, setMenuVisible] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date());
  const handleScriptureModal = () =>{
    setScriptureModalVisible(!scriptureModalVisible);
  }

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
      }else{
        setErrorColor("#ff3333");
        handleScripture("");
      }
    }else{
      setErrorColor("#ff3333");
    }
  }

  const handleBackButton = () =>{
    handleButton(date, title, scripture, observation, application, prayer, status, type, itemId, currentStatus);
    setErrorColor("#fff");
    handleScriptureModal();
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
    observation: observation,
    application: application,
    prayer: prayer,
  }
  useEffect(() => {
    
    const handleFetchVerse = () => {
      const verse = data[month][day]["verse"];
      handleScripture(verse);
    }
    if(month !== '' && day !== ''){
      if(month != "Select Month"){
        if(day >= 0){
          handleFetchVerse();
        }
      }else{
        handleScripture("");
      }
    }
  }, [month, day])
  

  return (
    <>
    <Modal visible={visible} onRequestClose={()=> handleBackButton()}>
      {/*HEADER*/}
      <View style={styles.header}> 

        <Pressable style={[styles.border, styles.btn]} onPress={()=> handleBackButton()}>
          <Image style={{width: 20, height: 20, transform:[{rotate: '180deg'}],}} source={require("../assets/arrow-right.png")}/>
        </Pressable>

        <Text style={{fontSize: 20}}>Journal Entry</Text>

        {
        currentStatus != "add" ? 
        (<Pressable style={[styles.border, styles.btn]} onPress={handleMenuVisible}>
          <Image style={{width:25, height: 25,}} source={require("../assets/three-dots-menu.png")}/>
        </Pressable>)
        : (<View></View>)
        }

      </View>
      
      {/*MODAL FOR HEADER MENU*/}
      <MenuModal visible={menuVisible} handleCloseModal={handleMenuVisible} deleteEntry={handleDelete} id={itemId} statusColor={statusColor} entry={entryToBeShared} />

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
                <Text>Scripture:</Text>
                <TouchableOpacity style={styles.touchable} onPress={handleScriptureModal}> 
                  <Text>{scripture}</Text>
                </TouchableOpacity>
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
              <Text>Title:</Text>
              <TextInput style={[styles.input, {minHeight: 50, maxHeight: 100}]} editable onChangeText={ text => handleChangeText(text, "title") } value={title} multiline={true} />
            </View>

            <View style={styles.inputContainer}>
              <Text>Observation:</Text>
              <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "observation") } value={observation}  multiline={true} />
            </View>

            <View style={styles.inputContainer}>
              <Text>Application:</Text>
              <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "application")} value={application}  multiline={true} />
            </View>

            <KeyboardAvoidingView behavior='padding' style={styles.inputContainer} >
              <Text>Prayer:</Text>
              <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "prayer") } value={prayer}  multiline={true} />
            </KeyboardAvoidingView>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
        

    </Modal>
    {/* <ScriptureModal openModal={scriptureModalVisible} handleVisible={handlePress} fetchVerse={handleFetchVerse}/> */}
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
  deleteButtons:{
    padding: 15,
    borderRadius: 10,
    margin: 5,
  },
})