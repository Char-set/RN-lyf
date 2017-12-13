'use strict';

import { AlertIOS } from 'react-native';
/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import utils from '../utils/ComUtils';//网络请求
import Config from '../config/Default';//默认配置

import * as TYPES from './types';

// fake user data
let testUser = {
	'name': 'juju',
	'age': '24',
	'avatar': 'https://avatars1.githubusercontent.com/u/1439939?v=3&s=460'
};

// for skip user 
let skipUser = {
	'name': 'guest',
	'age': 20,
	'avatar': 'https://avatars1.githubusercontent.com/u/1439939?v=3&s=460',
};

// login
export function user_logIn(opt,navigation){
	return (dispatch) => {
    dispatch({'type': TYPES.LOGGED_DOING});
    let url = Config.apiHost + '/ouser-web/mobileLogin/loginForm.do';
    let params = {
        companyId:30,
        username:opt.username,
        password:opt.password
    }
    NetUtil.postForm(url,params,(res) => {
			dispatch({'type': TYPES.LOGGED_IN, user: res.data,ut:res.ut});
			navigation.goBack();
    },(res) => {
			utils.showTips(res.message);
      dispatch({'type': TYPES.LOGGED_ERROR, error: res});
    });
	}
}



// skip login
export function skipLogin(){
	return {
		'type': TYPES.LOGGED_IN,
		'user': skipUser,
	}
}


// logout
export function user_logOut(){
	return {
		'type': TYPES.LOGGED_OUT
	}
}