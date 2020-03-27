import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { Container } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from '@apollo/react-hooks';
import { RefreshControl } from 'react-native';
import Contact from '../../components/Contact';
import Loader from '../../components/Loader';

const SEE_ALL_PROF = gql`
  query seeAllProf {
    seeAllProf {
      id
      name
      workPhone
      company
      position
      major {
        name
        shortName
      }
      email
      photo
      title
    }
  }
`;

export default ({ query }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [a, setA] = useState();
  const { data, loading, refetch } = useQuery(SEE_ALL_PROF, {
    //언제 쿼리를 조회하지 않고 넘길지 설정
    //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
    fetchPolicy: 'cache-and-network'
  });
  useEffect(() => {
    if (!loading) {
      setA(data.seeAllProf);
    }
    return () => {};
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

  if (loading || !a || !data) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  if (a !== undefined && data) {
    return (
      <Container>
        <FlatList
          data={a}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <Contact
                __typename={item.__typename}
                cellPhone={!item.workPhone ? null : item.workPhone}
                company={item.company}
                id={item.id}
                name={item.name}
                email={item.email}
                photo={item.photo === null ? '' : item.photo}
                position={item.position}
                team={item.title}
                major={item.major.name}
                generation={null}
                directorGen={''}
                directorTitle={''}
                shortName={item.major.shortName}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        />
      </Container>
    );
  }
};
