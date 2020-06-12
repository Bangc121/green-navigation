import * as React from 'react';
import Navigation from '@green/containers/Navigation';

export default class NavigationScreen extends React.Component {
  static navigationOptions = {headerShown: false};

  render() {
    const {navigation} = this.props;
    const start = navigation.getParam('start', 'start');
    const startPoint = navigation.getParam('startPoint', 'startPoint');
    const end = navigation.getParam('end', 'end');
    const endPoint = navigation.getParam('endPoint', 'endPoint');
    return (
      <Navigation
        start={start}
        startPoint={startPoint}
        end={end}
        endPoint={endPoint}
      />
    );
  }
}
