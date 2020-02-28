import React, { useState, useEffect } from 'react';
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
  List,
  View,
  Icon,
  Button,
  Item,
  Label,
  Input
} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import {
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native-gesture-handler';
import constants from '../../constants';
import {
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import { gql } from 'apollo-boost';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import useInput from '../../hooks/useInput';
import Loader from '../../components/Loader';
import { useQuery } from '@apollo/react-hooks';
import { number } from 'prop-types';

const SEE_ME = gql`
  query seeMe {
    seeMe {
      id
      name
      birthday
      email
      cellPhone
      company
      team
      position
      workPhone
      workAddress
      photo
      companyDesc
      major {
        name
      }
      graduatedYear {
        generation
      }
    }
    seeAllGradYear {
      id
      generation
    }
    seeAllMajor {
      id
      name
    }
  }
`;

export default () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : 40;
  const [edit, setEdit] = useState(false);
  const [birth, setBirth] = useState('');
  const [name, setName] = useState('');

  const [cellPhone, setCellPhone] = useState('');
  const [company, setCompany] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [team, setTeam] = useState('');
  const [position, setPosition] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [major, setMajor] = useState('');
  const [generation, setGeneration] = useState('');
  const [genList, setGenList] = useState([]);
  const [majList, setMajList] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { data, loading, refetch } = useQuery(SEE_ME, {
    //언제 쿼리를 조회하지 않고 넘길지 설정
    //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
    fetchPolicy: 'network-only'
  });
  const setAll = () => {
    if (!loading) {
      setName(data.seeMe.name);
      setBirth(new Date(data.seeMe.birthday).format('yyyy-MM-dd'));
      setCellPhone(data.seeMe.cellPhone);
      setCompany(data.seeMe.company);
      setWorkAddress(data.seeMe.workAddress);
      setCompanyDesc(data.seeMe.companyDesc);
      setTeam(data.seeMe.team);
      setPosition(data.seeMe.position);
      setWorkPhone(data.seeMe.workPhone);
      setGenList(
        data.seeAllGradYear.map(e => {
          return {
            key: e.id,
            label: `${e.generation}기`,
            value: e.generation
          };
        })
      );
      setMajList(
        data.seeAllMajor.map(e => {
          return {
            key: e.id,
            label: e.name,
            value: e.name
          };
        })
      );
      setPhoto(data.seeMe.photo);
      setMajor(data.seeMe.major.name);
      setGeneration(data.seeMe.graduatedYear.generation);
    }
  };
  useEffect(() => {
    setAll();
    return () => {
      setAll();
    };
  }, [data]);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
    Keyboard.dismiss();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    setBirth(new Date(date).format('yyyy-MM-dd'));
  };
  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images'
    });
    if (pickerResult.cancelled === true) {
      return;
    }
    pickerResult.filename =
      'IMG_' + Math.floor(Math.random(4000) * 100000) + '.JPG';
    setSelectedImage(pickerResult);
    setPhoto(pickerResult.uri);
    console.log(pickerResult);
  };
  console.log('-----------------!!', data);
  console.log(selectedImage);
  if (loading) {
    return <Loader />;
  }
  if (data) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        enabled
        style={{
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View style={{ backgroundColor: 'white' }}>
            <Content padder>
              <Card>
                <CardItem header bordered>
                  <Left>
                    {edit === false ? (
                      <Thumbnail
                        source={
                          photo !== null
                            ? { uri: photo }
                            : require('../../assets/HYU1.png')
                        }
                        style={{
                          width: 138,
                          height: 138,
                          borderRadius: (138 + 138) / 2
                        }}
                        large
                      />
                    ) : (
                      // <Thumbnail
                      //   source={}
                      //   style={{
                      //     width: constants.width / 5,
                      //     overflow: 'visible'
                      //   }}
                      //   resizeMode="cover"
                      // />
                      <TouchableOpacity onPress={openImagePickerAsync}>
                        <Thumbnail
                          source={
                            photo !== null
                              ? { uri: photo }
                              : require('../../assets/HYU1.png')
                          }
                          style={{
                            width: 138,
                            height: 138,
                            borderRadius: (138 + 138) / 2
                          }}
                          large
                        />
                      </TouchableOpacity>
                    )}
                    {edit ? (
                      <>
                        <Body
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1
                          }}
                        >
                          <Text>이미지 클릭시 변경</Text>
                          <Text note>확인을 눌르셔야 적용됩니다.</Text>
                        </Body>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end'
                          }}
                        >
                          <Button
                            style={{ marginBottom: 10 }}
                            bordered
                            rounded
                            danger
                            onPress={() => {
                              setAll();
                              setEdit(!edit);
                            }}
                          >
                            <Text style={{ fontWeight: '600' }}>취소</Text>
                          </Button>
                          <Button bordered rounded>
                            <Text style={{ fontWeight: '600' }}>확인</Text>
                          </Button>
                        </View>
                      </>
                    ) : (
                      <Right
                        style={{
                          flexDirection: 'column',
                          alignItems: 'flex-end'
                        }}
                      >
                        <Button
                          style={{ marginBottom: 10 }}
                          bordered
                          rounded
                          onPress={() => setEdit(!edit)}
                        >
                          <Text style={{ fontWeight: '600' }}>EDIT</Text>
                        </Button>
                        <Button bordered rounded danger>
                          <Text style={{ fontWeight: '600' }}>LOGOUT</Text>
                        </Button>
                      </Right>
                    )}
                  </Left>
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
                        {edit ? (
                          <Body>
                            <TextInput
                              value={name}
                              onChangeText={value => {
                                setName(value);
                              }}
                              style={
                                Platform.OS === 'ios'
                                  ? { marginBottom: 0.3 }
                                  : { flex: 1, marginBottom: -3.9 }
                              }
                              placeholder="(이름)*"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{name}</Text>
                          </Body>
                        )}
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
                        {edit ? (
                          <Body>
                            <TouchableOpacity onPress={showDatePicker}>
                              <Text
                                style={{
                                  color: '#bfc6ea'
                                }}
                              >
                                {birth}
                              </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                              cancelTextIOS="취소"
                              confirmTextIOS="선택"
                              headerTextIOS="출생년도를 선택하세요"
                              isVisible={isDatePickerVisible}
                              date={
                                birth !== '출생년도를 선택하세요'
                                  ? new Date(birth)
                                  : new Date()
                              }
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{birth}</Text>
                          </Body>
                        )}
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
                        {/* <Text>{company}</Text> */}
                        {edit ? (
                          <Body>
                            <TextInput
                              value={company}
                              onChangeText={value => {
                                setCompany(value);
                              }}
                              style={
                                Platform.OS === 'ios'
                                  ? { marginBottom: 0.3 }
                                  : { flex: 1, marginBottom: -3.9 }
                              }
                              placeholder="(회사명)"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{company}</Text>
                          </Body>
                        )}
                      </ListItem>
                      <ListItem thumbnail>
                        <Left>
                          <Icon
                            type="FontAwesome"
                            name="building"
                            style={{ color: '#5592ff' }}
                          />
                          <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                            사업장
                          </Text>
                        </Left>
                        {/* <Text>{workAddress}</Text> */}
                        {edit ? (
                          <Body>
                            <TextInput
                              value={workAddress}
                              onChangeText={value => {
                                setWorkAddress(value);
                              }}
                              style={
                                Platform.OS === 'ios'
                                  ? { marginBottom: 0.3 }
                                  : { flex: 1, marginBottom: -3.9 }
                              }
                              placeholder="(사업장)"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{workAddress}</Text>
                          </Body>
                        )}
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
                        {/* <Text>{team}</Text> */}
                        {edit ? (
                          <Body>
                            <TextInput
                              value={team}
                              onChangeText={value => {
                                setTeam(value);
                              }}
                              style={
                                Platform.OS === 'ios'
                                  ? { marginBottom: 0.3 }
                                  : { flex: 1, marginBottom: -3.9 }
                              }
                              placeholder="(부서)"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{team}</Text>
                          </Body>
                        )}
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
                        {/* <Text>{position}</Text> */}
                        {edit ? (
                          <Body>
                            <TextInput
                              value={position}
                              onChangeText={value => {
                                setPosition(value);
                              }}
                              style={
                                Platform.OS === 'ios'
                                  ? { marginBottom: 0.3 }
                                  : { flex: 1, marginBottom: -3.9 }
                              }
                              placeholder="(직책)"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{position}</Text>
                          </Body>
                        )}
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
                        {/* <Text>{workPhone}</Text> */}
                        {edit ? (
                          <Body>
                            <TextInput
                              value={workPhone}
                              onChangeText={value => {
                                setWorkPhone(value);
                              }}
                              style={
                                Platform.OS === 'ios'
                                  ? { marginBottom: 0.3 }
                                  : { flex: 1, marginBottom: -3.9 }
                              }
                              placeholder="(회사 전화)"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{workPhone}</Text>
                          </Body>
                        )}
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
                        {/* <Text>{major}</Text> */}
                        {edit ? (
                          <Body>
                            <RNPickerSelect
                              placeholder={{
                                label: '전공을 선택하세요.',
                                value: null
                              }}
                              value={major}
                              onValueChange={major => {
                                setMajor(major);
                              }}
                              items={majList}
                              doneText={'확인'}
                              Icon={() => (
                                <Icon
                                  style={
                                    Platform.OS === 'ios'
                                      ? { fontSize: 17 }
                                      : null
                                  }
                                  type="AntDesign"
                                  name="down"
                                />
                              )}
                              useNativeAndroidPickerStyle={false}
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{major}</Text>
                          </Body>
                        )}
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
                        {/* <Text>{generation !== '' ? `${generation}기` : null}</Text> */}
                        {edit ? (
                          <Body>
                            <RNPickerSelect
                              placeholder={{
                                label: '기수를 선택하세요.'
                              }}
                              onValueChange={generation => {
                                setGeneration(generation);
                              }}
                              value={generation}
                              items={genList}
                              doneText={'확인'}
                              Icon={() => (
                                <Icon
                                  style={
                                    Platform.OS === 'ios'
                                      ? { fontSize: 17 }
                                      : null
                                  }
                                  type="AntDesign"
                                  name="down"
                                />
                              )}
                              useNativeAndroidPickerStyle={false}
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{`${generation}기`}</Text>
                          </Body>
                        )}
                      </ListItem>
                      <ListItem thumbnail>
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
                        {/* <Text>{companyDesc}</Text> */}
                        {edit ? (
                          <Body>
                            <TextInput
                              style={
                                Platform.OS === 'ios'
                                  ? { marginBottom: 0.3 }
                                  : { flex: 1, marginBottom: -3.9 }
                              }
                              placeholder="(경력 및 소개)"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>설명</Text>
                          </Body>
                        )}
                      </ListItem>
                    </List>
                  </Content>
                </CardItem>
              </Card>
            </Content>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
};
