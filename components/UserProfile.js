import React from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Left,
  Thumbnail,
  Right,
  ListItem,
  List
} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { callNumber, linkEmail, linkMessage } from './PhoneCall';
import { number } from 'prop-types';
import constants from '../constants';
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
  // const { data, loading, refetch } = useQuery(SEE_ALL_USER, {
  //   //언제 쿼리를 조회하지 않고 넘길지 설정
  //   //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
  //   fetchPolicy: 'network-only'
  // });
  //envelope-o envelope phone
  // commenting-o commenting
  return (
    <Container>
      <Content padder>
        <Card>
          <CardItem header bordered>
            <Left>
              {photo === '' ? (
                <Thumbnail
                  source={require('../assets/HYU1.png')}
                  style={{
                    width: constants.width / 3.8,
                    height: constants.height / 8
                  }}
                  large
                />
              ) : (
                <Thumbnail
                  source={{ uri: photo }}
                  style={{
                    width: constants.width / 3.5,
                    height: constants.height / 7,
                    borderRadius:
                      (constants.width / 3.5 + constants.height / 7) / 2
                  }}
                  large
                />
              )}
            </Left>
            <Right
              style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
            >
              <TouchableOpacity onPress={() => linkEmail(email)}>
                <FontAwesome
                  size={30}
                  name={Platform.OS === 'ios' ? 'envelope-o' : 'envelope-o'}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => linkMessage(cellPhone)}>
                <FontAwesome
                  size={30}
                  name={Platform.OS === 'ios' ? 'commenting-o' : 'commenting-o'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => callNumber(cellPhone)}>
                <FontAwesome
                  size={30}
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
                    <Text>이름</Text>
                  </Left>
                  <Body>
                    <Text>{name}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>생일</Text>
                  </Left>
                  <Body>
                    <Text>{new Date(birth).format('yyyy-MM-dd')}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>회사명</Text>
                  </Left>
                  <Body>
                    <Text>{company}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>사업장</Text>
                  </Left>
                  <Body>
                    <Text>{workAddress}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>부서</Text>
                  </Left>
                  <Body>
                    <Text>{team}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>직책</Text>
                  </Left>
                  <Body>
                    <Text>{position}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>회사전화</Text>
                  </Left>
                  <Body>
                    <Text>{workPhone}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>대학원 전공</Text>
                  </Left>
                  <Body>
                    <Text>{major}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>기수</Text>
                  </Left>
                  <Body>
                    <Text>{generation !== '' ? `${generation}기` : null}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left>
                    <Text>설명</Text>
                  </Left>
                  <Body>
                    <Text>{companyDesc}</Text>
                  </Body>
                </ListItem>
              </List>
            </Content>
          </CardItem>
          <CardItem footer bordered style={{ justifyContent: 'center' }}>
            <Text>Save Contact</Text>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};
