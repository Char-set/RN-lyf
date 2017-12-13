import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    WebView,
} from 'react-native';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import {commonStyle} from '../styles';//样式文件引入
import Config from '../config/Default';//默认配置
const {width,height} = Dimensions.get('window');
export default class WebViewContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      url:''
    }
  }
  componentDidMount () {
    console.log('---------componentDidMount----------');
    console.log(this.props)
    this.setState({
      url:this.props.params?this.props.params.webUrl:'',
    })
  }
  _appLinkRouter(key){
    switch (key){
      case 'login':
          // this.props.navigation.navigate('LoginView')
          break;
      default:
          return;
    }
  }
  _shouGoNext(event){
    console.log(event);
    let url = event.url;
    if(url.includes(Config.appName + '://')){
      this._appLinkRouter(url.substring(url.indexOf("//") + 2));
    }
  }
  _shouldLoad(event){
    let url = event.url;
    if(url.includes(Config.appName + '://')){
      return false;
    } else{
      return 'YES';
    }
  }
  _loadStart(event){
    return true;
  }
  render(){
    // console.log(this.props.navigation.state.params.webUrl)
    var url = this.props.params?this.props.params.webUrl:'http://m.laiyifen.com/category.html';
    if(!this.state.url){
      return (
        <View style = {[styles.container,commonStyle.container,isIphoneX()?commonStyle.pdT45:'']}>
          <Text>无效页面</Text>
        </View>
      )
    }
    return(
      <View style = {[styles.container,commonStyle.container,isIphoneX()?commonStyle.pdT45:'']}>
        <WebView 
        style = {styles.webViewStyle}
        source = {{url:this.state.url,method:"GET"}}
        javaScriptEnabled = {true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        onNavigationStateChange={(event) => {
          this._shouGoNext(event);
        }}
        onLoadStart={(event) => {
          this._loadStart(event)
        }}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:20
  },
  webViewStyle:{
    width:width,
    height:height - 20,
    backgroundColor:"#b2b2b2"
  }
})