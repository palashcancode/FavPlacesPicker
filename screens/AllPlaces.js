import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PlacesList from '../components/Places/PlacesList'
import { useIsFocused } from '@react-navigation/native'

export default function AllPlaces({route}) {
   const [loadedPlaces, setLoadedPlaces] = useState([]);


   const isFocused = useIsFocused();
   useEffect(() => {
    if (isFocused && route.params){
      setLoadedPlaces(curPlaces => [...curPlaces, route.params.place]);
    }
   }, [isFocused, route] )

  return <PlacesList places={loadedPlaces}/>
}

const styles = StyleSheet.create({
 
})