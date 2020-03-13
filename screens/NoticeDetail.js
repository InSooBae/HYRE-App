import React from 'react';
import { Card } from 'react-native-paper';
import { View, Platform } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Loader from '../components/Loader';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import styles from '../styles';
import styled from 'styled-components';

const Text = styled.Text`
  font-family: lotte-medium;
  font-weight: 600;
`;

export default ({ navigation }) => {
  return (
    <Card elevation={6} style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderBottomColor: '#DCDCDC',
          borderBottomWidth: 1
        }}
      >
        <View>
          <Text
            style={
              Platform.OS === 'ios'
                ? {
                    fontFamily: 'lotte-bold',
                    marginLeft: 15,
                    marginTop: 15,
                    fontSize: 19,
                    fontWeight: '700',
                    marginBottom: 10,
                    textAlign: 'left',
                    marginRight: 15
                  }
                : {
                    marginLeft: 15,
                    marginTop: 15,
                    fontSize: 15,
                    fontWeight: '700',
                    marginBottom: 10,
                    textAlign: 'left',
                    marginRight: 15
                  }
            }
          >
            {`[공지] ${navigation.getParam('title')}`}
          </Text>
          <Text
            style={
              Platform.OS === 'ios'
                ? {
                    fontSize: 14,
                    color: '#A9A9A9',
                    marginLeft: 15,
                    marginBottom: 15
                  }
                : {
                    fontSize: 10,
                    color: '#A9A9A9',
                    marginLeft: 15,
                    marginBottom: 15
                  }
            }
          >
            {new Date(navigation.getParam('createdAt')).format('yyyy-MM-dd')}
          </Text>
        </View>
      </View>
      <Card.Content style={{ flex: 1, marginTop: 7 }}>
        <ScrollView style={{ flex: 1 }}>
          {Platform.OS === 'ios' ? (
            <TextInput
              style={{ fontSize: 17, color: '#595959', marginTop: 10 }}
              value={navigation.getParam('desc')}
              editable={false}
              multiline
              scrollEnabled={false}
            />
          ) : (
            <Text style={{ fontSize: 15, color: '#595959', marginTop: 10 }}>
              {navigation.getParam('desc')}
            </Text>
          )}
        </ScrollView>
      </Card.Content>
    </Card>
  );
};
