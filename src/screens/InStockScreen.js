import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Modal, Alert, Dimensions, ScrollView, Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { BarChart } from 'react-native-chart-kit';
import assetData from '../assets/data/assetList_cleaned.json';
import vendorData from '../assets/data/vendorList.json';
import fixedAssets from '../assets/data/fixedAssets.json';
import rentalAssets from '../assets/data/rentalAssets.json';



const InStockScreen = ({ visible, onClose, allocatedData = [] }) => {
  const [tab, setTab] = useState('inStock');
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  const inStockAssets = assetData.filter(
    item => !allocatedData.some(alloc => alloc.uniqueId === item['Asset Id'])
  );

  const getGroupedAssets = () => {
    const list = tab === 'inStock' ? inStockAssets : allocatedData;

    const filtered = list.filter(item =>
      (item['Asset Id'] || item.uniqueId || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    const fixed = filtered
      .filter(item => (item.assetType || item['Asset Type'] || '').toLowerCase() === 'fixed')
      .sort((a, b) =>
        (a['Asset Id'] || a.uniqueId || '').localeCompare(b['Asset Id'] || b.uniqueId || '')
      );

    const rental = filtered
      .filter(item => (item.assetType || item['Asset Type'] || '').toLowerCase() === 'rental')
      .sort((a, b) =>
        (a['Asset Id'] || a.uniqueId || '').localeCompare(b['Asset Id'] || b.uniqueId || '')
      );

    const fixedWithHeader = fixed.length
      ? [{ type: 'header', label: '🛠️ FIXED ASSETS' }, ...fixed]
      : [];
    const rentalWithHeader = rental.length
      ? [{ type: 'header', label: '🔁 RENTAL ASSETS' }, ...rental]
      : [];

    return [...fixedWithHeader, ...rentalWithHeader];
  };

  const getFilteredVendors = () => {
    return vendorData.filter(v =>
      typeof v['As on '] === 'string' &&
      v['As on '] !== 'Vendor name' &&
      v['As on '].toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const exportAssetsByTypeToExcel = async (type) => {
    try {
      const source = type === 'fixed' ? fixedAssets : rentalAssets;
      const cleaned = source.map(item => ({
        'Asset ID': item['Asset ID'],
        'Asset Type': item['Asset Type'],
        'Name': item['Name'],
        'Emp Code': item['Emp Code']
      }));

      const worksheet = XLSX.utils.json_to_sheet(cleaned);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `${type.charAt(0).toUpperCase() + type.slice(1)} Assets`);

      const excelData = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
      const uri = FileSystem.cacheDirectory + `${type}_Assets.xlsx`;

      await FileSystem.writeAsStringAsync(uri, excelData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to export assets: ' + error.message);
    }
  };

  const renderItem = ({ item, index }) => {
    if (tab === 'vendorSummary') {
      return (
        <View style={styles.assetCard}>
          <Text style={styles.assetText}>{index + 1}. {item['As on ']}</Text>
          <Text style={styles.assetText}>Total Assets: {item['30-Apr']}</Text>
          <Text style={styles.assetText}>Allocated: {item['Unnamed: 3']}</Text>
          <Text style={styles.assetText}>Need to Find: {item['Unnamed: 4']}</Text>
        </View>
      );
    }

    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.label}</Text>;
    }

    const assetId = item['Asset Id'] || item.uniqueId;
    const vendor = item['Vendor Name'] || '—';
    const type = item.assetType || item['Asset Type'] || '';
    const isFixed = type.toLowerCase() === 'fixed';
    const isRental = type.toLowerCase() === 'rental';

    return (
      <TouchableOpacity onPress={() => exportAssetsByTypeToExcel(type.toLowerCase())}>
        <View style={styles.assetCard}>
          <Text style={styles.assetText}>{index + 1}. Asset ID: {assetId}</Text>
          <Text style={styles.assetText}>Vendor: {vendor}</Text>
          {tab === 'allocated' && (
            <>
              <Text style={styles.assetText}>Name: {item.name}</Text>
              <Text style={styles.assetText}>Department: {item.department}</Text>
              <Text style={[styles.assetText, isFixed && { color: 'lime' }, isRental && { color: 'deepskyblue' }]}
              >
                {isFixed && '🛠️ '}
                {isRental && '🔁 '}
                Type: {type}
              </Text>
              <Text style={styles.assetText}>Onboarding: {item.onboardingDate}</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  const dataToRender = tab === 'vendorSummary' ? getFilteredVendors() : getGroupedAssets();
  const fixedCount = fixedAssets.length;
  const rentalCount = rentalAssets.length;

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={[styles.container, { backgroundColor: '#f3f9ff' }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-circle" size={30} color="#ff3366" />
        </TouchableOpacity>

        <Text style={[styles.header, { color: '#1a1aff' }]}>Asset Management</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => setTab('inStock')} style={tab === 'inStock' ? styles.activeTab : styles.tab}>
            <Text style={{ color: '#1a1aff' }}>📦 In Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('allocated')} style={tab === 'allocated' ? styles.activeTab : styles.tab}>
            <Text style={{ color: '#1a1aff' }}>🔄 Allocated</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('vendorSummary')} style={tab === 'vendorSummary' ? styles.activeTab : styles.tab}>
            <Text style={{ color: '#1a1aff' }}>📊 Vendor Summary</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder={tab === 'vendorSummary' ? "Search by Vendor Name" : "Search by Asset ID"}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: '#000' }]}
        />

        {tab === 'inStock' && (
          <Animated.View style={{ opacity: animatedValue, transform: [{ scale: animatedValue }] }}>
            <BarChart
              data={{
                labels: ['Fixed', 'Rental'],
                datasets: [{
                  data: [fixedCount, rentalCount],
                  colors: [
                    () => '#00e5ff',
                    () => '#ff4081'
                  ]
                }]
              }}
              width={Dimensions.get('window').width - 30}
              height={260}
              fromZero
              showValuesOnTopOfBars
              chartConfig={{
                backgroundGradientFrom: '#d9a7c7',
                backgroundGradientTo: '#fffcdc',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: () => '#333',
                barPercentage: 0.65,
                propsForBackgroundLines: {
                  stroke: '#bbb'
                },
                propsForLabels: {
                  fontSize: 12
                }
              }}
              verticalLabelRotation={0}
              style={{ marginBottom: 30, borderRadius: 20 }}
              onDataPointClick={({ index }) => {
                const type = index === 0 ? 'fixed' : 'rental';
                exportAssetsByTypeToExcel(type);
              }}
            />
          </Animated.View>
        )}

        <FlatList
          data={dataToRender}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.noData}>No data found.</Text>}
        />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  closeButton: { alignSelf: 'flex-end', marginBottom: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#e6e6fa',
    borderRadius: 20,
  },
  activeTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ff99cc',
    borderRadius: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  assetCard: {
    backgroundColor: '#fff0f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  assetText: { fontSize: 15, marginBottom: 5, color: '#333' },
  noData: { textAlign: 'center', marginTop: 20, color: '#888' },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#ffe4e1',
    color: '#000',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 6,
  },
});

export default InStockScreen;
