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
  View,
  Thumbnail,
  Right
} from 'native-base';
import constants from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  callNumber,
  linkEmail,
  inputPhoneNumber
} from '../components/PhoneCall';
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
            <Thumbnail
              source={
                photo === '' ? require('../assets/HYU1.png') : { uri: photo }
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: (100 + 100) / 2
              }}
            />

            <Body>
              <Text
                style={{
                  fontSize: 22,
                  color: '#0000FF',
                  fontWeight: '500',
                  marginBottom: 5
                }}
              >
                {name}
              </Text>

              <TouchableOpacity
                style={{}}
                onPress={() => callNumber(cellPhone)}
              >
                <Text
                  style={{ fontSize: 19, color: '#0099ff', marginBottom: 5 }}
                >
                  {inputPhoneNumber(cellPhone)}
                </Text>
              </TouchableOpacity>
              <View>
                <Text style={{ color: styles.hanyangColor, marginBottom: 5 }}>
                  {company}
                </Text>
              </View>
            </Body>
            <Right>
              {__typename === 'User' ? (
                <View
                  style={{
                    alignItems: 'flex-end'
                  }}
                >
                  {directorTitle === '' ? null : (
                    <Text
                      style={{
                        marginBottom: 5,
                        color: `#${directorGen}C${directorGen}43C`
                      }}
                    >{`${directorGen}기 ${directorTitle}`}</Text>
                  )}
                  <Text style={{ marginBottom: 5 }}>{`${generation}기`}</Text>
                  <Text style={{ marginBottom: 5 }}>{`${major}과`}</Text>
                  <Text style={{ color: styles.hanyangColor }}>{position}</Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'flex-end'
                  }}
                >
                  <Text style={{ color: styles.hanyangColor, marginBottom: 5 }}>
                    {position}
                  </Text>
                  <Text style={{ color: styles.hanyangColor, marginBottom: 5 }}>
                    {team}
                  </Text>
                </View>
              )}
            </Right>
          </Left>
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
