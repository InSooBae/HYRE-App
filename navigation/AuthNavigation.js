import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignUp from '../screens/Auth/SignUp';
import Confirm from '../screens/Auth/Confirm';
import Login from '../screens/Auth/Login';
import AuthHome from '../screens/Auth/AuthHome';

//When the User is logged out
// Navigator를 react component처럼 render하고싶으면 createAppContainer가 필수
// 위의 순서대로 실행
// Navigator는 기본으로 모든 navigator에 있는 route를 가짐 그리고 그 route에 prop을 줄거임
/*
 react router처럼 location이나 match path같은 prop들을 react router처럼 authHome이 stacknavigator안에 있는 route 이기떄문에
prop을 보낼수있음 결론 navigator similar like react router
navigation.navigate('Login') 여기서 이름이 다르면 못찾음 
SignMeUp: {
  screen:SignUp
}
*/

const AuthNavigation = createStackNavigator(
  {
    AuthHome,
    SignUp,
    Login,
    Confirm
  },
  {
    headerMode: 'none'
  }
);

export default createAppContainer(AuthNavigation);
