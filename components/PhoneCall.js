import { Alert, Platform } from 'react-native';
import { Linking } from 'expo';

export const callNumber = phone => {
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

export const inputPhoneNumber = obj => {
  let number = obj.replace(/[^0-9]/g, '');
  let phone = '';

  let seoul = 0;

  if (number.substring(0, 2).indexOf('02') == 0) {
    seoul = 1;
  }

  if (number.length < 4 - seoul) {
    return number;
  } else if (number.length < 7 - seoul) {
    phone += number.substr(0, 3 - seoul);
    phone += '-';
    phone += number.substr(3 - seoul);
  } else if (number.length < 11 - seoul) {
    phone += number.substr(0, 3 - seoul);
    phone += '-';
    phone += number.substr(3 - seoul, 3);
    phone += '-';
    phone += number.substr(6 - seoul);
  } else {
    phone += number.substr(0, 3 - seoul);
    phone += '-';
    phone += number.substr(3 - seoul, 4);
    phone += '-';
    phone += number.substr(7 - seoul);
  }
  return phone;
};
