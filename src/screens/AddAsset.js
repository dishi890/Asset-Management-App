import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const AddNewAssetScreen = () => {
  const [uploadedAssets, setUploadedAssets] = useState([]);
  const [fileName, setFileName] = useState('');
  const [selectedSheetName, setSelectedSheetName] = useState('');
  const [sheetNames, setSheetNames] = useState([]);

  useEffect(() => {
    fetchPreview();
  }, []);

  const fetchPreview = () => {
    axios.get('http://localhost:4000/preview-uploaded-assets')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setUploadedAssets(res.data);
          const allSheetNames = [...new Set(res.data.map(item => item['Sheet Name']).filter(Boolean))];
          setSheetNames(allSheetNames);
        }
      })
      .catch(err => {
        console.error('❌ Error fetching uploaded preview:', err);
        Alert.alert('Error', 'Failed to fetch uploaded assets.');
      });
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result?.assets?.[0]) {
        const file = result.assets[0];
        setFileName(file.name);

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });

        // ❗ DO NOT set Content-Type manually
        await axios.post('http://localhost:4000/upload-assets', formData);

        Alert.alert('✅ Upload Successful', `${file.name} uploaded.`);
        fetchPreview();
      } else {
        Alert.alert('No file selected.');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('❌ Upload Failed', 'An error occurred during upload.');
    }
  };

  const handleDownload = async () => {
    if (!selectedSheetName) {
      Alert.alert('Select a sheet to download.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/download-sheet/${encodeURIComponent(selectedSheetName)}`, {
        responseType: 'arraybuffer',
      });

      const base64String = Buffer.from(response.data).toString('base64');
      const fileUri = FileSystem.documentDirectory + `${selectedSheetName}.xlsx`;

      await FileSystem.writeAsStringAsync(fileUri, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error('Download Error:', err);
      Alert.alert('❌ Download Failed', `Could not download sheet: ${selectedSheetName}`);
    }
  };

  const filteredAssets = uploadedAssets.filter(item =>
    !selectedSheetName || item['Sheet Name'] === selectedSheetName
  );

  const renderItem = ({ item }) => (
    <View style={styles.assetCard}>
      <Text style={styles.assetText}>Asset ID: {item['Asset ID'] || 'N/A'}</Text>
      <Text style={styles.assetText}>Vendor: {item['Vendor Name'] || 'N/A'}</Text>
      <Text style={styles.assetText}>Type: {item['Asset Type'] || 'N/A'}</Text>
      <Text style={styles.assetText}>Sheet: {item['Sheet Name'] || 'N/A'}</Text>
      <Text style={styles.assetText}>Uploaded: {item['Uploaded At'] || '—'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Upload & Preview Assets</Text>

        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Ionicons name="cloud-upload-outline" size={20} color="white" style={{ marginRight: 6 }} />
          <Text style={styles.buttonText}>Upload Excel / CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={handleDownload}>
          <Ionicons name="cloud-download-outline" size={20} color="white" style={{ marginRight: 6 }} />
          <Text style={styles.buttonText}>Download Selected Sheet</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Filter by Sheet Name</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={selectedSheetName}
            onValueChange={(val) => setSelectedSheetName(val)}>
            <Picker.Item label="-- All Sheets --" value="" />
            {sheetNames.map((sheet, idx) => (
              <Picker.Item key={idx} label={sheet} value={sheet} />
            ))}
          </Picker>
        </View>

        {fileName ? (
          <Text style={styles.fileName}>Last Uploaded: {fileName}</Text>
        ) : null}

        {filteredAssets.length > 0 ? (
          <FlatList
            data={filteredAssets}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            style={{ marginTop: 10 }}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No uploaded data found.
          </Text>
        )}
      </View>
    </View>
  );
};

export default AddNewAssetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f0f4f7',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: '90%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  fileName: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  dropdownWrapper: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  assetCard: {
    backgroundColor: '#f8f8f8',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  assetText: {
    fontSize: 14,
    color: '#333',
  },
});
