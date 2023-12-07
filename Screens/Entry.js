import { StyleSheet, Text, View, Modal, TextInput, Pressable, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import data from '../constants/journal-data.json'
import React, {useState, useEffect} from 'react';


const MenuModal = ({visible, handleCloseModal, deleteEntry, id, statusColor}) => {
  const menuItems = ["Share", "Delete", "Details", "Mark as Done"];

  const handlePressBtn = (item) =>{
    console.log(item);
    if(item == "Delete"){
      deleteEntry(id);
    }
    else if(item == "Mark as Done"){
      statusColor("#077E8C");
      alert("Marked as done")
    }
    handleCloseModal();
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
                  onPress={() => handlePressBtn(item)} > 
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
    </>
  );
}

export default function Entry({visible, handleButton, handleChangeText, date, scripture, observation, application, prayer, status, type, handleDelete, itemId, handleScripture, currentStatus, statusColor}) {

  const [scriptureModalVisible, setScriptureModalVisible] = useState(false)
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const months = ["Select Month","January","February","March","April","May","June","July","August","September","October","November","December"];
  const [menuVisible, setMenuVisible] = useState(false);

  const handleBack = () =>{
    setScriptureModalVisible(!scriptureModalVisible);
  }

  const handleMenuVisible = ()=>{
    setMenuVisible(!menuVisible);
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
    <Modal visible={visible}>
      {/*HEADER*/}
      <View style={styles.header}> 

        <Pressable style={[styles.border, styles.btn]} onPress={ ()=>handleButton(date, scripture, observation, application, prayer, status, type, itemId, currentStatus) }>
          <Image style={{width: 20, height: 20, transform:[{rotate: '180deg'}],}} source={require("../assets/arrow-right.png")}/>
        </Pressable>

        <Text style={{fontSize: 20}}>Journal Entry</Text>

        <Pressable style={[styles.border, styles.btn]} onPress={handleMenuVisible}>
          <Image style={{width:25, height: 25,}} source={require("../assets/three-dots-menu.png")}/>
        </Pressable>

      </View>
      
      {/*MODAL FOR HEADER MENU*/}
      <MenuModal visible={menuVisible} handleCloseModal={handleMenuVisible} deleteEntry={handleDelete} id={itemId} statusColor={statusColor} />

      {/*FORMS*/}
      <KeyboardAvoidingView behavior='height' style={[styles.modal]}>
        <ScrollView>
          <View style={[styles.flex]}> 
        
        <View style={styles.touchableContainer}>
          <View style={styles.inputSubContainer}>
            <Text>Date</Text>
            {/* <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, 'date') } value={date} />        */}
            <TouchableOpacity style={styles.touchable}>
              <Text>{date}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSubContainer}>
            <Text>Scripture</Text>
            {/* <TextInput style={styles.input} editable  onPress={handlePress} onChangeText={ text => handleChangeText(text, "scripture") } value={scripture} /> */}
            <TouchableOpacity style={styles.touchable} onPress={handleBack}> 
              <Text>{scripture}</Text>
            </TouchableOpacity>
          </View>
        </View>

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
            
              <TextInput style={styles.scriptureDay} placeholder='Day' onChangeText={ text => setDay(text - 1)} />
            </View>
            </>
          )
        : null}

        
            
        <View style={styles.inputContainer}>
          <Text>Observation</Text>
          <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "observation") } value={observation}  multiline={true} />
        </View>

        <View style={styles.inputContainer}>
          <Text>Application</Text>
          <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "application")} value={application}  multiline={true} />
        </View>

        <KeyboardAvoidingView behavior='padding' style={styles.inputContainer} >
          <Text>Prayer</Text>
          <TextInput style={styles.input} editable onChangeText={ text => handleChangeText(text, "prayer") } value={prayer}  multiline={true} />
        </KeyboardAvoidingView>
{/* 
        
        { 
          status == "ongoing" ? <Pressable style={[styles.border, styles.btn2]} onPress={ ()=> handleDelete(itemId) }><Text>Delete</Text></Pressable> : null
        }
       */}
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
})