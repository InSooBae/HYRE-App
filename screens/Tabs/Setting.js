import React, { useState, useEffect, useRef } from 'react';
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
  Icon,
  Button,
  Item,
  Label,
  Input,
  Toast
} from 'native-base';
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
  Keyboard,
  View,
  Alert
} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import { gql } from 'apollo-boost';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import Loader from '../../components/Loader';
import { useQuery, useMutation } from '@apollo/react-hooks';
import styles from '../../styles';
import axios from 'axios';
import { inputPhoneNumber } from '../../components/PhoneCall';
import { useLogOut } from '../../AuthContext';

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

const EDIT_ME = gql`
  mutation editMe(
    $photo: String
    $name: String!
    $birthday: String!
    $email: String!
    $cellPhone: String!
    $company: String
    $companyDesc: String
    $team: String
    $position: String
    $workPhone: String
    $workAddress: String
    $majorName: String!
    $generation: Int!
  ) {
    editMe(
      photo: $photo
      name: $name
      birthday: $birthday
      email: $email
      cellPhone: $cellPhone
      company: $company
      companyDesc: $companyDesc
      team: $team
      position: $position
      workPhone: $workPhone
      majorName: $majorName
      workAddress: $workAddress
      generation: $generation
    ) {
      id
      name
      photo
    }
  }
`;

export default () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : 77;
  const logOut = useLogOut();
  const [edit, setEdit] = useState(false);
  const [birth, setBirth] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
  const [editMeMutation] = useMutation(EDIT_ME);
  const { data, loading, refetch } = useQuery(SEE_ME, {
    //언제 쿼리를 조회하지 않고 넘길지 설정
    //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
    fetchPolicy: 'network-only'
  });
  const [isloading, setIsLoading] = useState(false);
  const handleSignUp = async () => {
    //이메일 99.99% 유효성 체크
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (name === '') {
      return Toast.show({
        text: `이름을 입력해 주세요.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    }
    if (!emailRegex.test(email)) {
      return Toast.show({
        text: `이메일의 형식이 맞지 않습니다.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    }
    if (birth === '') {
      return Toast.show({
        text: `생년월일을 입력해 주세요.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    }
    if (cellPhone === '') {
      return Toast.show({
        text: `전화번호를 입력해 주세요.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    }
    if (major === '') {
      return Toast.show({
        text: `대학원 전공을 입력해 주세요.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    }
    if (generation === '') {
      return Toast.show({
        text: `기수를 입력해 주세요.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    }
    const formData = new FormData();

    formData.append('photo', {
      name: selectedImage.filename,
      type: 'image/jpeg',
      uri: selectedImage.uri
    });
    console.log('dkaadsk');
    try {
      setIsLoading(true);
      let a = null;
      console.log('------------g------------', selectedImage.filename);
      if (selectedImage.filename) {
        console.log('ehla?');
        const {
          data: { location }
        } = await axios.post(
          'https://hure-backend.herokuapp.com/api/upload',
          formData,
          {
            headers: {
              'content-type': 'multipart/form-data'
            }
          }
        );

        a = location;
        console.log('함수안');
      } else {
        a = photo;
      }
      console.log('요기요', a);
      const { data } = await editMeMutation({
        variables: {
          photo: a,
          name: name,
          birthday: birth,
          email: email,
          cellPhone: cellPhone,
          company: company,
          companyDesc: companyDesc,
          team: team,
          position: position,
          workPhone: workPhone,
          workAddress: workAddress,
          majorName: major,
          generation: parseInt(generation)
        }
      });
      console.log('요기요12', data);
      if (data) {
        Toast.show({
          text: `회원가입요청이 완료되었습니다. 관리자 인증후 로그인 가능합니다.`,
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'success',
          position: 'top',
          duration: 3000,
          style: { marginTop: 70 }
        });
      }
    } catch (e) {
      Alert.alert('이미 존재하는 이메일이 있습니다!');
    } finally {
      setIsLoading(false);
    }
  };
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
      setEmail(data.seeMe.email);
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
      setSelectedImage('');
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

  const deleteIndex = (index, change) => {
    companyDesc.splice(index, 1, change);
    setCompanyDesc(companyDesc);
  };

  if (loading) {
    return <Loader />;
  }
  if (data) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        enabled
      >
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View>
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
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            backgroundColor: 'white',
                            opacity: 0.5,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            height: 50,
                            width: 138
                          }}
                        >
                          <Text
                            style={{
                              color: 'black',
                              textAlign: 'center',
                              fontWeight: '700',
                              marginRight: 10
                            }}
                          >
                            Choose Image
                          </Text>
                        </View>
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
                          <Button
                            disabled={isloading}
                            onPress={handleSignUp}
                            bordered
                            rounded
                          >
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
                        <Button bordered rounded danger onPress={logOut}>
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
                                  ? { fontSize: 16 }
                                  : {
                                      fontSize: 16
                                    }
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
                                  color: '#bfc6ea',
                                  fontSize: 16
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
                            name="phone"
                            style={{ color: '#5592ff' }}
                          />
                          <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                            휴대전화
                          </Text>
                        </Left>
                        {/* <Text>{company}</Text> */}
                        {edit ? (
                          <Body>
                            <TextInput
                              value={cellPhone}
                              onChangeText={value => {
                                setCellPhone(value);
                              }}
                              style={
                                Platform.OS === 'ios'
                                  ? { fontSize: 16 }
                                  : {
                                      fontSize: 16
                                    }
                              }
                              placeholder="(휴대전화)*"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{inputPhoneNumber(cellPhone)}</Text>
                          </Body>
                        )}
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
                        {/* <Text>{company}</Text> */}
                        {edit ? (
                          <Body>
                            <TextInput
                              value={email}
                              onChangeText={value => {
                                setEmail(value);
                              }}
                              style={
                                Platform.OS === 'ios'
                                  ? { fontSize: 16 }
                                  : {
                                      fontSize: 16
                                    }
                              }
                              placeholder="(이메일)*"
                            />
                          </Body>
                        ) : (
                          <Body>
                            <Text>{email}</Text>
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
                                  ? { fontSize: 16 }
                                  : {
                                      fontSize: 16
                                    }
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
                            회사주소
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
                                  ? { fontSize: 16 }
                                  : {
                                      fontSize: 16
                                    }
                              }
                              placeholder="(회사주소)"
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
                                  ? { fontSize: 16 }
                                  : {
                                      fontSize: 16
                                    }
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
                                  ? { fontSize: 16 }
                                  : {
                                      fontSize: 16
                                    }
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
                                  ? { fontSize: 16 }
                                  : {
                                      fontSize: 16
                                    }
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
                                      ? { fontSize: 16 }
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
                              style={{ fontSize: 16 }}
                              value={generation}
                              items={genList}
                              doneText={'확인'}
                              Icon={() => (
                                <Icon
                                  style={
                                    Platform.OS === 'ios'
                                      ? { fontSize: 16 }
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

                      {edit ? (
                        <>
                          <ListItem thumbnail>
                            <Left>
                              <Icon
                                type="Entypo"
                                name="suitcase"
                                style={{ color: '#5592ff' }}
                              />
                              <Text
                                style={{ fontWeight: '700', marginLeft: 5 }}
                              >
                                설명
                              </Text>
                            </Left>
                            <Body>
                              <Text>우측 버튼을 눌러 추가하세요</Text>
                            </Body>
                            <Right>
                              <TouchableOpacity
                                onPress={() =>
                                  setCompanyDesc(companyDesc.concat(''))
                                }
                              >
                                <Icon
                                  type="AntDesign"
                                  name="pluscircle"
                                  style={{ color: '#32CD32', fontSize: 21 }}
                                />
                              </TouchableOpacity>
                            </Right>
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
                                    <TextInput
                                      value={desc}
                                      onChangeText={text =>
                                        setCompanyDesc(
                                          companyDesc.map((a, fIndex) => {
                                            if (fIndex === index) {
                                              return text;
                                            } else return a;
                                          })
                                        )
                                      }
                                      style={
                                        Platform.OS === 'ios'
                                          ? { fontSize: 16 }
                                          : {
                                              fontSize: 16
                                            }
                                      }
                                      placeholder="(경력 및 소개)"
                                    />
                                  </Body>
                                  <Right>
                                    <TouchableOpacity
                                      onPress={() =>
                                        setCompanyDesc(
                                          companyDesc.filter(
                                            (_, fIndex) => fIndex !== index
                                          )
                                        )
                                      }
                                    >
                                      <Icon
                                        type="AntDesign"
                                        name="minuscircle"
                                        style={{
                                          color: styles.redColor,
                                          fontSize: 20
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </Right>
                                </ListItem>
                              );
                            })}
                        </>
                      ) : (
                        <>
                          <ListItem style={{ marginTop: 16 }} thumbnail>
                            <Left>
                              <Icon
                                type="Entypo"
                                name="suitcase"
                                style={{ color: '#5592ff' }}
                              />
                              <Text
                                style={{ fontWeight: '700', marginLeft: 5 }}
                              >
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
                        </>
                      )}
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
