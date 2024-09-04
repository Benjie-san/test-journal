import { StyleSheet, Text, View, ScrollView } from 'react-native';
import content from '../../constants/content.json'
import ExpandableComponent from './ExpandableComponent';
import { useTheme } from 'react-native-paper';


export default function About() {
  const theme = useTheme();
  
  return (
    <View style={{flex: 1, backgroundColor: theme.colors.secondary,}}>
      <ScrollView>

        <ExpandableComponent title={content.cbcsof.title}>
          {
            content.cbcsof.items.map( (item, index) =>(
                <Text key={index} style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, gap: 10}}>{item}</Text>  
            ) )
          }
        </ExpandableComponent>

        <ExpandableComponent title={content.covenant.title}>
          {
            content.covenant.items.map( (item, index) =>(
              <Text key={index} style={
                {fontSize: theme.fonts.fontSize, 
                color: theme.colors.textColor, 
                gap: 10,
                fontWeight: item[0] == "O" ? "bold" : "normal"
              }}>
                { item }
              </Text>  
          ) )
          }
        </ExpandableComponent>

        <ExpandableComponent title={content.cbcdmp.title}>
          {
            content.cbcdmp.items.map( (item, index) =>(
                <Text key={index} style={{fontSize: theme.fonts.fontSize, color: theme.colors.textColor, gap: 10}}>{item}</Text>  
            ) )
          }
        </ExpandableComponent>

      </ScrollView>

    </View>
  )
}

