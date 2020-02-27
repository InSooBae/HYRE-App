import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';

import { useQuery } from '@apollo/react-hooks';
import UserProfile from '../components/UserProfile';
import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl } from 'react-native';
import Loader from '../components/Loader';
import { View, Container } from 'native-base';
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

  useEffect(() => {
    if (!loading) {
      if (type === 'User') {
        setA(...data.seeUser);
      } else {
        setA(data.seeProf);
      }
    }
  }, [data]);
  console.log(a, '-=-=-=-=-=-=-=-=');
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
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
