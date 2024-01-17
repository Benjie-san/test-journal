import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React,{ useState, useEffect } from 'react';
import Modal from "react-native-modal";
import { RadioButton } from 'react-native-paper'; 
import asv from '../constants/asv.json';
import esv from '../constants/esv.json';
import tagalog from '../constants/tagab.json';
import { Entypo } from '@expo/vector-icons';
import styles from '../styles/passageStyle';


const translationsName = ["ESV","ASV", "Tagalog"];

const TranslationModal = ({visible, handleModal, handleTranslation, globalStyle}) => {

	const [checked, setChecked] = useState('ESV');

	const handleRadioButton = (item, index) =>{
		handleTranslation(item, index);
		setChecked(item);
		handleModal(false);
	}

   return(
      <>
         <Modal
				animationIn="fadeIn"
				animationOut="fadeOut"
				onBackdropPress={() => handleModal(false)}
				onBackButtonPress={() => handleModal(false)}
				isVisible={visible}
			
			>
            <View style={[styles.picker, {backgroundColor: globalStyle.verseModal}]}>
					{
						translationsName.map( (item, index) => (
							<TouchableOpacity 
								key={index}
								onPress={ () => handleRadioButton(item, index) } 
								style={{
									borderBottomWidth: translationsName.length-1 == index  ? 0 : 1 , 
									borderBottomColor: globalStyle.borderColor,
									flexDirection: 'row',
									alignItems: 'center',
									gap: 10,
								}}
								>
								<RadioButton
									uncheckedColor={globalStyle?.color}
									value={item} 
									onPress={ () => handleRadioButton(item, index) } 
									status={ checked === item ? 'checked' : 'unchecked' }
								/>
								<Text style={[ {color: globalStyle?.color, fontSize: 17}]} >{item}</Text>
							</TouchableOpacity>
						) )
					}
            </View>
         </Modal>
      </>
   );
}

export default function PassageBottomSheet({globalStyle, visible, handleModal, verse, scripture, type}) {	
	
	const [fetchedVerse, setFetchedVerse] = useState([]);
	const [verseNumber, setVerseNumber] = useState([]);

	const [currentTranslation, setCurrentTranslation] = useState("ESV");
	const translations = [esv, asv, tagalog];
	const [translationPickerModalVisible, settranslationPickerModalVisible] = useState(false);
	const [fetchedFromDb, setFetchedFromDb] = useState([]);

	const handleTranslationPickerModal = (item) =>{
		settranslationPickerModalVisible(item)
	}

	const handleTranslation = (item, index) => {
		getVerse(scripture, translations[index])
		setCurrentTranslation(item);
	}

	const getVerse = (scripture = "Genesis 1:1-3", translation) => {
		let splitVerse = [];
		let range = [];
		let book = "";
		let chapter = 0;
		let start = 0;
		let end = 0;
		let verseTextResult = [];
		let verseNumberResult = []
	
		if(scripture != ''){
			let checkVerse = scripture.split(":");
			if( checkVerse[0] !== scripture ){

				splitVerse = scripture.split(":");
				book = splitVerse[0].slice(0, splitVerse[0].length-2).trim();
				chapter = splitVerse[0].slice(splitVerse[0].length-2, splitVerse[0].length).trim();

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
								verseNumberResult.push(`${item.verse}`)
								verseTextResult.push(`${item.text}`)
							}
						} else{
							if (item.verse == start) {
								verseNumberResult.push(`${item.verse}`)
								verseTextResult.push(`${item.text}`)
							}
						}
					}
				});

			}
			
		setFetchedVerse(verseTextResult);
		setVerseNumber(verseNumberResult);
	
		
		}
	

	}
	
	useEffect(() => {
		getVerse(scripture, esv);
	}, [scripture]);
	
   return (

		<Modal
			onBackdropPress={() => handleModal(false)}
			onBackButtonPress={() => handleModal(false)}
			isVisible={visible}
			onSwipeComplete={() => handleModal(!visible)}
			animationIn="bounceInUp"
			animationOut="bounceOutDown"
			animationInTiming={900}
			animationOutTiming={500}
			backdropTransitionInTiming={1000}
			backdropTransitionOutTiming={500}
			swipeDirection="down"
			style={styles.modal}
		>
			<View style={[styles.modalContent, {backgroundColor: globalStyle?.verseModal}]}>
				
				<View style={styles.center}>
					<View style={[styles.barIcon, {backgroundColor: globalStyle?.borderColor}]} />

					<View style={[styles.header, ]} >
						<Text style={[{color: globalStyle?.color, fontSize: 17, fontWeight: 'bold'}]} >
							{scripture !== '' ? scripture : "Set Scripture first"}
						</Text>
				
						<TouchableOpacity disabled={scripture !== '' ? false : true} onPress={ ()=> handleTranslationPickerModal(true)  } style={[styles.headerBtn, ] } > 
							<Text style={[ {color: globalStyle?.color, fontSize: 17}]}>{currentTranslation}</Text>
							<Entypo name="chevron-thin-down" size={20} color={globalStyle?.color} />

						</TouchableOpacity>

					</View>

					<TranslationModal visible={translationPickerModalVisible} handleModal={handleTranslationPickerModal} handleTranslation={handleTranslation} globalStyle={globalStyle} />
			
					<ScrollView contentContainerStyle={[styles.verseView, styles.center,]}
					>
					{ fetchedVerse.length > 0 ? (
						<>
						{
							fetchedVerse.map( (item, index) => (
								<View key={index} style={[{flexDirection: 'row', alignItems:'center', justifyContent: 'flex-start', paddingBottom: 5, width: '100%',  gap: 10}]}>
									<Text style={[styles.verseText, {color: globalStyle?.color, alignSelf: 'flex-start', padding: 5,}]}>{verseNumber[index]}</Text>
									<Text style={[styles.verseText, {color: globalStyle?.color,  padding: 5, width: '90%'}]}>{item}</Text>
								</View>
							))
						}
						</>
						) : ( <Text style={{fontSize: 30, paddingBottom: 150, color: globalStyle.color}} >No Verses Found</Text> ) 
					}
		
						
					</ScrollView>

				</View>

			</View>

		</Modal>
	
   )
}
