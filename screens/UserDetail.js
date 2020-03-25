import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import UserProfile from '../components/UserProfile';
import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl, Platform, PermissionsAndroid } from 'react-native';
import Loader from '../components/Loader';
import { View, Toast } from 'native-base';
import constants from '../constants';
import AuthButton from '../components/AuthButton';
import { inputPhoneNumber } from '../components/PhoneCall';
import Contacts from 'react-native-contacts';
import * as ContactS from 'expo-contacts';

const SEE_USER = gql`
  query seeUser($id: ID!) {
    seeUser(id: $id) {
      id
      name
      birthday
      email
      cellPhone
      company
      team
      position
      workPhone
      workAddress
      photo
      companyDesc
      major {
        name
      }
      graduatedYear {
        generation
      }
    }
  }
`;

const SEE_PROF = gql`
  query seeProf($id: ID!) {
    seeProf(id: $id) {
      id
      name
      email
      workPhone
      position
      title
      company
      photo
      major {
        name
      }
    }
  }
`;

export default ({ navigation }) => {
  const type = navigation.getParam('__typename');
  const isUserProf = type === 'User' ? SEE_USER : SEE_PROF;
  const [a, setA] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(isUserProf, {
    variables: { id: navigation.getParam('id') },
    fetchPolicy: 'network-only'
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const saveContact = async () => {
    const phoneName =
      type === 'User'
        ? `${a.name} ${a.major.name} ${a.graduatedYear.generation}기`
        : `${a.name} ${a.major.name} 교수`;
    if (Platform.OS === 'ios') {
      const { status } = await ContactS.requestPermissionsAsync();
      if (status === 'granted') {
        const cellPhoneA =
          a.__typename === 'User'
            ? !a.cellPhone
              ? ''
              : inputPhoneNumber(a.cellPhone)
            : !a.workPhone
            ? ''
            : inputPhoneNumber(a.workPhone);
        const contact = {
          [ContactS.Fields.FirstName]: phoneName,
          [ContactS.Fields.PhoneNumbers]: [
            {
              label: '전화번호',
              number: cellPhoneA
            }
          ],
          [ContactS.Fields.Emails]: [
            {
              email: a.email === null ? '' : a.email,
              isPrimary: true,
              id: '2',
              label: '이메일'
            }
          ],
          [ContactS.Fields.Company]: a.company === null ? '' : a.company
        };
        try {
          const contactId = await ContactS.addContactAsync(contact);
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
        const cellPhoneA =
          a.__typename === 'User'
            ? !a.cellPhone
              ? ''
              : inputPhoneNumber(a.cellPhone)
            : !a.workPhone
            ? ''
            : inputPhoneNumber(a.workPhone);
        const contact = {
          givenName: phoneName,
          phoneNumbers: [
            {
              label: '전화번호',
              number: cellPhoneA
            }
          ],
          emailAddresses: [
            {
              label: '이메일',
              email: a.email === null ? '' : a.email
            }
          ],
          company: a.company === null ? '' : a.company
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
    }
  };

  useEffect(() => {
    if (!loading) {
      if (type === 'User') {
        setA(...data.seeUser);
      } else {
        setA(data.seeProf);
      }
    }
  }, [data]);
  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  if (loading || a === undefined) return <Loader />;
  if (a !== undefined)
    return (
      <ScrollView
        style={{ backgroundColor: 'white' }}
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <View
          style={{ width: constants.width / 1.5, alignSelf: 'center', flex: 1 }}
        >
          <AuthButton
            loading={buttonLoading}
            text="연락처 저장"
            onPress={saveContact}
          />
        </View>
        <UserProfile
          name={a.name}
          birth={!a.birthday ? '' : a.birthday}
          email={a.email}
          cellPhone={type === 'User' ? a.cellPhone : a.workPhone}
          company={a.company}
          companyDesc={type === 'User' ? a.companyDesc : ''}
          team={type === 'User' ? a.team : a.title}
          position={a.position}
          workAddress={type === 'User' ? a.workAddress : ''}
          workPhone={a.workPhone}
          photo={a.photo === null ? '' : a.photo}
          generation={type === 'User' ? a.graduatedYear.generation : ''}
          major={a.major.name}
        />
      </ScrollView>
    );
};
