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
  Image,
  TouchableWithoutFeedback,
  TextInput,
  DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import {commonStyle,loginStyle} from '../styles';//样式文件引入

const s = loginStyle.loginWithCaptcha;
/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import Config from '../config/Default';//默认配置
import Css from '../common/Style';//通用样式
import Utils from '../utils/ComUtils';
import Session from '../utils/Session';
/*
 * 自定义组件引入
 */
import Header from '../component/Header';
import GuessComponent from '../component/Guess';
import Loading from '../component/Loading';
// import { setInterval } from 'timers';

/**
 * action引入
 */
import {user_captcha_logIn} from '../actions/user';

const mobileRegexp = /^[0-9]{11}$/;
const captchaRegexp = /^[0-9]{6}$/;

const styles = StyleSheet.create({
    percent: {
        width:'100%'
    },
    h100:{
        height:'100%'
    }
});

class loginWithCaptcha extends Component {
    constructor(props){
        super(props);
        this.state = {
          sendText:'获取验证码',
          mobile:'',//账户
          captcha:'',//验证码
          loginDis:true,//登录按钮禁用
          sendDis:true,//发送验证吗按钮禁用
          watiTime:60,//短信验证码发送间隔
          isSending:false,//验证码冷却中
        }
    }
  //组件将要被加载
  componentWillMount() {
    console.log('---------componentWillMount----------');
  }
  //组件更新
  componentWillReceiveProps(nextProps) {
      
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
    
    // alert(s)
  }
  _mobileChange = (mobile) => {
    let flag = mobileRegexp.test(mobile);
    this.setState({
      mobile:mobile,
      sendDis:!flag
    });
  }
  _captchaChange = (captcha) => {
    let flag = captchaRegexp.test(captcha);
    this.setState({
      captcha:captcha,
      loginDis:!(this.state.sendDis || flag)
    });
  }
  _sendCaptcha = () => {
    if(this.state.sendDis || this.state.isSending) return;
    let url = '/ouser-web/mobileRegister/sendCaptchasCodeFormNew.do';
    let params = {
      mobile:Utils.CryptoJSMobile(this.state.mobile),
      captchasType:3,
      platformId:Config.platformId
    };
    this.setState({
      sendText:this.state.watiTime + 's',
      isSending:true
    });
    let timeInterval = setInterval(() => {
      let nextTime = this.state.watiTime - 1;
      this.setState({
        watiTime:nextTime,
        sendText:this.state.watiTime + 's'
      },() => {
        if(this.state.watiTime == 0){
          this.setState({
            sendText:'重新获取',
            watiTime:60,
            isSending:false
          });
          clearInterval(timeInterval);
        }
      });
    },1000);
    NetUtil.postForm(url,params,res => {
      Utils.showTips('验证码发送成功');
    },(res) => {
      Utils.showTips(res.message || '验证码发送失败');
      this.setState({
        sendText:'重新获取',
        watiTime:60,
        isSending:false
      });
      clearInterval(timeInterval);
    });
  }
  _login = () => {
    this.props.dispatch({'type': 'LOGGED_IN', user: {},ut:''});
    if(this.state.loginDis) return;
    let url = '/ouser-web/mobileLogin/loginForm.do';
    let params = {
      mobile:Utils.CryptoJSMobile(this.state.mobile),
      captchas:this.state.captcha,
      platformId:Config.platformId,
      companyId:Config.companyId
    };
    NetUtil.postForm(url,params,res => {
      this.props.dispatch({'type': 'LOGGED_IN', user: res.data,ut:res.ut});
      Utils.showTips('登录成功');
      this.props.navigation.goBack();
    });
  }
  render() {
    return(
      <View style={[commonStyle.container,isIphoneX()?commonStyle.pdT45:'',commonStyle.bgf]}>
        <Header title="登录" backType="2" navigation={this.props.navigation}  />
        <View style={[s.login,s.bgededed]}>
          <View style={s.loginItem}>
            <Text style={s.loginItemText}>账户</Text>
            <TextInput keyboardType="numeric" defaultValue="17319326086" style={s.loginItemInput} onChangeText={(text) => this._mobileChange(text)} placeholder="请输入您的手机号码"/>
          </View>
          <View style={s.loginItem}>
            <Text style={s.loginItemText}>验证码</Text>
            <TextInput keyboardType="numeric" onChangeText={(text) => this._captchaChange(text)} style={s.loginItemCaptchaInput} placeholder="输入验证码" />
            <TouchableWithoutFeedback onPress={() => this._sendCaptcha()}>
              <View style={[s.loginItemSend,this.state.sendDis?s.loginItemSendDis:'']}>
                <Text style={[s.loginItemSendText,this.state.sendDis?s.loginItemSendTextDis:'']}>{this.state.sendText}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback onPress={() => this._login()}>
            <View style={[s.loginConfirm,this.state.loginDis?s.loginConfirmDis:'']}>
              <Text style={[s.loginConfirmText,this.state.loginDis?s.loginConfirmTextDis:'']}>登录</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}
function select(store){
  return {
      isLoggedIn: store.userStore.isLoggedIn,
      user: store.userStore.user,
      status: store.userStore.status,
      ut: store.userStore.ut,
  }
}


export default connect(select)(loginWithCaptcha);