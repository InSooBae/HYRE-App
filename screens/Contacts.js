import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Container } from 'native-base';
import Contact from '../components/Contact';
import { useApolloClient } from '@apollo/react-hooks';
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
    console.log('aaaaa');

    const { data } = await client.query({
      query: SEE_ALL_USER,
      variables: { limit: 5, page: page + 1 },
      fetchPolicy: 'network-only'
    });
    setPage(page + 1);

    setAddData(addData.concat(data.seeAllUser));
  };

  const getInitialData = async () => {
    const { data } = await client.query({
      query: SEE_ALL_USER,
      variables: { limit: 5, page: 1 },
      fetchPolicy: 'network-only'
    });
    if (!data) return;
    setUsers(data.howManyUser);
    setAddData([...data.seeAllUser]);

    setOnLoading(false);
  };
  useEffect(() => {
    getInitialData();
    return () => {
      getInitialData();
    };
  }, []);

  if (onloading || addData === undefined) {
    return <Loader />;
  }
  if (addData) {
    return (
      <Container>
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
