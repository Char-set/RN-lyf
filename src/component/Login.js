import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TextInput,
    Button,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { user_logIn, user_logOut } from '../actions/user';

/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import Config from '../config/Default';//默认配置

class LoginCompoent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mobile:'',
            passWord:'',
            canSubmit:false
        }
        console.log(this.props)
    }
    _login () {
        if(!this.state.canSubmit){
            return;
        }
        // let url = '/ouser-web/mobileLogin/loginForm.do';
        let params = {
            companyId:30,
            username:this.state.mobile,
            password:this.state.passWord
        }
        this.props.dispatch(user_logIn(params,this.props.navigation));
    }
    _checkInput () {
        if(!/^(13|15|17|18|14)[0-9]{9}$/.test(this.state.mobile)) {
            return;
        }
        if(!this.state.passWord || this.state.passWord.length < 6) {
            return;
        }
        this.setState({
            canSubmit:true
        });
    }
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.loginForm}>
                    <View style={styles.inputContent}>
                        <View style={styles.label}>
                            <Text style={styles.labelText}>手机号</Text>
                        </View>
                        <TextInput 
                        onChangeText={(res) => {
                            this.setState({mobile:res});
                            setTimeout(() => {
                                this._checkInput();
                            },100)
                        }}
                        autoFocus={true}
                        maxLength={11}
                        keyboardType="numeric"
                        style={styles.input} 
                        placeholder="请输入手机号"></TextInput>
                    </View>
                    <View style={styles.inputContent}>
                        <View style={styles.label}>
                            <Text style={styles.labelText}>密码</Text>
                        </View>
                        <TextInput 
                        onChangeText={(res) => {
                            this.setState({passWord:res});
                            setTimeout(() => {
                                this._checkInput();
                            },100)
                        }} 
                        style={styles.input}
                        secureTextEntry={true} 
                        placeholder="请输入密码"></TextInput>
                    </View>
                    <TouchableWithoutFeedback style={styles.touchBtn} onPress={() => {
                            this._login();
                        }}>
                        <View style={this.state.canSubmit?styles.submitBtnActive:styles.submitBtn}>
                            <Text style={styles.submitBtnText} title="登录">登录</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{

    },
    loginForm:{
        marginLeft:20,
        marginRight:20,
        marginTop:15,
    },
    inputContent:{
        marginTop:20,
        backgroundColor:'#fff',
        height:50,
        // lineHeight:50
        // ju:'2',
        justifyContent:'center'
    },
    label:{
        position:'absolute',
        width:65,
        alignItems:'center'
    },
    input:{
        marginLeft:70,
        fontSize:13
    },
    submitBtn:{
        marginTop:20,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#bbb',
        borderRadius:5
    },
    submitBtnActive:{
        marginTop:20,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Config.css.themeColor,
        borderRadius:5,
    },
    submitBtnText:{
        color:'#fff',
        fontSize:18
    },
    touchBtn:{
        width:'100%',
        display:'none'
    }
});

function select(store){
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        status: store.userStore.status,
    }
}


export default connect(select)(LoginCompoent);