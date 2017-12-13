import React, { Component } from 'react';
import Toast from 'react-native-root-toast';
export default class CommonUtils extends React.Component{
   /**
    * 路由跳转
    * @param {*} navigator 路由
    * @param {*} config 配置
    */
   static jumpPage(navigator,config){
     navigator.push(config);
   }

   /**
    * toast提示
    * toast提示
    */
    static showTips(message){
      if(!message || typeof message != 'string') return;
      toast = null;
      this.toast && this.toast.destroy();
      this.toast = Toast.show(message, {
        duration: 1200,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        onShow: () => {
            // calls on toast\`s appear animation start
        },
        onShown: () => {
            // calls on toast\`s appear animation end.
        },
        onHide: () => {
            // calls on toast\`s hide animation start.
        },
        onHidden: () => {
            // calls on toast\`s hide animation end.
            this.toast.destroy();
            this.toast = null;
        }
      });
    }
}