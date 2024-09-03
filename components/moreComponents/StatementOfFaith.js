import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';


export default function StatementOfFaith() {
  const theme = useTheme();

  const textStyles = {
    fontSize: theme.fonts.fontSize,
    color: theme.colors.textColor,

  }

  return (
    <View style={{gap: 10, padding: 10, flexWrap: 'wrap'}}>
        <Text style={textStyles}>I. We all accept without question that the 66 books of the Bible, 
        in both Old and New Testament, is the inspired Word of God to man. It is the ultimate authority of faith and practice for the Christian church today (Psalm 119:160; 2 Timothy 3:16).</Text>
        <Text>II. We believe in one God, revealed in three persons of the Father,
        the Son, and the Holy Spirit, as the sovereign Creator and Ruler of the universe. The three persons of the God- head are all equal in essence and in power (1 John 5:7).</Text>
        <Text>III. We believe in the deity of Jesus Christ, His miraculous virgin birth, and His fulfilling of the prophecy of the coming of the Messiah. He is the God-man who was crucified to atone for the sins of His people. He was resurrected from the dead. He now reigns in glory, and He will visibly return to this world to judge and to take His saints with Him in heaven (Isaiah 9:6; John 1:14; John 3:16; Acts 17:31; Revelation 22:20).</Text>
    </View>
  )
}

const styles = StyleSheet.create({})