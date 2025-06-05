import 'react-native-reanimated';

import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { store } from './src/state/store'
import Landing from './src/components/Landing'

export default function App() {
  return (
    <Provider store={store}>
      <Landing/>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boldText: {
    fontWeight: 'bold'
  }
})

console.log("Home screen loaded");
