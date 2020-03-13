import React from 'react';
import styled from 'styled-components';
import { withNavigation } from 'react-navigation';
import styles from '../styles';
import { Card, Avatar } from 'react-native-paper';
import { View } from 'react-native';

const Text = styled.Text`
  font-family: lotte-bold;
`;

const Notice = ({ id, title, desc, createdAt, navigation }) => {
  return (
    <Card
      onPress={() =>
        navigation.navigate('NoticeDetail', { id, title, desc, createdAt })
      }
      style={{
        marginTop: 1,
        marginBottom: 1,
        backgroundColor: '#fefffc'
      }}
    >
      <Card.Content
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View>
          <Text
            style={
              Platform.OS === 'ios'
                ? {
                    fontSize: 17,
                    color: '#000000',
                    fontWeight: '600',
                    marginBottom: 8
                  }
                : {
                    fontSize: 13,
                    fontWeight: '600',
                    color: '#000000',
                    marginBottom: 7
                  }
            }
          >
            {title.length > 20
              ? `[공지] ${title.substring(0, 20 - 3)}...`
              : `[공지] ${title}`}
          </Text>

          <Text
            style={
              Platform.OS === 'ios'
                ? { color: '#bfbfbf', fontSize: 16 }
                : { color: '#bfbfbf', fontSize: 11 }
            }
          >
            {new Date(createdAt).format('yyyy-MM-dd')}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', flex: 1 }}>
          <Avatar.Icon
            icon="chevron-right"
            size={50}
            theme={{ colors: { primary: '#fefffc' } }}
            color={styles.lightGreyColor}
          />
        </View>
      </Card.Content>
    </Card>
  );
};
export default withNavigation(Notice);
