import React from 'react';
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Left,
  Thumbnail,
  Right,
  ListItem,
  List,
  View,
  Icon
} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  callNumber,
  linkEmail,
  linkMessage,
  inputPhoneNumber
} from './PhoneCall';
import ResponsiveImage from 'react-native-responsive-image';

export default ({
  id,
  name,
  birth,
  email,
  cellPhone,
  company,
  companyDesc,
  team,
  position,
  workPhone,
  workAddress,
  photo,
  generation,
  major
}) => {
  return (
    <View style={{ backgroundColor: 'white' }}>
      <Content padder>
        <Card>
          <CardItem header bordered>
            <Left>
              {photo === '' ? (
                <ResponsiveImage
                  source={require('../assets/HYU1.png')}
                  initWidth="138"
                  initHeight="138"
                />
              ) : (
                // <Thumbnail
                //   source={require('../assets/HYU1.png')}
                //   style={{
                //     width: constants.width / 3.8,
                //     height: constants.height / 8
                //   }}
                //   large
                // />

                <Thumbnail
                  source={{ uri: photo }}
                  style={{
                    width: 138,
                    height: 138,
                    borderRadius: (138 + 138) / 2
                  }}
                  large
                />
              )}
            </Left>
            <Right
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <TouchableOpacity onPress={() => linkEmail(email)}>
                <FontAwesome
                  size={30}
                  style={{ color: '#333333' }}
                  name={Platform.OS === 'ios' ? 'envelope-o' : 'envelope-o'}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => linkMessage(cellPhone)}>
                <FontAwesome
                  size={30}
                  style={{ color: '#333333' }}
                  name={Platform.OS === 'ios' ? 'commenting-o' : 'commenting-o'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => callNumber(cellPhone)}>
                <FontAwesome
                  size={28}
                  style={{ color: '#333333' }}
                  name={Platform.OS === 'ios' ? 'phone' : 'phone'}
                />
              </TouchableOpacity>
            </Right>
          </CardItem>
          <CardItem bordered>
            <Content>
              <List>
                <ListItem thumbnail>
                  <Left>
                    <Icon name="person" style={{ color: '#5592ff' }} />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      이름
                    </Text>
                  </Left>
                  <Body>
                    <Text>{name}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="MaterialIcons"
                      name="cake"
                      style={{ color: '#5592ff' }}
                    />

                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      생일
                    </Text>
                  </Left>
                  <Body>
                    <Text>{new Date(birth).format('yyyy-MM-dd')}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="FontAwesome"
                      name="phone"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      휴대전화
                    </Text>
                  </Left>
                  <Body>
                    <Text>{inputPhoneNumber(cellPhone)}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="FontAwesome"
                      name="envelope"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      이메일
                    </Text>
                  </Left>
                  <Body>
                    <Text>{email}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="FontAwesome"
                      name="building-o"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      회사명
                    </Text>
                  </Left>
                  <Body>
                    <Text>{company}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="FontAwesome"
                      name="building"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      회사주소
                    </Text>
                  </Left>
                  <Body>
                    <Text>{workAddress}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="Entypo"
                      name="landline"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      회사전화
                    </Text>
                  </Left>
                  <Body>
                    <Text>{workPhone && inputPhoneNumber(workPhone)}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="Entypo"
                      name="archive"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      부서
                    </Text>
                  </Left>
                  <Body>
                    <Text>{team}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="Entypo"
                      name="medal"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      직책
                    </Text>
                  </Left>
                  <Body>
                    <Text>{position}</Text>
                  </Body>
                </ListItem>

                <ListItem thumbnail>
                  <Left>
                    <Icon
                      type="Entypo"
                      name="star"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      전공
                    </Text>
                  </Left>
                  <Body>
                    <Text>{major}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Icon
                      ios="ios-menu"
                      android="md-menu"
                      style={{ fontSize: 20, color: '#5592ff' }}
                    />

                    <Text
                      style={{
                        fontWeight: '700',
                        marginLeft: 5,
                        marginLeft: 5
                      }}
                    >
                      기수
                    </Text>
                  </Left>
                  <Body>
                    <Text>{generation !== '' ? `${generation}기` : null}</Text>
                  </Body>
                </ListItem>
                <ListItem style={{ marginTop: 15, marginBottom: 10 }} thumbnail>
                  <Left>
                    <Icon
                      type="Entypo"
                      name="suitcase"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      설명
                    </Text>
                  </Left>
                </ListItem>
                {Array.isArray(companyDesc) &&
                  companyDesc.length !== 0 &&
                  companyDesc.map((desc, index) => {
                    return (
                      <ListItem key={index} thumbnail>
                        <Left>
                          <Icon
                            type="MaterialCommunityIcons"
                            name="circle-small"
                            style={{ color: '#5592ff' }}
                          />
                        </Left>

                        <Body>
                          <Text>{desc}</Text>
                        </Body>
                      </ListItem>
                    );
                  })}
              </List>
            </Content>
          </CardItem>
        </Card>
      </Content>
    </View>
  );
};
