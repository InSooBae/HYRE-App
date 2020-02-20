import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View
} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Left,
  Body,
  Header,
  Button,
  Icon
} from 'native-base';
import constants from '../constants';
import Contact from '../components/Contact';
import { useQuery, useLazyQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Loader from '../components/Loader';

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
      email
      cellPhone
      company
      companyCategory
      team
      position
      workPhone
      workAddress
      photo
      emailSecret
      isConfirmed
      major {
        name
      }
      graduatedYear {
        year
        semester
      }
    }
    howManyUser
  }
`;

export default () => {
  // const [seeAllUserMutation] = useMutation();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  let user = page * 5;
  const [onloading, setOnLoading] = useState(true);
  const [users, setUsers] = useState();
  const client = useApolloClient();
  const [addData, setAddData] = useState();
  const { loading, data, refetch } = useLazyQuery(SEE_ALL_USER, {
    query: SEE_ALL_USER,
    variables: { limit: 5, page: 1 },
    fetchPolicy: 'no-cache'
  });

  console.log(users / user, '----------user/user-------');
  console.log(users, '--------------user--------');
  console.log(page, '--------page---------');
  console.log(addData, '----------------------');
  const refresh = async () => {
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
    console.log('aaaaa');
    if (users / user >= 1) setPage(page + 1);

    const { data } = await client.query({
      query: SEE_ALL_USER,
      variables: { limit: 5, page: page + 1 }
    });
    setAddData(addData.concat(data.seeAllUser));
  };

  const getInitialData = async () => {
    const { data } = await client.query({
      query: SEE_ALL_USER,
      variables: { limit: 5, page: 1 }
    });
    if (!data) return;
    setUsers(data.howManyUser);
    setAddData([...data.seeAllUser]);

    setOnLoading(false);
  };
  useEffect(() => {
    getInitialData();
  }, []);
  // useEffect(() => {
  //   allUser();
  // }, [page]);
  // useEffect(() => {
  //   if (data) {
  //     addUser();
  //   }
  //   console.log('Len', users.length);
  // }, [data]);
  const allUser = useCallback(() => {
    seeUser({ variables: { limit: 6, page } });
  });
  const addUser = useCallback(() => {
    setUsers(users.concat(data.seeAllUser));
  });
  const loadMore = useCallback(() => {
    handleLoadMore();
  });
  const handleLoadMore = () => {
    setPage(page + 1);
  };
  const handleLoadLess = () => {
    setPage(page - 1);
  };
  //flatlist는 data에 배열줘야 에러안남 객체형태넘기면 에러 ㅋㅋ
  // const renderFooter = () => {
  //   return loading ? (
  //     <View>
  //       <ActivityIndicator />
  //     </View>
  //   ) : null;
  // };

  if (onloading || addData === undefined) {
    return <Loader />;
  }
  if (addData) {
    return (
      <Container>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            opacity: 0.2
          }}
        >
          <Button
            iconLeft
            light
            onPress={page == 1 ? () => null : handleLoadLess}
          >
            <Icon name="arrow-back" />
            <Text>Back</Text>
          </Button>
          <Button
            iconRight
            light
            onPress={
              addData.howManyUser / user > 1 ? handleLoadMore : () => null
            }
          >
            <Text>Next</Text>
            <Icon name="arrow-forward" />
          </Button>
        </View>
        <FlatList
          data={addData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            console.log(item.name);
            return (
              <Contact
                birth={item.birthday}
                cellPhone={item.cellPhone}
                company={item.company}
                companyCat={item.companyCategory}
                email={item.email}
                semester={item.graduatedYear.semester}
                year={item.graduatedYear.year}
                id={item.id}
                major={item.major.name}
                name={item.name}
                photo={item.photo === null ? '' : item.photo}
                position={item.position}
                team={item.team}
                workAddress={item.workAddress}
                workPhone={item.workPhone}
              />
            );
          }}
          onEndReached={users / user >= 1 ? moreData : () => null}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        />
      </Container>
    );
  }
};
