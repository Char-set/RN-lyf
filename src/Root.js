import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Image, DeviceEventEmitter} from 'react-native';
import { TabNavigator, StackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
/**
 * 场景文件引入
 */
import Index from './page/Index';
import My from './page/My';
import Category from './page/Category'
import Search from './page/Search';
import Cart from './page/Cart';
import WebViewContent from './component/WebViewContent'
import LoginCompoent from './component/Login'
import Detail from './page/Details';
import LoginWithCaptcha from './page/LoginWithCaptcha';
import SetPosition from './page/SetPosition';

const IndexScreen = ({ navigation }) => (
  <Index banner="Home Tab" navigation={navigation} />
);
const WebViewScreen = ({ navigation}) => (
  <WebViewContent params={navigation.state.params} navigation={navigation} />
)
const SearchViewScreen = ({ navigation}) => (
  <Search params={navigation.state.params} navigation={navigation} />
)
const DetailViewScreen = ({ navigation}) => (
  <Detail params={navigation.state.params} navigation={navigation} />
)
const LoginViewScreen = ({ navigation}) => (
  <LoginCompoent navigation={navigation} />
)

const FindScreen = ({ navigation }) => (
  <WebViewContent params={{webUrl:'http://m.laiyifen.com/view/h5/30.html'}} navigation={navigation} />
);
FindScreen.navigationOptions = {
  tabBarLabel: '全球尖货',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    // source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_-btn_discover_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_-btn_discover_s@2x.png'}} 
    source={focused?require('./images/home_nav_-btn_discover_s.png'):require('./images/home_nav_-btn_discover_n.png')}
    style={{height:25,width:25}}/>
  ),
};
const CateScreen = ({ navigation }) => (
  <Category banner="Home Tab" navigation={navigation} />
);
CateScreen.navigationOptions = {
  tabBarLabel: '分类',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    // source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_classification_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_classification_s@2x.png'}} 
    source={focused?require('./images/home_nav_btn_classification_s.png'):require('./images/home_nav_btn_classification_n.png')}
    style={{height:25,width:25}}/>
  ),
};
const CartScreen = ({ navigation }) => (
  // <Search params={navigation.state.params} navigation={navigation} />
  <Cart navigation={navigation} />
);
CartScreen.navigationOptions = {
  tabBarLabel: '购物车',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    // source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_shopping_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_shopping_s@2x.png'}} 
    source={focused?require('./images/home_nav_btn_shopping_s.png'):require('./images/home_nav_btn_shopping_n.png')}
    style={{height:25,width:25}}/>
  ),
  tabBarOnPress:(item) => {
    if(item.scene.focused) return;
    item.jumpToIndex(item.scene.index);    
    DeviceEventEmitter.emit('updateCartScreen');
  }
};
const MyScreen = ({ navigation }) => (
  <My banner="Home Tab" navigation={navigation} />
);
MyScreen.navigationOptions = {
  tabBarLabel: '我',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    // source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_my_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_my_s@2x.png'}} 
    source={focused?require('./images/home_nav_btn_my_s.png'):require('./images/home_nav_btn_my_n.png')}
    style={{height:25,width:25}}/>
  ),
};


IndexScreen.navigationOptions = {
  tabBarLabel: '首页',
  tabBarIcon: ({ tintColor, focused }) => (
    <Image 
    // source={{uri:!focused?'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_home_n@2x.png':'http://ojc83pmmg.bkt.clouddn.com/home_nav_btn_home_s@2x.png'}} 
    source={focused?require('./images/home_nav_btn_home_s.png'):require('./images/home_nav_btn_home_n.png')}
    style={{height:25,width:25}}/>
  ),
  tabBarOnPress:(item) => {
    console.log(1111111,item);
    item.jumpToIndex(item.scene.index);    
  }
};

const mainTab = TabNavigator(
  {
    Index: {
      screen: IndexScreen,
      path: 'Index',
    },
    Category: {
      screen: CateScreen,
      path: 'Category',
    },
    All: {
      screen: FindScreen,
      path: 'All',
    },
    Cart: {
      screen: CartScreen,
      path: 'Cart',
    },
    Mine: {
      screen: MyScreen,
      path: 'Mine',
    }
  },
  {
    lazy:false,
    initialRouteName:'Category',
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? '#ff6900' : '#fff',
      inactiveTintColor:'#333',
      // activeBackgroundColor:'red',
      style:{
        backgroundColor:'#fff',
      },
      labelStyle:{
        fontSize:12
      }
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
    SearchView:{
      screen:SearchViewScreen,
      navigationOptions: {
        title:'搜索页',
        header:null
      }
    },
    DetailView:{
      screen:DetailViewScreen,
      navigationOptions: {
        title:'详情页',
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
    },
    CartView:{
      screen:CartScreen,
      navigationOptions: {
        title:'购物车页面',
        header:null
      }
    },
    LoginWithCaptchaView:{
      screen:LoginWithCaptcha,
      navigationOptions: {
        title:'登录页面',
        header:null
      }
    },
    SetPositionView:{
      screen:SetPosition,
      navigationOptions: {
        title:'定位',
        header:null
      }
    }
  },
  {
    // mode: Platform.OS === 'ios' ? 'modal' : 'card',
    // initialRouteName:'SetPositionView'
  }
)
const styles = StyleSheet.create({
  icon:{
    height:25,
    width:25
  }
})
const defaultGetStateForAction = App.router.getStateForAction;
App.router.getStateForAction = (action, state) => {
    // goBack返回指定页面
    if (state && action.type === 'Navigation/BACK' && action.key) {
        const backRoute = state.routes.find((route) => route.routeName === action.key);
        if (backRoute) {
            const backRouteIndex = state.routes.indexOf(backRoute);
            const purposeState = {
                ...state,
                routes: state.routes.slice(0, backRouteIndex + 1),
                index: backRouteIndex,
            };
            return purposeState;
        }
    }
    return defaultGetStateForAction(action, state)
};
// export default App;
function select(store){
  return {
      isLoggedIn: store.userStore.isLoggedIn,
      user: store.userStore.user,
      status: store.userStore.status,
  }
}

export default connect(select)(App);