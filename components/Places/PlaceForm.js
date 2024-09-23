// PlaceForm.js
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Colors } from '../../constants/colors';
import ImagePicker from './ImagePickers'; 
import LocationPicker from './LocationPicker'; 
import Button from '../UI/Button'; 
import { Place } from '../../models/place';

export default function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [pickedLocation, setPickedLocation] = useState();

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location) => {
    if (location) {
      setPickedLocation(location);
    }
  }, []);

  function savePlaceHandler() {
    if (!enteredTitle || !selectedImage || !pickedLocation) {
      console.log("Incomplete data. Please fill in all fields.");
      return;
    }
    const placeData = new Place(enteredTitle, selectedImage, pickedLocation);
    console.log("Place data being sent:", placeData);
    onCreatePlace(placeData);
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} />
      <LocationPicker onPickLocation={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: { // Updated from 'labels' to 'label'
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 4,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary700,
  },
});
