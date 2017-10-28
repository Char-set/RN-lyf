import React, { Component } from 'react';
import {
  Image
} from 'react-native';
import {StackNavigator,TabNavigator,DrawerNavigator} from 'react-navigation';
/*
 * 场景文件引入
 */
//首页
import Index from '../page/Index';
//我
import My from '../page/My';


const Navs = StackNavigator({
  Index:{
    screen:Index,
    navigationOptions: ({navigation}) => ({
      title: '首页',
      header:null
    }), 
  },
  My:{
    screen:My,
    navigationOptions: ({navigation}) => ({
      title: '我',
      header:null
    }),  
  }
},{
  initialRouteName: 'Index', // 默认显示界面
  mode:'modal',
});

export default Navs;