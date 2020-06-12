import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NavigationService } from '@green/common';

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      DATA: [
        {
          id: 1,
          title: 'First Item',
          icon: '../../images/bus.png',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          title: 'Second Item',
          icon: '../../images/bus.png',
        },
        {
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          title: 'Third Item',
          icon: '../../images/bus.png',
        },
      ],
    };
  }

  render() {
    const {DATA} = this.state;
    const Item = ({title, icon}) => {
      return (
        <View style={styles.item}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#60bf67',
                width: 40,
                height: 40,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Image
                source={require('../../images/bus.png')}
                style={{width: 24, height: 24}}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Text style={{color: '#030040', fontWeight: 'bold'}}>
                  {title}
                </Text>
                <Text
                  style={{color: '#030040', opacity: 0.3, fontWeight: 'bold'}}>
                  2020.04.21
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={{fontSize: 16, color: '#030040', fontWeight: 'bold'}}>
              300 GTK
            </Text>
          </View>
        </View>
      );
    };
    return (
      <View style={{flex: 1, backgroundColor: '#312ef2'}}>
        <View>
          <SafeAreaView>
            <View>
              <View
                style={[
                  styles.headerItem,
                  styles.sidePadding,
                  {marginTop: 20},
                ]}>
                <Image
                  style={styles.icon}
                  source={require('../../images/menu.png')}
                />
                <Image
                  style={styles.icon}
                  source={require('../../images/bell.png')}
                />
              </View>
              <View
                style={[
                  styles.headerItem,
                  styles.sidePadding,
                  {marginTop: 30},
                ]}>
                <View>
                  <Text style={{fontSize: 14, color: '#fff', opacity: 0.6}}>
                    총 토큰
                  </Text>
                  <Text
                    style={{
                      fontSize: 19,
                      color: '#fff',
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}>
                    50,000,000 GTK
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize: 14, color: '#fff', opacity: 0.6}}>
                    총 이동 거리
                  </Text>
                  <Text
                    style={{
                      fontSize: 19,
                      color: '#fff',
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}>
                    93,000 KM
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginTop: 30, height: 140}}>
              <TouchableOpacity
                style={[styles.bookmarkerItem, {backgroundColor: '#b8f0ff'}]}>
                <Image
                  style={styles.bookmarkIcon}
                  source={require('../../images/bookmark1.png')}
                />
                <Text style={styles.bookmarkText}>집 ➜ 회사</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bookmarkerItem, {backgroundColor: '#f5e6bf'}]}
                onPress={() => {
                  NavigationService.navigate('NavigationScreen', {
                    start: '패스트파이브 역삼3호점',
                    startPoint: {
                      latitude: '37.501024',
                      longitude: '127.036028',
                    },
                    end: '사당종합체육관',
                    endPoint: {
                      latitude: '37.493316',
                      longitude: '126.919711',
                    },
                  });
                }}>
                <Image
                  style={styles.bookmarkIcon}
                  source={require('../../images/bookmark2.png')}
                />
                <Text style={styles.bookmarkText}>집 ➜ 헬스장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bookmarkerItem, {backgroundColor: '#ffcffe'}]}>
                <Image
                  style={styles.bookmarkIcon}
                  source={require('../../images/bookmark1.png')}
                />
                <Text style={styles.bookmarkText}>헬스장 ➜ 회사</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bookmarkerItem, {backgroundColor: '#d6f7d5'}]}>
                <Image
                  style={styles.bookmarkIcon}
                  source={require('../../images/bookmark2.png')}
                />
                <Text style={styles.bookmarkText}>공원 ➜ 집</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
          <View
            style={{
              backgroundColor: '#ffffff',
              height: '100%',
              marginTop: 30,
              borderRadius: 40,
              padding: 40,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 23, color: '#030040', fontWeight: 'bold'}}>
                거래 내역
              </Text>
              <View
                style={{
                  backgroundColor: '#ebeeff',
                  borderRadius: 8,
                  padding: 10,
                }}>
                <Text style={{color: '#5e76ff', fontWeight: 'bold'}}>
                  See All
                </Text>
              </View>
            </View>
            <FlatList
              data={DATA}
              renderItem={({item}) => (
                <Item title={item.title} icon={item.icon} />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sidePadding: {
    marginRight: 40,
    marginLeft: 40,
  },
  icon: {
    height: 24,
    width: 24,
  },
  headerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookmarkerItem: {
    width: 166,
    borderRadius: 8,
    paddingLeft: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  bookmarkIcon: {
    width: 50,
    height: 50,
    marginTop: 20,
  },
  bookmarkText: {
    fontSize: 19,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#101369',
  },
  bodyContainer: {},
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
});

export default Home;
