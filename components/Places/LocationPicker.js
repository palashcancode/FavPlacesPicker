import { StyleSheet, Alert, Text, Image, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { getAddress, getMapPreview } from "../../util/location";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

export default function LocationPicker({ onPickLocation }) {
  const [pickedLocation, setPickedLocation] = useState(null);
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route.params, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        onPickLocation({ ...pickedLocation, address: address });
      }
    }

    handleLocation();
  }, [pickedLocation, onPickLocation]);

  useEffect(() => {
    async function getPermissions() {
      if (!locationPermissionInformation) {
        const permissionResponse = await requestPermission();
        if (!permissionResponse.granted) {
          Alert.alert(
            "Insufficient Permission!",
            "You need to grant location permission to use this app."
          );
        }
      }
    }
    getPermissions();
  }, [locationPermissionInformation, requestPermission]);

  const verifyPermission = useCallback(async () => {
    if (!locationPermissionInformation) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permission!",
        "You need to grant location permission to use this app."
      );
      return false;
    }

    return true;
  }, [locationPermissionInformation, requestPermission]);

  const getLocationHandler = useCallback(async () => {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        return;
      }

      const location = await getCurrentPositionAsync();
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Could not fetch location",
        "Please try again later or pick a location on the map."
      );
    }
  }, [verifyPermission]);

  const pickMapHandler = useCallback(() => {
    navigation.navigate("Map");
  }, [navigation]);

  let locationPreview = <Text>No location picked yet.</Text>;

  if (pickedLocation) {
    try {
      const mapPreviewUrl = getMapPreview(
        pickedLocation.lat,
        pickedLocation.lng
      );
      locationPreview = (
        <Image style={styles.image} source={{ uri: mapPreviewUrl }} />
      );
    } catch (error) {
      console.error("Error generating map preview:", error);
      locationPreview = <Text>Error loading map preview</Text>;
    }
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
