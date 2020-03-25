import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as ContactS from 'expo-contacts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { callNumber, inputPhoneNumber } from '../components/PhoneCall';
import { withNavigation } from 'react-navigation';
import styles from '../styles';
import {
  Card,
  Avatar,
  Portal,
  Dialog,
  Paragraph,
  Button
} from 'react-native-paper';
import { View, Platform, PermissionsAndroid } from 'react-native';
import { Toast, Text } from 'native-base';
import styled from 'styled-components';
import Contacts from 'react-native-contacts';
import { trimText } from '../utils';
const Contact = ({
  id,
  __typename,
  photo,
  name,
  cellPhone,
  company,
  team,
  position,
  major,
  generation,
  directorGen = '',
  directorTitle = '',
  email,
  navigation
}) => {
  const [visible, setVisible] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const saveContact = async () => {
    const phoneName =
      __typename === 'User'
        ? `${name} ${major} ${generation}기`
        : `${name} ${major} 교수`;
    if (Platform.OS === 'ios') {
      const { status } = await ContactS.requestPermissionsAsync();
      if (status === 'granted') {
        const contact = {
          [ContactS.Fields.FirstName]: phoneName,
          [ContactS.Fields.PhoneNumbers]: [
            {
              label: '전화번호',
              number: !cellPhone ? '' : inputPhoneNumber(cellPhone)
            }
          ],
          [ContactS.Fields.Emails]: [
            {
              email: !email ? '' : email,
              isPrimary: true,
              id: '2',
              label: '이메일'
            }
          ],
          [ContactS.Fields.Company]: !company ? '' : company
        };
        try {
          const contactId = await ContactS.addContactAsync(contact);
          console.log('contact-ID:', contactId);
          if (contactId) {
            Toast.show({
              text: `연락처가 저장되었습니다.`,
              textStyle: { textAlign: 'center' },
              buttonText: 'Okay',
              type: 'success',
              position: 'top',
              duration: 3000,
              style: { marginTop: 70 }
            });
          } else {
            Toast.show({
              text: `연락처가 저장실패 하였습니다.`,
              textStyle: { textAlign: 'center' },
              buttonText: 'Okay',
              type: 'danger',
              position: 'top',
              duration: 3000,
              style: { marginTop: 70 }
            });
          }
        } catch (err) {
          console.log(err);

          Toast.show({
            text: `연락처가 저장실패 하였습니다.`,
            textStyle: { textAlign: 'center' },
            buttonText: 'Okay',
            type: 'danger',
            position: 'top',
            duration: 3000,
            style: { marginTop: 70 }
          });
        }
      } else {
        Toast.show({
          text: `연락처 권한설정을 해주세요!`,
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'danger',
          position: 'top',
          duration: 3000,
          style: { marginTop: 70 }
        });
      }
      setButtonLoading(false);
      setVisible(false);
    } else {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
        ],
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal'
        }
      );
      setButtonLoading(true);
      if (
        granted['android.permission.READ_CONTACTS'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_CONTACTS'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        const contact = {
          givenName: phoneName,
          phoneNumbers: [
            {
              label: '전화번호',
              number: !cellPhone ? '' : inputPhoneNumber(cellPhone)
            }
          ],
          emailAddresses: [
            {
              label: '이메일',
              email: email === null ? '' : email
            }
          ],
          company: company === null ? '' : company
        };
        setButtonLoading(true);
        Contacts.addContact(contact, err => {
          if (err) {
            Toast.show({
              text: '연락처가 저장실패 하였습니다.',
              textStyle: { textAlign: 'center' },
              buttonText: 'Okay',
              type: 'danger',
              position: 'top',
              duration: 3000,
              style: { marginTop: 70 }
            });
            console.log(err);
            throw err;
          }
          if (!err) {
            Toast.show({
              text: '연락처가 저장되었습니다.',
              textStyle: { textAlign: 'center' },
              buttonText: 'Okay',
              type: 'success',
              position: 'top',
              duration: 3000,
              style: { marginTop: 70 }
            });
          }
        });
      } else {
        Toast.show({
          text: '권한 설정을 해주세요.',
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'danger',
          position: 'top',
          duration: 3000,
          style: { marginTop: 70 }
        });
      }
      setButtonLoading(false);
      setVisible(false);
    }
  };

  return (
    <Card
      onPress={() =>
        navigation.navigate('UserDetail', {
          id: id,
          name: name,
          __typename: __typename
        })
      }
      onLongPress={() => setVisible(true)}
      elevation={2}
      style={{
        marginTop: 3,
        marginBottom: 2,
        flex: 1,
        borderColor: styles.hanyangColor,
        borderTopRightRadius: 7,
        borderTopLeftRadius: 33,
        borderBottomRightRadius: 33,
        borderBottomLeftRadius: 7,
        borderWidth: 0.5
      }}
      theme={{}}
    >
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{`${name} 연락처 저장`}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{`${name}님의 연락처를 저장하시겠습니까?`}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              color={styles.hanyangColor}
              onPress={() => setVisible(false)}
            >
              취소
            </Button>
            <Button
              loading={buttonLoading}
              disabled={buttonLoading}
              color={styles.hanyangColor}
              onPress={saveContact}
            >
              확인
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center'
        }}
      >
        <Avatar.Image
          style={{ marginLeft: 7 }}
          source={photo === '' ? require('../assets/HYU1.png') : { uri: photo }}
          theme={{ colors: { primary: '#ffffff' } }}
        />
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            flex: 1
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 15
            }}
          >
            <Text
              style={
                Platform.OS === 'ios'
                  ? {
                      fontSize: 20,
                      color: styles.hanyangColor,
                      fontWeight: '600',
                      marginTop: 3,
                      marginBottom: 3
                    }
                  : {
                      fontSize: 17,
                      color: styles.hanyangColor,
                      fontWeight: '600'
                    }
              }
            >
              {name}
            </Text>
            <Text
              style={
                Platform.OS === 'ios'
                  ? { fontSize: 16, marginTop: 5 }
                  : { fontSize: 14, marginTop: 5 }
              }
            >
              {!company ? '' : trimText(company, 15)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 15
            }}
          >
            <TouchableOpacity
              style={{ flexWrap: 'wrap', flex: 1 }}
              onPress={() => (!cellPhone ? null : callNumber(cellPhone))}
            >
              <Text
                style={
                  Platform.OS === 'ios'
                    ? {
                        marginBottom: 5
                      }
                    : {
                        fontSize: 16
                      }
                }
              >
                {!cellPhone ? null : inputPhoneNumber(cellPhone)}
              </Text>
            </TouchableOpacity>
            <Text
              style={
                Platform.OS === 'ios'
                  ? { fontSize: 16, marginTop: 2 }
                  : { fontSize: 14, marginTop: 2 }
              }
            >
              {!team ? '' : trimText(team, 12)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 15
            }}
          >
            <View>
              {!directorTitle ? (
                __typename === 'User' ? (
                  <Text
                    style={
                      Platform.OS === 'ios'
                        ? { fontSize: 16, marginBottom: 3, marginRight: 13 }
                        : { fontSize: 14, marginBottom: 3, marginRight: 13 }
                    }
                  >{`${generation}기/${major}`}</Text>
                ) : (
                  <Text
                    style={
                      Platform.OS === 'ios'
                        ? { fontSize: 16, marginBottom: 3, marginRight: 13 }
                        : { fontSize: 14, marginBottom: 3, marginRight: 13 }
                    }
                  >{`${major}`}</Text>
                )
              ) : (
                <Text
                  style={
                    Platform.OS === 'ios'
                      ? {
                          fontSize: 16,
                          marginRight: 13,
                          marginBottom: 3
                        }
                      : {
                          marginRight: 13,
                          marginBottom: 3,
                          fontSize: 14
                        }
                  }
                >{`${generation}기 / ${directorGen}대 ${directorTitle}`}</Text>
              )}
            </View>

            <Text
              style={
                Platform.OS === 'ios' ? { fontSize: 16 } : { fontSize: 14 }
              }
            >
              {!position ? '' : position}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

Contact.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  cellPhone: PropTypes.string,
  company: PropTypes.string,
  team: PropTypes.string,
  position: PropTypes.string,
  photo: PropTypes.string,
  major: PropTypes.string,
  generation: PropTypes.number,
  __typename: PropTypes.string
};

export default withNavigation(Contact);
