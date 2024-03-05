import styles from '../styles/entryStyle';
import { Text, View, TouchableOpacity,} from 'react-native';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper';

const ConfirmationModal = ({visible, title, message, settingState, handleSettingState, handleModal,}) => {
    const theme = useTheme();

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
                <View style={[styles.confirmationModal,{backgroundColor: theme.colors.secondary, borderColor: theme.colors.borderColor,}]}>

                <Text style={{fontSize: theme.fonts.fontSize, alignSelf:'flex-start', color: theme.colors.textColor, fontWeight: 'bold', padding: 5,}}>
                    {title}
                </Text>
                <Text style={{fontSize: theme.fonts.fontSize, alignSelf:'flex-start', color: theme.colors.textColor, padding: 5,}}>
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
                        <Text style={{ color: theme.colors.textColor, fontSize: theme.fonts.fontSize}}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  style={[styles.deleteButtons,]} onPress={() => handleFunction()}>
                        <Text style={{color: title === "Delete" ? "red" : theme.colors.altColor, fontSize: theme.fonts.fontSize}}>Confirm</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            </Modal>
        </>
    );
}

export default ConfirmationModal;
