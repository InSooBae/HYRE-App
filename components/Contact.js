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

const Contact = ({
  id,
  photo,
  name,
  birth,
  email,
  cellPhone,
  company,
  companyCat,
  team,
  position,
  workPhone,
  workAddress,
  major,
  year,
  semester
}) => {
  return (
    <Card>
      <CardItem cardBody>
        <Left>
          <Image
            source={
              photo === '' ? require('../assets/HYU1.png') : { uri: photo }
            }
            resizeMode="contain"
            style={{
              height: constants.height / 5,
              width: constants.width / 3.8
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
            <Text style={{ marginBottom: 5 }} note>
              {new Date(birth).format('yyyy-MM-dd')}
            </Text>
            <TouchableOpacity onPress={() => callNumber(cellPhone)}>
              <Text style={{ fontSize: 22, color: '#0099ff', marginBottom: 5 }}>
                {cellPhone}
              </Text>
            </TouchableOpacity>
            <View>
              <Text style={{ marginBottom: 5 }}>
                {workAddress ? `사업장: ${workAddress}` : null}
              </Text>
              <Text style={{ color: '#00aFFF', marginBottom: 5 }}>
                {company}
              </Text>
              <TouchableOpacity onPress={() => linkEmail(email)}>
                <Text style={{ color: '#FF00FF' }}>{email}</Text>
              </TouchableOpacity>
            </View>
          </Body>
        </Left>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ marginBottom: 5 }}>{workPhone}</Text>
          <Text style={{ marginBottom: 5 }}>{major}</Text>
          <Text style={{ marginBottom: 5 }}>{`${year}년 ${semester}학기`}</Text>
        </View>
      </CardItem>
    </Card>
  );
};

Contact.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  birth: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  cellPhone: PropTypes.string.isRequired,
  company: PropTypes.string,
  companyCat: PropTypes.string,
  team: PropTypes.string,
  position: PropTypes.string,
  workPhone: PropTypes.string,
  workAddress: PropTypes.string,
  photo: PropTypes.string,
  major: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  semester: PropTypes.number.isRequired
};

export default Contact;
