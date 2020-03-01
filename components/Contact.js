import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Left,
  Body,
  View
} from 'native-base';
import constants from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { callNumber, linkEmail } from '../components/PhoneCall';
import { withNavigation } from 'react-navigation';
import styles from '../styles';

const Contact = ({
  id,
  __typename,
  photo,
  name,
  cellPhone,
  company,
  team,
  position,
  major,
  generation,
  directorGen = '',
  directorTitle = '',
  navigation
}) => {
  return (
    <Card
      style={{
        borderColor: styles.greyColor,
        borderWidth: 1
      }}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('UserDetail', {
            id: id,
            name: name,
            __typename: __typename
          })
        }
      >
        <CardItem cardBody>
          <Left style={{ height: constants.height / 8 }}>
            <ResponsiveImage
              source={
                photo === '' ? require('../assets/HYU1.png') : { uri: photo }
              }
              initWidth="80"
              initHeight="80"
            />

            <Body style={{ width: constants.width }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 25,
                    color: '#0000FF',
                    fontWeight: '500'
                  }}
                >
                  {name}
                </Text>
                <Text style={{ marginLeft: 5, marginTop: 5 }}>
                  {position && team
                    ? `${position}/${team}`
                    : position
                    ? position
                    : team}
                </Text>
              </View>

              <TouchableOpacity onPress={() => callNumber(cellPhone)}>
                <Text style={{ fontSize: 22, color: '#0099ff' }}>
                  {cellPhone}
                </Text>
              </TouchableOpacity>
              <View>
                <Text style={{ color: '#00aFFF' }}>{company}</Text>
              </View>
            </Body>
          </Left>

          {__typename === 'User' ? (
            <View
              style={{
                alignItems: 'flex-end',
                marginTop: 23
              }}
            >
              {directorTitle === '' ? null : (
                <Text>{`${directorGen}기 ${directorTitle}`}</Text>
              )}
              <Text>{`${generation}기`}</Text>
              <Text>{`${major}과`}</Text>
            </View>
          ) : null}
        </CardItem>
      </TouchableOpacity>
    </Card>
  );
};

Contact.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  cellPhone: PropTypes.string.isRequired,
  company: PropTypes.string,
  team: PropTypes.string,
  position: PropTypes.string,
  photo: PropTypes.string,
  major: PropTypes.string,
  generation: PropTypes.number,
  __typename: PropTypes.string
};

export default withNavigation(Contact);
