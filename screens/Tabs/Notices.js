import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Text, Spinner, View } from 'native-base';
import { gql } from 'apollo-boost';
import { useApolloClient } from '@apollo/react-hooks';
import Loader from '../../components/Loader';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { RefreshControl, AsyncStorage, Modal } from 'react-native';
import Notice from '../../components/Notice';
import { usePopUp, useLaterPopUp } from '../../AuthContext';
import { Button } from 'react-native-paper';
import styles from '../../styles';
const SEE_ALL_NOTICE = gql`
  query seeAllNotice($limit: Int!, $page: Int!) {
    seeAllNotice(limit: $limit, page: $page) {
      id
      title
      desc
      createdAt
    }
    howManyNotice
    seeLatestNotice {
      id
      title
      desc
      createdAt
    }
  }
`;

export default () => {
  const popUp = usePopUp();
  const laterPopUp = useLaterPopUp();
  const [dSee, setDSee] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 11;
  const [lastData, setLastData] = useState();
  const [isOpen, setIsOpen] = useState();
  let user = page * limit;
  const [howNotice, setHowNotice] = useState();
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const [addData, setAddData] = useState();
  const [footerLoading, setFooterLoading] = useState(false);

  console.log(lastData);
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
  console.log('-----', isOpen);
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
    if (!data) return;
    setHowNotice(data.howManyNotice);
    setAddData([...data.seeAllNotice]);
    setLastData(...data.seeLatestNotice);
    setLoading(false);
    setIsOpen(JSON.parse(await AsyncStorage.getItem('isPopUp')).result);
  };
  useEffect(() => {
    popUp();

    getInitialData();
  }, []);
  useEffect(() => {
    if (dSee) {
      laterPopUp();
    }
    return () => {
      null;
    };
  }, [dSee]);
  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        <>
          {isOpen ? (
            <Modal visible={isOpen} transparent={true}>
              <View
                style={{
                  backgroundColor: '#000000aa',
                  flex: 1,
                  justifyContent: 'center'
                }}
              >
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    margin: 40,
                    marginTop: 60,
                    padding: 30,
                    borderRadius: 10
                  }}
                >
                  <ScrollView>
                    <Text style={{ fontSize: 40 }}>최근 공지사항</Text>
                    <Text style={{ fontSize: 30 }}>{lastData.title}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>{lastData.desc}</Text>
                    <Text>
                      {new Date(lastData.createdAt).format('yyyy-MM-dd')}
                    </Text>
                  </ScrollView>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end'
                    }}
                  >
                    <Button
                      mode="contained"
                      style={{ backgroundColor: styles.hanyangColor }}
                      onPress={() => {
                        setIsOpen(false);
                      }}
                    >
                      닫기
                    </Button>
                    <Button
                      icon="eye-off-outline"
                      theme={{ colors: { primary: styles.hanyangColor } }}
                      onPress={() => {
                        setIsOpen(false);
                        setDSee(true);
                      }}
                    >
                      일주일 동안 안보기
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          ) : null}
          <FlatList
            data={addData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
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
        </>
      )}
    </Container>
  );
};
