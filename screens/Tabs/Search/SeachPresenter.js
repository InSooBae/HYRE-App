import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Loader from '../../../components/Loader';
import { FlatList } from 'react-native-gesture-handler';
import { Container } from 'native-base';
import Contact from '../../../components/Contact';

export const SEARCH = gql`
  query searchUser($query: String!) {
    searchUser(query: $query) {
      id
      name
      birthday
      cellPhone
      company
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
`;

//shouldFetch는 쿼리를 요청하기 위한 신호가 됨. 검색쿼리는 즉시요청되는게아님
const SearchPresenter = ({ query, shouldFetch }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH, {
    variables: {
      query
    },
    //언제 쿼리를 조회하지 않고 넘길지 설정
    skip: !shouldFetch,
    //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
    fetchPolicy: 'network-only'
  });
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch({ variables: { query } });
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };
  console.log(data, loading);
  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        data && (
          <FlatList
            data={data.searchUser}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              console.log(item.name);
              return (
                <Contact
                  cellPhone={item.cellPhone}
                  company={item.company}
                  id={item.id}
                  major={item.major.name}
                  name={item.name}
                  photo={item.photo === null ? '' : item.photo}
                  position={item.position}
                  team={item.team}
                  generation={item.graduatedYear.generation}
                />
              );
            }}
          />
        )
      )}
    </Container>
  );
};

SearchPresenter.propTypes = {
  query: PropTypes.string.isRequired,
  shouldFetch: PropTypes.bool.isRequired
};

export default SearchPresenter;
