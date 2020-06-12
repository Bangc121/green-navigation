import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from 'react-native-maps';
import RetroMapStyles from './RetroMapStyles.json';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

class Navigation extends PureComponent {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.state = {
      region: null,
      ready: true,
      coordinateFinal: null,
      responseWalking: null,
      responseCycling: null,
      responseDriving: null,
      coordinateWalking: null,
      coordinateCycling: null,
      coordinateDriving: null,
      start: '',
      startPoint: '',
      end: '',
      endPoint: '',
      marker: '',
      result: false,
    };
  }

  componentDidMount() {
    console.log('Component did mount');
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            longitudeDelta: 0.03,
            latitudeDelta: 0.03,
          },
        });
      },
      (error) => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  _onStartEditHandle = (start) => {
    this.setState({start});
    axios(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${start}.json?access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`,
    )
      .then((res) => {
        let coords = {
          latitude: res.data.features[0].geometry.coordinates[1],
          longitude: res.data.features[0].geometry.coordinates[0],
        };
        console.log(coords);
        this.setState({startPoint: coords});
      })
      .catch((errors) => {
        // react on errors.
      });
  };

  _onEndEditHandle = (end) => {
    this.setState({end});
    axios(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${end}.json?access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`,
    )
      .then((res) => {
        let coords = {
          latitude: res.data.features[0].geometry.coordinates[1],
          longitude: res.data.features[0].geometry.coordinates[0],
        };
        console.log(coords);
        this.setState({endPoint: coords});
      })
      .catch((errors) => {
        // react on errors.
      });
  };

  // 경로검색을 통해 api 경로 받아옴
  _onSearchHandle = () => {
    Keyboard.dismiss();

    const {startPoint, endPoint} = this.state;

    let walking = `https://api.mapbox.com/directions/v5/mapbox/walking/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?geometries=geojson&access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`;
    let cycling = `https://api.mapbox.com/directions/v5/mapbox/cycling/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?geometries=geojson&access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`;
    let driving = `https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?geometries=geojson&access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`;

    const requestWalking = axios.get(walking);
    const requestCycling = axios.get(cycling);
    const requestDriving = axios.get(driving);

    axios
      .all([requestWalking, requestCycling, requestDriving])
      .then(
        axios.spread((...responses) => {
          let coordinateWalking = responses[0].data.routes[0].geometry.coordinates.map(
            (item) => {
              return {latitude: item[1], longitude: item[0]};
            },
          );

          let coordinateCycling = responses[1].data.routes[0].geometry.coordinates.map(
            (item) => {
              return {latitude: item[1], longitude: item[0]};
            },
          );

          let coordinateDriving = responses[2].data.routes[0].geometry.coordinates.map(
            (item) => {
              return {latitude: item[1], longitude: item[0]};
            },
          );
          this.setState({
            responseWalking: responses[0],
            responseCycling: responses[1],
            responseDriving: responses[2],
            coordinateWalking: coordinateWalking,
            coordinateCycling: coordinateCycling,
            coordinateDriving: coordinateDriving,
            marker: [startPoint, endPoint],
            result: true,
          });
        }),
      )
      .catch((errors) => {
        // react on errors.
      });
  };

  _onNavigationView = (mode) => {
    const {
      coordinateWalking,
      coordinateCycling,
      coordinateDriving,
    } = this.state;
    setTimeout(() => {
      this.mapRef.fitToCoordinates(coordinateWalking, {
        edgePadding: {top: 50, right: 50, bottom: 120, left: 50},
        animated: true,
      });
    }, 1000);
    if (mode === 'walking') {
      this.setState({result: false, coordinateFinal: coordinateWalking});
    } else if (mode === 'cycling') {
      this.setState({result: false, coordinateFinal: coordinateCycling});
    } else if (mode === 'driving') {
      this.setState({result: false, coordinateFinal: coordinateDriving});
    }
  };

  rad = (x) => {
    return (x * Math.PI) / 180;
  };

  getDistance = (p1, p2) => {
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = this.rad(p2.latitude - p1.latitude);
    const dLong = this.rad(p2.longitude - p1.longitude);
    const xxx = parseInt(dLat);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.latitude)) *
        Math.cos(this.rad(p2.latiDegr)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d; // returns the distance in meter
  };
  _onRegionChange = (region) => {
    const {endPoint} = this.state;
    console.log('_onRegionChange: ' + region.latitude);
    console.log(this.getDistance(region, endPoint));
    // getDistance(region, endPoint);
  };

  render() {
    const {
      coordinateFinal,
      start,
      end,
      marker,
      result,
      responseWalking,
      responseCycling,
      responseDriving,
      region,
    } = this.state;

    // const nearPoints = centerList.map((rows) => {
    //   return {...rows, nearPoint: getDistance(geoLoacation, rows)};
    // });

    // const orderBynearPointList = nearPoints.sort((a, b) => {
    //   return +(a.nearPoint > b.nearPoint) || +(a.nearPoint === b.nearPoint) - 1;
    // });

    const mapView = (
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={(ref) => {
          this.mapRef = ref;
        }}
        // customMapStyle={RetroMapStyles}
        showsUserLocation={true}
        followUserLocation={true}
        region={region}
        onRegionChange={(region) => {
          this._onRegionChange(region);
        }}
        style={{flex: 1}}>
        {/* <Marker coordinate={desLocation} title={'시작'} /> */}
        {coordinateFinal === null ? (
          <Marker />
        ) : (
          marker.map((marker) => <Marker coordinate={marker} />)
        )}
        <Polyline
          coordinates={coordinateFinal} // 연결될 선들의 좌표
          strokeColor="red"
          fillColor="rgba(255,0,0,0.5)"
          strokeWidth={4}
        />
      </MapView>
    );
    const resultView = (
      <View style={styles.resultContainer}>
        <TouchableOpacity onPress={() => this._onNavigationView('walking')}>
          <View style={{flexDirection: 'column', marginBottom: 25}}>
            <Text style={{marginBottom: 8, fontSize: 26, color: 'green'}}>
              Green
            </Text>
            <Text style={{marginBottom: 8, fontSize: 20}}>걷기</Text>
            {responseWalking === null ? (
              <View></View>
            ) : (
              <View>
                <Text style={{marginBottom: 8, fontSize: 20}}>
                  {responseWalking.data.routes[0].legs[0].distance}m
                </Text>
                <Text style={{marginBottom: 8}}>
                  {responseWalking.data.routes[0].legs[0].duration}분
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onNavigationView('cycling')}>
          <View style={{flexDirection: 'column', marginBottom: 25}}>
            <Text style={{marginBottom: 8, fontSize: 26, color: 'yellow'}}>
              Yellow
            </Text>
            <Text style={{marginBottom: 8, fontSize: 20}}>자전거</Text>
            {responseCycling === null ? (
              <View></View>
            ) : (
              <View>
                <Text style={{marginBottom: 8, fontSize: 20}}>
                  {responseCycling.data.routes[0].legs[0].distance}m
                </Text>
                <Text style={{marginBottom: 8}}>
                  {responseCycling.data.routes[0].legs[0].duration}분
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onNavigationView('driving')}>
          <View style={{flexDirection: 'column'}}>
            <Text style={{marginBottom: 8, fontSize: 26, color: 'red'}}>
              Red
            </Text>
            <Text style={{marginBottom: 8, fontSize: 20}}>자동차</Text>
            {responseDriving === null ? (
              <View></View>
            ) : (
              <View>
                <Text style={{marginBottom: 8, fontSize: 20}}>
                  {responseDriving.data.routes[0].legs[0].distance}m
                </Text>
                <Text style={{marginBottom: 8}}>
                  {responseDriving.data.routes[0].legs[0].duration}분
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
    return (
      <SafeAreaView style={styles.container}>
        <View style={{height: 100, flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            <TextInput
              {...commonInputProps}
              fontSize={17}
              placeholder={'출발지'}
              keyboardType="default"
              onChangeText={this._onStartEditHandle}
              returnKeyType="next"
              value={start}
            />
          </View>
          <View style={{flex: 1}}>
            <TextInput
              {...commonInputProps}
              fontSize={17}
              placeholder={'도착지'}
              keyboardType="default"
              onChangeText={this._onEndEditHandle}
              returnKeyType="next"
              value={end}
            />
          </View>
        </View>
        <View>
          <Button
            onPress={this._onSearchHandle}
            title="경로 찾기"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        {result === false ? mapView : resultView}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    padding: 12,
  },
  input: {
    borderColor: '#9B9B9B',
    color: 'black',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 8,
    flex: 1,
  },
  versionBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  versionText: {
    padding: 4,
    backgroundColor: '#FFF',
    color: '#000',
  },
});

const commonInputProps = {
  style: styles.input,
  underlineColorAndroid: 'transparent',
  autoCapitalize: 'none',
  autoCorrect: false,
};

export default Navigation;
