import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../global.css"

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const Calendar = () => {
  const [selectedDays, setSelectedDays] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [consecutiveDays, setConsecutiveDays] = useState(0);

  useEffect(() => {
    loadSelectedDays();
  }, []);

  useEffect(() => {
    saveSelectedDays();
    updateConsecutiveDays();
  }, [selectedDays]);

  const loadSelectedDays = async () => {
    try {
      const savedDays = await AsyncStorage.getItem('selectedDays');
      if (savedDays !== null) {
        setSelectedDays(JSON.parse(savedDays));
      }
    } catch (e) {
      console.error('Failed to load selected days from storage');
    }
  };

  const saveSelectedDays = async () => {
    try {
      await AsyncStorage.setItem('selectedDays', JSON.stringify(selectedDays));
    } catch (e) {
      console.error('Failed to save selected days to storage');
    }
  };

  const updateConsecutiveDays = () => {
    const sortedDays = Object.keys(selectedDays).sort();
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    let prevDay = null;

    for (const day of sortedDays) {
      const currentDate = new Date(day);
      if (prevDay) {
        const diff = (currentDate - prevDay) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentConsecutive++;
        } else {
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
          currentConsecutive = 1;
        }
      } else {
        currentConsecutive = 1;
      }
      prevDay = currentDate;
    }

    maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    setConsecutiveDays(maxConsecutive);
  };

  const toggleDay = (day) => {
    const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    setSelectedDays(prev => {
      if (prev[dateString]) {
        const { [dateString]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [dateString]: true };
      }
    });
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const calendar = [];

    for (let i = 0; i < firstDay; i++) {
      calendar.push(<View key={`empty-${i}`} className="w-10 h-10 m-1" />);
    }

    for (let day = 1; day <= days; day++) {
      const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
      const isSelected = selectedDays[dateString];
      calendar.push(
        <TouchableOpacity
          key={day}
          onPress={() => toggleDay(day)}
          className={`w-10 h-10 items-center justify-center m-1 rounded-full ${
            isSelected ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        >
          <Text className={isSelected ? 'text-white' : 'text-black'}>{day}</Text>
        </TouchableOpacity>
      );
    }

    return calendar;
  };

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <View className="flex-1 items-center justify-start bg-gray-100 pt-8">
      <View className="flex-row items-center justify-between w-full px-4 mb-4">
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text className="text-2xl">{'<'}</Text>
        </TouchableOpacity>
        <Text className="text-xl">
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text className="text-2xl">{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap justify-center">
        {renderCalendar()}
      </View>
      <Text className="mt-4 text-lg">Consecutive days: {consecutiveDays}</Text>
    </View>
  );
}

export default Calendar
