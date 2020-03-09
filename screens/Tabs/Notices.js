import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useApolloClient } from '@apollo/react-hooks';
import Loader from '../../components/Loader';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
  RefreshControl,
  AsyncStorage,
  Modal,
  StyleSheet,
  View
} from 'react-native';
import Notice from '../../components/Notice';
import { usePopUp, useLaterPopUp } from '../../AuthContext';
import { Button, FAB, Text } from 'react-native-paper';
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
  const [isOpen, setIsOpen] = useState(false);
  let user = page * limit;
  const [howNotice, setHowNotice] = useState();
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const [addData, setAddData] = useState();
  const [footerLoading, setFooterLoading] = useState(false);

  const scrollTop = useRef();
  const toTop = () => {
    scrollTop.current.scrollToOffset({ animated: true, offset: 0 });
  };
  const style = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: styles.hanyangColor
    }
  });
  const refresh = () => {
    try {
      setRefreshing(true);

      reFetchData();
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

    setAddData(addData.concat(data.seeAllNotice));
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
    popUp(data.seeLatestNotice[0].createdAt);

    setIsOpen(JSON.parse(await AsyncStorage.getItem('isPopUp')).result);
    setHowNotice(data.howManyNotice);
    setAddData([...data.seeAllNotice]);
    setLastData(...data.seeLatestNotice);
    setLoading(false);
    setIsOpen(JSON.parse(await AsyncStorage.getItem('isPopUp')).result);
  };

  const reFetchData = async () => {
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
  };
  useEffect(() => {
    getInitialData();
  }, []);
  useEffect(() => {
    if (dSee) {
      laterPopUp(lastData.createdAt);
    }
    return () => {
      null;
    };
  }, [dSee]);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
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
                    marginRight: 20,
                    marginBottom: 80,
                    marginLeft: 20,
                    marginTop: 80,
                    padding: 20,
                    borderRadius: 10,
                    flex: 1
                  }}
                >
                  <View>
                    <View>
                      <Text
                        style={{
                          fontSize: 25,
                          fontWeight: '500'
                        }}
                      >
                        {lastData.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomColor: styles.lightGreyColor,
                        borderBottomWidth: 1,
                        marginBottom: 20,
                        marginTop: 10
                      }}
                    >
                      <Text style={{ fontSize: 21, color: '#595959' }}>
                        최근 공지사항
                      </Text>
                      <Text style={{ fontSize: 17, color: '#A9A9A9' }}>
                        {new Date(lastData.createdAt).format('yyyy-MM-dd')}
                      </Text>
                    </View>
                  </View>

                  <ScrollView style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18 }}>{lastData.desc}</Text>
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
                      새 공지까지 안보기
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          ) : null}
          <FlatList
            ref={scrollTop}
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
              footerLoading && howNotice / user > 1 ? <Loader /> : null
            }
          />
        </>
      )}
      <FAB style={style.fab} small icon="chevron-up" onPress={toTop} />
    </View>
  );
};
