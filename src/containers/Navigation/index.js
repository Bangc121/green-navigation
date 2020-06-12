import React, { PureComponent } from 'react';
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
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import RetroMapStyles from './RetroMapStyles.json';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import { ScrollView } from 'react-native-gesture-handler';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const pathType = {
  1: '지하철',
  2: '버스',
  3: '지하철+버스'
}

const trafficType = {
  1: '지하철',
  2: '버스',
  3: '도보'
}

class Navigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.478189,
        longitude: 126.982148,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
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
      path: [],
    };


  }



  // setRegion(region) {
  //   if (this.state.ready) {
  //     setTimeout(() => this.map.mapview.animateToRegion(region), 10);
  //   }
  //   //this.setState({ region });
  // }

  // componentDidMount() {
  //   console.log('Component did mount');
  //   this.getCurrentPosition();
  // }

  // getCurrentPosition() {
  //   try {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const region = {
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //           latitudeDelta: LATITUDE_DELTA,
  //           longitudeDelta: LONGITUDE_DELTA,
  //         };
  //         this.setRegion(region);
  //       },
  //       (error) => {
  //         //TODO: better design
  //         switch (error.code) {
  //           case 1:
  //             if (Platform.OS === 'ios') {
  //               Alert.alert(
  //                 '',
  //                 'Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización',
  //               );
  //             } else {
  //               Alert.alert(
  //                 '',
  //                 'Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización',
  //               );
  //             }
  //             break;
  //           default:
  //             Alert.alert('', 'Error al detectar tu locación');
  //         }
  //       },
  //     );
  //   } catch (e) {
  //     alert(e.message || '');
  //   }
  // }

  // onMapReady = (e) => {
  //   if (!this.state.ready) {
  //     this.setState({ready: true});
  //   }
  // };

  // onRegionChange = (region) => {
  //   console.log('onRegionChange', region);
  // };

  // onRegionChangeComplete = (region) => {
  //   console.log('onRegionChangeComplete', region);
  // };

  _onStartEditHandle = (start) => {
    this.setState({ start });
    axios(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${start}.json?access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`,
    )
      .then((res) => {
        let coords = {
          latitude: res.data.features[0].geometry.coordinates[1],
          longitude: res.data.features[0].geometry.coordinates[0],
        };
        // console.log(coords);
        this.setState({ startPoint: coords });
      })
      .catch((errors) => {
        // react on errors.
      });
  };

  _onEndEditHandle = (end) => {
    this.setState({ end });
    axios(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${end}.json?access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`,
    )
      .then((res) => {
        let coords = {
          latitude: res.data.features[0].geometry.coordinates[1],
          longitude: res.data.features[0].geometry.coordinates[0],
        };
        // console.log(coords);
        this.setState({ endPoint: coords });
      })
      .catch((errors) => {
        // react on errors.
      });
  };

  // 경로검색을 통해 api 경로 받아옴
  _onSearchHandle = () => {
    const { startPoint, endPoint } = this.state;

    let walking = `https://api.mapbox.com/directions/v5/mapbox/walking/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?geometries=geojson&access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`;
    let cycling = `https://api.mapbox.com/directions/v5/mapbox/cycling/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?geometries=geojson&access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`;
    let driving = `https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?geometries=geojson&access_token=pk.eyJ1Ijoia2ltanVuZ2h3YW4iLCJhIjoiY2tiM2R3ZDRkMG01dTM0bjlydWNqam03NCJ9.GYTyiR9uY91Wy_B37gvMug`;

    let odsay = `http://169.56.97.117/publictransportpath.php?SX=${startPoint.longitude}&SY=${startPoint.latitude}&EX=${endPoint.longitude}&EY=${endPoint.latitude}`
    console.log(odsay)

    const requestWalking = axios.get(walking);
    const requestCycling = axios.get(cycling);
    const requestDriving = axios.get(driving);


    axios({
      method: 'get',
      url: odsay,
      // responseType: 'arraybutter'
    })
      .then(response => {
        console.log('버스 결과 개수', response.data.result.busCount)
        console.log('지하철 결과 개수', response.data.result.subwayCount)
        console.log('지하철+버스 결과 개수', response.data.result.subwayBusCount)
        // console.log(pathType[response.data.result.path[0].pathType])
        this.setState({ path: response.data.result.path });
      });

    axios
      .all([requestWalking, requestCycling, requestDriving])
      .then(
        axios.spread((...responses) => {
          let coordinateWalking = responses[0].data.routes[0].geometry.coordinates.map(
            (item) => {
              return { latitude: item[1], longitude: item[0] };
            },
          );

          let coordinateCycling = responses[1].data.routes[0].geometry.coordinates.map(
            (item) => {
              return { latitude: item[1], longitude: item[0] };
            },
          );

          let coordinateDriving = responses[2].data.routes[0].geometry.coordinates.map(
            (item) => {
              return { latitude: item[1], longitude: item[0] };
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
    // console.log(mode);
    if (mode === 'walking') {
      this.setState({ result: false, coordinateFinal: coordinateWalking });
    } else if (mode === 'cycling') {
      this.setState({ result: false, coordinateFinal: coordinateCycling });
    } else if (mode === 'driving') {
      this.setState({ result: false, coordinateFinal: coordinateDriving });
    }
  };

  render() {
    const {
      coordinateFinal,
      start,
      destination,
      marker,
      result,
      responseWalking,
      responseCycling,
      responseDriving,
      region,
      path
    } = this.state;



    const mapView = (
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={(map) => {
          this.map = map;
        }}
        // customMapStyle={RetroMapStyles}
        showsUserLocation={true}
        region={this.state.region}
        onMapReady={this.onMapReady}
        showsMyLocationButton={false}
        onRegionChange={this.onRegionChange}
        onRegionChangeComplete={this.onRegionChangeComplete}
        style={{ flex: 1 }}>
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

    const convertTimestamptoTime = (unixTimestamp) => {
      let dateObj = new Date(unixTimestamp * 1000);
      utcString = dateObj.toUTCString();
      time = utcString.slice(-11, -4);
      return time;
    }

    const transPath = (item) => (

      <View style={{ margin: 10 }}>
        <Text>{pathType[item.pathType]}</Text>
        <Text>{item.info.totalTime} 분</Text>
        <Text>{item.info.totalDistance} km</Text>
        <Text>이동경로</Text>
        {item.subPath.map((item2, index) => {
          if (item2.distance === 0) return;
          return (
            <View>
              <Text>{index} 번째</Text>
              <Text>{trafficType[item2.trafficType]}</Text>
              <Text>{item2.distance}</Text>
              <Text style={{ color: 'red' }}>{item2.startName} -> {item2.endName}</Text>
            </View>
          )
        })}
      </View>
    )
    const resultView = (
      <ScrollView style={styles.resultContainer}>
        <TouchableOpacity onPress={() => this._onNavigationView('walking')}>
          <View style={{ flexDirection: 'column', marginBottom: 25 }}>
            <Text style={{ marginBottom: 8, fontSize: 26, color: 'green' }}>
              Green
            </Text>
            <Text style={{ marginBottom: 8, fontSize: 20 }}>걷기</Text>
            {responseWalking === null ? (
              <View></View>
            ) : (
                <View>
                  <Text style={{ marginBottom: 8, fontSize: 20 }}>
                    {responseWalking.data.routes[0].legs[0].distance}m
                </Text>
                  <Text style={{ marginBottom: 8 }}>
                    {convertTimestamptoTime(responseWalking.data.routes[0].legs[0].duration)}
                  </Text>
                </View>
              )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onNavigationView('cycling')}>
          <View style={{ flexDirection: 'column', marginBottom: 25 }}>
            <Text style={{ marginBottom: 8, fontSize: 26, color: 'green' }}>
              Green
            </Text>
            <Text style={{ marginBottom: 8, fontSize: 20 }}>자전거</Text>
            {responseCycling === null ? (
              <View></View>
            ) : (
                <View>
                  <Text style={{ marginBottom: 8, fontSize: 20 }}>
                    {responseCycling.data.routes[0].legs[0].distance}m
                </Text>
                  <Text style={{ marginBottom: 8 }}>
                    {convertTimestamptoTime(responseCycling.data.routes[0].legs[0].duration)}
                  </Text>
                </View>
              )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onNavigationView('driving')}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ marginBottom: 8, fontSize: 26, color: 'red' }}>
              Red
            </Text>
            <Text style={{ marginBottom: 8, fontSize: 20 }}>자동차</Text>
            {responseDriving === null ? (
              <View></View>
            ) : (
                <View>
                  <Text style={{ marginBottom: 8, fontSize: 20 }}>
                    {responseDriving.data.routes[0].legs[0].distance}m
                </Text>
                  <Text style={{ marginBottom: 8 }}>
                    {convertTimestamptoTime(responseDriving.data.routes[0].legs[0].duration)}
                  </Text>
                </View>
              )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ marginBottom: 8, fontSize: 26, color: 'yellow' }}>
              Yello
            </Text>
            <Text style={{ marginBottom: 8, fontSize: 20 }}>대중교통</Text>
            {path.map(item => transPath(item))}
          </View>

        </TouchableOpacity>

      </ScrollView>
    );
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ height: 100, flexDirection: 'column' }}>
          <View style={{ flex: 1 }}>
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
          <View style={{ flex: 1 }}>
            <TextInput
              {...commonInputProps}
              fontSize={17}
              placeholder={'도착지'}
              keyboardType="default"
              onChangeText={this._onEndEditHandle}
              returnKeyType="next"
              value={destination}
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
