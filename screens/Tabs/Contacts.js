import React, { useState, useEffect, useRef } from 'react';
import { FlatList, RefreshControl, StyleSheet, Platform } from 'react-native';
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  ActionSheet,
  Item,
  View,
  Row,
  Fab,
  Spinner,
  Icon,
  Right
} from 'native-base';
import { useApolloClient } from '@apollo/react-hooks';
import RNPickerSelect from 'react-native-picker-select';
import { gql } from 'apollo-boost';
import Contact from '../../components/Contact';
import Loader from '../../components/Loader';
import styles from '../../styles';
import { FAB } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
const SEE_ALL_USER = gql`
  query seeAllUser(
    $limit: Int!
    $page: Int!
    $major: String
    $generation: Int
  ) {
    seeAllUser(
      limit: $limit
      page: $page
      major: $major
      generation: $generation
    ) {
      id
      name
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
    howManyUser(major: $major, generation: $generation)
    seeAllGradYear {
      id
      generation
    }
    seeAllMajor {
      id
      name
    }
  }
`;

export default () => {
  // const [seeAllUserMutation] = useMutation();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 11;
  let user = page * limit;
  const [majorQuery, setMajorQuery] = useState(null);
  const [generationQuery, setGenerationQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onloading, setOnLoading] = useState(true);
  const [users, setUsers] = useState();
  const client = useApolloClient();
  const [generation, setGeneration] = useState([]);
  const [major, setMajor] = useState([]);
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
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      backgroundColor: 'white',
      fontSize: 18,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 5, // to ensure the text is never behind the icon
      textAlign: 'center'
    },
    inputAndroid: {
      fontSize: 18,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 5,
      textAlign: 'center'
    }
  });
  const queryOptions =
    !majorQuery && !generationQuery
      ? {
          query: SEE_ALL_USER,
          variables: { limit: limit, page: page + 1 },

          fetchPolicy: 'network-only'
        }
      : majorQuery === null
      ? {
          query: SEE_ALL_USER,
          variables: {
            limit: limit,
            page: page + 1,
            generation: generationQuery
          },

          fetchPolicy: 'network-only'
        }
      : generationQuery === null
      ? {
          query: SEE_ALL_USER,
          variables: { limit: limit, page: page + 1, major: majorQuery },
          fetchPolicy: 'network-only'
        }
      : {
          query: SEE_ALL_USER,
          variables: {
            limit: limit,
            page: page + 1,
            major: majorQuery,
            generation: generationQuery
          },
          fetchPolicy: 'network-only'
        };
  const initQueryOptions =
    !majorQuery && !generationQuery
      ? {
          query: SEE_ALL_USER,
          variables: { limit: limit, page: 1 },

          fetchPolicy: 'network-only'
        }
      : majorQuery === null
      ? {
          query: SEE_ALL_USER,
          variables: { limit: limit, page: 1, generation: generationQuery },

          fetchPolicy: 'network-only'
        }
      : generationQuery === null
      ? {
          query: SEE_ALL_USER,
          variables: { limit: limit, page: 1, major: majorQuery },
          fetchPolicy: 'network-only'
        }
      : {
          query: SEE_ALL_USER,
          variables: {
            limit: limit,
            page: 1,
            major: majorQuery,
            generation: generationQuery
          },
          fetchPolicy: 'network-only'
        };

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
    const { data } = await client.query(queryOptions);
    setPage(page + 1);

    setAddData(addData.concat(data.seeAllUser));
    setFooterLoading(false);
  };
  const getInitialData = async () => {
    const { data } = await client.query(initQueryOptions);
    if (!data) return;
    setUsers(data.howManyUser);
    setAddData([...data.seeAllUser]);
    setGeneration(
      data.seeAllGradYear.map(e => {
        return {
          key: e.id,
          label: `${e.generation}기`,
          value: e.generation
        };
      })
    );
    setMajor(
      data.seeAllMajor.map(e => {
        return {
          key: e.id,
          label: e.name,
          value: e.name
        };
      })
    );
    setLoading(false);
    setOnLoading(false);
  };
  useEffect(() => {
    getInitialData();
    return () => {};
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh();
    return () => {
      console.log('Contacts');
    };
  }, [majorQuery, generationQuery]);

  if (onloading || addData === undefined) {
    return <Loader />;
  }
  if (addData) {
    return (
      <Container>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontSize: 16,
              paddingHorizontal: 10,
              fontWeight: '600'
            }}
          >
            기수:
          </Text>
          <RNPickerSelect
            placeholder={{
              label: '선택없음',
              value: null
            }}
            Icon={() => null}
            placeholderTextColor={'black'}
            style={{ ...pickerSelectStyles }}
            onValueChange={generation => {
              setGenerationQuery(generation);
            }}
            items={generation}
            doneText={'확인'}
            useNativeAndroidPickerStyle={false}
          />
          <Text
            style={{
              fontSize: 16,
              paddingHorizontal: 10,
              fontWeight: '600'
            }}
          >
            전공:
          </Text>

          <RNPickerSelect
            placeholder={{
              label: '선택없음',
              value: null
            }}
            style={{ ...pickerSelectStyles }}
            placeholderTextColor={'black'}
            Icon={() => null}
            onValueChange={major => {
              setMajorQuery(major);
            }}
            items={major}
            doneText={'확인'}
            useNativeAndroidPickerStyle={false}
          />
        </View>

        {loading ? (
          <Loader />
        ) : users === 0 ? (
          <Text>해당 인원이 없습니다.</Text>
        ) : (
          <FlatList
            ref={scrollTop}
            data={addData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <Contact
                  __typename={item.__typename}
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
            onEndReached={users / user > 1 ? () => moreData() : () => null}
            onEndReachedThreshold={Platform.OS === 'ios' ? 1 : 50}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
            ListFooterComponent={
              footerLoading && users / user > 1 ? <Loader /> : null
            }
          />
        )}
        <FAB style={style.fab} small icon="chevron-up" onPress={toTop} />
      </Container>
    );
  }
};
