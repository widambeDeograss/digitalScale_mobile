import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { Input, Avatar, Dialog, Button, Divider } from '@rneui/themed';
import RadioGroup from 'react-native-radio-buttons-group';
import { styles } from '../styles';
import { Colors } from '../constants/Colors';
import { useBleContext } from '../components/BleContext';

interface farmerDat {
  farmer: Object
  farmer_data: Array<Object>
}

const AddFarmerScreen = (props:any) => {
  const [isLoasing, setisLoasing] = useState(false);
  const [farmerPhone, setfarmerPhone] = useState("");
  const [farmerData, setfarmerData] = useState<farmerDat | null>();
  const [corporates, setcorporates] = useState([])
  const [selectedCorporate, setselectedCorporate] = useState();
  const [cropselected, setcropselected] = useState();
  const [corporateCrops, setcorporateCrops] = useState([])
  const [selectedId, setSelectedId] = useState();
  const { setCurrentFarmer } = useBleContext();

  console.log(farmerPhone);

  const onSubmit = async () => {
    setisLoasing(true);
    try {
      const response = await fetch("http://172.17.17.151:1999/mobile_api/farmer_info", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            "phone": farmerPhone
          }
        ),
      });

      const result = await response.json();
      console.log("Success:", result);
      setfarmerData(result)
      if (result.message === "User Does Not Exist") {
        Alert.alert("The farmer with that ID doest exist");
      }
      const newdat = [];

      result?.farmer_data?.forEach((dat: any) => {
        newdat.push({
          id: dat?.corporate?.id,
          label: dat?.corporate?.name,
          value: dat?.corporate?.name,
        });
      });
      setcorporates(newdat);

      setfarmerPhone("")
    } catch (error: any) {
      console.error("Error:", error);
      Alert.alert("Error:", error.message)
    }
    setisLoasing(false)
  }

  interface RadioButtonOption {
    id: string;
    label: string;
    value: string;
  }


  const radioButtons: RadioButtonOption[] = useMemo(() => (
    corporates
  ), [farmerData]);

  console.log(corporates);

  useEffect(() => {
    if (selectedId) {
      const cop = farmerData?.farmer_data.find((dat) => {
        return dat.corporate.id === selectedId;
      })
      const newdat:any = [];
      cop?.corporate_crops?.forEach((dat: any) => {
        newdat.push({
          id: dat?.id,
          label: dat?.name,
          value: dat?.name,
        });
      });
      setcorporateCrops(newdat);
    }
  }, [selectedId])

  type currentFarmer = {
    name: string | null;
    id: string | null;
    crop:string | null;
    cropId:string | null;
    corporate:string | null;
  }
   

  const onProceed = () => {

    const cop:any = farmerData?.farmer_data.find((dat:any) => {
      return dat.corporate.id === selectedId;
    })

   const crop = cop?.corporate_crops?.find((cop:any) => {
      return cop.id === cropselected;
    })

    const frm:currentFarmer = {
        name: farmerData?.farmer?.full_name,
        id: farmerData?.farmer_data[0]?.farmer.id,
        cropId:cropselected,
        corporate:cop?.corporate.name,
        crop:crop.name
    }
    if (frm) {
      setCurrentFarmer(frm)
      props.navigation.navigate("WeightDisplay");
    }else{
      Alert.alert("Fill the required detaails first")
    }

  }

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <StatusBar
        backgroundColor="white"
      />
      <View>
        <Text
          style={{
            // color: '#073762',
            fontFamily: "Poppins-Bold",
            fontSize: 26,
            marginTop: 10,
          }}>
          Add farmer
        </Text>
      </View>

      <View style={{ width: '80%', alignItems: 'center', marginBottom: 5 }}>

        <Input
          placeholder="Farmer ID"
          keyboardType='phone-pad'
          inputStyle={{
            // borderColor: Colors.primary,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            fontFamily: 'Poppins-Regular',
            fontSize: 15,
          }}
          onChangeText={(text) => setfarmerPhone(text)}

          inputContainerStyle={{
            borderBottomWidth: 0,
            padding: 10,
            marginTop: 10,
          }}
        // leftIcon={{ type: 'font-awesome', name: 'comment' }}
        // onChangeText={value => this.setState({ comment: value })}
        />
        {isLoasing ? (
          <ActivityIndicator />
        ) : (
          <Button title="Submit farmer info" onPress={() => { onSubmit() }} containerStyle={{ backgroundColor: Colors.danger, width: "90%", borderRadius: 10 }}
            titleStyle={{ fontFamily: "Poppins-Medium" }}
          />
        )}
      </View>
      <Divider style={{ borderWidth: 1, backgroundColor: "#AFAFAF", width: "90%", marginTop: 10 }} />

      <View style={{  alignItems: "flex-start", marginTop: 10 }}>

        {farmerData && (
          <View>
            <Text style={{ fontFamily: "Poppins-Medium", textAlign: "left", marginTop: 10, fontSize: 18 }}>
              Farmers name:  {farmerData?.farmer?.full_name}
            </Text>
            <Text style={{ fontFamily: "Poppins-Medium", textAlign: "left", marginTop: 5, fontSize: 18 }}>
              Farmers email:  {farmerData?.farmer?.emalil}
            </Text>
          </View>
        )}

        {corporates.length > 0 && (<Text style={{ fontFamily: "Poppins-Medium", textAlign: "left", marginTop: 15, fontSize: 18 }}>
          Choose Corporate societies registered
        </Text>)}
        <RadioGroup
          radioButtons={corporates}

          onPress={(id) => {
            setSelectedId(id);
          }}
          selectedId={selectedId}
          containerStyle={{ marginTop: 10 }}

        />

        {corporateCrops.length > 0 && (<Text style={{ fontFamily: "Poppins-Medium", textAlign: "left", fontSize: 18, marginTop: 15, }}>
          Choose Crop
        </Text>)}
        <View>
          {corporateCrops && (
            <RadioGroup
              radioButtons={corporateCrops}
              onPress={setcropselected}
              selectedId={cropselected}
              containerStyle={{ marginTop: 10 }}
            />
          )}
        </View>
      
      </View>

      <View style={{width: "90%",  marginTop: 30,alignItems: 'center',  }}>
          {corporateCrops.length > 0  && (
           <Button title="Proceed" onPress={() => { onProceed() }} containerStyle={{ backgroundColor: Colors.danger, width: "90%", borderRadius: 10 }}
           titleStyle={{ fontFamily: "Poppins-Medium" }}
         />
          )}
        </View>
    </SafeAreaView>
  );
};

export default AddFarmerScreen;
