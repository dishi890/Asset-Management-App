import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Update paths to match actual screens
import Home from './Home';
import AssetSearch from './AssetSearch';
import AddAsset from './AddAsset';
import AssetHistory from './Assethistory';

const Tab = createBottomTabNavigator();

const ContentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#d0f595',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#009933',
          height: 60,
          paddingBottom: 5,
        },
        headerStyle: {
          backgroundColor: '#009933',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: 'white',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home" size={22} color={focused ? '#d0f595' : 'white'} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={AssetSearch}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="search" size={22} color={focused ? '#d0f595' : 'white'} />
          ),
        }}
      />
      <Tab.Screen
        name="Add New"
        component={AddAsset}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="plus-box" size={24} color={focused ? '#d0f595' : 'white'} />
          ),
        }}
      />
      <Tab.Screen
        name="Asset History"
        component={AssetHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="history" size={20} color={focused ? '#d0f595' : 'white'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTabs;
