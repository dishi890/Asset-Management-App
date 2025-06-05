import React from 'react'
import { View, Text, FlatList, Modal, StyleSheet, Pressable } from 'react-native'
import vendorData from '../assets/data/vendorList.json'

const VendorPopup = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>All Vendors</Text>
        <FlatList
          data={vendorData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.Vendor_Name}</Text>
              <Text>As per Vendor: {item.As_per_Vendor}</Text>
              <Text>Allocated: {item.Allocated}</Text>
            </View>
          )}
        />
        <Pressable style={styles.button} onPress={onClose}>
          <Text style={{ color: 'white' }}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#e4f5ea',
    padding: 10,
    borderRadius: 6,
    marginVertical: 5
  },
  name: {
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#009933',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20
  }
})

export default VendorPopup
