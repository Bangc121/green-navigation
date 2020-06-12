import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import NavigationScreen from './NavigationScreen';
import HomeScreen from './HomeScreen';

const AuthStack = createStackNavigator(
  {
    HomeScreen: {screen: HomeScreen},
    NavigationScreen: {screen: NavigationScreen},
  },
  {
    initialRouteName: 'HomeScreen',
  },
);

// 최상단 네비게이터
const AppNavigator = createSwitchNavigator(
  {
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth',
  },
);

export default createAppContainer(AppNavigator);
