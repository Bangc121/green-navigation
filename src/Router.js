import React, {Component} from 'react';
import Navigation from '@test/navigation';
import {NavigationService} from '@test/common';

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
