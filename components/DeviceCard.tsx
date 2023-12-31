import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { styles } from '../styles';

interface device {
  peripheral:any
  connect:any
  disconnect:any
}

 export const DeviceList = ({peripheral, connect, disconnect}:device) => {

  // const {name, rssi, connected} = peripheral;
  return (
    <>
      {peripheral&& (
        <View style={styles.deviceContainer}>
          <View style={styles.deviceItem}>
            <Text style={[styles.deviceName, {color:"black"}]}>{peripheral?.name}</Text>
            <Text style={[styles.deviceInfo, {color:"black"}]}>RSSI: {peripheral?.rssi}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              peripheral?.advertising.isConnectable ? connect(peripheral) : disconnect(peripheral)
            }
            style={styles.scanButton}>
            <Text
              style={[
                styles.scanButtonText,
                { fontSize: 10},
              ]}>
              {peripheral?.advertising.isConnectable ? 'Connect' : 'Non Connectable' }
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};