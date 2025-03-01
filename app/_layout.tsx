import { View, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <GestureHandlerRootView className='flex-1'>
      <Stack>
        <Stack.Screen 
          name = "(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  )
}

export default RootLayout