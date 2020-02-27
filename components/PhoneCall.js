import { Alert, Platform } from 'react-native';
import { Linking } from 'expo';

export const callNumber = phone => {
  console.log('callNumber ----> ', phone);
  let phoneNumber = phone;
  if (Platform.OS === 'ios') {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
};

export const linkEmail = email => {
  let emailAddress = email;
  emailAddress = `mailto:${email}`;
  Linking.canOpenURL(emailAddress)
    .then(supported => {
      if (!supported) {
        Alert.alert('Email is not available');
      } else {
        return Linking.openURL(emailAddress);
      }
    })
    .catch(err => console.log(err));
};

export const linkMessage = phone => {
  console.log(phone);
  const url = `sms:${phone}${Platform.OS === 'ios' ? '&' : '?'}body=${''}`;
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        Alert.alert('Phone Number is not available');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(err => console.log(err));
};
