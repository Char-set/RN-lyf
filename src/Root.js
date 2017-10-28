import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Image } from 'react-native';
import { TabNavigator, StackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
/**
 * 场景文件引入
 */
import Index from './page/Index';
import My from './page/My';
import Category from './page/Category'
import WebViewContent from './component/WebViewContent'
import LoginCompoent from './component/Login'
 

const IndexScreen = ({ navigation }) => (
  <Index banner="Home Tab" navigation={navigation} />
);
const WebViewScreen = ({ navigation}) => (
  <WebViewContent params={navigation.state.params} navigation={navigation} />
)
const LoginViewScreen = ({ navigation}) => (
  <LoginCompoent navigation={navigation} />
)

const FindScreen = ({ navigation }) => (
  <Category banner="Home Tab" navigation={navigation} />
);
FindScreen.navigationOptions = {
  tabBarLabel: '',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_-btn_discover_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_-btn_discover_s@2x.png'}} 
    style={{height:25,width:25}}/>
  ),
};
const CateScreen = ({ navigation }) => (
  <Category banner="Home Tab" navigation={navigation} />
);
CateScreen.navigationOptions = {
  tabBarLabel: '',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_classification_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_classification_s@2x.png'}} 
    style={{height:25,width:25}}/>
  ),
};
const CartScreen = ({ navigation }) => (
  <Category banner="Home Tab" navigation={navigation} />
);
CartScreen.navigationOptions = {
  tabBarLabel: '',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_shopping_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_shopping_s@2x.png'}} 
    style={{height:25,width:25}}/>
  ),
};
const MyScreen = ({ navigation }) => (
  <My banner="Home Tab" navigation={navigation} />
);
MyScreen.navigationOptions = {
  tabBarLabel: '',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_my_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_my_s@2x.png'}} 
    style={{height:25,width:25}}/>
  ),
};


IndexScreen.navigationOptions = {
  tabBarLabel: '',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_home_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_home_s@2x.png'}} 
    style={{height:25,width:25}}/>
  ),
};

const mainTab = TabNavigator(
  {
    "首页": {
      screen: IndexScreen,
      path: '',
    },
    "分类": {
      screen: CateScreen,
      path: 'My',
    },
    "全球尖货": {
      screen: FindScreen,
      path: 'My',
    },
    "购物车": {
      screen: CartScreen,
      path: 'My',
    },
    "我": {
      screen: MyScreen,
      path: 'My',
    }
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? '#ff6900' : '#fff',
      inactiveTintColor:'#333',
      // activeBackgroundColor:'red',
      style:{
        backgroundColor:'#fff',
      },
      // labelStyle:{
      //   color:"#333"
      // }
    },
  }
);
const App = StackNavigator(
  {
    IndexView:{
      screen:mainTab,
      path:'/',
      navigationOptions: {
        title:' ',
        header:null,
        headerMode:'none'
      }
    },
    WebView:{
      screen:WebViewScreen,
      navigationOptions: {
        title:'首页',
        header:null
      }
    },
    LoginView:{
      screen:LoginViewScreen,
      navigationOptions:{
        title:'登录',
        // header:null,
        // headerBackTitle:"ds"
      }
    }
  },
  {
    // mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }
)
const styles = StyleSheet.create({
  icon:{
    height:25,
    width:25
  }
})

// export default App;
function select(store){
  return {
      isLoggedIn: store.userStore.isLoggedIn,
      user: store.userStore.user,
      status: store.userStore.status,
  }
}

export default connect(select)(App);