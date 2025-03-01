import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
          title: 'Counter',
        }}   
      />
      <Tabs.Screen 
        name="calendar"
        options={{
          title: 'Calendar',
        }}
      />
    </Tabs>
  )
}

export default Layout