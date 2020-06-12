import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import NavigationScreen from './NavigationScreen';

const AuthStack = createStackNavigator(
  {
    NavigationScreen: {screen: NavigationScreen},
  },
  {
    initialRouteName: 'NavigationScreen',
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
