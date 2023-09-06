import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { SpeedDial, Button, Divider, Dialog, Icon } from '@rneui/themed';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useBleContext } from '../components/BleContext';

const WeightDisplay = (props: any) => {
  const [addFarmerDial, setaddFarmerDial] = useState(false);
  const { connectedScale, currentFarmer, setCurrentReceipt, setCurrentFarmer } = useBleContext();
  const [isSelling, setisSelling] = useState(false);

  console.log(connectedScale);
  const sellCrops = async () => {
    setisSelling(true);

    try {
      const requestBody = {
        cropId: currentFarmer?.cropId,
        farmerId: currentFarmer?.id,
        quantity_in_kg: 1233.3, // You might want to get this value from user input or elsewhere
      };

      const response = await fetch("http://172.17.17.151:1999/mobile_api/scale_crop_sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      const receiptData: any = {
        receiptId: result?.id,
        crop: result?.cropSold,
        cropId: currentFarmer?.cropId,
        corporate: currentFarmer?.corporate,
        farmer: result?.farmer,
        saledate: result?.saledate,
        quantity_before: result?.quantity_before,
        moisturePercentage: result?.moisturePercentage,
        quantityInKg: result?.quantityInKg,
        totalPay: result?.totalPay,
      };

      setCurrentReceipt(receiptData);
    } catch (error: any) {
      console.error("Error:", error);
      Alert.alert("Something went wrong", error.message);
    } finally {
      setisSelling(false);
      setCurrentFarmer(null);
      props.navigation.navigate("receipt")
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="white"
      />
      <View style={{ marginTop: 20 }}>
        {connectedScale ? (
          <View>
            <Text style={{ marginTop: 10, fontStyle: 'normal', fontSize: 18, fontFamily: "Poppins-Bold" }}>Name: {connectedScale.name}</Text>
            <Text style={{ marginTop: 10, fontStyle: 'normal', fontSize: 18, fontFamily: "Poppins-Regular" }}>ID: {connectedScale.id}</Text>
          </View>
        ) : (
          <Text style={{ marginTop: 10, fontStyle: 'normal', fontSize: 18, fontFamily: 'Poppins-SemiBold', }}>
            No connection!! Scan to connect
          </Text>
        )}

      </View>
      <View style={styles.weightView}>
        <ProgressCircle
          percent={30}
          radius={70}
          borderWidth={8}
          color="#3399FF"
          shadowColor="#999"
          bgColor="#fff">
          <Text style={{ fontSize: 28, fontFamily: 'Poppins-SemiBold', }}>{'30kg'}</Text>
        </ProgressCircle>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontFamily: 'Poppins-SemiBold', }}>
          Current weight: 500Kgs
        </Text>
        <Button title="TARE" type="outline" style={{ marginTop: 13 }} titleStyle={{ fontFamily: 'Poppins-Medium', }} />

      </View>
      <Divider style={{ borderWidth: 1, backgroundColor: "#AFAFAF", width: "95%", marginTop: 17 }} />

      {currentFarmer ? (
        <View>
          <Text style={{ fontFamily: "Poppins-Medium", textAlign: "left", marginTop: 10, fontSize: 18 }}>
            Farmers name:  {currentFarmer.name}
          </Text>
          <Text style={{ fontFamily: "Poppins-Medium", textAlign: "left", marginTop: 5, fontSize: 18 }}>
            Corporate society:  {currentFarmer.corporate}
          </Text>
          <Text style={{ fontFamily: "Poppins-Medium", textAlign: "left", marginTop: 5, fontSize: 18 }}>
            Crop:  {currentFarmer.crop}
          </Text>
          <Button title="Proceed with the Transaction" onPress={sellCrops} containerStyle={{ width: "90%", borderRadius: 10, marginTop: 25, }}
            titleStyle={{ fontFamily: "Poppins-Medium" }}
          />
        </View>
      ) : (
        <Text style={{ fontFamily: "Poppins-Medium", textAlign: "left", marginTop: 10, fontSize: 18, color: "red" }}>
          No Farmer selected
        </Text>
      )}
      <SpeedDial
        isOpen={addFarmerDial}
        icon={<Icon
          name='heartbeat'
          type='font-awesome'
          color='#f50'
        />}
        openIcon={{ name: 'close', color: '#fff' }}
        iconContainerStyle={{ backgroundColor: "#0079FF" }}
        onOpen={() => setaddFarmerDial(!addFarmerDial)}
        onClose={() => setaddFarmerDial(!addFarmerDial)}>
        <SpeedDial.Action
          icon={<Icon name="person" size={24} color="#fff" />}
          title="Add farmer"
          iconContainerStyle={{ backgroundColor: "#0079FF" }}
          onPress={() => props.navigation.navigate("farmer")}
          titleStyle={{ fontFamily: 'Poppins-Medium', }}
        />
        <SpeedDial.Action
          icon={
            <Icon name="bluetooth" size={24} color="#fff" />
          }
          title="Connect device"
          titleStyle={{ fontFamily: 'Poppins-Medium', }}
          iconContainerStyle={{ backgroundColor: "#0079FF" }}
          onPress={() => props.navigation.navigate("devices")}
        />
      </SpeedDial>
      <Dialog
        isVisible={isSelling}

      // onBackdropPress={() => setVisible1(!visible1)}
      >
        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16, textAlign: "center" }}>Processing crop transaction</Text>
        <Dialog.Loading
        />
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
  weightView: {
    borderWidth: 2,
    width: 300,
    height: 200,
    borderRadius: 10,
    borderColor: 'gray',
    marginTop: 30,
    // flex:1,
    justifyContent: "center",
    alignItems: 'center'
  },
});

export default WeightDisplay;
