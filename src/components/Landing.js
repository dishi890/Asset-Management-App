import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ContentLanding from './ContentLanding';

const Landing = () => {
  return (
    <View style={styles.container}>
      <ContentLanding />
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
