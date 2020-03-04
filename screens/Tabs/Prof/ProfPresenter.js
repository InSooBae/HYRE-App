import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { Container } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from '@apollo/react-hooks';
import { RefreshControl } from 'react-native';
import Contact from '../../../components/Contact';
import Loader from '../../../components/Loader';

const SEE_ALL_PROF = gql`
  query seeAllProf {
    seeAllProf {
      id
      name
      workPhone
      company
      position
      photo
      title
    }
  }
`;

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

export default ({ query }) => {
  const isProfUser = query === '교수' ? SEE_ALL_PROF : SEE_ALL_EXE;
  const [refreshing, setRefreshing] = useState(false);
  const [a, setA] = useState();
  const [b, setB] = useState();
  const { data, loading, refetch } = useQuery(isProfUser, {
    //언제 쿼리를 조회하지 않고 넘길지 설정
    //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
    fetchPolicy: 'network-only'
  });
  useEffect(() => {
    if (!loading) {
      if (query === '교수') {
        setA(data.seeAllProf);
      } else {
        setB(data.seeAllExecutive);
      }
    }
    return () => {
      console.log('교수');
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

  if (
    query === '교수'
      ? loading || a === undefined || !data
      : loading || b === undefined || !data
  ) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  if (query === '교수' ? a !== undefined && data : b !== undefined && data) {
    return (
      <Container>
        <FlatList
          data={query === '교수' ? a : b}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <Contact
                __typename={
                  query === '교수' ? item.__typename : item.user.__typename
                }
                cellPhone={
                  query === '교수' ? item.workPhone : item.user.cellPhone
                }
                company={query === '교수' ? item.company : item.user.company}
                id={query === '교수' ? item.id : item.user.id}
                name={query === '교수' ? item.name : item.user.name}
                photo={
                  query === '교수'
                    ? item.photo === null
                      ? ''
                      : item.photo
                    : item.user.photo === null
                    ? ''
                    : item.user.photo
                }
                position={query === '교수' ? item.position : item.user.position}
                team={query === '교수' ? item.title : item.user.team}
                major={query === '교수' ? '' : item.user.major.name}
                generation={
                  query === '교수' ? null : item.user.graduatedYear.generation
                }
                directorGen={query === '교수' ? '' : item.generation}
                directorTitle={query === '교수' ? '' : item.title}
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
