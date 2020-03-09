import React, { useEffect, useState } from 'react';
import { Card, Text, Avatar, Switch, Title } from 'react-native-paper';
import { View, Platform } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Loader from '../components/Loader';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import styles from '../styles';

const SEE_NOTICE = gql`
  query seeNotice($id: ID!) {
    seeNotice(id: $id) {
      title
      desc
      createdAt
    }
  }
`;

export default ({ navigation }) => {
  const { data, loading, refetch } = useQuery(SEE_NOTICE, {
    variables: { id: navigation.getParam('id') },
    fetchPolicy: 'network-only'
  });
  const [notice, setNotice] = useState();
  const [copyMode, setCopyMode] = useState(false);
  useEffect(() => {
    if (!loading) {
      setNotice(data.seeNotice);
    }
    return () => {
      null;
    };
  }, [data]);

  if (loading || notice === undefined) return <Loader />;

  if (notice !== undefined) {
    return (
      <Card elevation={6} style={{ flex: 1 }}>
        <Card.Title
          left={props => (
            <Avatar.Icon
              style={{ backgroundColor: styles.hanyangColor }}
              {...props}
              icon="account"
            />
          )}
          title={
            <Text
              adjustsFontSizeToFit={true}
              style={{ fontSize: 23, fontWeight: '600' }}
            >
              관리자
            </Text>
          }
          subtitle={
            <Text style={{ marginRight: 15, fontSize: 16, color: 'gray' }}>
              {new Date(notice.createdAt).format('yyyy-MM-dd')}
            </Text>
          }
          right={
            Platform.OS === 'ios'
              ? () => null
              : props => (
                  <View style={{ flexDirection: 'row' }}>
                    <Text>Copy Mode</Text>
                    <Switch
                      value={copyMode}
                      onValueChange={() => setCopyMode(!copyMode)}
                    />
                  </View>
                )
          }
        />
        <Card.Content style={{ flex: 1 }}>
          <View
            style={{
              marginTop: 10
            }}
          >
            <Title
              style={{
                fontSize: 22,
                fontWeight: '600'
              }}
            >
              {notice.title}
            </Title>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {Platform.OS === 'ios' ? (
              // iOS requires a textinput for word selections
              <TextInput
                style={{ fontSize: 18, color: '#404040', marginTop: 10 }}
                value={notice.desc}
                editable={false}
                multiline
                scrollEnabled={false}
              />
            ) : (
              // Android can do word selections just with <Text>
              <Text
                selectable={copyMode}
                theme={{
                  fonts: {
                    light: {
                      fontWeight: 'normal',
                      fontFamily: 'sans-serif-thin'
                    }
                  }
                }}
                style={{ fontSize: 17, color: '#595959', marginTop: 10 }}
              >
                {notice.desc}
              </Text>
            )}
          </ScrollView>
        </Card.Content>
      </Card>
    );
  }
};
