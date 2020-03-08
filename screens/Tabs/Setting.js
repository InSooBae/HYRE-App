import React, { useState, useEffect, useRef } from 'react';
import { Icon, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import constants from '../../constants';
import {
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  StyleSheet
} from 'react-native';
import {
  TextInput,
  HelperText,
  Avatar,
  Text,
  Card,
  Button
} from 'react-native-paper';
import { gql } from 'apollo-boost';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import Loader from '../../components/Loader';
import { useQuery, useMutation } from '@apollo/react-hooks';
import styles from '../../styles';
import axios from 'axios';
import {
  inputPhoneNumber,
  callNumber,
  linkEmail
} from '../../components/PhoneCall';
import { useLogOut } from '../../AuthContext';

import InputScrollView from 'react-native-input-scroll-view';

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
    $companyDesc: [String!]!
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
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  const ref_input6 = useRef();
  const ref_input7 = useRef();

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
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16
    },
    inputAndroid: {
      fontSize: 16
    }
  });

  const styleBack = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%'
    },
    container: {
      flex: 1,
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'center'
    }
  });

  const [isloading, setIsLoading] = useState(false);
  const handleSignUp = async () => {
    //이메일 99.99% 유효성 체크
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
    if (!major) {
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
    if (!generation) {
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
    try {
      setIsLoading(true);
      let a = null;
      if (selectedImage.filename) {
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
      } else {
        a = photo;
      }
      const { data } = await editMeMutation({
        variables: {
          photo: a,
          name: name,
          birthday: birth,
          email: email,
          cellPhone: cellPhone.replace(/-/g, ''),
          company: company,
          companyDesc: companyDesc,
          team: team,
          position: position,
          workPhone: workPhone.replace(/-/g, ''),
          workAddress: workAddress,
          majorName: major,
          generation: parseInt(generation)
        }
      });
      if (data) {
        Toast.show({
          text: `${name}님의 정보를 수정 했습니다.`,
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'success',
          position: 'top',
          duration: 3000,
          style: { marginTop: 70 }
        });
        setEdit(!edit);
        await refetch();
      }
    } catch (e) {
      Alert.alert('수정 오류!');
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
      console.log('Profile');
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
  };

  if (loading) {
    return <Loader />;
  }
  if (data) {
    return (
      <InputScrollView
        keyboardAvoidingViewProps={{
          behavior: 'padding',
          enabled: true,
          style: styleBack.container
        }}
      >
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 15 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around'
                }}
              >
                {edit === false ? (
                  <Avatar.Image
                    source={
                      photo !== null
                        ? { uri: photo }
                        : require('../../assets/HYU1.png')
                    }
                    size={138}
                    theme={{ colors: { primary: '#ffffff' } }}
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
                    <Avatar.Image
                      source={
                        photo !== null
                          ? { uri: photo }
                          : require('../../assets/HYU1.png')
                      }
                      size={138}
                      theme={{ colors: { primary: '#ffffff' } }}
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
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1
                      }}
                    >
                      <Text>이미지 클릭시 변경</Text>
                      <Text note>확인시 변경사항 적용</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end'
                      }}
                    >
                      <Button
                        style={{ marginBottom: 10 }}
                        onPress={() => {
                          setAll();
                          setEdit(!edit);
                        }}
                      >
                        <Text style={{ fontWeight: '600' }}>취소</Text>
                      </Button>
                      <Button
                        disabled={isloading}
                        loading={isloading}
                        onPress={handleSignUp}
                      >
                        <Text style={{ fontWeight: '600' }}>확인</Text>
                      </Button>
                    </View>
                  </>
                ) : (
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      flex: 1
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
                    <Button
                      bordered
                      rounded
                      danger
                      onPress={() => {
                        Toast.show({
                          text: `로그아웃 하셨습니다.`,
                          textStyle: { textAlign: 'center' },
                          buttonText: 'Okay',
                          type: 'success',
                          position: 'top',
                          duration: 3000,
                          style: { marginTop: 70 }
                        });
                        logOut();
                      }}
                    >
                      <Text style={{ fontWeight: '600' }}>LOGOUT</Text>
                    </Button>
                  </View>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="person" style={{ color: '#5592ff' }} />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>이름</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <TextInput
                  style={{ width: constants.width / 1.5 }}
                  mode="outlined"
                  theme={{
                    roundness: 100,
                    colors: {
                      background: 'white',
                      primary: styles.hanyangColor
                    }
                  }}
                  value={name}
                  onChangeText={value => setName(value)}
                  label="(이름)*"
                  autoCorrect={false}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  disabled={!edit}
                  onSubmitEditing={() => showDatePicker()}
                />
                {!name && (
                  <HelperText type="info" visible={!name}>
                    {'이름은 필수입니다.'}
                  </HelperText>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type="MaterialIcons"
                  name="cake"
                  style={{ color: '#5592ff' }}
                />

                <Text style={{ fontWeight: '700', marginLeft: 5 }}>생일</Text>
              </View>
              <View
                style={{ flexDirection: 'column', justifyContent: 'center' }}
              >
                <TouchableOpacity
                  disabled={!edit}
                  onPress={showDatePicker}
                  onPressIn={showDatePicker}
                >
                  <TextInput
                    style={{
                      backgroundColor: 'white',
                      width: constants.width / 1.5
                    }}
                    selectionColor={styles.hanyangColor}
                    mode="outlined"
                    value={birth}
                    theme={{
                      roundness: 100,
                      colors: {
                        background: 'white',
                        primary: styles.hanyangColor
                      }
                    }}
                    disabled
                    label="(출생년도를 선택하세요)*"
                  />
                  {birth === '(출생년도를 선택하세요)*' && (
                    <HelperText
                      type="info"
                      visible={birth === '(출생년도를 선택하세요)*'}
                    >
                      생일은 필수입니다.
                    </HelperText>
                  )}
                </TouchableOpacity>
                <DateTimePickerModal
                  cancelTextIOS="취소"
                  confirmTextIOS="선택"
                  headerTextIOS="출생년도를 선택하세요"
                  isVisible={isDatePickerVisible}
                  date={
                    birth !== '(출생년도를 선택하세요)*'
                      ? new Date(birth)
                      : new Date()
                  }
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  isDarkModeEnabled={true}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type="FontAwesome"
                  name="phone"
                  style={{ color: '#5592ff' }}
                />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                  휴대전화
                </Text>
              </View>
              <View
                style={{ flexDirection: 'column', justifyContent: 'center' }}
              >
                <TextInput
                  style={{ width: constants.width / 1.5 }}
                  mode="outlined"
                  theme={{
                    roundness: 100,
                    colors: {
                      background: 'white',
                      primary: styles.hanyangColor
                    }
                  }}
                  value={cellPhone}
                  onChangeText={value => {
                    setCellPhone(inputPhoneNumber(value));
                  }}
                  label="(휴대전화)*"
                  keyboardType={'numeric'}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  disabled={!edit}
                  autoCorrect={false}
                  onSubmitEditing={() => ref_input2.current.focus()}
                />
                {!cellPhone && (
                  <HelperText type="info" visible={!cellPhone}>
                    {'휴대전화는 필수입니다.'}
                  </HelperText>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type="FontAwesome"
                  name="envelope"
                  style={{ color: '#5592ff' }}
                />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>이메일</Text>
              </View>
              <View
                style={{ flexDirection: 'column', justifyContent: 'center' }}
              >
                <TextInput
                  style={{ width: constants.width / 1.5 }}
                  ref={ref_input2}
                  mode="outlined"
                  theme={{
                    roundness: 100,
                    colors: {
                      background: 'white',
                      primary: styles.hanyangColor
                    }
                  }}
                  value={email}
                  onSubmitEditing={() => ref_input3.current.focus()}
                  onChangeText={value => setEmail(value)}
                  label="(이메일)*"
                  keyboardType="email-address"
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  disabled={!edit}
                  autoCorrect={false}
                  error={
                    (email.length != 0) !== false && !emailRegex.test(email)
                  }
                />
                {!email && (
                  <HelperText type="info" visible={!email}>
                    {'이메일은 필수입니다.'}
                  </HelperText>
                )}
                {email.length != 0 && !emailRegex.test(email) && (
                  <HelperText type="error" visible={!emailRegex.test(email)}>
                    {'이메일 형식이 맞지 않습니다.'}
                  </HelperText>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type="FontAwesome"
                  name="building-o"
                  style={{ color: '#5592ff' }}
                />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>회사명</Text>
              </View>
              <View>
                <TextInput
                  style={{ width: constants.width / 1.5 }}
                  ref={ref_input3}
                  mode="outlined"
                  theme={{
                    roundness: 100,
                    colors: {
                      background: 'white',
                      primary: styles.hanyangColor
                    }
                  }}
                  value={company}
                  onChangeText={value => setCompany(value)}
                  label="(회사명)"
                  onSubmitEditing={() => ref_input4.current.focus()}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  disabled={!edit}
                  autoCorrect={false}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type="FontAwesome"
                  name="building"
                  style={{ color: '#5592ff' }}
                />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                  회사주소
                </Text>
              </View>
              <View>
                <TextInput
                  style={{ width: constants.width / 1.5 }}
                  ref={ref_input4}
                  mode="outlined"
                  theme={{
                    roundness: 100,
                    colors: {
                      background: 'white',
                      primary: styles.hanyangColor
                    }
                  }}
                  value={workAddress}
                  onChangeText={value => setWorkAddress(value)}
                  label="(회사주소)"
                  onSubmitEditing={() => ref_input5.current.focus()}
                  returnKeyType="next"
                  disabled={!edit}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type="Entypo"
                  name="landline"
                  style={{ color: '#5592ff' }}
                />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                  회사전화
                </Text>
              </View>
              <View>
                <TextInput
                  style={{ width: constants.width / 1.5 }}
                  ref={ref_input5}
                  mode="outlined"
                  theme={{
                    roundness: 100,
                    colors: {
                      background: 'white',
                      primary: styles.hanyangColor
                    }
                  }}
                  value={workPhone}
                  onChangeText={value => setWorkPhone(inputPhoneNumber(value))}
                  label="(회사 전화)"
                  onSubmitEditing={() => ref_input6.current.focus()}
                  keyboardType={'numeric'}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  disabled={!edit}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type="Entypo"
                  name="archive"
                  style={{ color: '#5592ff' }}
                />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>부서</Text>
              </View>
              <View>
                <TextInput
                  style={{ width: constants.width / 1.5 }}
                  ref={ref_input6}
                  mode="outlined"
                  theme={{
                    roundness: 100,
                    colors: {
                      background: 'white',
                      primary: styles.hanyangColor
                    }
                  }}
                  value={team}
                  onChangeText={value => setTeam(value)}
                  onSubmitEditing={() => ref_input7.current.focus()}
                  label="(부서)"
                  disabled={!edit}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type="Entypo" name="medal" style={{ color: '#5592ff' }} />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>직책</Text>
              </View>
              <View>
                <TextInput
                  ref={ref_input7}
                  style={{ width: constants.width / 1.5 }}
                  mode="outlined"
                  theme={{
                    roundness: 100,
                    colors: {
                      background: 'white',
                      primary: styles.hanyangColor
                    }
                  }}
                  value={position}
                  onChangeText={value => setPosition(value)}
                  label="(직책)"
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  disabled={!edit}
                  autoCorrect={false}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type="Entypo" name="star" style={{ color: '#5592ff' }} />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>전공</Text>
              </View>
              <View style={{ width: constants.width / 1.5 }}>
                <RNPickerSelect
                  placeholder={{
                    label: '(전공을 선택하세요)*',
                    value: null
                  }}
                  value={major}
                  onValueChange={major => {
                    setMajor(major);
                  }}
                  items={majList}
                  doneText={'확인'}
                  style={{ ...pickerSelectStyles }}
                  Icon={() => (
                    <Icon
                      style={Platform.OS === 'ios' ? { fontSize: 16 } : null}
                      type="AntDesign"
                      name="down"
                    />
                  )}
                  useNativeAndroidPickerStyle={false}
                  disabled={!edit}
                />
                {!major && (
                  <HelperText type="info" visible={!major}>
                    전공은 필수입니다.
                  </HelperText>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 2 }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  ios="ios-menu"
                  android="md-menu"
                  style={{ color: '#5592ff' }}
                />
                <Text
                  style={{
                    fontWeight: '700',
                    marginLeft: 5
                  }}
                >
                  기수
                </Text>
              </View>
              <View style={{ width: constants.width / 1.5 }}>
                <RNPickerSelect
                  placeholder={{
                    label: '(기수를 선택하세요)*'
                  }}
                  onValueChange={generation => {
                    setGeneration(generation);
                  }}
                  style={{ ...pickerSelectStyles }}
                  value={generation}
                  items={genList}
                  doneText={'확인'}
                  Icon={() => (
                    <Icon
                      style={Platform.OS === 'ios' ? { fontSize: 16 } : null}
                      type="AntDesign"
                      name="down"
                    />
                  )}
                  useNativeAndroidPickerStyle={false}
                  disabled={!edit}
                />
                {!generation && (
                  <HelperText type="info" visible={!generation}>
                    기수는 필수입니다.
                  </HelperText>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {edit ? (
          <>
            <Card
              elevation={6}
              style={{ marginBottom: 2 }}
              theme={{ roundness: 2 }}
            >
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',
                    justifyContent: 'space-around',
                    flex: 1
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      type="Entypo"
                      name="suitcase"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      설명
                    </Text>
                  </View>
                  <View
                    style={{
                      width: constants.width / 1.5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Text>우측 버튼을 눌러 추가하세요</Text>
                    <TouchableOpacity
                      onPress={() => setCompanyDesc(companyDesc.concat(''))}
                    >
                      <Icon
                        type="AntDesign"
                        name="pluscircle"
                        style={{ color: '#32CD32', fontSize: 23 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card.Content>
            </Card>
            {Array.isArray(companyDesc) &&
              companyDesc.length !== 0 &&
              companyDesc.map((desc, index) => {
                return (
                  <Card
                    elevation={6}
                    style={{ marginBottom: 2 }}
                    key={index}
                    theme={{ roundness: 2 }}
                  >
                    <Card.Content>
                      <View
                        style={{
                          flexDirection: 'row',

                          alignItems: 'center',
                          justifyContent: 'space-around',
                          flex: 1
                        }}
                      >
                        <Icon
                          type="MaterialCommunityIcons"
                          name="circle-small"
                          style={{ color: '#5592ff' }}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            flex: 1
                          }}
                        >
                          <TextInput
                            style={{ width: constants.width / 1.5 }}
                            mode="outlined"
                            theme={{
                              roundness: 100,
                              colors: {
                                background: 'white',
                                primary: styles.hanyangColor
                              }
                            }}
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
                            returnKeyType="next"
                            autoCorrect={false}
                            label="(경력 및 소개)"
                            autoFocus
                          />

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
                                fontSize: 23
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
          </>
        ) : (
          <>
            <Card
              elevation={6}
              style={{ marginBottom: 2 }}
              theme={{ roundness: 2 }}
            >
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',
                    justifyContent: 'space-around',
                    flex: 1
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      type="Entypo"
                      name="suitcase"
                      style={{ color: '#5592ff' }}
                    />
                    <Text style={{ fontWeight: '700', marginLeft: 5 }}>
                      설명
                    </Text>
                  </View>
                  <View
                    style={{
                      width: constants.width / 1.5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  ></View>
                </View>
              </Card.Content>
            </Card>
            {Array.isArray(companyDesc) &&
              companyDesc.length !== 0 &&
              companyDesc.map((desc, index) => {
                return (
                  <Card
                    elevation={6}
                    style={{ marginBottom: 2, flex: 1 }}
                    key={index}
                    theme={{ roundness: 2 }}
                  >
                    <Card.Content>
                      <View
                        style={{
                          flexDirection: 'row',

                          alignItems: 'center',
                          justifyContent: 'space-around',
                          flex: 1
                        }}
                      >
                        <Icon
                          type="MaterialCommunityIcons"
                          name="circle-small"
                          style={{ color: '#5592ff' }}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            flex: 1
                          }}
                        >
                          <TextInput
                            style={{ width: constants.width / 1.5 }}
                            mode="outlined"
                            theme={{
                              roundness: 100,
                              colors: {
                                background: 'white',
                                primary: styles.hanyangColor
                              }
                            }}
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
                            returnKeyType="next"
                            autoCorrect={false}
                            label="(경력 및 소개)"
                            disabled
                          />
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
          </>
        )}
        <View style={{ alignItems: 'center', marginBottom: 3, marginTop: 5 }}>
          <TouchableOpacity onPress={() => callNumber('01057515232')}>
            <Text style={{ color: styles.darkGreyColor, marginBottom: 5 }}>
              developer H.P : 010-5751-5232
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => linkEmail('qospwmf@gmail.com')}>
            <Text style={{ color: styles.darkGreyColor, marginBottom: 5 }}>
              email : qospwmf@gmail.com
            </Text>
          </TouchableOpacity>
        </View>
      </InputScrollView>
    );
  }
};
