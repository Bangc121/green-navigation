import * as React from 'react';
import Home from '@green/containers/Home';

export default class HomeScreen extends React.Component {
  static navigationOptions = {headerShown: false};

  render() {
    return <Home />;
  }
}
