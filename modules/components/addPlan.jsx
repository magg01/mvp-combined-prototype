import React, { useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import {
  StyleSheet, Text, TextInput, Alert, TouchableOpacity,
} from 'react-native';
import * as db from '../database/database';
import DateTimePicker from './dateTimePicker';
import animations from '../utils/animations';

function AddPlan(props) {
  const toBeId = useRef(props.toBeId);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const calEvent = useRef(null);

  const addPlan = () => {
    db.addPlan(newPlanTitle, toBeId.current, calEvent.current)
      .then((success) => {
        if (success) {
          props.onAdd();
        } else {
          Alert.alert("Unable to add a new plan at this time.");
        }
      });
  };

  const addCalendar = () => {
    setShowDateTimePicker(true);
  };

  const onDateTimeChange = (eventDate, eventStartTime, eventEndTime) => {
    calEvent.current = {
      date: eventDate.toISOString(),
      start: eventStartTime.toISOString(),
      end: eventEndTime.toISOString(),
    };
    setShowDateTimePicker(false);
  };

  return (
    <Animated.View
      style={styles.container}
      entering={animations.addPlan.addPlanView.entering}
      exiting={animations.addPlan.addPlanView.exiting}
    >

      <Text style={{color: props.tintColor, fontSize: 20}}>How can you be more {props.toBeItemTitle.toLowerCase()}?</Text>
      <TextInput style={[styles.input, {borderBottomColor: props.tintColor, color: props.tintColor}]} onChangeText={(text) => setNewPlanTitle(text)} />
      <TouchableOpacity style={styles.addButton} onPress={addPlan}>
        <Text>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={addCalendar}>
        <Text>Cal</Text>
      </TouchableOpacity>
      {showDateTimePicker && (
      <DateTimePicker
        calEvent={calEvent.current}
        onDateTimeChange={
          // eslint-disable-next-line max-len
          (eventDate, eventStartTime, eventEndTime) => onDateTimeChange(eventDate, eventStartTime, eventEndTime)
        }
        onCancel={() => setShowDateTimePicker(false)}
      />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  input: {
    width: "50%",
    margin: 12,
    borderBottomWidth: 2,
    padding: 6,
    fontSize: 20,
  },
  addButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white'
  }
});

export default AddPlan;
