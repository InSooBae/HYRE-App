import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Container,
  Header,
  Item,
  Input,
  Icon,
  Button,
  Text,
  Spinner
} from 'native-base';
import { gql } from 'apollo-boost';
import { useApolloClient } from '@apollo/react-hooks';
import Loader from '../../components/Loader';
import { FlatList } from 'react-native-gesture-handler';
import { RefreshControl } from 'react-native';
import Notice from '../../components/Notice';
const SEE_ALL_NOTICE = gql`
  query seeAllNotice($limit: Int!, $page: Int!) {
    seeAllNotice(limit: $limit, page: $page) {
      id
      title
      desc
      createdAt
    }
    howManyNotice
  }
`;

export default () => {
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 11;
  let user = page * limit;
  const [howNotice, setHowNotice] = useState();
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const [addData, setAddData] = useState();
  const [footerLoading, setFooterLoading] = useState(false);

  const refresh = () => {
    try {
      setRefreshing(true);

      getInitialData();
      setPage(1);
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  const moreData = async () => {
    setFooterLoading(true);
    const { data } = await client.query({
      query: SEE_ALL_NOTICE,
      variables: { limit: limit, page: page + 1 },

      fetchPolicy: 'network-only'
    });
    setPage(page + 1);

    setAddData(addData.concat(data.seeAllUser));
    setFooterLoading(false);
  };
  const getInitialData = async () => {
    const { data } = await client.query({
      query: SEE_ALL_NOTICE,
      variables: {
        limit: limit,
        page: 1
      },
      fetchPolicy: 'network-only'
    });
    console.log(data);
    if (!data) return;
    setHowNotice(data.howManyNotice);
    setAddData([...data.seeAllNotice]);
    setLoading(false);
  };
  useEffect(() => {
    getInitialData();
  }, []);
  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={addData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            console.log(item);
            return (
              <Notice
                id={item.id}
                title={item.title}
                desc={item.desc}
                createdAt={item.createdAt}
              />
            );
          }}
          onEndReached={howNotice / user > 1 ? () => moreData() : () => null}
          onEndReachedThreshold={Platform.OS === 'ios' ? 1 : 50}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListFooterComponent={
            footerLoading && howNotice / user > 1 ? (
              <Spinner color={styles.hanyangColor} />
            ) : null
          }
        />
      )}
    </Container>
  );
};
