import CookieManager from 'react-native-cookies';
import React, { Component } from 'react';

import Config from '../config/Default';//默认配置
import Dates from './TimeFormat';//格式化时间

export default class Cookies extends React.Component {
    /*
     * setCookie
     * name 名称
     * value 值
     * 有效期，天，默认一年
     * sucCallback 成功回调
     **/
    static setCookie(name,value,time,sucCallback) {
        var exp = new Date();
        exp.setTime(exp.getTime() + (time?time:365) * 24 * 60 * 60 * 1000);
        exps = exp.getTime() + (time?time:365) * 24 * 60 * 60 * 1000;
        CookieManager.set({
            name: name,
            value: value,
            domain: Config.apiHost,
            origin: Config.apiHost,
            path: '/',
            version: '1',
            expiration: Dates.dateformat(exps,'yyyy-MM-ddThh:mm:ss') + '.00-05:00'
            // expiration: '2018-05-30T12:30:00.00-05:00'
          }).then((res) => {
            return new Promise(function(resolve,reject){
                resolve(res)
            });
          });
    }
    /**
     * getCokie
     * name 名称
     * sucCallback 成功回调
     */
    static getCookie (name,sucCallback) {
        CookieManager.get(Config.domain)
        .then((res) => {
            if(typeof sucCallback == 'function') {
                if(name){
                    sucCallback(res[name])
                } else{
                    sucCallback(res)
                }
            }
        });
    }
    /**
     * getCokie
     * name 名称
     * sucCallback 成功回调
     */
    // static getAllCookie (name,sucCallback) {
    //     CookieManager.getAll()
    //     .then((res) => {
    //         if(typeof sucCallback == 'function') {
    //             if(name && res[name]){
    //                 sucCallback(res[name].value)
    //             } else{
    //                 sucCallback(res)
    //             }
    //         }
    //     });
    // }
    static getAllCookie (name,sucCallback) {
        return new Promise(function(resolve,reject){
            CookieManager.getAll()
            .then((res) => {
                // if(typeof sucCallback == 'function') {
                //     if(name && res[name]){
                //         sucCallback(res[name].value)
                //     } else{
                //         sucCallback(res)
                //     }
                // }
                if(name && res[name]){
                    resolve(res[name].value);
                }
            });
        })
    }
    /**
     * delCookie
     * name 名称
     * sucCallback 成功回调
     */
    static delCookie (name,sucCallback) {
        return new Promise(function(resolve,reject){
            CookieManager.clearByName(name)
            .then((res) => {
                // if(typeof sucCallback == 'function') {
                //     sucCallback(res)
                // }
                resolve(res);
            });
        });
    }
}