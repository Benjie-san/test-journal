import { StyleSheet, Text, View, Platform } from "react-native";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Brp, Search, More, Bible} from "./index";

//icon imports
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FontAwesome5 } from '@expo/vector-icons';

import Settings from "../components/moreComponents/Settings";
import Archive from "../components/moreComponents/Archive";
import Trash from '../components/moreComponents/Trash'
import Entry from '../components/Entry';

import { useTheme } from 'react-native-paper';

//const Tab = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const BibleStack = createNativeStackNavigator();

const SearchStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

export default function NavigationIndex ({ currentTheme, currentFontSize, currentSort, currentDisplay, currentFilter, handleTheme, handleFontSize, handleSort, handleDisplay, handleFilter}) {
    const theme = useTheme();

    // RENDER OF COMPONENTS AND PASSING SOME PROPS
    const RenderHome = (props) => ( 
        <Home {...props} 
            currentSort={currentSort} currentDisplay={currentDisplay} currentFilter={currentFilter}
        /> 
    );
    const RenderEntry = (props) => ( <Entry {...props} /> );
    const RenderBrp = (props) => <Brp {...props}/>;
    const RenderBible = (props) => <Bible {...props}/>;
    const RenderSearch = (props) => ( <Search {...props} />);
    const RenderMore = (props) => ( <More {...props} /> );
    const RenderSettings = (props) => (
        <Settings {...props} 
        currentTheme={currentTheme} currentFontSize={currentFontSize}
        currentSort={currentSort} currentDisplay={currentDisplay} currentFilter={currentFilter} 

        handleTheme={handleTheme} handleFontSize={handleFontSize} 
        handleSort={handleSort} handleDisplay={handleDisplay} handleFilter={handleFilter} 
        />);
    const RenderArchive = (props) => ( <Archive {...props}   /> );
    const RenderTrash = (props) => ( <Trash {...props}   /> );

    //STACKS OF COMPONENTS
    const StackHome = () => (
        <HomeStack.Navigator
            screenOptions={{ 
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTitleStyle:{
                    color: theme.colors.textColor,
                },
                animation:'slide_from_right',
                headerTintColor: theme.colors.textColor,
            }}
        >
            <HomeStack.Screen   
                name="HomeStack"
                component={RenderHome}
                options={{ headerShown: false, headerTitleAlign: "center",
                }}
            />  

            <HomeStack.Screen
                name="BRP"
                options={{headerTitle: "Bible Reading Plan",}}
                component={RenderBrp}
            />

            <HomeStack.Screen name="Entry" component={RenderEntry} />
        </HomeStack.Navigator>
    );

    const StackBible = () => (
        <BibleStack.Navigator
            screenOptions={{ 
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTitleStyle:{
                    color: theme.colors.textColor,
                },
                animation:'slide_from_right',
                headerTintColor: theme.colors.textColor,
            
            }}
        >

            <BibleStack.Screen name="BibleStack" component={RenderBible} options={{ 
                tabBarStyle: {
                    display: "none",
                },
                tabBarButton: () => null,
            }} />
        
        </BibleStack.Navigator>
    );

    const StackSearch = () => (
        <SearchStack.Navigator
            screenOptions={{ 
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTitleStyle:{
                    color: theme.colors.textColor,
                },
                animation:'slide_from_right',
                headerTintColor: theme.colors.textColor,
            }}
        >

            <SearchStack.Screen name="SearchStack" component={RenderSearch} />
            
            <SearchStack.Screen name="SearchEntry" component={RenderEntry} />

        </SearchStack.Navigator>
    );

    const StackMore = () => (
        <MoreStack.Navigator
            screenOptions={{ 
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTitleStyle:{
                    color: theme.colors.textColor,
                },
                animation:'slide_from_right',
                headerTintColor: theme.colors.textColor,
            }}
        >

            <MoreStack.Screen
                name="MoreStack"
                component={RenderMore}
                options={{ headerTitle: "More",}}
            />

            <MoreStack.Screen
                name="Settings"
                component={RenderSettings}
                options={{ headerTitle: "Settings",}}
            />

            <MoreStack.Screen
            name="Archive"
            component={RenderArchive}
            options={{ headerTitle: "Settings", }}
            
            />

            <MoreStack.Screen
                name="Trash"
                component={RenderTrash}
                options={{ headerTitle: "Settings",}}
            />
        
            <MoreStack.Screen name="MoreEntry" component={RenderEntry} />

        </MoreStack.Navigator>
    );

    return(
        <Tab.Navigator
            initialRouteName="Home"
            barStyle={{ backgroundColor: theme.colors.primary}}
        >
            <Tab.Screen
                component={StackHome}
                name="Home"
                options={{
                    tabBarLabel: <Text style={{textAlign : "center", color: '#0998e7'}}>Home</Text>,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    name={focused ? "md-home" : "md-home-outline"}
                                    size={24}
                                    color="#0998e7"
                                />
                            </View>
                        );
                    },
                    tabBarHideOnKeyboard: true,
                }}
            />
            
            {/* <Tab.Screen
            component={StackBible}
            name="Bible"
            options={{
                title: "Bible",
                tabBarIcon: ({ }) => {
                    return (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <FontAwesome5 name="bible" size={24} color="#1d9bf0" />
                        </View>
                    );
                },
                tabBarHideOnKeyboard: true,
            }}
            /> */}

            <Tab.Screen
            component={StackSearch}
            name="Search"
            options={{
                tabBarLabel: <Text style={{textAlign : "center", color: '#e67b0c'}}>Search</Text>,
                tabBarIcon: ({ focused }) => {
                    return (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Ionicons
                                name={focused ? "md-search" : "md-search-outline"}
                                size={24}
                                color="#e67b0c"
                            />
                        </View>
                    );
                },
                tabBarHideOnKeyboard: true,
            }}
            />

            <Tab.Screen
                component={StackMore}
                name="More"
                options={{
                    tabBarLabel: <Text style={{textAlign : "center", color: '#faca2a'}}>More</Text>,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <MaterialIcons
                                    name={focused ? "more" : "more-horiz"}
                                    size={24}
                                    color="#faca2a"
                                />
                            </View>
                        );
                    },
                    tabBarHideOnKeyboard: true,
            }}
            />
        </Tab.Navigator>
    );

}
