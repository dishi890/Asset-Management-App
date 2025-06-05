import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

const AssetDetail = ({ asset, onClose }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asset Details</Text>
      <Text>Asset ID: {asset.Asset_ID}</Text>
      <Text>Employee: {asset.Name}</Text>
      <Text>Emp Code: {asset.Emp_Code}</Text>
      <Text>Vendor: {asset.Vendor_Name}</Text>
      <Text>Asset Type: {asset.Type}</Text>
      <Text>Onboarding Date: {asset.Onboarding_Date}</Text>
      <Text>Warranty: {asset.Warranty}</Text>
      <Pressable style={styles.button} onPress={onClose}>
        <Text style={{ color: 'white' }}>Close</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  button: {
    marginTop: 20,
    backgroundColor: '#009933',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8
  }
})

export default AssetDetail
