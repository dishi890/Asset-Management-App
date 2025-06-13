import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  ScrollView
} from 'react-native';
import assetData from '../assets/data/assetList_cleaned.json';
import { Ionicons } from '@expo/vector-icons';

const AssetHistory = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    const matched = assetData.find(
      (item) =>
        item["Employee Code"]?.toString().toLowerCase() === text.toLowerCase() ||
        item["Name"]?.toString().toLowerCase() === text.toLowerCase() ||
        item["Asset ID"]?.toString().toLowerCase() === text.toLowerCase()
    );

    if (matched) {
      setResult(matched);
      setModalVisible(true);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }).start();

      // Add to history if not already present (based on Asset ID)
      const isAlreadyInHistory = history.some(
        (item) => item["Asset ID"] === matched["Asset ID"]
      );
      if (!isAlreadyInHistory) {
        setHistory([matched, ...history]);
      }
    } else {
      setResult(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="🔍 Search by Asset ID, Employee Code or Name"
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />

      {!result && query !== '' && (
        <Text style={styles.noResult}>No matching asset found.</Text>
      )}

      <ScrollView style={styles.historyList}>
        {history.map((item, index) => (
          <View key={index} style={styles.historyCard}>
            <Ionicons
              name="laptop-outline"
              size={24}
              color="#009933"
              style={{ marginRight: 10 }}
            />
            <View>
              <Text style={styles.label}>Asset ID: <Text style={styles.value}>{item["Asset ID"]}</Text></Text>
              <Text style={styles.label}>Name: <Text style={styles.value}>{item["Name"]}</Text></Text>
              <Text style={styles.label}>Type: <Text style={styles.value}>
                {item["Asset ID"]?.toLowerCase().includes('rental') ? 'Rental' : 'Fixed'}
              </Text></Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Ionicons name="laptop-outline" size={50} color="#009933" style={{ alignSelf: 'center' }} />
            <Text style={styles.label}>Employee Code: <Text style={styles.value}>{result?.["Employee Code"]}</Text></Text>
            <Text style={styles.label}>Name: <Text style={styles.value}>{result?.["Name"]}</Text></Text>
            <Text style={styles.label}>Asset ID: <Text style={styles.value}>{result?.["Asset ID"]}</Text></Text>
            <Text style={styles.label}>Vendor: <Text style={styles.value}>{result?.["Vendor"]}</Text></Text>
            <Text style={styles.label}>Asset Type: <Text style={styles.value}>
              {result?.["Asset ID"]?.toLowerCase().includes('rental') ? 'Rental' : 'Fixed'}
            </Text></Text>
            <Text style={styles.closeBtn} onPress={() => setModalVisible(false)}>Close</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5f2',
    padding: 20
  },
  input: {
    height: 50,
    borderColor: '#009933',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000'
  },
  noResult: {
    color: 'red',
    fontStyle: 'italic',
    marginTop: 10
  },
  historyList: {
    marginTop: 20
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14
  },
  value: {
    fontWeight: 'normal',
    color: '#444'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10
  },
  closeBtn: {
    marginTop: 20,
    textAlign: 'center',
    color: '#009933',
    fontWeight: 'bold'
  }
});

export default AssetHistory;
