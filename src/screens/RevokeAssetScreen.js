import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import assetData from '../assets/data/assetList_cleaned.json';
import { Ionicons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

const RevokeAssetScreen = ({ visible, onClose }) => {
  const [empCode, setEmpCode] = useState('');
  const [matchedAssets, setMatchedAssets] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = () => {
    const results = assetData.filter(
      (item) => item['Employee Code']?.toLowerCase() === empCode.toLowerCase()
    );
    setMatchedAssets(results);
    setSuccessMessage('');
  };

  const handleInStock = (assetId) => {
    const updatedAssets = matchedAssets.map(item => {
      if (item['Asset ID'] === assetId) {
        return {
          ...item,
          'Deboarding Date': new Date().toLocaleDateString()
        };
      }
      return item;
    });

    const newMatched = updatedAssets.filter(item => item['Asset ID'] !== assetId);
    setMatchedAssets(newMatched);
    setSuccessMessage(`✅ Asset ${assetId} successfully marked in stock.`);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close-circle" size={28} color="red" />
          </TouchableOpacity>

          <Text style={styles.heading}>🔁 Revoke Asset</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Employee Code"
            value={empCode}
            onChangeText={setEmpCode}
            onSubmitEditing={handleSearch}
          />

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          {successMessage !== '' && <Text style={styles.successMessage}>{successMessage}</Text>}

          {matchedAssets.length > 0 ? (
            <FlatList
              data={matchedAssets}
              keyExtractor={(item) => item['Asset ID']}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.label}>Name: <Text style={styles.value}>{item['Name']}</Text></Text>
                  <Text style={styles.label}>Asset ID: <Text style={styles.value}>{item['Asset ID']}</Text></Text>
                  <Text style={styles.label}>Vendor: <Text style={styles.value}>{item['Vendor']}</Text></Text>
                  <Text style={styles.label}>Allocated Date: <Text style={styles.value}>{item['Onboarding Date']}</Text></Text>
                  <Text style={styles.label}>Deboarding Date: <Text style={styles.value}>{item['Deboarding Date'] || '-'}</Text></Text>
                  <TouchableOpacity
                    style={styles.inStockBtn}
                    onPress={() => handleInStock(item['Asset ID'])}>
                    <Text style={styles.inStockText}>Mark as In-Stock</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            empCode !== '' && <Text style={styles.noResult}>No allocated assets found.</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 20
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  searchBtn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2
  },
  label: {
    fontWeight: 'bold'
  },
  value: {
    fontWeight: 'normal'
  },
  inStockBtn: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  inStockText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  noResult: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontWeight: 'bold'
  }
});

export default RevokeAssetScreen;
