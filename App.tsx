import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DonationsProvider } from './src/context/DonationsContext';
import { LocationProvider } from './src/context/LocationContext'; 
import { ActivityIndicator, View } from 'react-native';

import { AuthStack, AppStack } from './src/navigation'; 

const AppContent = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      { user ? <AppStack /> : <AuthStack /> }
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DonationsProvider>
        <LocationProvider>
          <AppContent /> 
        </LocationProvider>
      </DonationsProvider>
    </AuthProvider>
  );
}