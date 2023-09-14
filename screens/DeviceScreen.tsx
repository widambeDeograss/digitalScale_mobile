import React, {useState, useEffect} from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
  ScrollView
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DeviceList} from '../components/DeviceCard';
import {styles} from '../styles';
import {useBleContext} from '../components/BleContext';
import {Divider, Dialog} from '@rneui/themed';
// import { ScrollView } from 'react-native-gesture-handler';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const DeviceScreen = (props: any) => {
  const peripherals: any = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const {setConnectedScale} = useBleContext();

  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        let peripheral: any = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };
  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });
    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );
    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );
    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });
    }
    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);
  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  // pair with device first before connecting to it
  const connectToPeripheral = (peripheral: any) => {
    BleManager.connect(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        setConnectedScale(peripheral);
        Alert.alert(`BLE device paired successfully ${peripheral.name}`);
        console.log('BLE device paired successfully');
        props.navigation.navigate('WeightDisplay');
      })
      .catch(() => {
        Alert.alert('Failed to bond device');
        console.log('failed to bond');
      });
  };
  // disconnect from device
  const disconnectFromPeripheral = (peripheral: any) => {
    BleManager.disconnect(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('fail to remove the bond');
      });
  };
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ?Colors.lighter : Colors.lighter,
  };
  // render list of bluetooth devices
  return (
    <View style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{paddingHorizontal: 20, flex:1, height:""}}>
        <Text
          style={[
            styles.title,
            {color: isDarkMode ? Colors.black : Colors.black, fontSize:20},
          ]}>
          Digital scale device connection
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.scanButton}
          onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.subtitle,
            {color: isDarkMode ? Colors.black : Colors.black, fontSize:16},
          ]}>
          Discovered Devices:
        </Text>
        <View style={{height:290}}>
          {discoveredDevices.length > 0 ? (
            <FlatList
              data={discoveredDevices}
              renderItem={({item}) => (
                <DeviceList
                  peripheral={item}
                  connect={connectToPeripheral}
                  disconnect={disconnectFromPeripheral}
                />
              )}
              keyExtractor={item => item.id}
            />
          ) : (
            <Text style={[styles.noDevicesText, { color:"black"}]}>No Bluetooth devices found</Text>
          )}
        </View>
        <Text
          style={[
            styles.subtitle,
            {color: isDarkMode ? Colors.black : Colors.black},
          ]}>
          Connected Devices:
        </Text>
        <View style={{height:"30%"}}>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connectToPeripheral}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={[styles.noDevicesText, {color:"black"}]}>No connected devices</Text>
        )}
        </View>
      </View>
      <Dialog
        isVisible={isScanning}
        // onBackdropPress={() => setVisible1(!visible1)}
      >
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: 16,
            textAlign: 'center',
             color:"black"
          }}>
          Scanning available Ble devices
        </Text>
        <Dialog.Loading />
      </Dialog>
    </View>
  );
};

export default DeviceScreen;
