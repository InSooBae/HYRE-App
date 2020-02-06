import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import SelectPhoto from '../screens/Photo/SelectPhoto';
import TakePhoto from '../screens/Photo/TakePhoto';
import UploadPhoto from '../screens/Photo/UploadPhoto';

const PhotoTabs = createMaterialTopTabNavigator(
  {
    SelectPhoto,
    TakePhoto
  },
  {
    tabBarPosition: 'bottom'
  }
);

//stack navigator는 header를 갖고있음 이게 안쪽 navigation header
export default createStackNavigator({
  PhotoTabs,
  UploadPhoto
});
