import * as React from 'react';
import {ThemeProvider} from '@test/styles/styled-components';
import {theme} from '@test/styles/theme';
import StoreState from '@test/store';
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
