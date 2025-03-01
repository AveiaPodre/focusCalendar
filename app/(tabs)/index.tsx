import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../global.css"

const { width, height } = Dimensions.get('window');

const Counter = () => {
  const [count, setCount] = useState(0);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    loadCount();
  }, []);

  useEffect(() => {
    saveCount();
    if (count % 7 === 0 && count !== 0) {
      addStar();
    }
  }, [count]);

  const loadCount = async () => {
    try {
      const savedCount = await AsyncStorage.getItem('count');
      const savedStars = await AsyncStorage.getItem('stars');
      if (savedCount !== null) {
        setCount(parseInt(savedCount));
      }
      if (savedStars !== null) {
        setStars(JSON.parse(savedStars));
      }
    } catch (e) {
      console.error('Failed to load the count from storage');
    }
  };

  const saveCount = async () => {
    try {
      await AsyncStorage.setItem('count', count.toString());
      await AsyncStorage.setItem('stars', JSON.stringify(stars));
    } catch (e) {
      console.error('Failed to save the count to storage');
    }
  };

  const addStar = () => {
    const newStar = {
      left: Math.random() * (width - 20),
      top: Math.random() * (height - 20),
    };
    setStars([...stars, newStar]);
  };

  const increment = () => setCount(prevCount => prevCount + 1);
  const reset = () => {
    setCount(0);
    setStars([]);
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-4xl mb-8">{count}</Text>
      <View className="flex-row">
        <TouchableOpacity
          onPress={increment}
          className="bg-blue-500 px-6 py-3 rounded-lg mr-4"
        >
          <Text className="text-white text-lg">Increment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={reset}
          className="bg-red-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-lg">Reset</Text>
        </TouchableOpacity>
      </View>
      {stars.map((star, index) => (
        <Text
          key={index}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            fontSize: 20,
          }}
        >
          ⭐
        </Text>
      ))}
    </View>
  );
}

export default Counter
