import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableWithoutFeedback
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
      dataList:[],
      item:
        {"productId":1007020801002534,"mpId":1007020801002535,"mpsId":1007020801002535,"code":"6933211482461","name":"天天坚果（活力派）25g","subTitle":null,"type":1,"brandId":1008020801002649,"brandName":"来伊份","brandImgUrl":null,"categoryId":1008020801000003,"categoryName":"果仁","categoryTreeNodeId":null,"merchantSeriesId":0,"companyId":30,"merchantId":101,"merchantName":"来伊份","merchantType":"10","freightAttribute":null,"grossWeight":null,"merchantProdVolume":null,"shopId":9,"shopName":"来伊份","shopType":null,"freightTemplateId":null,"warehouseNo":null,"calculationUnit":"DAI","standard":"1X30包","saleType":1,"saleIconUrl":null,"mpSource":null,"isBargain":null,"isRent":null,"isSeries":null,"status":null,"remark":null,"managementState":null,"price":5.90,"marketPrice":6.44,"tax":0,"stockNum":2024,"lackOfStock":0,"promotionType":0,"promotionPrice":null,"preferentialPrice":null,"promotionId":null,"promotionIconUrl":null,"promotionIconUrls":[],"promotionIconTexts":[],"promotionStartTime":null,"promotionEndTime":null,"titleIconTexts":[],"titleIconUrls":[],"mpSalesVolume":336112,"volume4sale":336112,"isAreaSale":1,"isSeckill":0,"isForcast":0,"forcastPromotionId":null,"forcastPromotionType":null,"forcastPromotionPrice":null,"forcastPreferentialPrice":null,"forcastPromotionStartTime":null,"forcastPromotionEndTime":null,"isPresell":0,"presellFinalStartTime":null,"presellFinalEndTime":null,"deliveryTime":null,"presellDownPrice":null,"presellOffsetPrice":null,"presellTotalPrice":null,"balancePayment":null,"presellBookedNum":null,"individualLimitNum":-1,"totalLimitNum":-1,"warehouseName":null,"picUrl":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3.jpg","commentInfo":{"mpid":null,"commentNum":4582,"goodRate":98},"promotionInfo":[{"mpId":1007020801002535,"iconText":null,"iconUrl":null,"promotions":[{"id":null,"description":"全场8折","promotionId":1023069800007665,"promotionType":3,"frontPromotionType":1003,"contentType":2,"url":null,"iconText":"满折","iconUrl":"http://cdn.oudianyun.com/lyf-local/branch/back-promotion/1487661428991_3559_77.png","weight":4,"startTime":1530149950000,"endTime":1530374399000,"promotionRuleList":[{"promotionId":1023069800007665,"conditionType":2,"conditionValue":1,"contentType":2,"contentValue":80,"description":"满1件8.0折","merchantId":null,"merchantName":null,"flag":true,"level":1,"iconUrl":null}],"promotionGiftDetailList":null,"isJumpPage":1,"jumpPageUrl":null,"individualLimitNum":-1,"totalLimitNum":-1},{"id":null,"description":"APP专享换购","promotionId":1023069700002909,"promotionType":11,"frontPromotionType":1018,"contentType":14,"url":null,"iconText":"换购","iconUrl":"http://cdn.oudianyun.com/lyf-local/branch/back-promotion/1487661389371_6583_94.png","weight":6,"startTime":1528387200000,"endTime":1531583999000,"promotionRuleList":[{"promotionId":1023069700002909,"conditionType":1,"conditionValue":12800,"contentType":14,"contentValue":1,"description":"满128.0元换购商品","merchantId":null,"merchantName":null,"flag":true,"level":1,"iconUrl":null}],"promotionGiftDetailList":null,"isJumpPage":1,"jumpPageUrl":null,"individualLimitNum":-1,"totalLimitNum":-1}]}],"scripts":null,"nowDate":1530272382692,"availablePrice":5.90,"valid":true,"url60x60":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_s.jpg","url100x100":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_s.jpg","url120x120":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_s.jpg","url160x160":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_s.jpg","url220x220":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_m.jpg","url300x300":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_m.jpg","url400x400":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_l.jpg","url500x500":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_l.jpg","url800x800":"http://images.laiyifen.com/trailbreaker/product/20160810/8a213aa0-8693-47ce-9672-4e854f2ee8e3_l.jpg"}
      
    }
  }
  componentDidMount(){
    let {mpId} = this.props;
    this.setState({
        mpId
    },() => {
        this._getRecommend();
    })
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
        let {mpId} = this.props;
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
        let url = Config.apiHost + '/api/read/product/recommendProductList';
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
    this.props.navigation.navigate('DetailView',{mpId:p.mpId});
  }
  _buildPromotionIcon(promotion){
    if(!promotion) return;
    var arrPro=[];
    (promotion || []).forEach((item,index) => {
      arrPro.push(
        <Image key={'promotion' + index} style={s.guessProLiPromotionIcon} source={{uri:item.tagUrl}} />
      )
    });
    return arrPro;
  }
  //检查是否是系列品
  _checkSerialPro(item){
    let url = Config.apiHost + '/api/product/baseInfo';
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
  _addCart(mpId){
    // Utils.showTips(JSON.stringify(item));
    // console.info(item);
    Cookie.getAllCookie('sessionId').then(res => {
      let url = Config.apiHost + '/api/cart/addItem';
      let params = {
        sessionId:res,
        mpId:mpId,
        num:1,
        ut:this.state.ut || ''
      };
      NetUtil.postForm(url,params,res => {
        Utils.showTips('添加成功');
      })
    });
  }
  _renderItem(){
      let swiperItem = [];
    (this.state.dataList || []).forEach((item,index) => {
        let proItem = [];
        (item || []).forEach((p,i) => {
            proItem.push(
                <View key={'renderItem' + i} style={s.guessProLi}>
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
            <View style={s.guessPro}>
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