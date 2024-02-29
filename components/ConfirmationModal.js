import styles from '../styles/entryStyle';
import { Text, View, TouchableOpacity,} from 'react-native';
import Modal from "react-native-modal";

const ConfirmationModal = ({visible, title, message, settingState, handleSettingState, handleModal, globalStyle}) => {
    const handleFunction = () =>{
        handleSettingState(title);
        handleModal(false);
    }
    return (
        <>
            <Modal
            isVisible={visible}
            style={{flex:1, margin: 0}}
            animationIn="fadeIn"
            animationOut="fadeOut"
            onBackdropPress={() => handleModal(false)}
            onBackButtonPress={() => handleModal(false)}
            animated
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating
            backdropOpacity={0.2}
            >

            <View
                style={[styles.flex]}
            >
                <View style={[styles.confirmationModal,{backgroundColor: globalStyle?.bgBody, borderColor: globalStyle?.borderColor,}]}>

                <Text style={{fontSize: globalStyle?.fontSize, alignSelf:'flex-start', color: globalStyle?.color, fontSize: 17, fontWeight: 'bold', padding: 5,}}>
                    {title}
                </Text>
                <Text style={{fontSize: globalStyle?.fontSize, alignSelf:'flex-start', color: globalStyle?.color, padding: 5,}}>
                    {/* Are you sure want to move the entry to trash? */}
                    {message}
                </Text>
                <View style={{
                    marginTop: 10,
                    alignSelf:'flex-end',
                    flexDirection:'row',
                    
                    }}
                >
                    <TouchableOpacity style={[styles.deleteButtons]} onPress={() => handleModal(false)}>
                        <Text style={{ color: globalStyle?.color, fontSize: globalStyle?.fontSize}}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  style={[styles.deleteButtons,]} onPress={() => handleFunction()}>
                        <Text style={{color: title === "Delete" ? "red" : globalStyle.settingsColor, fontSize: globalStyle?.fontSize}}>Confirm</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            </Modal>
        </>
    );
}

export default ConfirmationModal;
