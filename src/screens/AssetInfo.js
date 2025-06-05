import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import assetData from '../assets/data/assetList_cleaned.json';

const AssetHistory = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [animation] = useState(new Animated.Value(0));

  const handleSearch = () => {
    Keyboard.dismiss();
    const lowerQuery = query.toLowerCase();
    const match = assetData.find(
      (item) =>
        item['Employee Code']?.toString().toLowerCase().includes(lowerQuery) ||
        item['Name']?.toLowerCase().includes(lowerQuery) ||
        item['Asset ID']?.toString().toLowerCase().includes(lowerQuery)
    );

    if (match) {
      setResult(match);
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }).start();
    } else {
      setResult(null);
    }
  };

  const animatedStyle = {
    opacity: animation,
    transform: [{ translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by Asset ID, Employee Code, or Name"
        style={styles.searchBar}
        value={query}
        onChangeText={(text) => setQuery(text)}
        onSubmitEditing={handleSearch}
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Ionicons name="search" size={20} color="#fff" />
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {result ? (
        <Animated.View style={[styles.card, animatedStyle]}>
          <Ionicons name="laptop-outline" size={24} color="#0066cc" style={styles.icon} />
          <Text style={styles.label}>Name: <Text style={styles.value}>{result.Name}</Text></Text>
          <Text style={styles.label}>Employee Code: <Text style={styles.value}>{result['Employee Code']}</Text></Text>
          <Text style={styles.label}>Asset ID: <Text style={styles.value}>{result['Asset ID']}</Text></Text>
          <Text style={styles.label}>Vendor: <Text style={styles.value}>{result['Vendor']}</Text></Text>
          <Text style={styles.label}>Asset Type: <Text style={styles.value}>{result['Asset Type'] || 'N/A'}</Text></Text>
        </Animated.View>
      ) : query.length > 0 ? (
        <Text style={styles.noResult}>No matching asset found.</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  searchBar: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333'
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#009966',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8
  },
  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 15
  },
  value: {
    fontWeight: 'normal',
    color: '#333'
  },
  noResult: {
    marginTop: 20,
    textAlign: 'center',
    color: 'red',
    fontStyle: 'italic'
  }
});

export default AssetHistory;
