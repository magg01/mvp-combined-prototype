/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useRef } from 'react';
import {
  Button, View, Text, StyleSheet, Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import colors from '../utils/colors';
import { zeroPadTime } from '../utils/datetime';
import { DTPickerNativePickerModeEnum, DTPickerUpdateValueEnum } from '../utils/enums';

const IconSize = 28;

function DateTimePicker({
  calEvent, dateOnly, onSubmit, onCancel, modalTitleText,
}) {
  const [isNativePickerVisible, setIsNativePickerVisibile] = useState(false);
  const [datePicked, setDatePicked] = useState(
    calEvent ? new Date(calEvent.date) : new Date(),
  );
  const [startTimePicked, setStartTimePicked] = useState(
    calEvent ? new Date(calEvent.start) : new Date(),
  );
  const [endTimePicked, setEndTimePicked] = useState(
    calEvent ? new Date(calEvent.end) : new Date(),
  );

  const pickerMode = useRef(DTPickerNativePickerModeEnum.date);
  const updateValue = useRef(DTPickerUpdateValueEnum.date);

  const showNativePicker = (valueToUpdate) => {
    if (valueToUpdate === DTPickerUpdateValueEnum.date) {
      pickerMode.current = DTPickerNativePickerModeEnum.date;
      updateValue.current = DTPickerUpdateValueEnum.date;
    } else if (valueToUpdate === DTPickerUpdateValueEnum.startTime) {
      pickerMode.current = DTPickerNativePickerModeEnum.time;
      updateValue.current = DTPickerUpdateValueEnum.startTime;
    } else if (valueToUpdate === DTPickerUpdateValueEnum.endTime) {
      pickerMode.current = DTPickerNativePickerModeEnum.time;
      updateValue.current = DTPickerUpdateValueEnum.endTime;
    }
    setIsNativePickerVisibile(true);
  };

  const hideNativePicker = () => {
    setIsNativePickerVisibile(false);
  };

  const handleConfirm = (date) => {
    if (updateValue.current === DTPickerUpdateValueEnum.date) {
      setDatePicked(date);
    } else if (updateValue.current === DTPickerUpdateValueEnum.startTime) {
      setStartTimePicked(date);
    } else if (updateValue.current === DTPickerUpdateValueEnum.endTime) {
      setEndTimePicked(date);
    }
    hideNativePicker();
  };

  const onClose = (shouldReturnDateTime) => {
    if (shouldReturnDateTime) {
      if (dateOnly) {
        onSubmit({ date: datePicked });
      } else {
        onSubmit({ date: datePicked, startTime: startTimePicked, endTime: endTimePicked });
      }
    } else {
      onCancel();
    }
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={() => onClose(false)}
    >
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          {modalTitleText
            && (
              <Text style={styles.titleText}>{modalTitleText}</Text>
            )}
          <View style={styles.selectorRowContainer}>
            <Text style={styles.dateTimePickerHeader}>
              Date:
            </Text>
            <Text style={styles.dateTimePickerDateTime}>
              {datePicked.toDateString()}
            </Text>
            <MaterialCommunityIcons
              name="calendar-edit"
              size={IconSize}
              color={colors.plans.textOrIconOnWhite}
              onPress={() => showNativePicker('date')}
            />
          </View>
          {!dateOnly
            && (
              <>
                <View style={styles.selectorRowContainer}>
                  <Text style={styles.dateTimePickerHeader}>
                    Start:
                  </Text>
                  <Text style={styles.dateTimePickerDateTime}>
                    {zeroPadTime(startTimePicked.getHours())}
                    :
                    {zeroPadTime(startTimePicked.getMinutes())}
                  </Text>
                  <MaterialCommunityIcons
                    name="clock-edit-outline"
                    size={IconSize}
                    color={colors.plans.textOrIconOnWhite}
                    onPress={() => showNativePicker('startTime')}
                  />
                </View>
                <View style={styles.selectorRowContainer}>
                  <Text style={styles.dateTimePickerHeader}>
                    End:
                  </Text>
                  <Text style={styles.dateTimePickerDateTime}>
                    {zeroPadTime(endTimePicked.getHours())}
                    :
                    {zeroPadTime(endTimePicked.getMinutes())}
                  </Text>
                  <MaterialCommunityIcons
                    name="clock-edit-outline"
                    size={IconSize}
                    color={colors.plans.textOrIconOnWhite}
                    onPress={() => showNativePicker('endTime')}
                  />
                </View>
              </>
            )}
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={() => onClose(false)} />
            <Button title="Submit" onPress={() => onClose(true)} />
          </View>
          <DateTimePickerModal
            isVisible={isNativePickerVisible}
            mode={pickerMode.current}
            onConfirm={handleConfirm}
            onCancel={hideNativePicker}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
    backgroundColor: colors.modals.outerColorOpacity,
  },
  innerContainer: {
    backgroundColor: colors.general.defaultWhite,
    padding: 20,
    opacity: 1,
    shadowColor: colors.general.defaultBlack,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  titleText: {
    fontWeight: '500',
    fontSize: 20,
    marginBottom: 12,
    color: colors.plans.textOrIconOnWhite,
  },
  selectorRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderColor: colors.plans.textOrIconOnWhite,
    marginHorizontal: 3,
    marginBottom: 18,
  },
  dateTimePickerHeader: {
    color: colors.plans.textOrIconOnWhite,
    fontSize: 20,
    minWidth: '18%',
  },
  dateTimePickerDateTime: {
    color: colors.plans.textOrIconOnWhite,
    fontSize: 16,
    marginLeft: 20,
    flexGrow: 1,
  },
  buttonRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default DateTimePicker;
