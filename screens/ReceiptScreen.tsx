import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useBleContext } from '../components/BleContext';

const ReceiptScreen= () => {
    const { connectedScale, currentFarmer, setCurrentReceipt, currentReceipt } = useBleContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.receipt}>
        <Text style={styles.title}>Receipt</Text>
        <Text style={styles.subtitle}>Receipt ID: {currentReceipt?.receiptId}</Text>
        <View style={styles.line} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crop:</Text>
          <Text style={styles.sectionText}>{currentReceipt?.crop}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Corporate:</Text>
          <Text style={styles.sectionText}>{currentReceipt?.corporate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farmer:</Text>
          <Text style={styles.sectionText}>{currentReceipt?.farmer}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sale Date:</Text>
          <Text style={styles.sectionText}>{currentReceipt?.saledate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity (Before):</Text>
          <Text style={styles.sectionText}>{currentReceipt?.quantity_before} kg</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moisture Percentage:</Text>
          <Text style={styles.sectionText}>{currentReceipt?.moisturePercentage}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity (In Kg):</Text>
          <Text style={styles.sectionText}>{currentReceipt?.quantityInKg} kg</Text>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalTitle}>Total Pay:</Text>
          <Text style={styles.totalAmount}>{currentReceipt?.totalPay} Tsh/=</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 24,
    fontFamily: 'Poppins-Regular', // Apply the Poppins-Regular font family
  },
  receipt: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    fontFamily: 'Poppins-Regular', // Apply the Poppins-Regular font family
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold', // Apply the Poppins-Bold font family
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular', // Apply the Poppins-Regular font family
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular', // Apply the Poppins-Regular font family
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold', // Apply the Poppins-Bold font family
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular', // Apply the Poppins-Regular font family
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  totalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold', // Apply the Poppins-Bold font family
  },
  totalAmount: {
    fontSize: 18,
    color: 'green',
    fontFamily: 'Poppins-Bold', // Apply the Poppins-Bold font family
  },
});

export default ReceiptScreen;
