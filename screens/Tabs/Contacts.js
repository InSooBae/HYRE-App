import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
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
  Spinner
} from 'native-base';
import { useApolloClient } from '@apollo/react-hooks';
import RNPickerSelect from 'react-native-picker-select';
import { gql } from 'apollo-boost';
import Contact from '../../components/Contact';
import Loader from '../../components/Loader';

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
    howManyUser
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
  let user = page * 5;
  const [majorQuery, setMajorQuery] = useState(null);
  const [generationQuery, setGenerationQuery] = useState(null);
  const [onloading, setOnLoading] = useState(true);
  const [users, setUsers] = useState();
  const client = useApolloClient();
  const [generation, setGeneration] = useState([]);
  const [major, setMajor] = useState([]);
  const [addData, setAddData] = useState();
  const [footerLoading, setFooterLoading] = useState(false);
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 18,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
      textAlign: 'center'
    },
    inputAndroid: {
      fontSize: 18,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
      textAlign: 'center'
    }
  });

  const queryOptions =
    !majorQuery && !generationQuery
      ? {
          query: SEE_ALL_USER,
          variables: { limit: 5, page: page + 1 },

          fetchPolicy: 'network-only'
        }
      : majorQuery === null
      ? {
          query: SEE_ALL_USER,
          variables: { limit: 5, page: page + 1, generation: generationQuery },

          fetchPolicy: 'network-only'
        }
      : generationQuery === null
      ? {
          query: SEE_ALL_USER,
          variables: { limit: 5, page: page + 1, major: majorQuery },
          fetchPolicy: 'network-only'
        }
      : {
          query: SEE_ALL_USER,
          variables: {
            limit: 5,
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
          variables: { limit: 5, page: 1 },

          fetchPolicy: 'network-only'
        }
      : majorQuery === null
      ? {
          query: SEE_ALL_USER,
          variables: { limit: 5, page: 1, generation: generationQuery },

          fetchPolicy: 'network-only'
        }
      : generationQuery === null
      ? {
          query: SEE_ALL_USER,
          variables: { limit: 5, page: 1, major: majorQuery },
          fetchPolicy: 'network-only'
        }
      : {
          query: SEE_ALL_USER,
          variables: {
            limit: 5,
            page: 1,
            major: majorQuery,
            generation: generationQuery
          },
          fetchPolicy: 'network-only'
        };

  const refresh = async () => {
    try {
      setRefreshing(true);
      setOnLoading(true);

      getInitialData();
      setPage(1);
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
      setOnLoading(false);
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

    setOnLoading(false);
  };
  useEffect(() => {
    getInitialData();
    return () => {
      getInitialData();
    };
  }, []);

  useEffect(() => {
    refresh();
  }, [majorQuery, generationQuery]);

  if (onloading || addData === undefined) {
    return <Loader />;
  }
  if (addData) {
    return (
      <Container>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: 20,
              paddingVertical: 12,
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
              fontSize: 20,
              paddingVertical: 12,
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
            onValueChange={major => {
              setMajorQuery(major);
            }}
            items={major}
            doneText={'확인'}
            useNativeAndroidPickerStyle={false}
          />
        </View>
        <FlatList
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
          onEndReached={users / user >= 1 ? moreData : () => null}
          onEndReachedThreshold={1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListFooterComponent={footerLoading ? <Spinner color="blue" /> : null}
        />
      </Container>
    );
  }
};
