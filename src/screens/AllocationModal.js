// ✅ Final AllocationModal.js - Direct Allocation + UI Refresh (No JSON file writes)
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Modal, ScrollView, KeyboardAvoidingView, Platform, Alert, Animated
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import assetList from '../assets/data/assetList_cleaned.json';

const departments = [
  'Sales', 'B to B', 'B to C', 'Leverage Partners', 'Fly Homes', 'Fly loans',
  'International office', 'Uniops', 'HR', 'Accounts', 'Admin', 'IT'
];

const AllocationModal = ({ visible, onClose, onOpenRevoke, onAllocated }) => {
  const [form, setForm] = useState({
    name: '', onboardingDate: ''
  });
  const [selectedEmpCode, setSelectedEmpCode] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [assetType, setAssetType] = useState('');
  const [confirmationAnim] = useState(new Animated.Value(0));
  const [confirmationText, setConfirmationText] = useState('');
  const [empCodes, setEmpCodes] = useState([]);

  useEffect(() => {
    const codes = [...new Set(assetList.map(item => item['Employee Code']).filter(Boolean))];
    setEmpCodes(codes);
  }, []);

  useEffect(() => {
    if (!selectedEmpCode) return;

    const match = assetList.find(item => item['Employee Code'] === selectedEmpCode);

    if (match) {
      const today = new Date();
      const formatted = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

      setForm({
        name: match['Name'] || '',
        onboardingDate: formatted
      });

      setSelectedDepartment(match['Department'] || '');
      setAssetType(match['Asset Type'] || '');
    }
  }, [selectedEmpCode]);

  const handleSubmit = async () => {
    console.log("1")
    if (!form.name || !selectedEmpCode || !selectedDepartment || !uniqueId || !assetType || !form.onboardingDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const payload = {
      name: form.name,
      empCode: selectedEmpCode,
      department: selectedDepartment,
      onboardingDate: form.onboardingDate,
      uniqueId,
      assetType,
      'Asset Id': uniqueId
    };

    try {
      
      setConfirmationText('✅ Asset allocated successfully');
      onAllocated && onAllocated(payload); // pass the payload to parent

      confirmationAnim.setValue(0);
      Animated.timing(confirmationAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false
      }).start();

      // Reset form
      setForm({ name: '', onboardingDate: '' });
      setSelectedEmpCode('');
      setSelectedDepartment('');
      setUniqueId('');
      setAssetType('');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleRevokeRedirect = () => {
    onClose();
    setTimeout(() => onOpenRevoke && onOpenRevoke(), 300);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>📝 Asset Allocation Form</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedDepartment}
              onValueChange={(value) => setSelectedDepartment(value)}>
              <Picker.Item label="Select Department" value="" />
              {departments.map((dept, i) => (
                <Picker.Item key={i} label={dept} value={dept} />
              ))}
            </Picker>
          </View>

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedEmpCode}
              onValueChange={(value) => setSelectedEmpCode(value)}>
              <Picker.Item label="Select Employee Code" value="" />
              {empCodes.map((code, i) => (
                <Picker.Item key={i} label={code} value={code} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Unique Laptop ID"
            value={uniqueId}
            onChangeText={setUniqueId}
          />

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={assetType}
              onValueChange={setAssetType}>
              <Picker.Item label="Select Asset Type" value="" />
              <Picker.Item label="Fixed" value="Fixed" />
              <Picker.Item label="Rental" value="Rental" />
            </Picker>
          </View>

          <TextInput
            style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            placeholder="Onboarding Date"
            value={form.onboardingDate}
            editable={false}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>

          {confirmationText && (
            <Animated.Text style={[styles.confirmation, { opacity: confirmationAnim }]}>
              {confirmationText}
            </Animated.Text>
          )}

          <TouchableOpacity style={styles.revokeLink} onPress={handleRevokeRedirect}>
            <Text style={styles.revokeText}>🔁 Revoke Asset</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 10
  },
  dropdownContainer: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10
  },
  submitBtn: {
    backgroundColor: '#009933', padding: 12, borderRadius: 8,
    alignItems: 'center', marginTop: 10
  },
  submitText: { color: '#fff', fontWeight: 'bold' },
  confirmation: { fontSize: 16, marginTop: 15, color: '#4CAF50' },
  revokeLink: { marginTop: 25, alignSelf: 'center' },
  revokeText: { color: '#007bff', fontWeight: 'bold' },
  closeBtn: { marginTop: 20, alignItems: 'center' },
  closeText: { color: 'red' }
});

export default AllocationModal;
