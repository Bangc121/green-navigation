import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from 'react-native-maps';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {ScrollView} from 'react-native-gesture-handler';
import Overlay from 'react-native-modal-overlay';

const pathType = {
  1: '지하철',
  2: '버스',
  3: '지하철+버스',
};

const trafficType = {
  1: '지하철',
  2: '버스',
  3: '도보',
};

class Navigation extends PureComponent {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.state = {
      modalVisible: false,
      region: null,
      ready: true,
      coordinateFinal: null,
      responseWalking: null,
      responseCycling: null,
      responseDriving: null,
      coordinateWalking: null,
      coordinateCycling: null,
      coordinateDriving: null,
      start: this.props.start,
      startPoint: this.props.startPoint,
      end: this.props.end,
      endPoint: this.props.endPoint,
      marker: '',
      result: false,
      path: [],
    };
  }

  componentDidMount() {
    console.log('Component did mount');
    const {start} = this.state;
    if (start) {
      console.log('aaaa');
      this._onSearchHandle();
    } else {
      console.log('ggg');
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
        // console.log(coords);
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
        // console.log(coords);
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

    let odsay = `http://169.56.97.117/publictransportpath.php?SX=${startPoint.longitude}&SY=${startPoint.latitude}&EX=${endPoint.longitude}&EY=${endPoint.latitude}`;
    console.log(odsay);

    const requestWalking = axios.get(walking);
    const requestCycling = axios.get(cycling);
    const requestDriving = axios.get(driving);

    axios({
      method: 'get',
      url: odsay,
      // responseType: 'arraybutter'
    }).then((response) => {
      console.log('버스 결과 개수', response.data.result.busCount);
      console.log('지하철 결과 개수', response.data.result.subwayCount);
      console.log('지하철+버스 결과 개수', response.data.result.subwayBusCount);
      // console.log(pathType[response.data.result.path[0].pathType])
      this.setState({path: response.data.result.path});
    });

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
    // console.log(mode);
    if (mode === 'walking') {
      this.setState({result: false, coordinateFinal: coordinateWalking});
    } else if (mode === 'cycling') {
      this.setState({result: false, coordinateFinal: coordinateCycling});
    } else if (mode === 'driving') {
      this.setState({result: false, coordinateFinal: coordinateDriving});
    }
  };

  calcDistance(lat1, lon1, lat2, lon2) {
    var EARTH_R, Rad, radLat1, radLat2, radDist;
    var distance, ret;
    EARTH_R = 6371000.0;
    Rad = Math.PI / 180;
    radLat1 = Rad * lat1;
    radLat2 = Rad * lat2;
    radDist = Rad * (lon1 - lon2);
    distance = Math.sin(radLat1) * Math.sin(radLat2);
    distance =
      distance + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radDist);
    ret = EARTH_R * Math.acos(distance);
    var rtn = Math.round(Math.round(ret));
    return rtn;
  }

  _onClose = () => this.setState({modalVisible: false});

  _onRegionChange = (region) => {
    const {endPoint} = this.state;
    console.log('_onRegionChange: ' + region.latitude);
    let distance = this.calcDistance(
      region.latitude,
      region.longitude,
      endPoint.latitude,
      endPoint.longitude,
    );
    console.log(distance);
    if (distance <= 10) {
      console.log('ggggg');
      this.setState({modalVisible: true});
    }
    // getDistance(region, endPoint);
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
      path,
      modalVisible,
      path,
    } = this.state;

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

    const convertTimestamptoTime = (unixTimestamp) => {
      let dateObj = new Date(unixTimestamp * 1000);
      let utcString = dateObj.toUTCString();
      let time = utcString.slice(-11, -4);
      return time;
    };

    const transPath = (item) => (
      <View style={{margin: 10}}>
        <Text>{pathType[item.pathType]}</Text>
      <View style={{ padding: 30, marginTop: 10, marginBottom: 10, backgroundColor: '#e8ebff', borderRadius: 15 }}>
        <Text style={{ fontSize: 18, color: '#45435e', fontWeight: 'bold' }}>{pathType[item.pathType]}</Text>
        <Text>{item.info.totalTime} 분</Text>
        <Text>{item.info.totalDistance} km</Text>
        <Text>이동경로</Text>
        {item.subPath.map((item2, index) => {
          console.log(item2.startName)
          if (item2.distance === 0 || !item2.startName || !item2.endName) return;
          return (
            <View>
              <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{index} 번째</Text>
              <Text>{trafficType[item2.trafficType]}</Text>
              <Text>{item2.distance} km</Text>
              <Text style={{ color: '#3247c9', fontWeight: 'bold' }}>{item2.startName} -> {item2.endName}</Text>
            </View>
          );
        })}
      </View>
    );
    const resultView = (
      <ScrollView style={styles.resultContainer}>
        <TouchableOpacity onPress={() => this._onNavigationView('walking')}>
          <View style={{ flexDirection: 'column', marginBottom: 25 }}>
            <Text style={{ marginBottom: 8, fontSize: 26, color: 'green', fontWeight: 'bold' }}>
              Green
            </Text>
            <Text style={{ marginBottom: 8, fontSize: 20, fontWeight: 'bold' }}>걷기</Text>
            {responseWalking === null ? (
              <View></View>
            ) : (
              <View>
                <Text style={{marginBottom: 8, fontSize: 20}}>
                  {responseWalking.data.routes[0].legs[0].distance}m
                </Text>
                <Text style={{marginBottom: 8}}>
                  {convertTimestamptoTime(
                    responseWalking.data.routes[0].legs[0].duration,
                  )}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onNavigationView('cycling')}>
          <View style={{ flexDirection: 'column', marginBottom: 25 }}>
            <Text style={{ marginBottom: 8, fontSize: 26, color: 'green', fontWeight: 'bold' }}>
              Green
            </Text>
            <Text style={{ marginBottom: 8, fontSize: 20, fontWeight: 'bold' }}>자전거</Text>
            {responseCycling === null ? (
              <View></View>
            ) : (
              <View>
                <Text style={{marginBottom: 8, fontSize: 20}}>
                  {responseCycling.data.routes[0].legs[0].distance}m
                </Text>
                <Text style={{marginBottom: 8}}>
                  {convertTimestamptoTime(
                    responseCycling.data.routes[0].legs[0].duration,
                  )}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onNavigationView('driving')}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ marginBottom: 8, fontSize: 26, color: 'red', fontWeight: 'bold' }}>
              Red
            </Text>
            <Text style={{ marginBottom: 8, fontSize: 20, fontWeight: 'bold' }}>자동차</Text>
            {responseDriving === null ? (
              <View></View>
            ) : (
              <View>
                <Text style={{marginBottom: 8, fontSize: 20}}>
                  {responseDriving.data.routes[0].legs[0].distance}m
                </Text>
                <Text style={{marginBottom: 8}}>
                  {convertTimestamptoTime(
                    responseDriving.data.routes[0].legs[0].duration,
                  )}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ marginBottom: 8, fontSize: 26, color: '#ffc56e', fontWeight: 'bold' }}>
              Yello
            </Text>
            <Text style={{ marginBottom: 8, fontSize: 20, fontWeight: 'bold' }}>대중교통</Text>
            {path.map(item => transPath(item))}
          </View>
        </TouchableOpacity>
      </ScrollView>
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
        {modalVisible === false ? null : (
          <Overlay
            visible={this.state.modalVisible}
            onClose={this.onClose}
            closeOnTouchOutside
            animationType="zoomIn"
            containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
            childrenWrapperStyle={{backgroundColor: '#eee'}}
            animationDuration={500}>
            {(hideModal, overlayState) => (
              <View
                style={{
                  height: 300,
                  width: 300,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.conIcon}
                  source={require('../../images/con.png')}
                />
                <Text style={{fontSize: 28}}>Success</Text>
              </View>
            )}
          </Overlay>
        )}
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
    padding: 40,
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
  conIcon: {
    width: 150,
    height: 150,
  },
});

const commonInputProps = {
  style: styles.input,
  underlineColorAndroid: 'transparent',
  autoCapitalize: 'none',
  autoCorrect: false,
};

export default Navigation;
