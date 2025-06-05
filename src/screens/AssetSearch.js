import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native'
import assetData from '../assets/data/assetList_cleaned.json' // <-- use the converted JSON from your Excel
// (only where needed)


const AssetSearch = () => {
  const [search, setSearch] = useState('')
  
  const filteredData = assetData.filter(item =>
    item.Asset_ID.toLowerCase().includes(search.toLowerCase()) ||
    item.Emp_Code.toLowerCase().includes(search.toLowerCase())
  )

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.Name}</Text>
      <Text>Emp Code: {item.Emp_Code}</Text>
      <Text>Asset ID: {item.Asset_ID}</Text>
      <Text>Vendor: {item.Vendor_Name}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Asset ID or Emp Code"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No matching records found</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef9f1',
    padding: 10
  },
  searchBar: {
    height: 50,
    borderColor: '#009933',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray'
  }
})

export default AssetSearch
