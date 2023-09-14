import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, NativeModules, NativeEventEmitter,ScrollView } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { SpeedDial, Button, Divider, Dialog, Icon } from '@rneui/themed';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useBleContext } from '../components/BleContext';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


const WeightDisplay = (props: any) => {
  const [addFarmerDial, setaddFarmerDial] = useState(false);
  const { connectedScale, currentFarmer, setCurrentReceipt, setCurrentFarmer, setConnectedScale } = useBleContext();
  const [isSelling, setisSelling] = useState(false);
  const [parsedWeightData, setparsedWeightData] = useState();
  const [accumulatedWeight, setaccumulatedWeight] = useState<any>();

  console.log(connectedScale);


  useEffect(() => {
    if (connectedScale) {
      subscribeToNotifications();
    }
  }, [connectedScale]);

  const sellCrops = async () => {
    setisSelling(true);


    try {
      const requestBody = {
        cropId: currentFarmer?.cropId,
        farmerId: currentFarmer?.id,
        quantity_in_kg: parsedWeightData, // You might want to get this value from user input or elsewhere
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

  const getWeight = () => {
    const weightCharacteristicUUID = 'YOUR_WEIGHT_CHARACTERISTIC_UUID';
    // @ts-ignore
    // @ts-igdore
    // @ts-ignore
    BleManager.read(
      connectedScale?.id,
      "181d",
      '2A98',
    )
      .then((readData: any) => {
        // Success code
        console.log(readData);


        // https://github.com/feross/buffer
        // https://nodejs.org/api/buffer.html#static-method-bufferfromarray
        const buffer = Buffer.from(readData);
        const sensorData: any = buffer.readUInt8(1);
        console.log("Read: " + parseFloat(sensorData));
        setparsedWeightData(sensorData)

      })
      .catch((error) => {
        // Failure code
        console.log(error);
        Alert.alert("Lost connection to the scale connect again")
        setparsedWeightData(0);
        setConnectedScale(null)
      });
  }

  const subscribeToNotifications = async () => {
    try {
      const weightCharacteristicUUID = 'YOUR_WEIGHT_CHARACTERISTIC_UUID';

      // Before startNotification you need to call retrieveServices
      await BleManager.retrieveServices(connectedScale?.id);

      await BleManager.startNotification(connectedScale?.id,
        "181d",
        '2A98')
        .then(() => {
          console.log('Subscribed to notifications.');
        })
        .catch((error) => {
          console.error('Error subscribing to notifications:', error);
        });
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
       // Failure code
       console.log(error);
       Alert.alert("Lost connection to the scale connect again")
       setparsedWeightData(0);
       setConnectedScale(null)
    }
  };

  bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', ({ peripheral, characteristic, value }: any) => {
    if (peripheral.id === connectedScale?.id) {
      // Handle incoming notifications.
      console.log('====================================');
      console.log(value);
      console.log('====================================');
      const stringValue = String.fromCharCode(...value)
      const parsedData: any = parseFloat(stringValue);
      const weightKg: any = parsedData / 1000;
      setparsedWeightData(weightKg.toFixed(2));
    }
  });

  const tareScale = () => {
    const tareCharacteristicUUID = '2A98';
    const tareCommand = 'TARE'; // Replace with the actual tare command bytes.
    console.log("----------------------");

    try {
      BleManager.write(
        connectedScale?.id,
        "181d",
        '2A98',
        // encode & extract raw `number[]`.
        // Each number should be in the 0-255 range as it is converted from a valid byte.
        [1, 2]
      )
        .then((rep: any) => {
          // Success code
          console.log("Write: " + rsp);
        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  };

  const accumulateWeight = () => {
    if (accumulatedWeight) {
      setaccumulatedWeight(accumulatedWeight+ parsedWeightData)
    }else{
      setaccumulatedWeight(parsedWeightData)
    }
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{alignItems:"center"}}
    >
      <StatusBar
       barStyle="light-content"
        backgroundColor="white"
      />
      <View style={{ marginTop: 20 }}>
        {connectedScale ? (
          <View>
            <Text style={{ marginTop: 10, fontStyle: 'normal', fontSize: 18, fontFamily: "Poppins-Bold", color:"black" }}>Name: {connectedScale.name}</Text>
            <Text style={{ marginTop: 10, fontStyle: 'normal', fontSize: 18, fontFamily: "Poppins-Regular", color:"black" }}>ID: {connectedScale.id}</Text>
          </View>
        ) : (
          <Text style={{ marginTop: 10, fontStyle: 'normal', fontSize: 18, fontFamily: 'Poppins-SemiBold', color:"black"}}>
            No connection!! Scan to connect
          </Text>
        )}

      </View>
      <View style={styles.weightView}>
        <ProgressCircle
          percent={parseInt(parsedWeightData)}
          radius={70}
          borderWidth={8}
          color="#3399FF"
          shadowColor="#999"
          bgColor="#fff">
          <Text style={{ fontSize: 28, fontFamily: 'Poppins-SemiBold', }}>{parsedWeightData ? parsedWeightData : 0}Kgs</Text>
        </ProgressCircle>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontFamily: 'Poppins-SemiBold', textAlign: "center" }}>
          Current weight: {accumulatedWeight? accumulatedWeight:parsedWeightData ?parsedWeightData : 0}kgs
        </Text>
        <View style={{ flexDirection: "row", width: "80%", justifyContent: "space-between" }}>
          <Button title="ACCUMULATE " onPress={accumulateWeight} type="outline" style={{ marginTop: 13 }} titleStyle={{ fontFamily: 'Poppins-Medium', }} />
          <Button title="TARE WEIGHT" onPress={tareScale} type="outline" style={{ marginTop: 13 }} titleStyle={{ fontFamily: 'Poppins-Medium', }} />

        </View>
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
        icon={{ name: "person", color: "#fff" }}
        openIcon={{ name: 'close', color: '#fff' }}
        iconContainerStyle={{ backgroundColor: "#0079FF" }}
        onOpen={() => setaddFarmerDial(!addFarmerDial)}
        onClose={() => setaddFarmerDial(!addFarmerDial)}>

        <SpeedDial.Action
          icon={{ name: "person", color: "#fff" }}
          title="Add farmer"
          iconContainerStyle={{ backgroundColor: "#0079FF" }}
          onPress={() => props.navigation.navigate("farmer")}
          titleStyle={{ fontFamily: 'Poppins-Medium', }}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
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
