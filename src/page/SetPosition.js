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
  Button,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  DeviceEventEmitter,
  Animated,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import {commonStyle,setPositionStyle} from '../styles';//样式文件引入

const s = setPositionStyle;
const { timing } = Animated
const { width, height } = Dimensions.get('window');
/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import Config from '../config/Default';//默认配置
import Css from '../common/Style';//通用样式
import Utils from '../utils/ComUtils';
import Session from '../utils/Session';
/*
 * 自定义组件引入
 */
import Header from '../component/Header';
import Loading from '../component/Loading';

/**
 * action引入
 */

const styles = StyleSheet.create({
    percent: {
        width:'100%'
    },
    h100:{
        height:'100%'
    },
    bgOp:{
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
});

class setPosition extends Component {
    constructor(props){
        super(props);
        this.state = {
            userAddr:[],//用户所有的收货地址
            ut:'',
            province:[],//省列表
            citys:[],//市列表
            regoin:[],//区域列表
            showCity:false,//显示市选择列表
            warpRight:new Animated.Value(width),//需要滚动的距离
            curProvince:{},//当前选中的省
            curCity:{},//当前选中的市
            curRegoin:{},//当前选中的区域
            showLoading:false,//显示loading
        }
    }
  //组件将要被加载
  componentWillMount() {
    console.log('---------componentWillMount----------');
  }
  //组件更新
  componentWillReceiveProps(nextProps) {
      if(this.state.ut != nextProps.ut){
        this.setState({
            ut:nextProps.ut || ''
        },() => {
            this._getUserAddr();
        });
      }
  }
  //组件是否需要更新
  shouldComponentUpdate(nextProps, nextState){
    return true;
  }
  //组件将要更新
  componentWillUpdate() {
      console.log('---------componentWillUpdate----------');
  }
  //组件已经更新
  componentDidUpdate() {
      console.log('---------componentDidUpdate----------');
  }
  //组件呗卸载
  componentWillUnmount() {
      console.log('---------componentWillUnmount----------');
  }
  componentDidMount () {
    console.log('---------componentDidMount----------')
    if(this.props.ut != this.state.ut){
        this.setState({
            ut:this.props.ut || ''
        },() => {
            this._getUserAddr();
        });
    }
    this._getProvince();
    // alert(s)
  }
//   获取已登录用户的收货地址
  _getUserAddr = () => {
      if(!this.state.ut){
          this.setState({userAddr:[]});
          return;
      }
      let url = '/ouser-web/address/getAllAddressForm.do';
      let params = {
          ut:this.state.ut || '',
          nocache:+new Date(),
          platformId:Config.platformId
      };
      NetUtil.postForm(url,params,res => {
        this.setState({
            userAddr:res.data || []
        });
      });
  }
//   渲染收获地址
  _renderUserAddr = () =>  {
    let arr = [];
    this.state.userAddr.forEach((item,index) => {
        arr.push(
            <View style={[s.addrContentItem,index != this.state.userAddr.length - 1 ? s.addrContentItemBorderB : '']} key={item.id}>
                <Text numberOfLines={1}>{item.provinceName}{item.cityName}{item.regionName}{item.detailAddress}</Text>
            </View>
        );
    });
    if(arr.length > 0){
        return (
            <View style={s.addr}>
                <View style={s.addrTitle}>
                    <Text numberOfLines={1} style={s.addrTitleText}>收货地址</Text>
                </View>
                <View style={s.addrContent}>
                    {arr}
                </View>
            </View>
        )
    }
  }
//   获取省列表
  _getProvince = () => {
      this.setState({
        showLoading:true
      });
      let url = '/api/location/areaGroupList';
      let params = {
        areaLevel:1,
        platformId:Config.platformId
      };
      NetUtil.get(url,params,res => {
        this.setState({
            province:res.data || [],
            showLoading:false
        });
      });
  }
//   渲染省列表
  _renderProvince = () => {
      let arr = [];
      this.state.province.forEach(item => {
          let province = [];
          (item.list || []).forEach((v,i) => {
              province.push(
                <TouchableWithoutFeedback key={v.areaCode} onPress={() => this._chooseProinvce(v)}>
                    <View style={[s.addrContentItem,i != item.list.length - 1 ? s.addrContentItemBorderB : '']}>
                        <Text numberOfLines={1}>{v.areaName}</Text>
                    </View>
                </TouchableWithoutFeedback>
              );
          });
          arr.push(
            <View style={s.addr} key={item.key}>
                <View style={s.addrTitle}>
                    <Text numberOfLines={1} style={s.addrTitleText}>{item.key}</Text>
                </View>
                <View style={s.addrContent}>
                    {province}
                </View>
            </View>
          );
      });
      if(arr.length > 0){
          return arr;
      }
  }
//   获取市列表,type:2、市，3、区域
  _getCitys = (code,type) => {
      let url = '/api/location/list/' + code;
      let params = {
          platformId:Config.platformId
      };
      NetUtil.get(url,params,res => {
        (res.data || []).forEach(item => {
            item.checked = false;
        });
        if(type == 2){
            this.setState({
                citys:res.data || [],
                showCity:true
            });
        } else if(type == 3){
            this.setState({
                regoin:res.data || []
            });
        }
      });
  }
//   渲染市列表
  _renderCitys = () => {
      let arr = [];
      this.state.citys.forEach((item,i) => {
        arr.push(
            <View style={s.citysWarpContent} key={item.code}>
                <TouchableWithoutFeedback onPress={() => this._chooseCity(item)}>
                    <View style={[s.citysWarpContentItem,i != this.state.citys.length - 1 ? s.citysWarpContentItemBorderB : '',item.checked?s.citysWarpContentItemBorderBActive:'']}>
                        <Text style={s.citysWarpContentItemText}>{item.name}</Text>
                        <Image style={s.citysWarpContentItemImg} source={item.checked?require('../images/common_btn_arrow_greyup.png'):require('../images/common_btn_arrow_greydown.png')} />
                    </View>
                </TouchableWithoutFeedback>
                {item.checked ? this._renderRegoin():null}
            </View>
        )
      });
      if(arr.length > 0){
          return arr;
      }
  }
//   渲染区域列表
  _renderRegoin = () => {
      let arr = [];
      this.state.regoin.forEach((item,index) => {
          arr.push(
            <TouchableWithoutFeedback key={item.code} onPress={() => this._chooseRegoin(item)}>
                <View style={[s.citysWarpContentRegoinItem,index != this.state.regoin.length - 1 ? s.citysWarpContentRegoinItemBorderB : '']}>
                    <Text style={s.citysWarpContentRegoinItemText}>{item.name}</Text>
                    {item.checked?<Image source={require('../images/common_ic_select.png')} />:null}
                </View>
            </TouchableWithoutFeedback>
          )
      });
      if(arr.length > 0){
          return (
            <View style={s.citysWarpContentRegoin}>
                {arr}
            </View>
          )
      }
  }
//   选择市
  _chooseCity = (item) => {
    this.state.curCity = item;
    this.state.citys.forEach(s => {
        if(s.code == item.code){
            s.checked = !s.checked
        } else{
            s.checked = false;
        }
    });
    // this._getCitys(item.code,3);
    this.setState({
        citys:this.state.citys,
        regoin:[]
    },() => {
        if(item.checked){
            this._getCitys(item.code,3);
        } else{
            this.setState({
                regoin:[]
            })
        }
    });
  }
//   回退选择省
  _resetCity = () => {
      setTimeout(() => {
        this.setState({
            showCity:false,
            citys:[]
          });
      }, 350);
      timing(
        this.state.warpRight,
        { toValue: width, duration: 300, useNativeDriver: true }
      ).start()
  }
//   选择省
  _chooseProinvce = (item) => {
    this.state.curProvince = item;
    this._getCitys(item.areaCode,2);
    timing(
        this.state.warpRight,
        { toValue: 0, duration: 300, useNativeDriver: true }
      ).start()
  }
//   选择区域
  _chooseRegoin = (item) => {
    this.state.curRegoin = item;
    this.props.dispatch({
        type:'POSITION_SET',
        province:this.state.curProvince,
        city:this.state.curCity,
        regoin:this.state.curRegoin,
    });
    this.props.navigation.goBack();
  }
  render() {
    return(
      <View style={[commonStyle.container,isIphoneX()?commonStyle.pdT45:'',commonStyle.bgf]} >
        <Loading isShow={this.state.showLoading} />
        <Header title="定位" backType="1" navigation={this.props.navigation}  />
        <View style={isIphoneX()?s.ipxScrollHeight:s.scrollHeight}>
            <ScrollView showsVerticalScrollIndicator={false} style={isIphoneX()?s.ipxScrollHeight:s.scrollHeight}>
                <View style={s.addr}>
                    <View style={s.addrTitle}>
                        <Text numberOfLines={1} style={s.addrTitleText}>当前定位地址</Text>
                    </View>
                    <View style={s.addrContent}>
                        <View style={s.addrContentItem}>
                            <Text numberOfLines={1}>上海市</Text>
                        </View>
                    </View>
                </View>
                {this._renderUserAddr()}
                {this._renderProvince()}
            </ScrollView>
        </View>
        {this.state.showCity?
            <Animated.View style={[s.citys,styles.bgOp,{transform:[{translateX:this.state.warpRight}]}]}>
                <TouchableWithoutFeedback onPress={() => this._resetCity()}>
                    <View style={s.citysGray}></View>
                </TouchableWithoutFeedback>
                <View style={[s.citysWarp,isIphoneX()?commonStyle.pdT45:'']}>
                    <View style={s.citysWarpTitle}>
                        <TouchableWithoutFeedback onPress={() => this._resetCity()}>
                            <Image style={s.citysWarpTitleImg} source={require('../images/global_close.png')} />
                        </TouchableWithoutFeedback>
                        <Text style={s.citysWarpTitleText}>选择收货城市</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={isIphoneX()?s.citysWarpIpxScrollHeight:s.citysWarpScrollHeight}>
                        {this._renderCitys()}
                    </ScrollView>
                </View>
            </Animated.View>
            :null
        }
        
      </View>
    )
  }
}
function select(store){
  return {
      curProvince:store.positionStore.province,
      curCity:store.positionStore.city,
      curRegoin:store.positionStore.regoin,
  }
}


export default connect(select)(setPosition);