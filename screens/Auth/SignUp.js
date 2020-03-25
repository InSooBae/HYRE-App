import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, View, StyleSheet } from 'react-native';
import { Toast } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import { gql } from 'apollo-boost';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles';
import Loader from '../../components/Loader';
import { TextInput, HelperText, Avatar, Text, Card } from 'react-native-paper';
import { inputPhoneNumber } from '../../components/PhoneCall';
import constants from '../../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InputScrollView from 'react-native-input-scroll-view';
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
    $birthday: String
    $email: String!
    $cellPhone: String
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
  //회원가입값들
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  const ref_input6 = useRef();
  const ref_input7 = useRef();

  const [birth, setBirth] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(navigation.getParam('email', ''));
  const [cellPhone, setCellPhone] = useState('');
  const [company, setCompany] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [companyDesc, setCompanyDesc] = useState([]);
  const [team, setTeam] = useState('');
  const [position, setPosition] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [major, setMajor] = useState(null);
  const [generation, setGeneration] = useState(null);
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
      return Toast.show({
        text: `사진 권한을 설정해 주세요.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'danger',
        position: 'top',
        duration: 4000,
        style: { marginTop: 70 }
      });
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
  };

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16
    },
    inputAndroid: {
      fontSize: 16
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
        duration: 7000,
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
        duration: 7000,
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
        duration: 7000,
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
        duration: 7000,
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
      setButtonLoading(true);
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
      }
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
          workPhone: workPhone.replace(/-/g, ''),
          workAddress: workAddress,
          majorName: major,
          generation: parseInt(generation)
        }
      });
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
      Toast.show({
        text: '이미 존재하는 이메일 혹은 전화번호 입니다. 다시 확인 해주세요',
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'danger',
        position: 'top',
        duration: 7000,
        style: { marginTop: 70 }
      });
    } finally {
      setButtonLoading(false);
    }
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
                <TouchableOpacity onPress={openImagePickerAsync}>
                  <Avatar.Image
                    source={selectedImage}
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
              </View>
              <View>
                <Text>이미지 클릭시 변경</Text>
                {selectedImage === require('../../assets/HYU1.png') ? (
                  <Text note>왼쪽이 기본이미지 입니다.</Text>
                ) : null}
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 15 }}
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
                <Avatar.Icon
                  icon="account"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
                />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>이름</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: constants.width / 1.5
                }}
              >
                <TextInput
                  style={{}}
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
          theme={{ roundness: 15 }}
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
                <Avatar.Icon
                  icon="cake"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
                />

                <Text style={{ fontWeight: '700', marginLeft: 5 }}>생일</Text>
              </View>
              <View
                style={{ flexDirection: 'column', justifyContent: 'center' }}
              >
                <TouchableOpacity
                  disabled={false}
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
                    label="(출생년도를 선택하세요)"
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  cancelTextIOS="취소"
                  confirmTextIOS="선택"
                  headerTextIOS="출생년도를 선택하세요"
                  isVisible={isDatePickerVisible}
                  date={!birth ? new Date() : new Date(birth)}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
        <Card
          elevation={6}
          style={{ marginBottom: 2 }}
          theme={{ roundness: 15 }}
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
                <Avatar.Icon
                  icon="phone"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
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
                  label="(휴대전화)"
                  keyboardType={'numeric'}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onSubmitEditing={() => ref_input2.current.focus()}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="email"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="office-building"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
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
                  autoCorrect={false}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="domain"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="deskphone"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
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
                />
              </View>
            </View>
          </Card.Content>
        </Card>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="briefcase-account"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="medal"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
                />
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
                  autoCorrect={false}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="star"
                  color="#ffffff"
                  size={30}
                  theme={{ colors: { primary: '#5592ff' } }}
                />
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
                    <Avatar.Icon
                      icon="chevron-down"
                      size={30}
                      color="gray"
                      theme={{ colors: { primary: '#ffffff' } }}
                    />
                  )}
                  useNativeAndroidPickerStyle={false}
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="altimeter"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
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
                    <Avatar.Icon
                      icon="chevron-down"
                      size={30}
                      color="gray"
                      theme={{ colors: { primary: '#ffffff' } }}
                    />
                  )}
                  useNativeAndroidPickerStyle={false}
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
                justifyContent: 'space-around',
                flex: 1
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                  icon="briefcase-edit"
                  size={30}
                  color="#ffffff"
                  theme={{ colors: { primary: '#5592ff' } }}
                />
                <Text style={{ fontWeight: '700', marginLeft: 5 }}>설명</Text>
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
                  <Avatar.Icon
                    icon="plus-circle"
                    color="#32CD32"
                    size={45}
                    theme={{
                      colors: {
                        primary: '#ffffff'
                      }
                    }}
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
                theme={{ roundness: 15 }}
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
                    <Avatar.Icon
                      icon="checkbox-multiple-marked-circle"
                      color="#5592ff"
                      size={30}
                      theme={{ colors: { primary: '#ffffff' } }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
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
                            companyDesc.filter((_, fIndex) => fIndex !== index)
                          )
                        }
                      >
                        <Avatar.Icon
                          icon="minus-circle"
                          color={styles.redColor}
                          size={45}
                          theme={{
                            colors: {
                              primary: '#ffffff'
                            }
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        <View
          style={{
            width: constants.width / 1.5,
            alignSelf: 'center',
            marginBottom: 20
          }}
        >
          <AuthButton
            loading={buttonLoading}
            onPress={handleSignUp}
            text="Sign Up"
          />
        </View>
      </InputScrollView>
    );
  }
};
