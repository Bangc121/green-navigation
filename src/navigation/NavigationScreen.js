import * as React from 'react';
import Navigation from '@test/containers/Navigation';

export default class NavigationScreen extends React.Component {
  static navigationOptions = {headerShown: false};

  render() {
    return <Navigation />;
  }
}
