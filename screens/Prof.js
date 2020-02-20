import React, { useState, useEffect } from 'react';
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
  const [seeUser, { loading, data, refetch }] = useLazyQuery(SEE_ALL_USER, {
    fetchPolicy: 'no-cache'
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
    seeUser({ variables: { limit: 6, page } });
  }, [page]);
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
  } else if (data && data.seeAllUser) {
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
          data={data.seeAllUser}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListFooterComponent={renderFooter}
        />
      </Container>
    );
  }
};
