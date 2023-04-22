import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { FIRESTORE_DB } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import HomeScreen from "../screens/Home";
import CallScreen from "../screens/Call";
import SettingsScreen from "../screens/Settings";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";



const Tab = createBottomTabNavigator();

export default function UserStack() {

  return (
    <>
      
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: "#2e2e2e" },
          }}
          sceneContainerStyle={{ backgroundColor: "#2e2e2e" }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Feather
                name="home"
                color={focused ? "white" : "gray"}
                // size={"24"}
              />
            ),
          }}
          />
          <Tab.Screen
          name="Call"
          component={CallScreen}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Feather
                name="users"
                color={focused ? "white" : "gray"}
                // size={"24"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            },
          }}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => <SettingsScreen />,
          }}
        />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}  
        
        

