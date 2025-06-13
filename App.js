import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/state/store';
import ContentTabs from './src/screens/ContentTabs';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ContentTabs />
      </NavigationContainer>
    </Provider>
  );
}
