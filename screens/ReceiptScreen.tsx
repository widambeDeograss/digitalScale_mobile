import React from 'react';
import {View, Text, StyleSheet, ScrollView, Button} from 'react-native';
import {useBleContext} from '../components/BleContext';
import QRCode from 'qrcode.react';
import RNPrint from 'react-native-print';

const ReceiptScreen = () => {
  const {connectedScale, currentFarmer, setCurrentReceipt, currentReceipt} =
    useBleContext();

  const printReceipt = async () => {
    try {
      const receiptHTML = `
      <div style="width: 58mm; padding: 10px; text-align: center; font-family: 'Poppins-Regular';">
        <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; font-family: 'Poppins-Bold';">Receipt</h1>
        <p style="font-size: 14px; margin-bottom: 12px; font-family: 'Poppins-Regular';">Receipt ID: ${currentReceipt?.receiptId}</p>
        <hr style="border-bottom-color: black; border-bottom-width: 1px; margin-bottom: 12px;">
        
        <div style="font-size: 14px; margin-bottom: 8px; font-family: 'Poppins-Regular';">
          <span style="font-weight: bold; font-family: 'Poppins-Bold';">Crop:</span>
          <span>${currentReceipt?.crop}</span>
        </div>
      
        <div style="font-size: 14px; margin-bottom: 8px; font-family: 'Poppins-Regular';">
          <span style="font-weight: bold; font-family: 'Poppins-Bold';">Corporate:</span>
          <span>${currentReceipt?.corporate}</span>
        </div>
      
        <div style="font-size: 14px; margin-bottom: 8px; font-family: 'Poppins-Regular';">
          <span style="font-weight: bold; font-family: 'Poppins-Bold';">Farmer:</span>
          <span>${currentReceipt?.farmer}</span>
        </div>
      
        <div style="font-size: 14px; margin-bottom: 8px; font-family: 'Poppins-Regular';">
          <span style="font-weight: bold; font-family: 'Poppins-Bold';">Sale Date:</span>
          <span>${currentReceipt?.saledate}</span>
        </div>
      
        <div style="font-size: 14px; margin-bottom: 8px; font-family: 'Poppins-Regular';">
          <span style="font-weight: bold; font-family: 'Poppins-Bold';">Quantity (Before):</span>
          <span>${currentReceipt?.quantity_before} kg</span>
        </div>
      
        <div style="font-size: 14px; margin-bottom: 8px; font-family: 'Poppins-Regular';">
          <span style="font-weight: bold; font-family: 'Poppins-Bold';">Moisture Percentage:</span>
          <span>${currentReceipt?.moisturePercentage}</span>
        </div>
      
        <div style="font-size: 14px; margin-bottom: 8px; font-family: 'Poppins-Regular';">
          <span style="font-weight: bold; font-family: 'Poppins-Bold';">Quantity (In Kg):</span>
          <span>${currentReceipt?.quantityInKg} kg</span>
        </div>
      
        <div style="margin-top: 14px; border-top: 1px dashed black; padding-top: 10px;">
          <span style="font-size: 16px; font-weight: bold; font-family: 'Poppins-Bold';">Total Pay:</span>
          <span style="font-size: 16px; color: green; font-family: 'Poppins-Bold';">$${currentReceipt?.totalPay}</span>
        </div>
      </div>
      `;
      
      

      // Rest of your ReceiptScreen component remains the same

      // Print the receipt
      await RNPrint.print({
        html: receiptHTML,
      });

      console.log('Receipt printed successfully.');
    } catch (error) {
      console.error('Error printing receipt:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.receipt}>
        <Text style={styles.title}>Receipt</Text>
        <Text style={styles.subtitle}>
          Receipt ID: {currentReceipt?.receiptId}
        </Text>
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
          <Text style={styles.sectionText}>
            {currentReceipt?.quantity_before} kg
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moisture Percentage:</Text>
          <Text style={styles.sectionText}>
            {currentReceipt?.moisturePercentage}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity (In Kg):</Text>
          <Text style={styles.sectionText}>
            {currentReceipt?.quantityInKg} kg
          </Text>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalTitle}>Total Pay:</Text>
          <Text style={styles.totalAmount}>
            {currentReceipt?.totalPay} Tsh/=
          </Text>
        </View>

        <View>
      <Button onPress={printReceipt} title="Print Receipt" />
    </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 16,
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
