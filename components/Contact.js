import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
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
  navigation
}) => {
  return (
    <Card style={{ height: constants.height / 8 }}>
      <TouchableOpacity onPress={() => navigation.navigate('UserDetail')}>
        <CardItem cardBody>
          <Left style={{ height: constants.height / 8 }}>
            <Image
              source={
                photo === '' ? require('../assets/HYU1.png') : { uri: photo }
              }
              resizeMode="contain"
              style={{
                height: constants.height / 5,
                width: constants.width / 6
              }}
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
                <Text style={{ marginLeft: 20, marginTop: 5 }}>
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
                alignItems: 'flex-end'
              }}
            >
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
