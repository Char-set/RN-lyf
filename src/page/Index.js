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
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import Config from '../config/Default';//默认配置
/*
 * 自定义组件引入
 */
import HelloComponent from '../component/helloComponent';
import Footer from '../component/footer';
import Carousel from '../component/Carousel'
import ChannelItem from '../component/ChannelItem'

import {commonStyle} from '../styles';//样式文件引入

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray:[],
      channel:[]
    }
  }
  componentDidMount () {
    this.getImagesData();
  }
  getImagesData(){
    // var url = Config.apiHost + '/mockData/images.json';
    var url = Config.apiHost + '/api/dolphin/list'
    var params = {
      platform:2,
      pageCode:"H5_HOME",
      adCode:'ad_banner,searchword,ad_channel,float_tail',
      companyId:30,
      areaCode:310101
    };
    NetUtil.get(url,params,(res) => {
      if(res.data && res.data.ad_banner){
        this.setState({
          imagesArray:res.data.ad_banner,
          channel:res.data.ad_channel
        })
      }
    });
  }
  render() {
    var channelArray = [];
    this.state.channel.forEach((item,index) => {
      channelArray.push(<ChannelItem key={index} navigation={this.props.navigation} item={item}/>);
    })
    return (
      <ScrollView style = {[commonStyle.container,isIphoneX()?commonStyle.pdT45:'']}>
          <View>
            <Carousel navigation={this.props.navigation} images={this.state.imagesArray} /> 
          </View>
          <View style={styles.channelContent} >
            {channelArray}
          </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor:'#fff',
  //   paddingTop:20,
  //   paddingBottom:44,
  //   height:'100%'
  // },
  carousel:{
    height:150,
    width:Dimensions.get('window').width
  },
  icon:{
    height:150,
    width:150,
    color:"#b2b2b2"
  },
  channelContent:{
    flexDirection:'row',
    flexWrap:'wrap'
  }
});
