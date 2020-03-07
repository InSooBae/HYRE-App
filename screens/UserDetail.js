import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import * as Contacts from 'expo-contacts';
import { useQuery } from '@apollo/react-hooks';
import UserProfile from '../components/UserProfile';
import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl } from 'react-native';
import Loader from '../components/Loader';
import { View, Container, Toast } from 'native-base';
import constants from '../constants';
import AuthButton from '../components/AuthButton';
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
    setButtonLoading(true);
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const contact = {
        [Contacts.Fields.FirstName]: a.name,
        [Contacts.Fields.PhoneNumbers]: [
          { label: '휴대폰', number: a.cellPhone }
        ],
        [Contacts.Fields.Emails]: [
          {
            email: a.email,
            isPrimary: true,
            id: '2',
            label: '이메일'
          }
        ],
        [Contacts.Fields.Company]: a.company
      };
      try {
        const contactId = await Contacts.addContactAsync(contact);
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
        Toast.show({
          text: `연락처가 저장실패 하였습니다.`,
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'danger',
          position: 'top',
          duration: 3000,
          style: { marginTop: 70 }
        });
      } finally {
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
  };

  useEffect(() => {
    if (!loading) {
      if (type === 'User') {
        setA(...data.seeUser);
      } else {
        setA(data.seeProf);
      }
    }
    return () => {
      null;
    };
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
          birth={a.birthday}
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
          major={type === 'User' ? a.major.name : ''}
        />
      </ScrollView>
    );
};
