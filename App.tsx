import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator, RootStackParams } from './Navigator';
import { AuthProvider } from './auth/AuthContext';
import { AppProvider } from './AppContext';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';

const RootTab = createStackNavigator<RootStackParams>();

export default function App() {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <AppProvider>
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </AppProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
}
