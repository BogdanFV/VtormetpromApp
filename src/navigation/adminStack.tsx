import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { AdminHomeScreen } from "../screens/AdminHome";
import CallScreen from "../screens/Call";
import SettingsScreen from "../screens/Settings";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

export default function AdminStack() {

  return (
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
            component={AdminHomeScreen}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => (
                <Feather
                  name="home"
                  color={focused ? "white" : "gray"}
                  size={24}
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
                  size={24}
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
  );
}



