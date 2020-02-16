import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import PhotoNavigation from './PhotoNavigation';
import AuthNavigation from './AuthNavigation';
import { stackStyles } from './config';

const AuthMainNavigation = createStackNavigator(
  {
    AuthNavigation,
    PhotoNavigation
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      }
    },
    headerMode: 'none',
    mode: 'modal'
  }
);

export default createAppContainer(AuthMainNavigation);
