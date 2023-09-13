import 'react-native-gesture-handler';
import React, {useState, useEffect, useReducer} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BleManager from 'react-native-ble-manager';
import {DeviceList} from './components/DeviceCard';
import WeightDisplay from './screens/WeightDisplay';

import {
  Alert,
  Pressable,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  View,
  FlatList,
  PermissionsAndroid,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Dialog} from '@rneui/themed';
import AddFarmerScreen from './screens/AddFarmerScreen';
import DeviceScreen from './screens/DeviceScreen';
import {BleProvider} from './components/BleContext';
import ReceiptScreen from './screens/ReceiptScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



// const manager = new BleManager();

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [visible1, setVisible1] = useState(true);

  const requestBlePermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    try {
      const status = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);
      return (
        status[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] == 'granted' &&
        status[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] == 'granted' &&
        status[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] == 'granted'
      );
    } catch (e) {
      console.error('Location Permssions Denied ', e);
      return false;
    }
  };

  // effects
  useEffect(() => {
    const initBle = async () => {
      await requestBlePermissions();
      BleManager.enableBluetooth();
      initBle();
    };
  }, []);

  function AppStack() {
    return (
      <Stack.Navigator>
      <Stack.Screen
        name="WeightDisplay"
        component={WeightDisplay}
        options={{
          headerTitle: 'Digital scale',
          // headerRight: () => (
          //   <TouchableOpacity
          //     activeOpacity={0.5}
          //     onPress={() => {
          //       setVisible1(!visible1);
          //     }}>
          //     <Text>Scan Devices </Text>
          //   </TouchableOpacity>
          //   // <Pressable >
          //   //   <Text style={{fontWeight:"bold", }}>Scan device</Text>
          //   // </Pressable>
          // ),
          headerTitleStyle: {fontSize: 29, fontFamily: 'Poppins-Bold',},
        }}
      />
      <Stack.Screen name="devices" component={DeviceScreen}  options={{
        headerTitleStyle:{fontFamily: 'Poppins-Medium',},
        headerTitle: 'Device',
      }}

      />

      <Stack.Screen name="farmer" component={AddFarmerScreen} options={{
        headerTitleStyle:{fontFamily: 'Poppins-Medium',},
        headerTitle: 'Farmer',
      }}/>

      <Stack.Screen name="receipt" component={ReceiptScreen} options={{
        headerTitleStyle:{fontFamily: 'Poppins-Medium',},
        headerTitle: 'Receipts',
      }}/>
    </Stack.Navigator>
  
    );
  }

  return (
    <NavigationContainer>

      <BleProvider>
      <Tab.Navigator
       screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          position: "absolute",
          // bottom: 10,
          height: 82,
          paddingBottom: 20,
          width: "100%",
          // marginLeft: 20,
          shadowColor: "white",
          backgroundColor: "white",
        },
        headerShown: false,
      }}
      sceneContainerStyle={{
        marginBottom: 82,
      }}
      >
        <Tab.Screen name="Home" component={AppStack} 
         options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={32} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "Poppins-Bold",
          },
        }}
        />
        <Tab.Screen name="devices" component={DeviceScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bluetooth-audio" color={color} size={32} />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Poppins-Bold",
            },
            tabBarLabel:"Connect Device"
          }}  
        
        />
      </Tab.Navigator>

      </BleProvider>
    </NavigationContainer>
  );
};

export default App;
