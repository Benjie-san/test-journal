import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React,{ useState, useEffect } from 'react';
import Modal from "react-native-modal";
import { useTheme, RadioButton } from 'react-native-paper'; 
import asv from '../constants/asv.json';
import esv from '../constants/esv.json';
import tagalog from '../constants/tagab.json';
import { Entypo } from '@expo/vector-icons';
import styles from '../styles/passageStyle';

const translationsName = ["ESV","ASV", "Tagalog"];

const TranslationModal = ({visible, handleModal, handleTranslation}) => {
	const theme = useTheme();

	const [checked, setChecked] = useState('ESV');

	const handleRadioButton = (item, index) =>{
		handleTranslation(item, index);
		setChecked(item);
		handleModal(false);
	}

	return(
    <>
        <Modal
			onBackdropPress={() => handleModal(false)}
			onBackButtonPress={() => handleModal(false)}
			animationIn="fadeIn"
            animationOut="fadeOut"			
			isVisible={visible}
			style={styles.flex}
			animated
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating
		>
            <View style={[styles.picker, {backgroundColor: theme.colors.primary}]}>
				{
					translationsName.map( (item, index) => (
						<TouchableOpacity 
							key={index}
							onPress={ () => handleRadioButton(item, index) } 
							style={{
								borderBottomWidth: translationsName.length-1 == index  ? 0 : 1 , 
								borderBottomColor: theme.colors.borderColor,
								flexDirection: 'row',
								alignItems: 'center',
								gap: 10,
							}}
							>
							<RadioButton
								color={theme.colors.altColor}
								value={item}
								onPress={ () => handleRadioButton(item, index) } 
								status={ checked === item ? 'checked' : 'unchecked' }
							/>
							<Text style={[ {color: theme.colors.textColor, fontSize: theme.fonts.fontSize}]} >{item}</Text>
						</TouchableOpacity>
					) )
				}
            </View>
        </Modal>
    </>
  );
}

export default function PassageBottomSheet({visible, handleModal, scripture, handlePassage}) {	
	const theme = useTheme();

	const [fetchedVerse, setFetchedVerse] = useState([]);
	const [verseNumber, setVerseNumber] = useState([]);

	const [currentTranslation, setCurrentTranslation] = useState("ESV");
	const translations = [esv, asv, tagalog];
	const [translationPickerModalVisible, settranslationPickerModalVisible] = useState(false);

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
		let passage = [];
		if(scripture !== '' && scripture !== undefined && scripture !== null){
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
								passage.push(`${item.verse} ${item.text}`);
							}
						} else{
							if (item.verse == start) {
								verseNumberResult.push(`${item.verse}`)
								verseTextResult.push(`${item.text}`)
								passage.push(`${item.verse} ${item.text}`);
							}
						}
					}
				});

			}
			
		setFetchedVerse(verseTextResult);
		setVerseNumber(verseNumberResult);
		handlePassage(passage);
		}
	
	}

	const toggleModal = () =>{
		handleModal(!visible)
	}
	
	useEffect(() => {
		getVerse(scripture, esv);
	}, [scripture]);
	
  return (
		<Modal
			onBackdropPress={() => handleModal(false)}
			onBackButtonPress={() => handleModal(false)}
			isVisible={visible}
			animationIn="bounceInUp"
			animationOut="bounceOutDown"
			swipeDirection="down"
			onSwipeComplete={toggleModal}
			animationInTiming={900}
			animationOutTiming={500}
			backdropTransitionInTiming={1000}
			backdropTransitionOutTiming={1000}
			animated
            hideModalContentWhileAnimating
			style={styles.modal}
		>
			<View style={[styles.modalContent, {backgroundColor: theme.colors.primary}]}>
				
				<View style={styles.center}>
					
					<View style={[styles.header,]} >
						<View style={{flexDirection: 'row', alignItems: 'center', flex: 1,}}>
							<Text style={[{color: theme.colors.textColor, fontSize: theme.fonts.fontSize+1, fontWeight: 'bold'}]} >
								{scripture !== '' ? scripture : "Set Scripture first"}
							</Text>
							{scripture !== '' ? (
								<TouchableOpacity onPress={ ()=> handleTranslationPickerModal(true)  } style={[styles.headerBtn, ] } > 
									<Text style={[ {color: theme.colors.altColor, fontSize: theme.fonts.fontSize+1}]}>{currentTranslation}</Text>
								</TouchableOpacity>
							) : null }
						</View>
				
					
						<TouchableOpacity style={[{height: 45, padding: 10, opacity: 0.5}]} onPress={()=>handleModal(false)}>
							<Text style={[ {color: theme.colors.textColor, fontSize: theme.fonts.fontSize+1}]}>Close</Text>
						</TouchableOpacity>

					</View>

					<TranslationModal visible={translationPickerModalVisible} handleModal={handleTranslationPickerModal} handleTranslation={handleTranslation} />
			
					<ScrollView contentContainerStyle={[styles.verseView, styles.center,]}
					>
					{ fetchedVerse.length > 0 ? (
						<>
						{
							fetchedVerse.map( (item, index) => (
								<View key={index} style={[{flexDirection: 'row', alignItems:'center', justifyContent: 'flex-start', paddingBottom: 5, width: '100%',  gap: 10}]}>
									<Text style={[styles.verseText, { fontSize: theme.fonts.fontSiz, color: theme.colors.textColor, alignSelf: 'flex-start', padding: 5,}]}>{verseNumber[index]}</Text>
									<Text style={[styles.verseText, {fontSize: theme.fonts.fontSiz, color: theme.colors.textColor,  padding: 5, width: '90%'}]}>{item}</Text>
								</View>
							))
						}
						</>
						) : ( <Text style={{fontSize: theme.fonts.fontSize, paddingBottom: 150, color: theme.colors.textColor}} >No Verses Found</Text> ) 
					}
						
					</ScrollView>

				</View>

			</View>

		</Modal>
	
    )
}
