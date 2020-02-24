import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Modal
} from 'react-native';
import {
  Container,
  Picker,
  Item,
  Icon,
  Input,
  Text,
  Toast,
  Card,
  CardItem,
  Thumbnail,
  Left,
  Body,
  Content,
  Right,
  Button,
  Label,
  Form
} from 'native-base';
import axios from 'axios';
import { useMutation } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import constants from '../../constants';
import { gql } from 'apollo-boost';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';

const REQUEST_CREATE_USER = gql`
  mutation requestCreateUser(
    $photo: String
    $name: String!
    $birthday: String!
    $email: String!
    $cellPhone: String!
    $company: String
    $companyCategory: String
    $team: String
    $position: String
    $workPhone: String
    $workAddress: String
    $majorName: String!
    $generation: Int!
  ) {
    requestCreateUser(
      photo: $photo
      name: $name
      birthday: $birthday
      email: $email
      cellPhone: $cellPhone
      company: $company
      companyCategory: $companyCategory
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

Date.prototype.format = function(f) {
  if (!this.valueOf()) return ' ';

  const weekKorName = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일'
  ];

  const weekKorShortName = ['일', '월', '화', '수', '목', '금', '토'];

  const weekEngName = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const weekEngShortName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const d = this;

  return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function(
    $1
  ) {
    switch ($1) {
      case 'yyyy':
        return d.getFullYear(); // 년 (4자리)

      case 'yy':
        return (d.getFullYear() % 1000).zf(2); // 년 (2자리)

      case 'MM':
        return (d.getMonth() + 1).zf(2); // 월 (2자리)

      case 'dd':
        return d.getDate().zf(2); // 일 (2자리)

      case 'KS':
        return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)

      case 'KL':
        return weekKorName[d.getDay()]; // 요일 (긴 한글)

      case 'ES':
        return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)

      case 'EL':
        return weekEngName[d.getDay()]; // 요일 (긴 영어)

      case 'HH':
        return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)

      case 'hh':
        return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)

      case 'mm':
        return d.getMinutes().zf(2); // 분 (2자리)

      case 'ss':
        return d.getSeconds().zf(2); // 초 (2자리)

      case 'a/p':
        return d.getHours() < 12 ? '오전' : '오후'; // 오전/오후 구분

      default:
        return $1;
    }
  });
};

String.prototype.string = function(len) {
  var s = '',
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};

String.prototype.zf = function(len) {
  return '0'.string(len - this.length) + this;
};

Number.prototype.zf = function(len) {
  return this.toString().zf(len);
};

// const Text = styled.Text`
//   width: ${constants.width / 1.5};
//   font-size: 17px;
//   color: slategrey;
// `;

export default ({ navigation }) => {
  //키보드 토글시 위로 패딩되는 offset값
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : 40;
  //회원가입값들
  const nameInput = useInput('');
  const [birth, setBirth] = useState('출생년도를 선택하세요');
  const cellPhoneInput = useInput('');
  const companyInput = useInput('');
  const workAddressInput = useInput('');
  const companyCatInput = useInput('');
  const teamInput = useInput('');
  const positionInput = useInput('');
  const workPhoneInput = useInput('');
  const [major, setMajor] = useState('');
  const generationInput = useInput('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [requestCreateUserMutation] = useMutation(REQUEST_CREATE_USER);
  const [selectedImage, setSelectedImage] = useState(
    require('../../assets/HYU1.png')
  );
  const showDatePicker = () => {
    setDatePickerVisibility(true);
    Keyboard.dismiss();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    setBirth(date.format('yyyy-MM-dd'));
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
    console.log(pickerResult);
  };

  // const handleConfirm = date => {
  //   setBirth(date.format('yyyy-MM-dd'));
  //   hideDatePicker();
  // };
  //login에서 보낸 parameter가 있으면 받고 없으면 '' empty String
  const emailInput = useInput(navigation.getParam('email', ''));

  const [loading, setLoading] = useState(false);

  // 이메일이 유효한지 검증
  const handleSignUp = async () => {
    const { value: email } = emailInput;
    const { value: name } = nameInput;
    const { value: cellPhone } = cellPhoneInput;
    const { value: company } = companyInput;
    const { value: workAddress } = workAddressInput;
    const { value: companyCat } = companyCatInput;
    const { value: team } = teamInput;
    const { value: position } = positionInput;
    const { value: workPhone } = workPhoneInput;
    const { value: generation } = generationInput;
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
      setLoading(true);
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
      }
      console.log('요기요', a);
      const { data } = await requestCreateUserMutation({
        variables: {
          photo: a,
          name: name,
          birthday: birth,
          email: email,
          cellPhone: cellPhone,
          company: company,
          companyCategory: companyCat,
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
        navigation.navigate('AuthHome');
      }
    } catch (e) {
      Alert.alert('이미 존재하는 이메일이 있습니다!', '로그인해주세요');
      navigation.navigate('Login', { email });
    } finally {
      setLoading(false);
    }
  };
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              height: constants.height * 1.3
            }}
          >
            {/* <TouchableOpacity
                onPress={() => navigation.navigate('PhotoNavigation')}
              >
                <Image source={photo} style={{ height: 80, width: 80 }} />
              </TouchableOpacity> */}

            <CardItem
              button
              onPress={openImagePickerAsync}
              style={{ width: constants.width / 1.5 }}
            >
              <Left>
                <Thumbnail
                  source={selectedImage}
                  style={{
                    height: 80,
                    width: 80
                  }}
                />
                <Body>
                  <Text>이미지를 선택하세요</Text>
                  <Text note>미선택시 기본이미지로 지정됩니다.</Text>
                </Body>
              </Left>
            </CardItem>

            {/* <View style={{ marginBottom: 10 }}>
              <Item
                style={{
                  width: constants.width / 1.5
                }}
                floatingLabel
                success={focus}
              >
                <Label>{placeholder}</Label>
                <Input
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  onChangeText={onChange}
                  keyboardType={keyboardType}
                  returnKeyType={returnKeyType}
                  value={value}
                  onSubmitEditing={onSubmitEditing}
                  autoCorrect={autoCorrect}
                  autoCapitalize={autoCapitalize}
                />
              </Item>
            </View> */}

            <AuthInput
              {...nameInput}
              placeholder="이름 / Full Name"
              autoCorrect={false}
              returnKeyType="next"
            />
            <AuthInput
              {...emailInput}
              placeholder="이메일 / Email"
              keyboardType="email-address"
              returnKeyType="next"
              autoCorrect={false}
            />

            <Item
              style={{
                width: constants.width / 1.5,
                paddingTop: 10
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1
                }}
                onPress={showDatePicker}
              >
                <Text
                  style={{
                    width: constants.width / 1.7,
                    fontSize: 18,
                    color: '#bfc6ea'
                  }}
                >
                  {birth}
                </Text>
                <Icon active name="arrow-down" />
              </TouchableOpacity>
            </Item>
            <DateTimePickerModal
              cancelTextIOS="취소"
              confirmTextIOS="선택"
              headerTextIOS="출생년도를 선택하세요"
              isVisible={isDatePickerVisible}
              date={
                birth !== '출생년도를 선택하세요' ? new Date(birth) : new Date()
              }
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            {/* <Modal
                animationType="fade"
                transparent
                visible={showTimeOfDayPicker}
                presentationStyle="overFullScreen"
              >
                */}
            <AuthInput
              {...cellPhoneInput}
              placeholder="010-xxxx-xxxx"
              keyboardType={
                Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'
              }
              returnKeyType="next"
              autoCorrect={false}
            />
            <AuthInput
              {...companyInput}
              placeholder="회사명 / Company Name"
              returnKeyType="next"
              autoCorrect={false}
            />
            <AuthInput
              {...workAddressInput}
              placeholder="사업장 / Work Address"
              returnKeyType="next"
              autoCorrect={false}
            />
            <AuthInput
              {...companyCatInput}
              placeholder="직종 / Company Category"
              returnKeyType="next"
              autoCorrect={false}
            />
            <AuthInput
              {...teamInput}
              placeholder="부서 / Team"
              returnKeyType="next"
              autoCorrect={false}
            />
            <AuthInput
              {...positionInput}
              placeholder="직책 / Position"
              returnKeyType="next"
              autoCorrect={false}
            />
            <AuthInput
              {...workPhoneInput}
              placeholder="회사전화 / Work Phone"
              keyboardType={
                Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'
              }
              returnKeyType="next"
              autoCorrect={false}
            />
            {/* <AuthInput
              {...majorInput}
              placeholder="대학원 전공 / Major"
              returnKeyType="next"
              autoCorrect={false}
            /> */}
            <Item
              style={{ marginBottom: 5, width: constants.width / 1.5 }}
              picker
            >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: constants.width / 1.5 }}
                placeholder="대학원 전공"
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor="#007aff"
                selectedValue={major}
                onValueChange={newMajor => setMajor(newMajor)}
              >
                <Picker.Item label="부동산자산관리" value="부동산자산관리" />
                <Picker.Item label="도시부동산개발" value="도시부동산개발" />
                <Picker.Item label="부동산투자금융" value="부동산투자금융" />
              </Picker>
            </Item>
            <AuthInput
              {...generationInput}
              placeholder="기수 / Generation"
              returnKeyType="send"
              autoCorrect={false}
            />
            <AuthButton
              loading={loading}
              onPress={handleSignUp}
              text="Sign Up"
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
