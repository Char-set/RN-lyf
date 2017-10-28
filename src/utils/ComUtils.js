/**
 * NetUtil 网络请求的实现
 * https://github.com/facebook/react-native
 */
import React, { Component } from 'react';

export default class CommonUtils extends React.Component{
   /**
    * 路由跳转
    * @param {*} navigator 路由
    * @param {*} config 配置
    */
   static jumpPage(navigator,config){
     navigator.push(config);
   }
}