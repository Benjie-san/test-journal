import { StyleSheet, Text, View, Platform } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Brp, Search, More} from "./index";

//icon imports
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Settings from "../components/Settings";
import Archive from "../components/Archive";
import Trash from '../components/Trash'
import Entry from '../components/Entry';

import { useTheme } from 'react-native-paper';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

export default function NavigationIndex ({currentTheme, currentFontSize, handleTheme, handleFontSize}) {

    const theme = useTheme();
    
    const RenderHome = (props) => ( <Home {...props} /> );
    const RenderEntry = (props) => ( <Entry {...props} /> );
    const RenderBrp = (props) => <Brp {...props}/>;
    const RenderSearch = (props) => ( <Search {...props} />);
    const RenderMore = (props) => ( <More {...props} /> );
    const RenderSettings = (props) => (<Settings {...props} currentTheme={currentTheme} currentFontSize={currentFontSize} handleTheme={handleTheme} handleFontSize={handleFontSize}  />);
    const RenderArchive = (props) => ( <Archive {...props}   /> );
    const RenderTrash = (props) => ( <Trash {...props}   /> );

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
                options={{ headerTitle: "Journal 2024", headerTitleAlign: "center",
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
                activeColor="#1d9bf0"
                barStyle={{ backgroundColor: theme.colors.primary}}
            >
                <Tab.Screen
                    component={StackHome}
                    name="Home"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ focused }) => {
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Ionicons
                                        name={focused ? "md-home" : "md-home-outline"}
                                        size={24}
                                        color="#1d9bf0"
                                    />
                                </View>
                            );
                        },
                        tabBarHideOnKeyboard: true,
                    }}
                />
                
                <Tab.Screen
                component={StackSearch}
                name="Search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons
                                    name={focused ? "md-search" : "md-search-outline"}
                                    size={24}
                                    color="#1d9bf0"
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
                        title: "More",
                        tabBarIcon: ({ focused }) => {
                            return (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <MaterialIcons
                                        name={focused ? "more" : "more-horiz"}
                                        size={24}
                                        color="#1d9bf0"
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
