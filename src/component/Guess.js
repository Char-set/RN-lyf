import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';
import Swiper from 'react-native-swiper';
import {commonStyle,guessStyle} from '../styles';//样式文件引入
import usuallyStyle from '../common/Style';
const s = guessStyle;
const u = usuallyStyle;
/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import Utils from '../utils/ComUtils';//网络请求
import timeFormat from '../utils/TimeFormat';//时间格式化
import Config from '../config/Default';//默认配置
import Cookie from '../utils/Cookies';

/**
 * 自定义组件引入
 */

import PriceComponent from '../component/Price';


export default class GuessLike extends Component{
  constructor(props){
    super(props);
    this.state = {
      mpId:'',
      dataList:[]
    }
  }
  componentDidMount(){
    let {mpId} = this.props;
    this.setState({
        mpId
    },() => {
        this._getRecommend();
    });
    this.updateGuessMpIdListener = DeviceEventEmitter.addListener('updateGuessMpId',(mpIds) => {
        this.setState({
            mpId:mpIds
        },() => {
            this._getRecommend();
        });
    });
  }
  componentWillUnmount(){
    this.updateGuessMpIdListener && this.updateGuessMpIdListener.remove();
  }
  //组件是否需要更新
  shouldComponentUpdate(nextProps, nextState){
    //   debugger
    // if(this.state.mpId != nextProps.mpId){
    //     return true;
    // } else{
    //     return false;
    // }
    return true;
  }
  componentWillReceiveProps(nextProps){
    if(this.state.mpId != nextProps.mpId){
        let {mpId} = nextProps;
        this.setState({
            mpId
        },() => {
            this._getRecommend();
        })
    }
  }
  componentDidUpdate(){
    //   debugger
    // if(this.state.mpId != this.props.mpId){
    //     let {mpId} = this.props;
    //     this.setState({
    //         mpId
    //     },() => {
    //         this._getRecommend();
    //     })
    // }
  }
//   获取推荐商品列表
  _getRecommend(){
        if(!this.state.mpId) return;
        let url = '/api/read/product/recommendProductList';
        let params = {
        sceneNo:1,
        ut:this.props.ut || '',
        pageSize: 20,
        pageNo: 1,
        platformId: Config.platformId,
        mpIds:this.state.mpId,//商品id
        areaCode: Config.areaCode,
        }
        NetUtil.get(url,params,res => {
            let itemIds = [];
            for (let p of res.data.dataList) {
                itemIds.push(p.mpId)
            }
            itemIds = itemIds.join();
            Utils.getPriceAndStock(itemIds,res.data.dataList,null,obj => {
                let list = [],temp = [];
                (obj || []).forEach((item,index) => {
                    if(index % 4 == 0) temp = [];
                    temp.push(item);
                    if(index % 4 == 0) list.push(temp);
                });
                this.setState({
                    dataList:list
                });
            });
        });
  }
  _goDetais(p){
    // DeviceEventEmitter.emit('updateMpId',p.mpId);
    this.props.navigation.navigate('DetailView',{mpId:p.mpId});
  }
  _buildPromotionIcon(promotion){
    if(!promotion) return;
    var arrPro=[];
    (promotion || []).forEach((item,index) => {
      arrPro.push(
        <Image key={'promotion' + item.tagUrl} style={s.guessProLiPromotionIcon} source={{uri:item.tagUrl}} />
      )
    });
    return arrPro;
  }
  //检查是否是系列品
  _checkSerialPro(item){
    let url = '/api/product/baseInfo';
    let params = {
      mpIds:item.mpId
    };
    NetUtil.get(url,params,res => {
      if(res.data && res.data.length > 0){
        switch (res.data[0].isSeries) {
          case 0:
            // Utils.showTips('商品为普通商品');
            this._addCart(item.mpId);
            break;
          case 1:
            Utils.showTips('商品为系列品');
            break;
        }
      } else{
        Utils.showTips('未获取到有效的商品信息');
      };
    })
  }
  _afterAddCart = () => {
    if(typeof this.props.afterAddCart == 'function'){
        this.props.afterAddCart();
    }
  }
  _addCart(mpId){
    // Utils.showTips(JSON.stringify(item));
    // console.info(item);
    Cookie.getAllCookie('sessionId').then(res => {
      let url = '/api/cart/addItem';
      let params = {
        sessionId:res,
        mpId:mpId,
        num:1,
        ut:this.state.ut || ''
      };
      NetUtil.postForm(url,params,res => {
        Utils.showTips('添加成功');
        this._afterAddCart();
      })
    });
  }
  _renderItem(){
      let swiperItem = [];
    (this.state.dataList || []).forEach((item,index) => {
        let proItem = [];
        (item || []).forEach((p,i) => {
            proItem.push(
                <View key={'renderItem' + p.mpId} style={s.guessProLi}>
                    <TouchableWithoutFeedback onPress={() => this._goDetais(p)}>
                        <Image style={s.guessProLiImg} source={{uri:p.url300x300}} />
                    </TouchableWithoutFeedback>
                    <Text numberOfLines={1} style={s.guessProLiTitle}>{p.mpName}</Text>
                    <View style={s.guessProLiPromotion}>
                        {this._buildPromotionIcon(p.tagList)}
                    </View>
                    <View style={s.guessProLiPrice}>
                        <PriceComponent params={{availablePrice:p.promotionPrice,originalPrice:p.price}} />
                    </View>
                    <View style={s.guessProLiComment}>
                        <View style={[s.guessProLiCommentItem,commonStyle.mr5]}>
                            <Text style={s.guessProLiCommentItemBer}>{p.commentInfo.commentNum}</Text>
                            <Text style={s.guessProLiCommentItemText}>评论</Text>
                        </View>
                        <View style={s.guessProLiCommentItem}>
                            <Text style={s.guessProLiCommentItemText}>好评</Text>
                            <Text style={s.guessProLiCommentItemBer}>{p.commentInfo.goodRate + '%'}</Text>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this._checkSerialPro(p)}>
                        <Image style={s.guessProLiAddCart} source={require('../images/common_btn_addtoshoppingcart.png')}/>
                    </TouchableWithoutFeedback>
                </View>
            )
        });
        swiperItem.push(
            <View style={s.guessPro} key={'swiper' + index}>
                {proItem}
            </View>
        );
    });
    if(swiperItem.length > 0){
        return (
            <View style={{height:swiperItem.length > 1 ? 552 : 266}}>
                <Swiper autoplay={false} showsPagination={false} >
                    {swiperItem}
                </Swiper>
            </View>
        )
    }
    
  }
  render() {
      if(this.state.dataList.length > 0){
        return (
            <View style={s.guess}>
                <View style={s.guessTop}>
                    <View style={[s.guessTopLine,u.percent]}></View>
                    <View style={s.guessTopContent}>
                        <Image style={s.guessTopContentImg} source={require('../images/common_ic_likes.png')} />
                        <View style={s.guessTopContentBody}>
                            <Text style={s.guessTopContentBodyText}>猜你喜欢</Text>
                        </View>
                    </View>
                </View>
                {this._renderItem()}
            </View>
        )
      } else{
          return <View></View>
      }
    
  }
}