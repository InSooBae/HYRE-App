import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  Alert,
  ScrollView,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  StyleSheet
} from 'react-native';
import {
  Icon,
  Text,
  Toast,
  Card,
  CardItem,
  Thumbnail,
  Left,
  Body,
  Content,
  Right,
  List,
  ListItem
} from 'native-base';
import { Header, useHeaderHeight } from 'react-navigation-stack';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { gql } from 'apollo-boost';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles';
import Loader from '../../components/Loader';
import { TextInput, HelperText } from 'react-native-paper';
import { inputPhoneNumber } from '../../components/PhoneCall';
import constants from '../../constants';
import { Button } from 'react-native-paper';
const SEE_MAJOR_GRAD = gql`
  query seeAllMajor {
    seeAllMajor {
      name
    }
    seeAllGradYear {
      generation
    }
  }
`;

const REQUEST_CREATE_USER = gql`
  mutation requestCreateUser(
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
    requestCreateUser(
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

// const Text = styled.Text`
//   width: ${constants.width / 1.5};
//   font-size: 17px;
//   color: slategrey;
// `;

export default ({ navigation }) => {
  //키보드 토글시 위로 패딩되는 offset값
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 75;
  //회원가입값들
  const headerHeight = useHeaderHeight();

  const [birth, setBirth] = useState('(출생년도를 선택하세요)*');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(navigation.getParam('email', ''));
  const [cellPhone, setCellPhone] = useState('');
  const [company, setCompany] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [companyDesc, setCompanyDesc] = useState([]);
  const [team, setTeam] = useState('');
  const [position, setPosition] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [major, setMajor] = useState('');
  const [generation, setGeneration] = useState('');
  const [genList, setGenList] = useState([]);
  const [majList, setMajList] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [requestCreateUserMutation] = useMutation(REQUEST_CREATE_USER);
  const [selectedImage, setSelectedImage] = useState(
    require('../../assets/HYU1.png')
  );
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const { data, loading, refetch } = useQuery(SEE_MAJOR_GRAD, {
    //언제 쿼리를 조회하지 않고 넘길지 설정
    //검색 결과가 항상 캐시에 저장되지 않도록 fetchPolicy로 설정
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!loading) {
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
    }
    return () => {
      console.log('끝');
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
    console.log(pickerResult);
  };

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 18
    },
    inputAndroid: {
      fontSize: 18
    }
  });
  // const handleConfirm = date => {
  //   setBirth(date.format('yyyy-MM-dd'));
  //   hideDatePicker();
  // };
  //login에서 보낸 parameter가 있으면 받고 없으면 '' empty String

  const [buttonLoading, setButtonLoading] = useState(false);

  // 이메일이 유효한지 검증
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
      setButtonLoading(true);
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
          cellPhone: cellPhone.replace(/-/g, ''),
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
          duration: 10000,
          style: { marginTop: 70 }
        });
        navigation.navigate('AuthHome');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('이미 존재하는 이메일이 있습니다!', '로그인해주세요');
      navigation.navigate('Login', { email });
    } finally {
      setButtonLoading(false);
    }
  };
  if (loading) {
    return <Loader />;
  }
  if (data) {
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={'padding'}
        enabled
      >
        <ScrollView
          stickyHeaderIndices={[0]}
          style={{ backgroundColor: 'white', paddingBottom: -80 }}
        >
          <View
            style={{
              width: constants.width / 2,
              left: constants.width / 3.6
            }}
          >
            <Button
              style={{ backgroundColor: styles.hanyangColor, marginTop: 10 }}
              loading={buttonLoading}
              theme={{
                roundness: 100
              }}
              mode="contained"
              onPress={handleSignUp}
            >
              <Text style={{ color: 'white' }}>Sign Up</Text>
            </Button>
          </View>
          <Content padder>
            <Card>
              <CardItem bordered>
                <Left>
                  <TouchableOpacity onPress={openImagePickerAsync}>
                    <Thumbnail
                      source={selectedImage}
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

                  <Body
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1
                    }}
                  >
                    <Text>이미지 클릭시 변경</Text>
                    <Text note>왼쪽이 기본이미지 입니다.</Text>
                  </Body>
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

                      <Body>
                        <AuthInput
                          value={name}
                          onChange={value => setName(value)}
                          placeholder="(이름)*"
                          autoCorrect={false}
                          returnKeyType="next"
                          infoMessage="이름은 필수입니다."
                        />
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
                        <TouchableOpacity
                          disabled={false}
                          onPress={showDatePicker}
                          onPressIn={showDatePicker}
                        >
                          <TextInput
                            style={{ backgroundColor: 'white' }}
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
                            label="(생일)*"
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
                        />
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
                        <AuthInput
                          value={inputPhoneNumber(cellPhone)}
                          onChange={value => setCellPhone(value)}
                          placeholder="(휴대전화)*"
                          keyboardType={'numeric'}
                          returnKeyType="next"
                          autoCorrect={false}
                          infoMessage="휴대전화는 필수입니다."
                        />
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
                        <AuthInput
                          value={email}
                          onChange={value => setEmail(value)}
                          placeholder="(이메일)*"
                          keyboardType="email-address"
                          returnKeyType="next"
                          autoCorrect={false}
                          infoMessage="이메일은 필수입니다."
                          errorMessage="이메일 형식이 맞지 않습니다."
                          visible={!emailRegex.test(email)}
                        />
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
                        <AuthInput
                          value={company}
                          onChange={value => setCompany(value)}
                          placeholder="(회사명)"
                          returnKeyType="next"
                          autoCorrect={false}
                        />
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
                        <AuthInput
                          value={workAddress}
                          onChange={value => setWorkAddress(value)}
                          placeholder="(회사주소)"
                          returnKeyType="next"
                          autoCorrect={false}
                        />
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
                        <AuthInput
                          value={inputPhoneNumber(workPhone)}
                          onChange={value => setWorkPhone(value)}
                          placeholder="(회사 전화)"
                          keyboardType={'numeric'}
                          returnKeyType="next"
                          autoCorrect={false}
                        />
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
                        <AuthInput
                          value={team}
                          onChange={value => setTeam(value)}
                          placeholder="(부서)"
                          returnKeyType="next"
                          autoCorrect={false}
                        />
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
                        <AuthInput
                          value={position}
                          onChange={value => setPosition(value)}
                          placeholder="(직책)"
                          returnKeyType="next"
                          autoCorrect={false}
                        />
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
                              style={
                                Platform.OS === 'ios' ? { fontSize: 16 } : null
                              }
                              type="AntDesign"
                              name="down"
                            />
                          )}
                          useNativeAndroidPickerStyle={false}
                        />
                        {major === '' && (
                          <HelperText type="info" visible={major === ''}>
                            전공은 필수입니다.
                          </HelperText>
                        )}
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
                              style={
                                Platform.OS === 'ios' ? { fontSize: 16 } : null
                              }
                              type="AntDesign"
                              name="down"
                            />
                          )}
                          useNativeAndroidPickerStyle={false}
                        />
                        {generation === '' && (
                          <HelperText type="info" visible={generation === ''}>
                            기수는 필수입니다.
                          </HelperText>
                        )}
                      </Body>
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
                      <Body>
                        <Text>우측 버튼을 눌러 추가하세요</Text>
                      </Body>
                      <Right>
                        <TouchableOpacity
                          onPress={() => setCompanyDesc(companyDesc.concat(''))}
                        >
                          <Icon
                            type="AntDesign"
                            name="pluscircle"
                            style={{ color: '#32CD32', fontSize: 23 }}
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
                              <AuthInput
                                value={desc}
                                onChange={text =>
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
                                placeholder="(경력 및 소개)"
                              />
                            </Body>
                            <Right style={{ marginLeft: 10 }}>
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
                                    fontSize: 22
                                  }}
                                />
                              </TouchableOpacity>
                            </Right>
                          </ListItem>
                        );
                      })}
                  </List>
                </Content>
              </CardItem>
            </Card>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
};
