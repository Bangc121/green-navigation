import * as React from 'react';
import {ThemeProvider} from '@green/styles/styled-components';
import {theme} from '@green/styles/theme';
import StoreState from '@green/store';
import RootRouter from './src/Router';

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StoreState.Provider>
          <RootRouter />
        </StoreState.Provider>
      </ThemeProvider>
    );
  }
}

export default App;
