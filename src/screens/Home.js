// ✅ Final Home.js with refreshKey integration and correct allocatedData reload
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import fixedAssets from '../assets/data/fixedAssets.json';
import rentalAssets from '../assets/data/rentalAssets.json';
import AllocationModal from './AllocationModal';
import RevokeAssetScreen from './RevokeAssetScreen';
import InStockScreen from './InStockScreen';

const screenWidth = Dimensions.get('window').width;

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewType, setViewType] = useState('');
  const [allocationVisible, setAllocationVisible] = useState(false);
  const [revokeVisible, setRevokeVisible] = useState(false);
  const [inStockVisible, setInStockVisible] = useState(false);
  const [allocatedData, setAllocatedData] = useState([]);

  const reloadAllocatedAssets = (newAsset) => {
    if (newAsset) setAllocatedData(prev => [...prev, newAsset]);
  };

  const totalLaptops = fixedAssets.length + rentalAssets.length;

  const showAssets = (type) => {
    setViewType(type);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.assetCard}>
      <Text style={styles.assetText}>Name: {item.Name}</Text>
      <Text style={styles.assetText}>Vendor: {item["Vendor Name"]}</Text>
      <Text style={styles.assetText}>Warranty: {item.Warranty || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Total Laptops</Text>
        <View style={styles.iconContainer}>
          <Ionicons name="laptop-outline" size={40} color="#009933" />
          <Text style={styles.totalCount}>{totalLaptops}</Text>
        </View>

        <PieChart
          data={[
            {
              name: 'Fixed',
              population: fixedAssets.length,
              color: '#4CAF50',
              legendFontColor: '#333',
              legendFontSize: 14
            },
            {
              name: 'Rental',
              population: rentalAssets.length,
              color: '#FFC107',
              legendFontColor: '#333',
              legendFontSize: 14
            }
          ]}
          width={screenWidth - 20}
          height={180}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => `#000`
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chartStyle}
        />

        <TouchableOpacity style={styles.button} onPress={() => showAssets('fixed')}>
          <Text style={styles.buttonText}>View Fixed Assets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => showAssets('rental')}>
          <Text style={styles.buttonText}>View Rental Assets</Text>
        </TouchableOpacity>
      </ScrollView>

      <Animated.View style={[styles.floatingButton, { bottom: 25, right: 25 }]}> 
        <TouchableOpacity onPress={() => setAllocationVisible(true)}>
          <Ionicons name="add-circle" size={60} color="#009933" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.floatingButton, { bottom: 100, right: 25 }]}> 
        <TouchableOpacity onPress={() => setRevokeVisible(true)}>
          <Ionicons name="sync" size={40} color="#FF5722" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.floatingButton, { bottom: 175, right: 25 }]}> 
        <TouchableOpacity onPress={() => setInStockVisible(true)}>
          <Ionicons name="cube-outline" size={36} color="#4CAF50" />
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Ionicons name="close-circle" size={30} color="red" />
          </TouchableOpacity>

          <Text style={styles.modalHeading}>
            {viewType === 'fixed' ? 'Fixed Asset List' : 'Rental Asset List'}
          </Text>

          <FlatList
            data={viewType === 'fixed' ? fixedAssets : rentalAssets}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </Modal>

      <AllocationModal
        visible={allocationVisible}
        onClose={() => setAllocationVisible(false)}
        onOpenRevoke={() => {
          setAllocationVisible(false);
          setTimeout(() => setRevokeVisible(true), 300);
        }}
        onAllocated={reloadAllocatedAssets}
      />

      <RevokeAssetScreen
        visible={revokeVisible}
        onClose={() => setRevokeVisible(false)}
      />

      <InStockScreen
        visible={inStockVisible}
        onClose={() => setInStockVisible(false)}
        allocatedData={allocatedData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  totalCount: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#009933'
  },
  chartStyle: {
    marginVertical: 10
  },
  button: {
    backgroundColor: '#009933',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#f2f2f2'
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  assetCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2
  },
  assetText: {
    fontSize: 16
  },
  floatingButton: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 5,
    zIndex: 10
  }
});

export default Home;
