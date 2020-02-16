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
  KeyboardAvoidingView
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useMutation } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import { LOG_IN, CREATE_ACCOUNT } from './AuthQueries';
import {
  Container,
  Picker,
  Item,
  Icon,
  Label,
  Input,
  Text,
  Toast
} from 'native-base';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import constants from '../../constants';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
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
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  //회원가입값들
  const nameInput = useInput('');
  const [birth, setBirth] = useState('출생년도를 선택하세요');
  const cellPhoneInput = useInput('');
  const companyInput = useInput('');
  const companyCatInput = useInput('');
  const teamInput = useInput('');
  const positionInput = useInput('');
  const workPhoneInput = useInput('');
  const [major, setMajor] = useState('');
  const generationInput = useInput('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.log();
    setBirth(date.format('yyyy-MM-dd'));
    hideDatePicker();
  };
  //login에서 보낸 parameter가 있으면 받고 없으면 '' empty String
  const emailInput = useInput(navigation.getParam('email', ''));
  let photo = navigation.getParam('photo', require('../../assets/HYU1.png'));
  console.log(photo);
  console.log(major);
  const [loading, setLoading] = useState(false);
  // const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
  //   variables: {
  //     username: userNameInput,
  //     email: emailInput.value,
  //     firstName: nameInput.value,
  //     lastName: lNameInput.value
  //   }
  // });

  // 이메일이 유효한지 검증
  const handleSignUp = async () => {
    const { value: email } = emailInput;
    const { value: name } = nameInput;
    const { value: cellPhone } = cellPhoneInput;
    const { value: company } = companyInput;
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
    try {
      Alert.alert(
        '프로필 사진을 첨부해주세요.',
        '스킵을 누르시면 기본이미지로 됩니다.'
      );
    } catch (e) {
      Alert.alert('이미 존재하는 회원입니다!', '로그인 해주세요');
      navigation.navigate('Login', { email });
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('PhotoNavigation')}
              >
                <Image source={photo} style={{ height: 80, width: 80 }} />
              </TouchableOpacity>
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
              {/* <AuthInput
              {...birthInput}
              placeholder="생년월일 / Birth Day"
              returnKeyType="next"
              autoCorrect={false}
            /> */}
              <Item style={{ width: constants.width / 1.5, marginBottom: 5 }}>
                <TouchableOpacity onPress={showDatePicker}>
                  <Text style={{ color: '#bfc6ea', fontSize: 17 }}>
                    {birth}
                  </Text>
                </TouchableOpacity>
                <Input />
              </Item>

              <DateTimePickerModal
                cancelTextIOS="취소"
                confirmTextIOS="선택"
                headerTextIOS="출생년도를 선택하세요"
                isVisible={isDatePickerVisible}
                mode="date"
                locale="ko-KR"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
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
              <Item style={{ marginBottom: 5 }} picker>
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
          </Container>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
