import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { Container } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from '@apollo/react-hooks';
import { RefreshControl } from 'react-native';
import Contact from '../../components/Contact';
import Loader from '../../components/Loader';

const SEE_ALL_EXE = gql`
  query seeAllExecutive {
    seeAllExecutive {
      generation
      title
      user {
        id
        name
        company
        cellPhone
        team
        position
        photo
        email
        major {
          name
        }
        graduatedYear {
          generation
        }
      }
    }
  }
`;

export default () => {
  const [refreshing, setRefreshing] = useState(false);
  const [b, setB] = useState();
  const { data, loading, refetch } = useQuery(SEE_ALL_EXE, {
    //언제 쿼리를 조회하지 않고 넘길지 설정
    //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
    fetchPolicy: 'cache-and-network'
  });
  useEffect(() => {
    if (!loading) {
      setB(data.seeAllExecutive);
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

  if (loading || !b || !data) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  if (b !== undefined && data) {
    return (
      <Container>
        <FlatList
          data={b}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <Contact
                __typename={item.user.__typename}
                cellPhone={!item.user.cellPhone ? null : item.user.cellPhone}
                company={item.user.company}
                id={item.user.id}
                name={item.user.name}
                email={item.user.email}
                photo={item.user.photo === null ? '' : item.user.photo}
                position={item.user.position}
                team={item.user.team}
                major={item.user.major.name}
                generation={item.user.graduatedYear.generation}
                directorGen={item.generation}
                directorTitle={item.title}
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
