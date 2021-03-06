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
  DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import {commonStyle,cartStyle} from '../styles';//样式文件引入
import { user_logIn, user_logOut } from '../actions/user';

const s = cartStyle;
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
import GuessComponent from '../component/Guess';
import Loading from '../component/Loading';
import { debug } from 'util';

const styles = StyleSheet.create({
    percent: {
        width:'100%'
    },
    h100:{
        height:'100%'
    }
});

class Cart extends Component {
    constructor(props){
        super(props);
        this.state = {
            sessionId:'',
            merchantList:[],//商家列表
            summary:{},//购物车统计
            failureProducts:[],//无效商品
            allMpId:[],//购物车所有的商品id
            showLoading:false,//显示loading图
            isSelectAll:false,//全选了购物车的所有商品
            noFooter:false,//是否是有底部的购物车
        }
    }
  //组件将要被加载
  componentWillMount() {
    console.log('---------componentWillMount----------');
  }
  //组件更新
  componentWillReceiveProps(nextProps) {
      
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
      this.updateCartScreen && this.updateCartScreen.remove();
  }
  componentDidMount () {
    console.log('---------componentDidMount----------')
    Session.getSessionId().then(sid => {
        this.setState({
            sessionId:sid,
            noFooter:(this.props.navigation.state.params && this.props.navigation.state.params.noFooter != undefined) ? this.props.navigation.state.params.noFooter:false
        },() => {
            this._getCartList();
        });
    });
    this.updateCartScreen = DeviceEventEmitter.addListener('updateCartScreen',() => {
        Session.getSessionId().then(sid => {
            this.setState({
                sessionId:sid,
                noFooter:(this.props.navigation.state.params && this.props.navigation.state.params.noFooter != undefined) ? this.props.navigation.state.params.noFooter:false
            },() => {
                this._getCartList();
            });
        });
    });
      
  }
  _goIndex(){
      const backAction = NavigationActions.navigate({
        key: 'Index',
        routeName: 'Index',
      });
      this.props.navigation.dispatch(backAction);
    // this.props.navigation.navigate('IndexView')
  }
  _getCartList = () => {

    let url = '/api/cart/list';
    let params ={
        v:1.2,
        areaCode:Config.areaCode,
        platformId:Config.platformId,
        sessionId:this.state.sessionId
    }
    this.setState({
        showLoading:true
    });
    NetUtil.get(url,params,res => {
        let {failureProducts,merchantList,summary} = res.data;
        let allMpId = [],isSelectAll = true;
        (merchantList || []).forEach(item => {
            item.productGroups.forEach(v => {
                v.productList.forEach(s => {
                    allMpId.push(s.mpId);
                    if(!s.checked) isSelectAll = false;
                });
            })
        });
        this.setState({
            failureProducts:res.data.failureProducts || [],
            merchantList:res.data.merchantList || [],
            summary:res.data.summary || {},
            allMpId,
            showLoading:false,
            isSelectAll:isSelectAll
        });
    });
  }
//   编辑商品数量
  _proBtnClick(product,flag){
    //   数量加
    if(flag){
        if(product.num < product.stockNum){
            this._editProNum(product.mpId,product.num - 0 + 1); 
        }
    } else{
        if(product.num > 1){
            this._editProNum(product.mpId,product.num - 1); 
        }
    }
  }
  _editProNum(mpId,num){
      let url = '/api/cart/editItemNum';
      let params = {
          ut:this.props.ut || '',
          sessionId:this.state.sessionId,
          mpId:mpId,
          num:num,
          platformId:Config.platformId
      };
      NetUtil.postForm(url,params,res => {
        this._getCartList();
      });
  }
//   选中商品
  _editItemCheck(product){
    let url = "/api/cart/editItemCheck";
    let params={
        ut: this.props.ut || '',
        sessionId:this.state.sessionId,
        checkStr:[product.mpId,product.checked?0:1,product.itemType,product.objectId].join('-')
    };
    NetUtil.postForm(url,params,res => {
        this._getCartList();
    });
  }
//   全选、取消商家下的商品,若未给参数merchant，标识全选购物车的所有商品
  _selectMerchant(merchant){
    let arr = [];
    if(merchant){
        merchant.productGroups.forEach(group => {
            group.productList.forEach(pro => {
                arr.push(pro.mpId + '-' + (merchant.merchantCheckFlag?0:1) + '-' + pro.itemType + '-' + pro.objectId);
            });
        });
    } else{
        this.state.merchantList.forEach(item => {
            item.productGroups.forEach(group => {
                group.productList.forEach(pro => {
                    arr.push(pro.mpId + '-' + (this.state.isSelectAll?0:1) + '-' + pro.itemType + '-' + pro.objectId);
                });
            });
        });
    }
    
    let url = "/api/cart/editItemCheck";
    let params={
        ut: this.props.ut || '',
        sessionId:this.state.sessionId,
        checkStr:arr.join(',')
    };
    NetUtil.postForm(url,params,res => {
        this._getCartList();
    });   
  }
  _goPromotion(promotion){
      this.props.navigation.navigate('SearchView',{promotionId:promotion.promotionId});
  }
  _renderMerchantList(){
      if(!this.state.merchantList || this.state.merchantList.length == 0) return;
      let merchantList = [],allMpId = [];
      this.state.merchantList.forEach((item,index) => {
          let groupList = [],merchantCheckFlag = true;
          (item.productGroups || []).forEach((group,v) => {
              let productList = [];
              (group.productList || []).forEach((pro,i) => {
                  if(!pro.checked) merchantCheckFlag = false;
                  allMpId.push(pro.mpId);
                //   <TextInput keyboardType='numeric' autoCorrect={false} defaultValue={pro.num.toString()} style={s.merchantContentListItemProBtnInput} onChangeText={(text) => {this._editProNum(pro,text)}} />
                  productList.push(
                    <View style={s.merchantContentListItem} key={pro.mpId}>
                        <TouchableWithoutFeedback onPress={() => {this._editItemCheck(pro)}}>
                            <View style={[s.merchantContentListItemCheck]}>
                                <Image style={s.merchantContentListItemCheckImg} source={pro.checked?require('../images/checkBox_selected.png'):require('../images/checkBox_unselected.png')} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {this.props.navigation.navigate('DetailView',{mpId:pro.mpId});}}>
                            <Image style={s.merchantContentListItemImg} source={{uri:pro.picUrl}}/>
                        </TouchableWithoutFeedback>
                        <View style={[s.merchantContentListItemPro]}>
                            <Text style={s.merchantContentListItemProName} numberOfLines={1}>{pro.name}</Text>
                            <Text style={s.merchantContentListItemProAttr}>
                                口味：微辣  包装：260克
                            </Text>
                            <Text style={s.merchantContentListItemProPrice}>{Utils.filterPrice(pro.price,'￥')}</Text>
                            <View style={s.merchantContentListItemProBtn}>
                                <TouchableWithoutFeedback onPress={() => this._proBtnClick(pro,false)}>
                                    <View style={s.merchantContentListItemProBtnReduce}>
                                        <Image source={pro.num > 1 ? require('../images/cut_back_n.png') : require('../images/cut_back_n-dis.png')} />
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={s.merchantContentListItemProBtnInput}>
                                    <Text style={s.merchantContentListItemProBtnInputText}>{pro.num}</Text>
                                </View>
                                <TouchableWithoutFeedback onPress={() =>{this._proBtnClick(pro,true)}}>
                                    <View style={s.merchantContentListItemProBtnAdd}>
                                        <Image source={pro.num < pro.stockNum ? require('../images/increase_s.png') : require('../images/increase_s-dis.png')} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                  )
              })
            groupList.push(
                <View style={s.merchantContentList} key={'merchantGroup' + v}>
                    {group.promotion?
                        <View style={s.merchantContentListPromotion}>
                            <Image style={s.merchantContentListPromotionImg} source={{uri:group.promotion.promIconUrl}}/>
                            <Text style={s.merchantContentListPromotionText} numberOfLines={1}>{group.promotion.displayName}</Text>
                            {group.promotion.isReachCondition == 0 ?
                                <TouchableWithoutFeedback onPress={() => this._goPromotion(group.promotion)}>
                                    <View style={s.merchantContentListPromotionNext}>
                                        <Text style={s.merchantContentListPromotionNextText}>去凑单</Text>
                                        <Image style={s.merchantContentListPromotionNextImg} source={require('../images/next.png')} />
                                    </View>
                                </TouchableWithoutFeedback>
                                :null
                            }
                        </View>
                        :null
                    }
                    {productList}
                </View>
            )
          });
          item.merchantCheckFlag = merchantCheckFlag;
        merchantList.push(
            <View style={s.merchant} key={item.merchantId}>
                <View style={s.merchantTop}>
                    <TouchableWithoutFeedback onPress={() => this._selectMerchant(item)}>
                        <Image style={s.merchantTopCheck} source={merchantCheckFlag?require('../images/checkBox_selected.png'):require('../images/checkBox_unselected.png')} />
                    </TouchableWithoutFeedback>
                    <Image style={s.merchantTopIcon} source={require('../images/cart_edit_house_orange.png')} />
                    <Text style={s.merchantTopTitle}>{item.merchantName}</Text>
                </View>
                <View style={s.merchantContent}>
                    {groupList}
                </View>
            </View>
        )
      });
    //   DeviceEventEmitter.emit('updateGuessMpId',allMpId.join(','));
      return merchantList;
  }
  render() {
    return(
      <View style={[commonStyle.container,isIphoneX()?commonStyle.pdT45:'',commonStyle.bgf0]}>
        <Loading isShow={this.state.showLoading} />
        <Header title="购物车" showBack={this.state.noFooter} navigation={this.props.navigation} />
        <View style={isIphoneX()?(this.state.noFooter?s.ipxScrollNoFooterHeight:s.ipxScrollHeight):(this.state.noFooter?(s.scrollNoFooterHeight):(s.scrollHeight))}>
            <ScrollView style={isIphoneX()?commonStyle.ipxScrollHeight:commonStyle.scrollHeight} showsVerticalScrollIndicator={false} >
                {this.state.merchantList && this.state.merchantList.length == 0?
                    <View style={[s.noData,isIphoneX()?commonStyle.ipxScrollHeight:commonStyle.scrollHeight]}>
                        <Image style={s.noDataImg} source={require('../images/cart_nothing.png')} />
                        <Text style={s.noDataText}>购物车空空荡荡...</Text>
                        <TouchableWithoutFeedback onPress={() => this._goIndex()}>
                            <View style={s.noDataBtn}>
                                <Text style={s.noDataBtnText}>立刻去逛逛</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    :null
                }
                {this._renderMerchantList()}
                <GuessComponent navigation={this.props.navigation} afterAddCart={this._getCartList.bind(this)} mpId={(this.state.allMpId || []).join(',')} ut={this.props.ut} />
            </ScrollView>
        </View>
        {this.state.merchantList.length > 0 ?
            <View style={[s.footer,{bottom:this.state.noFooter?0:50}]}>
                <TouchableWithoutFeedback onPress={() => this._selectMerchant()}>
                    <View style={s.footerSelect}>
                            <Image style={s.footerSelectImg} source={this.state.isSelectAll ? require('../images/cart_edit_chose_all_selected.png') : require('../images/cart_edit_chose_all_unselected.png')}/>
                            <Text style={s.footerSelectText}>全选</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={s.footerAmount}>
                    <Text style={s.footerAmountTotal}>合计：{Utils.filterPrice(this.state.summary.amount,'￥')}</Text>
                    <Text style={s.footerAmountDiscount}>{this.state.summary.discount > 0 ?<Text>已优惠：{Utils.filterPrice(this.state.summary.discount,'￥')}</Text> : null}  不含运费</Text>
                </View>
                <View style={[s.footerConfirm,this.state.summary.totalNum > 0 ? '' : s.footerConfirmDis]}>
                    <Text style={s.footerConfirmText}>去结算{this.state.summary.totalNum > 0 ? ('('+ this.state.summary.totalNum + ')'):''}</Text>
                </View>
            </View>
            :null
        }
      </View>
    )
  }
}
function select(store){
  return {
      isLoggedIn: store.userStore.isLoggedIn,
      user: store.userStore.user,
      status: store.userStore.status,
      ut: store.userStore.ut,
  }
}


export default connect(select)(Cart);