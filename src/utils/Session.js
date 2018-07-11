import React, { Component } from 'react';
import Cookie from './Cookies';
export default class Session {
    //用户的session id 名称
    static sidName = "sessionId"

    //获取用户session id， 如果没有生成一个。
    static getSessionId () {
        let _this = this;
        return new Promise(function(resolve,reject) {
            Cookie.getAllCookie(_this.sidName).then(sid => {
                if (!sid) {
                    let now = new Date();
                    //随机数字
                    let randNum = Math.round(Math.random() * 1000);
                    sid = now.getTime() + "" + randNum;
                    Cookie.setCookie(_this.sidName, sid);
                }
                resolve(sid);
            });
        })
        
    }
    //删除session id
    deleteSessionId () {
        Cookie.delCookie(this.sidName);
    }
}