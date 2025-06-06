import React from 'react';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const LoginTabs = () => {
  return (
    <>
      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#d0f595',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: {
            backgroundColor: '#009933',
            height: 60,
            paddingBottom: 5
          },
          headerStyle: {
            backgroundColor: '#009933',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 25,
            color: 'white'
          },
          headerTitleAlign: 'center'
        }}
      >
        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="face-man"
                size={25}
                color={focused ? '#d0f595' : 'white'}
              />
            )
          }}
        />

        {/* Optional Signup tab (uncomment if needed) */}
        {/* 
        <Tab.Screen
          name="Signup"
          component={Signup}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="face-man-shimmer"
                size={25}
                color={focused ? '#d0f595' : 'white'}
              />
            ),
            unmountOnBlur: true
          }}
        />
        */}
      </Tab.Navigator>
    </>
  );
};

export default LoginTabs;
