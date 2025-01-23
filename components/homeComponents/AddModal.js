//import for react stuffs
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const AddModal = ({visible, type, handleModal}) => {
    const theme = useTheme();

    const handlePress = (item) =>{
        type(item);
        handleModal();
    }

    return(
        <>
            <Modal
                isVisible={visible}
                style={[styles.flex, {margin: 0, flex:1,}]}
                animationIn="fadeIn"
                animationOut="fadeOut"
                onBackButtonPress={handleModal}
                onBackdropPress={handleModal}
                backdropOpacity={0}
                animated
                backdropTransitionOutTiming={1}
                hideModalContentWhileAnimating
            >
            
                <View style={{
                    backgroundColor: theme.colors.primary,
                    borderWidth: 1,
                    borderColor: theme.colors.textColor,
                    padding: 20,
                    borderRadius: 10,
                    alignItems:'left',
                    flexDirection:'column',
                    justifyContent:"center",
                    width: '70%',
                    gap: 10,
                }} >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                    <MaterialIcons name="post-add" size={28} color={theme.colors.textColor} />           
                    <Text style={{fontSize: theme.fonts.fontSize+6,  color: theme.colors.textColor, }}>Add</Text>
                </View>
                
                <TouchableOpacity 
                    onPress={() => handlePress()} 
                    style={[styles.btn, { alignItems: "left",
                        borderWidth: 1,
                        borderColor: theme.colors.textColor,
                        backgroundColor: theme.colors.primary, 
                        flexDirection: 'row', 
                        gap: 5
                    }]}
                >
                    <Entypo name="book" size={26} color={theme.colors.textColor} />
                    <Text style={{fontSize: theme.fonts.fontSize+2, color: theme.colors.textColor, textAlign:'right'}}>Journal Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => handlePress("opm")} 
                    style={[styles.btn, { alignItems: "left", 
                        borderWidth: 1,
                        borderColor: theme.colors.textColor,flexDirection: 'row', gap: 10, backgroundColor:  theme.colors.primary}]}
                >
                    <Entypo name="open-book" size={26} color={theme.colors.textColor} />
                    <Text style={{fontSize: theme.fonts.fontSize+2,  color: theme.colors.textColor,}}>OPM Reflection</Text>
                </TouchableOpacity>

                </View>
            </Modal>
        </>
    );
}

export default AddModal;

const styles = StyleSheet.create({
    flex:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btn:{
        padding: 15,
        alignItems: 'center',
        margin: 5,
        borderRadius: 10,
       
    },
})