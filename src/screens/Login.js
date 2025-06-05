import React, { useRef } from 'react'
import { SafeAreaView, StyleSheet, View, Button, Alert } from 'react-native'
import { Text, TextInput } from 'react-native'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators } from '../state/index'
// import axios from 'axios'
// import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const userNameRef = useRef('')
  const passWordRef = useRef('')
  const dispatch = useDispatch()
  const actions = bindActionCreators(actionCreators, dispatch)

  const handleloginstate = () => {
    const userName = userNameRef.current
    const passWord = passWordRef.current

    if (userName === 'admin' && passWord === '1234') {
      actions.userNameAssign('admin')
      actions.loggedin()
    } else {
      createTwoButtonAlert('Incorrect User', 'Try username: admin and password: 1234')
    }
  }

  const createTwoButtonAlert = (title, message) =>
    Alert.alert(title, message, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={styles.homeinfo}>
          <Text style={styles.heading}>Welcome Back !!</Text>
          <Text style={styles.subheading}>
            Please Login to continue our services
          </Text>
          <TextInput
            style={styles.input}
            placeholder="User Name"
            keyboardType="default"
            textContentType="username"
            onChangeText={(text) => (userNameRef.current = text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            keyboardType="default"
            textContentType="password"
            secureTextEntry={true}
            onChangeText={(text) => (passWordRef.current = text)}
          />
        </View>
        <View style={styles.buttoncontainer}>
          <Button title="Login" color="#009933" onPress={handleloginstate} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10
  },
  subcontainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  heading: {
    backgroundColor: '#fff',
    alignItems: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  subheading: {
    fontSize: 17,
    backgroundColor: '#fff',
    textAlign: 'center'
  },
  homeinfo: {
    backgroundColor: '#fff',
    alignSelf: 'center'
  },
  buttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20
  },
  input: {
    height: 50,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 17
  }
})

export default Login
