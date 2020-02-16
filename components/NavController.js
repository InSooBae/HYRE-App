import React from 'react';
import { View } from 'react-native';
import { useIsLoggedIn } from '../AuthContext';
import TabNavigation from '../navigation/TabNavigation';
import AuthMainNavigation from '../navigation/AuthMainNavigation';
export default () => {
  const isLoggedIn = false;
  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? (
        <TabNavigation />
      ) : (
        //When the User is logged out
        <AuthMainNavigation />
      )}
    </View>
  );
};
