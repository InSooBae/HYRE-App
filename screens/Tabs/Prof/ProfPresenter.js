import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { Container } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from '@apollo/react-hooks';
import { RefreshControl } from 'react-native';
import Contact from '../../../components/Contact';
import Loader from '../../../components/Loader';

const SEARCH = gql`
  query seeAllProf {
    seeAllProf {
      id
      name
      workPhone
      company
      position
      photo
    }
  }
`;

export default ({ query }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH, {
    //언제 쿼리를 조회하지 않고 넘길지 설정
    //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
    fetchPolicy: 'network-only'
  });
  console.log(query);
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

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        data && (
          <FlatList
            data={data.seeAllProf}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              console.log(item);
              return (
                <Contact
                  __typename={item.__typename}
                  cellPhone={item.workPhone}
                  company={item.company}
                  id={item.id}
                  name={item.name}
                  photo={item.photo === null ? '' : item.photo}
                  position={item.position}
                />
              );
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
          />
        )
      )}
    </Container>
  );
};
