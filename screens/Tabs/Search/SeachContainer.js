import React from 'react';
import styled from 'styled-components';
import SearchBar from '../../../components/SearchBar';
import SearchPresenter from './SeachPresenter';
import constants from '../../../constants';

//쿼리는 hook 써야해서 파일 나눔
/* 
상단 네비게이션을 바꾸기위한 2가지 방법 
1.TabNavigation의 Search stack에 헤더부분을 바꿈 스크린안에 header right한거처럼 ..
#문제점이 여기 입력하는 컴포넌트와 Search화면의 컴포넌트의 state가 서로 상호작용하도록 하는게 문제임.
-> search화면의 static property에 접근하기 위한 방법이 필요함 -> class형식
*/

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

//static 함수를 사용하려면 클래스 컴포넌트여야함 static property는 컴포넌트 정의되기 전에생성되어 (onChange={this.onChange})요런거적용안됨
//
export default class extends React.Component {
  //함수로 만들고 객체형태로 리턴하고싶으면 () 감싸야함
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => (
      <SearchBar
        value={navigation.getParam('query', '')}
        onChange={navigation.getParam('onChange', () => null)}
        onSubmit={navigation.getParam('onSubmit', () => null)}
      />
    )
  });
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      query: '',
      shouldFetch: false
    };
    navigation.setParams({
      query: this.state.query,
      onChange: this.onChange,
      onSubmit: this.onSubmit
    });
  }

  onSubmit = () => {
    this.setState({ shouldFetch: true });
  };
  onChange = text => {
    const { navigation } = this.props;
    //text를 query에 저장해야함 나중에 검색쿼리에 query사용
    //state도 갱신하고, navigation의 params도 갱신
    this.setState({ query: text, shouldFetch: false });
    navigation.setParams({
      query: text
    });
  };
  render() {
    const { query, shouldFetch } = this.state;
    return <SearchPresenter query={query} shouldFetch={shouldFetch} />;
  }
}
