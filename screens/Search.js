import React, { useState, useEffect, useCallback } from 'react';
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
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
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
  let user = page * 6;
  const [onloading, setOnLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [seeUser, { loading, data, refetch }] = useLazyQuery(SEE_ALL_USER, {
    fetchPolicy: 'cache-and-network'
  });
  const [addData, setAddData] = useState([]);

  console.log(page, '----------------------');
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
  useEffect(() => {
    allUser();
  }, [page]);
  useEffect(() => {
    if (data) {
      addUser();
    }
    console.log('Len', users.length);
  }, [data]);
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
  const renderFooter = () => {
    return loading ? (
      <View>
        <ActivityIndicator />
      </View>
    ) : null;
  };

  if (loading || data === undefined) {
    return <Loader />;
  }
  if (data && data.seeAllUser) {
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
            onPress={data.howManyUser / user > 1 ? handleLoadMore : () => null}
          >
            <Text>Next</Text>
            <Icon name="arrow-forward" />
          </Button>
        </View>
        <FlatList
          data={users}
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
          onEndReached={data.howManyUser / user > 1 ? loadMore : () => null}
          onEndReachedThreshold={0}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListFooterComponent={renderFooter}
        />
      </Container>
    );
  }
};
