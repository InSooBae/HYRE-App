import React from 'react';
import { View } from 'react-native';
import { useIsLoggedIn } from '../AuthContext';
import TabNavigation from '../navigation/TabNavigation';
import AuthNavigation from '../navigation/AuthNavigation';
export default () => {
  const isLoggedIn = useIsLoggedIn();
  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? (
        <TabNavigation />
      ) : (
        //When the User is logged out
        <AuthNavigation />
      )}
    </View>
  );
};
