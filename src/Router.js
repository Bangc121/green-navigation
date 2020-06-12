import React, {Component} from 'react';
import Navigation from '@green/navigation';
import {NavigationService} from '@green/common';

class Router extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navigation
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

export default Router;
