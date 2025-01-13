import { Text, View, TextInput, TouchableOpacity, Share, AppState, ActivityIndicator, Alert} from 'react-native';

// Icons
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import Modal from "react-native-modal";
import styles from '../../styles/entryStyle';

const MenuModal = ({visible, handleCloseModal, status, entry, type, handleStatus, handleSettingState, settingState}) => {
    const theme = useTheme(); //for theme

	let entryPassage = "";
	if(entry?.passage.length > 0){
		entryPassage = entry?.passage.map( item => "\n" + item + "\n" );
	}

	const alertModal = (title, message) => 	Alert.alert(
		title,
		message,
		[
		{ text: "Cancel", style: 'cancel', onPress: () => {} },
		{
			text: 'Confirm',
			style: 'destructive',
			// If the user confirmed, then we dispatch the action we blocked earlier
			// This will continue the action that had triggered the removal of the screen
			onPress: () => handleSettingState(title),
		},
		]
	);

    const onShare = async () => {
        let message = "";
        if(type == "journal"){
            message =  `Date:\n${entry.date}\n\nScripture:\n${entry.scripture}\n\n${entryPassage.toString().replaceAll(",", "")}\n\nTitle:\n${entry.title}\n\nObservation:\n${entry.observation}\n\nApplication:\n${entry.application}\n\nPrayer:\n${entry.prayer}\n`
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
            //handleDeleteModal(true);
			alertModal("Delete", "Are you sure want to permanently delete the entry?")

        }
        else if(item == "Archive"){
            //handleArchiveModal(true);
			if(settingState == "archive"){
				alertModal("Unarchive", "Are you sure want to remove the entry from archive?")
            }else{
				alertModal("Archive", "Are you sure want to move the entry to archive?")
            }
        }
        else if(item == "Trash"){
            //handleTrashModal(true);
			if(settingState == "trash"){
				alertModal("Restore", "Are you sure want to restore the entry from trash?")    
            }else{
				alertModal("Trash", "Are you sure want to move the entry to trash?")        
            }
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
				<View style={[styles.menuPopup, {backgroundColor: theme.colors.primary}]} >

				<TouchableOpacity 
					style={[styles.menuItems]}  
					onPress={() => handlePressBtn(status)} 
				> 
					<View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}> 
						<AntDesign name="checksquareo" size={theme.fonts.fontSize+4} color={ theme.colors.textColor} />        
						<Text style={{fontSize: theme.fonts.fontSize+2,  color:  theme.colors.textColor}}>{status === "#8CFF31" ? "Unmark as done" : "Mark as done"}</Text>
					</View>
					
				</TouchableOpacity>

				<TouchableOpacity 
					onPress={() => handlePressBtn("Archive")} 
					style={styles.menuItems}  
				> 
					<View style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>
						<Feather name="archive" size={theme.fonts.fontSize+4} color={theme.colors.textColor} />        
						<Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor}}>{settingState == "archive" ? "Unarchive" : "Archive"}</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.menuItems}  
					onPress={() => handlePressBtn("Trash")} 
				> 
					<View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}> 
						{settingState == "trash" ? 
						(<MaterialIcons name="restore" size={theme.fonts.fontSize+8} color={theme.colors.textColor} />) 
						:
						( <Feather name="trash" size={theme.fonts.fontSize+4} color={theme.colors.textColor} /> )}
						<Text style={{color:  theme.colors.textColor, fontSize: theme.fonts.fontSize+2}}>{settingState == "trash" ? "Restore" : "Trash"}</Text>
					</View>
				</TouchableOpacity>

				{settingState == "trash" ? (
					<TouchableOpacity 
							style={styles.menuItems}  
							onPress={() => handlePressBtn("Delete")} 
					> 
						<View  style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>   
								<Feather name="trash" size={theme.fonts.fontSize+4} color="#FA5252" />          
								<Text style={{color: '#FA5252', fontSize: theme.fonts.fontSize+2}}>Delete</Text>
						</View>
					</TouchableOpacity>

				) : null }

				<TouchableOpacity 
					style={[styles.menuItems, {borderBottomColor: 'transparent'}]}  
					onPress={() => handlePressBtn("Share")} 
				> 
					<View style={{flexDirection: 'row', alignItems: "center", gap: 10,}}>
						<Feather name="share-2" size={theme.fonts.fontSize+4} color={theme.colors.textColor} />        
						<Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor}}>Share</Text>
					</View>
				</TouchableOpacity>

				</View>
		</View>
		</Modal>
	</>
);
}

export default MenuModal;