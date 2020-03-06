import React from 'react';
import PropTypes, { number } from 'prop-types';
import {
  Card,
  CardItem,
  Text,
  Left,
  Body,
  View,
  Thumbnail,
  Right
} from 'native-base';
import constants from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { withNavigation } from 'react-navigation';
import styles from '../styles';

const Notice = ({ id, title, desc, createdAt, navigation }) => {
  return (
    <Card>
      <TouchableOpacity onPress={() => null}>
        <CardItem style={{ backgroundColor: styles.greyColor }}>
          <View
            style={{
              width: constants.width,
              alignItems: 'flex-start',
              flex: 1
            }}
          >
            <Text
              style={{
                fontSize: 21,
                color: '#0000FF',
                fontWeight: '500',
                marginBottom: 3
              }}
            >
              {title}
            </Text>
            <Text style={{ fontSize: 19, color: '#0099ff', marginBottom: 5 }}>
              {desc.length > 20 ? desc.substring(0, 20 - 3) + '...' : desc}
            </Text>
          </View>

          <TouchableOpacity style={{ flex: 1 }}></TouchableOpacity>
          <Text style={{ color: styles.hanyangColor, marginBottom: 5 }}>
            {new Date(createdAt).format('yyyy-MM-dd')}
          </Text>
        </CardItem>
      </TouchableOpacity>
    </Card>
  );
};

export default Notice;
