import React, {useState, useEffect, Fragment} from 'react'
import MapView, {Marker} from 'react-native-maps'
import {View, StyleSheet, StatusBar, Image} from 'react-native'

import Geolocation from '@react-native-community/geolocation'
import Geocoder from 'react-native-geocoding'

import Search from '../Search'
import Directions from '../Directions'
import Details from '../Details'

import {getPixelSize} from '../../utils'

import markerImage from '../../assets/marker.png'
import backImage from '../../assets/back.png'

import {GOOGLE_API_KEY} from '@env'

import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
} from './styles'

Geocoder.init(GOOGLE_API_KEY)

export default function Map() {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0143,
    longitudeDelta: 0.0134,
  })

  const [destination, setDestination] = useState(null)
  const [duration, setDuration] = useState(null)
  const [coordinates, setCoordinates] = useState({})
  const [location, setLocation] = useState('')

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async ({coords: {latitude, longitude}}) => {
        const response = await Geocoder.from({latitude, longitude})
        const address = response.results[0].formatted_address
        setLocation(address.substring(0, address.indexOf(',')))

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134,
        })
      },
      (error) => {
        console.error(error)
      },
      {
        timeout: 2000,
        enableHighAccuracy: true,
      },
    )
  }, [])

  useEffect(() => {
    this.mapView.fitToCoordinates(coordinates, {
      edgePadding: {
        right: getPixelSize(50),
        bottom: getPixelSize(350),
        left: getPixelSize(50),
        top: getPixelSize(50),
      },
    })
  }, [coordinates])

  handleLocationSelected = (data, {geometry}) => {
    const {
      location: {lat: latitude, lng: longitude},
    } = geometry
    setDestination({
      latitude,
      longitude,
      title: data.structured_formatting.main_text,
    })
  }

  handleBack = () => {
    setDestination(null)
  }
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <MapView
        style={styles.mapContainer}
        region={region}
        showsUserLocation
        loadingEnabled
        ref={(el) => (this.mapView = el)}>
        {destination && (
          <Fragment>
            <Directions
              origin={region}
              destination={destination}
              onReady={(result) => {
                setCoordinates(result.coordinates)
                /* this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    bottom: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                  },
                }) */
                setDuration(Math.floor(result.duration))
              }}
              onError={(error) => {
                console.log(error)
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{x: 0, y: 0}}
              image={markerImage}>
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker coordinate={region} anchor={{x: 0, y: 0}}>
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </Fragment>
        )}
      </MapView>

      {destination ? (
        <Fragment>
          <Back onPress={handleBack}>
            <Image source={backImage} />
          </Back>
          <Details />
        </Fragment>
      ) : (
        <Search onLocationSelected={handleLocationSelected} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
})
