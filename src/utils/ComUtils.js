import React, { Component } from 'react';
import Toast from 'react-native-root-toast';
import NetUtil from './NetUtil';
import Config from '../config/Default';
import CryptoJS from 'crypto-js/crypto-js';
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

    static filterPrice(value,_currency,decimals){
        var digitsRE = /(\d{3})(?=\d)/g;
        value = parseFloat(value);
        if (!isFinite(value) || !value && value !== 0) return '';
        _currency = _currency != null ? _currency : '$';
        decimals = decimals != null ? decimals : 2;
        var stringified = Math.abs(value).toFixed(decimals);
        var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
        var i = _int.length % 3;
        var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
        var _float = decimals ? stringified.slice(-1 - decimals) : '';
        var sign = value < 0 ? '-' : '';
        return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
    }
    static filterProBg(common,type){
        var className = '';
        switch(type) {
            case 1:
                className = common.bgff3939;
                break;
            case 7:
                className = common.bgd9c62a;
                break;
            case 8:
                className = common.bgfe2b2b;
                break;
            case 1002:
            case 1004:
                className = common.bg9d9afe;
                break;
            case 1001:
            case 1003:
                className = common.bgb3be07;
                break;
            case 1005:
            case 1006:
                className = common.bge9a5a5;
                break;
            case 1012:
                className = common.bg9ba0fe;
                break;
            case 1013:
                className = common.bgd1cf14;
                break;
            case 1014:
            case 1015:
                className = common.bg7279f9;
                break;
            case 1016:
            case 1017:
                className = common.bge18b66;
                break;
            case 1018:
            case 1019:
                className = common.bgb9be67;
                break;
            case 1022:
                className = common.bgff6900;
                break;
            case 2001:
                className = common.bgff6900;
                break;
            case 2002:
                className = common.bgff6900;
                break;
            case 3001:
                className = common.bgff6900;
                break;
            default:
        }
        return className;
    }
    /**
     * 日期格式化
     * 例{ Utils.filterDate(item.time,'yyyy-MM-dd hh:mm:ss w') } 返回 2016-11-16 14:40:25 周三
     */
    static filterDate(value, fmt){
        function format(value, fmt) {
            var date = new Date(value);
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "w+": date.getDay(), //星期
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if(k === 'w+') {
                    if(o[k] === 0) {
                        fmt = fmt.replace('w', '周日');
                    }else if(o[k] === 1) {
                        fmt = fmt.replace('w', '周一');
                    }else if(o[k] === 2) {
                        fmt = fmt.replace('w', '周二');
                    }else if(o[k] === 3) {
                        fmt = fmt.replace('w', '周三');
                    }else if(o[k] === 4) {
                        fmt = fmt.replace('w', '周四');
                    }else if(o[k] === 5) {
                        fmt = fmt.replace('w', '周五');
                    }else if(o[k] === 6) {
                        fmt = fmt.replace('w', '周六');
                    }
                }else if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
        if(value) {
            value = format(value, fmt);
        }
        return value;
    }
    /**
     * 获取商品实时价格
     * @param mpIds String
     * @param mpArr Arr
     * @param promotionId 促销活动id
     * @param callBack function 
     */
    static getPriceAndStock(mpIds,mpArr,promotionId,callBack){
        if((mpIds.length || '').length == 0) return;
        let url = '/api/realTime/getPriceStockList';
        let params = {
            mpIds: mpIds,
            promotionId: promotionId || ''
        }
        NetUtil.get(url,params,res => {
            var plistMap={};
            for(let pl of res.data.plist||[]){
                plistMap[pl.mpId]=pl;
            }
            for(let pl of mpArr||[]){
                if(plistMap[pl.mpId]){
                    pl = Object.assign(pl,plistMap[pl.mpId]);
                    if(pl.isPresell){
                        pl.availablePrice = pl.presellTotalPrice;
                    }
                }
            }
            if(callBack){
                callBack(mpArr);
            }
        },res => {
            this.showTips(res.message);
        })
    }
    /**
     * 来伊份专用，加密手机号
     */
    static CryptoJSMobile (mobile) {
        let endData = CryptoJS.enc.Utf8.parse(mobile);
        let key = CryptoJS.enc.Utf8.parse("1fi;qPa7utddahWy");
        let encryptResult = CryptoJS.AES.encrypt(endData,key, {   //  AES加密
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7  // 后台用的是pad.Pkcs5,前台对应为Pkcs7
        });
        return "@%^*" + encryptResult.toString();
    }
}