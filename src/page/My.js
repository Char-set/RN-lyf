/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import {userStyle} from '../styles';//样式文件引入
import { user_logIn, user_logOut } from '../actions/user';

/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import Config from '../config/Default';//默认配置
import Css from '../common/Style';//通用样式
/*
 * 自定义组件引入
 */


class my extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo:{},
      hasLogin:false,
      ut:'',
      bean:0,
      orderStatus: [{imgUrl:require('../images/myOrderPayments.png'),title:'待付款',num:0},
      {imgUrl:require('../images/myOrderShippeds.png'),title:'待发货',num:0},
      {imgUrl:require('../images/myOrderReceipts.png'),title:'待收货',num:0},
      {imgUrl:require('../images/myOrderEvaluateds.png'),title:'待评价',num:0},
      {imgUrl:require('../images/myOrderReturns.png'),title:'退换货',num:0},],
      wallet:[{title:'悠点卡',num:'0'},{title:'伊点卡',num:'- -'},
              {title:'积分',num:'- -'},{title:'优惠券',num:'- -'},]
    }
    console.log(this.props)
  }
  _loginOut () {
    this.props.dispatch(user_logOut());
  }
  _getUserInfo () {
    let url = Config.apiHost + '/api/my/user/info';
    let params = {
      ut:this.state.ut,
      companyId:Config.companyId,
      cash:new Date().getTime()
    }
    NetUtil.get(url,params,(res) => {
      if(res.data){
        this.setState({
          userInfo:res.data,
          hasLogin:true
        })
      }
    })
  }
  //组件将要被加载
  componentWillMount() {
    console.log('---------componentWillMount----------');
    // this.setState({
    //   userInfo:this.props.user,
    //   hasLogin:this.props.isLoggedIn
    // })
  }
  //组件更新
  componentWillReceiveProps(nextProps) {
      console.log('---------componentWillReceiveProps----------');
      // this.props = nextProps;
      if(nextProps.isLoggedIn){
        this.setState({
          hasLogin:nextProps.isLoggedIn,
          ut:nextProps.ut
        },() => {
          this._init();
        });
      } else{
        this.setState({
          hasLogin:nextProps.isLoggedIn,
          ut:''
        })
      }
  }
  //组件是否需要更新
  shouldComponentUpdate(nextProps, nextState){
    return true;
  }
  //组件将要更新
  componentWillUpdate() {
      console.log('---------componentWillUpdate----------');
  }
  //组件已经更新
  componentDidUpdate() {
      console.log('---------componentDidUpdate----------');
  }
  //组件呗卸载
  componentWillUnmount() {
      console.log('---------componentWillUnmount----------');
  }
  componentDidMount () {
    console.log('---------componentDidMount----------')
    this.setState({
      hasLogin:this.props.isLoggedIn,
      ut:this.props.ut
    },() => {
      this._init();
    })
  }
  _getOrderStatus() {
    let url = Config.apiHost + '/api/my/order/summary';
    let params = {
      ut:this.state.ut
    }
    NetUtil.get(url,params,(res) => {
      if(res.data){
        this.setState({
          orderStatus:[
            {imgUrl:require('../images/myOrderPayments.png'),title:'待付款',num:res.data.unpay},
            {imgUrl:require('../images/myOrderShippeds.png'),title:'待发货',num:res.data.undelivery},
            {imgUrl:require('../images/myOrderReceipts.png'),title:'待收货',num:res.data.unreceive},
            {imgUrl:require('../images/myOrderEvaluateds.png'),title:'待评价',num:res.data.unEvaluate},
            {imgUrl:require('../images/myOrderReturns.png'),title:'退换货',num:res.data.isAfter},
          ]
        })
      }
    })
  }
  _getWallet() {
    let url = Config.apiHost + '/api/my/wallet/summary';
    let params = {
      ut:this.state.ut,
      isECard:1,
      isYCard:1,
      isBean:1,
      isCoupon:1,
      isPoint:1
    }
    NetUtil.get(url,params,(res) => {
      if(res.data){
        this.setState({
          wallet:[{title:'悠点卡',num:res.data.yCardBalance},{title:'伊点卡',num:res.data.eCardBalance},
          {title:'积分',num:res.data.point},{title:'优惠券',num:res.data.coupon}],
          bean:res.data.yBean
        })
      }
    })
  }
  _init(){
    if(this.state.hasLogin){
      this._getUserInfo();
      this._getWallet();
      this._getOrderStatus();    
    }
  }
  _renderLoginTab() {
    if(!this.state.hasLogin){
      return(
        <View style={userStyle.loginBtn}>
          <Text onPress={() => this.props.navigation.navigate('LoginView')} style={userStyle.loginBtnText}>登录</Text>
          <Text style={userStyle.loginBtnText}>/</Text>
          <Text style={userStyle.loginBtnText}>注册</Text>
        </View>
      )
    } else{
      return (
        <View style={userStyle.loginBtn}>
          <Text style={userStyle.loginBtnText}>{this.state.userInfo.nickname}</Text>
        </View>
      )
    }
  }
  _renderMyOrder(){
    return this.state.orderStatus.map((item,index) => {
      return (
        <View style={userStyle.panelContentLi} key={index}>
          <Image style={userStyle.panelContentLiIcon} source={item.imgUrl} />
          <Text style={userStyle.panelContentLiText}>{item.title}</Text>
          {this.state.hasLogin&&item.num>0?(<View style={userStyle.panelContentLiTips}>
            <Text style={userStyle.panelContentLiTipsText}>{item.num}</Text>
          </View>):(<View style={userStyle.panelContentLiTips}></View>)}
        </View>
      )
    })
  }
  _renderMyWallet(){
    return this.state.wallet.map((item,index) => {
      return (
        <View style={userStyle.panelContentLi} key={index}>
          <Text style={userStyle.panelContentLiAccounts}>{this.state.hasLogin?item.num:'- -'}</Text>
          <Text style={userStyle.panelContentLiText}>{item.title}</Text>
        </View>
      )
    })
  }
  render() {
    return(
      <ScrollView style = {userStyle.container}>
        <LinearGradient colors={['#ffb300','#ff6c00']} style={userStyle.myInfo}>
          <View style={userStyle.loginStatus}>
            <View style={userStyle.loginStatusLi}>
              <View style={userStyle.loginStatusLiSpan}>
                <Text style={userStyle.loginStatusLiSpanText}>
                  {this.state.hasLogin?this.state.userInfo.userLevlName:'- -'}
                </Text>
              </View>
              <Text style={userStyle.loginStatusLiText}>会员等级</Text>
            </View>
            <View style={userStyle.loginStatusLi}>
              <Image source={!this.state.hasLogin?require('../images/1.jpg'):{uri:this.state.userInfo.url60x60}} style={userStyle.loginStatusLiImg} />
            </View>
            <View style={userStyle.loginStatusLi}>
              <View style={userStyle.loginStatusLiSpan}>
                <Text style={userStyle.loginStatusLiSpanText}>
                  {this.state.hasLogin?this.state.bean:'- -'}
                </Text>
              </View>
              <Text style={userStyle.loginStatusLiText}>伊豆</Text>
            </View>
          </View>
          {this._renderLoginTab()}
          <View style={styles.loginOut}>
            <Text onPress={() => {
              this._loginOut();
            }}>退出</Text>
          </View>
        </LinearGradient>
        <View style={userStyle.panel}>
            <View style={userStyle.panelInclude}>
              <Image style={userStyle.panelIcon} source={require('../images/my-order-all.png')} />
              <Text style={userStyle.panelText}>我的订单</Text>
              <Text style={userStyle.panelTips}>全部</Text>
              <Image style={userStyle.panelTipsImg} source={require('../images/myOrderNexts.png')} />
            </View>
        </View>
        <View style={userStyle.panelContent}>
            {this._renderMyOrder()}
        </View>
        <View style={userStyle.panel}>
            <View style={userStyle.panelInclude}>
              <Image style={userStyle.panelIcon} source={require('../images/my_purse.png')} />
              <Text style={userStyle.panelText}>我的钱包</Text>
              <Text style={userStyle.panelTips}>查看全部</Text>
              <Image style={userStyle.panelTipsImg} source={require('../images/myOrderNexts.png')} />
            </View>
        </View>
        <View style={userStyle.panelContent}>
            {this._renderMyWallet()}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff',
    paddingBottom:44,
    height:'100%',
    // justifyContent:'center',
    // alignItems:'center'
  },
  myInfo:{
    // backgroundColor:'-webkit-linear-gradient(top,#ffb300,#ff6c00)'
    height:180,
    paddingTop:20,
    width:'100%',
  },
  // headPicUrl:{
  //   height:40,
  //   width:40
  // },
  loginOut:{
    position:'absolute',
    top:30,
    right:0,
    backgroundColor: "transparent"
  }
});
function select(store){
  return {
      isLoggedIn: store.userStore.isLoggedIn,
      user: store.userStore.user,
      status: store.userStore.status,
      ut: store.userStore.ut,
  }
}


export default connect(select)(my);