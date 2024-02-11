import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard,
  Share,
  Alert,
  SafeAreaView,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Region} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/@';
Geocoder.init(`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
interface AddressRegion extends Region {
  latitudeDelta: number;
  longitudeDelta: number;
}

const App: React.FC = () => {
  const [region, setRegion] = useState<AddressRegion>({
    latitude: -23.563987,
    longitude: -46.653254,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [address, setAddress] = useState<string>('');
  const mapRef = useRef<MapView>(null);

  const onRegionChangeComplete = useCallback((newRegion: AddressRegion) => {
    setRegion(newRegion);
    Geocoder.from(newRegion.latitude, newRegion.longitude)
      .then(json => {
        const addressComponent: string = json.results[0].formatted_address;
        setAddress(addressComponent);
      })
      .catch(error => console.warn(error));
  }, []);

  const copyToClipboard = useCallback((value: string) => {
    Clipboard.setString(value);
  }, []);

  const onShare = useCallback(async () => {
    try {
      const url = `${GOOGLE_MAPS_URL}${region.latitude},${region.longitude},15z?entry=ttu`;
      await Share.share({message: url});
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  }, [region]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{...styles.map, flex: 1}}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          onRegionChangeComplete={onRegionChangeComplete}
          initialRegion={region}
        />
        <View style={styles.markerFixed}>
          <Text style={styles.marker}>📍</Text>
        </View>
      </View>
      <View style={styles.addressBar}>
        <Text style={styles.title}>Share your location</Text>
        <View
          style={{
            ...styles.shareStyle,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            gap: 8,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
          <View
            style={{
              width: 80,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => copyToClipboard(address)}>
              <Text style={styles.buttonText}>❏</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.shareStyle}>
          <TouchableOpacity style={styles.button} onPress={onShare}>
            <Text style={styles.buttonText}>Share Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    fontSize: 48,
  },
  addressBar: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  addressText: {
    color: '#000',
  },
  shareStyle: {
    marginTop: 26,
  },
  button: {
    backgroundColor: '#1d8fb9',
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
