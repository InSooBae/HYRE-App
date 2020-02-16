import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import SelectPhoto from '../screens/Photo/SelectPhoto';
import TakePhoto from '../screens/Photo/TakePhoto';
import UploadPhoto from '../screens/Photo/UploadPhoto';
import styles from '../styles';
import { stackStyles } from './config';

const PhotoTabs = createMaterialTopTabNavigator(
  {
    Select: {
      screen: SelectPhoto,
      navigationOptions: {
        title: '사진 선택'
      }
    },
    Take: {
      screen: TakePhoto,
      navigationOptions: {
        title: '사진 찍기'
      }
    }
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: styles.blackColor,
        marginBottom: 20
      },
      labelStyle: {
        color: styles.blackColor,
        fontWeight: '600'
      },
      style: {
        paddingBottom: 20,
        ...stackStyles
      }
    }
  }
);

//stack navigator는 header를 갖고있음 이게 안쪽 navigation header
export default createStackNavigator(
  {
    Tabs: {
      screen: PhotoTabs,
      navigationOptions: {
        headerTitle: '사진 업로드'
      }
    },
    Upload: {
      screen: UploadPhoto,
      navigationOptions: {
        headerTitle: '회원가입'
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      },
      headerTintColor: styles.blackColor
    }
  }
);
