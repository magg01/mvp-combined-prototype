import React, { useState, useRef } from "react";
import { Button, View, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Example = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicked, setDatePicked] = useState(new Date());
  const [startTimePicked, setStartTimePicked] = useState(new Date())
  const [endTimePicked, setEndTimePicked] = useState(new Date())
  const pickerMode = useRef('date');
  const updateValue = useRef('date');

  const showDatePicker = (mode) => {
    if(mode === 'date'){
      pickerMode.current = 'date';
      updateValue.current = 'date'  
    } else if (mode === 'startTime'){
      pickerMode.current = 'time';
      updateValue.current = 'startTime'  
    } else if (mode === 'endTime'){
      pickerMode.current = 'time';
      updateValue.current = 'endTime'  
    }
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if(updateValue.current === 'date'){
      console.log("A date has been picked: ", date);
      setDatePicked(date);
    } else if(updateValue.current === 'startTime'){
      console.log("A time has been picked: ", date);
      setStartTimePicked(date);
    } else if(updateValue.current === 'endTime'){
      console.log("A time has been picked: ", date);
      setEndTimePicked(date);
    }
    hideDatePicker();
  };

  return (
    <View>
      <Button title="Show Date Picker" onPress={() => showDatePicker('date')} />
      <Text style={{color:'white'}}>Date: {datePicked.toDateString()}</Text>
      <Button title="Show Start Time Picker" onPress={() => showDatePicker('startTime')} />
      <Text style={{color:'white'}}>Start time: {startTimePicked.getHours()}:{startTimePicked.getMinutes()} </Text>
      <Button title="Show End Time Picker" onPress={() => showDatePicker('endTime')} />
      <Text style={{color:'white'}}>End time: {endTimePicked.getHours()}:{endTimePicked.getMinutes()}</Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={pickerMode.current}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default Example;