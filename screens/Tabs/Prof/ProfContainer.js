import React from 'react';
import ProfPresenter from './ProfPresenter';
import HeaderButton from '../../../components/HeaderButton';
import { Segment, Button, Text, View } from 'native-base';

//쿼리는 hook 써야해서 파일 나눔
/* 
상단 네비게이션을 바꾸기위한 2가지 방법 
1.TabNavigation의 Search stack에 헤더부분을 바꿈 스크린안에 header right한거처럼 ..
#문제점이 여기 입력하는 컴포넌트와 Search화면의 컴포넌트의 state가 서로 상호작용하도록 하는게 문제임.
-> search화면의 static property에 접근하기 위한 방법이 필요함 -> class형식
*/

//static 함수를 사용하려면 클래스 컴포넌트여야함 static property는 컴포넌트 정의되기 전에생성되어 (onChange={this.onChange})요런거적용안됨
//
export default class extends React.Component {
  //함수로 만들고 객체형태로 리턴하고싶으면 () 감싸야함
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => (
      <View>
        <HeaderButton
          value1={navigation.getParam('value1', '교수')}
          value2={navigation.getParam('value2', '국장')}
          query={navigation.getParam('query', '교수')}
          onPress1={navigation.getParam('onPress1', () => null)}
          onPress2={navigation.getParam('onPress2', () => null)}
        />
      </View>
      //     <Segment>
      //   <Button first active={this.isValue1} onPress={onPress1}>
      //     <Text>{value1}</Text>
      //   </Button>
      //   <Button last active={isValue2} onPress={onPress2}>
      //     <Text>{value2}</Text>
      //   </Button>
      // </Segment>
    )
  });
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      value1: '교수',
      value2: '국장',
      query: '교수'
    };
    navigation.setParams({
      value1: this.state.value1,
      value2: this.state.value2,
      query: this.state.query,
      onPress1: this.onPress1,
      onPress2: this.onPress2
    });
  }

  onPress2 = () => {
    const { navigation } = this.props;
    const text = navigation.getParam('value2', '국장');
    //text를 query에 저장해야함 나중에 검색쿼리에 query사용
    //state도 갱신하고, navigation의 params도 갱신
    this.setState({ query: text });
    navigation.setParams({
      query: text
    });
  };
  onPress1 = value1 => {
    const { navigation } = this.props;
    const text = navigation.getParam('value1', '교수');
    //text를 query에 저장해야함 나중에 검색쿼리에 query사용
    //state도 갱신하고, navigation의 params도 갱신
    this.setState({ query: text });
    navigation.setParams({
      query: text
    });
  };
  render() {
    const { query } = this.state;
    return <ProfPresenter query={query} />;
  }
}
