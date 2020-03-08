import React, { useState } from 'react';

import { withNavigation } from 'react-navigation';
import styles from '../styles';
import { Text, Card, Avatar } from 'react-native-paper';
import { View, Platform } from 'react-native';
const Notice = ({ id, title, desc, createdAt, navigation }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Card
      onPress={() => navigation.navigate('NoticeDetail', { id, title })}
      onLongPress={() => setVisible(true)}
      style={{
        marginTop: 1,
        marginBottom: 1
      }}
      theme={{ roundness: 10 }}
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
                    fontSize: 21,
                    color: '#000000',
                    fontWeight: '400',
                    marginBottom: 3
                  }
                : {
                    fontSize: 18,
                    color: '#000000',
                    fontWeight: '600',
                    marginBottom: 3
                  }
            }
          >
            {title.length > 20 ? title.substring(0, 20 - 3) + '...' : title}
          </Text>
          <Text
            theme={{
              fonts: {
                light: { fontWeight: 'normal', fontFamily: 'sans-serif-thin' }
              }
            }}
            style={
              Platform.OS === 'ios'
                ? { fontSize: 16, color: '#666666', marginBottom: 5 }
                : { fontSize: 14, color: '#666666', marginBottom: 5 }
            }
          >
            {desc.length > 27 ? desc.substring(0, 27 - 3) + '...' : desc}
          </Text>
          <Text
            theme={{
              fonts: {
                light: { fontWeight: 'normal', fontFamily: 'sans-serif-thin' }
              }
            }}
            style={{ color: '#bfbfbf' }}
          >
            {new Date(createdAt).format('yyyy-MM-dd')}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', flex: 1 }}>
          <Avatar.Icon
            icon="chevron-right"
            size={50}
            theme={{ colors: { primary: '#ffffff' } }}
            color={styles.lightGreyColor}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default withNavigation(Notice);
