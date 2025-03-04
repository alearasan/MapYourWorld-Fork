import React from "react";
import { Image, Text, View } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MapScreen from "@/components/Map/MapScreen";
import LoginScreen from "@/components/screens/LoginScreen";
import RegisterScreen from "@/components/screens/RegisterScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import { styled } from 'nativewind';
import DropdownButton from "@/components/UI/DropDownMenu";


const Stack = createStackNavigator();
const StyledText = styled(Text);


const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" 
        component={WelcomeScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('./src/assets/images/logo.png')} 
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <StyledText className="text-xl font-bold ml-2 text-gray-800">Welcome</StyledText>
          </View>
          )
          
        }}/>
        <Stack.Screen name="Register" 
        component={RegisterScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('./src/assets/images/logo.png')} 
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <StyledText className="text-xl font-bold ml-2 text-gray-800">Register</StyledText>
          </View>
          )
          
        }}/>
        <Stack.Screen name="Login" 
        component={LoginScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('./src/assets/images/logo.png')} 
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <StyledText className="text-xl font-bold ml-2 text-gray-800">Login</StyledText>
          </View>
          )
          
        }}/>
        <Stack.Screen name="Map" 
        component={MapScreen}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('./src/assets/images/logo.png')} 
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <StyledText className="text-xl font-bold ml-2 text-gray-800">MapYourWorld</StyledText>
           
          </View>
          )
          
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
