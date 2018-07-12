import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Animated,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  WebView,
  DeviceEventEmitter,
  TextInput,
  UIManager,
  findNodeHandle,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import HTML from 'react-native-render-html';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import {commonStyle,detailStyle} from '../styles';//样式文件引入

const s = detailStyle;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { timing } = Animated
const styles = StyleSheet.create({
  percent: {
    width:'100%'
  }
});
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

import GuessComponent from '../component/Guess';
// console.log(GuessLike,'-----')
// import { request } from 'https';

const {width,height} = Dimensions.get('window');

class Detail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mpId:'',//商品id
      currentTab:0,//0、商品，1、详情，2、评价
      baseInfo:{},//商品详情信息
      lunboImage:[],//轮播数组
      swiperShow:false,
      promotionInfo:[],//商品促销活动
      comment:{},//商品评价对象
      commentSearch:{
        rateFlag:0,//0:全部;1:好评;2:中评;3:差评;4:有图
        pageNo:1
      },
      commentList:[],//评论数组
      proDesc:'',//商品详情，html
      swiper:null
    }
  }
  componentDidMount() {
    // console.log(this.props.params)
    InteractionManager.runAfterInteractions(() => {
      if(this.props.params && this.props.params.mpId){
        this._initState(this.props.params.mpId);
      }
      this.upDateMpidListener = DeviceEventEmitter.addListener('updateMpId',(mpId) => {
        this._initState(mpId);
      });
    });
  }
  componentWillUnmount() {
    //此生命周期内，去掉监听
    this.upDateMpidListener && this.upDateMpidListener.remove();
  }
  componentWillUpdate(){
  }
  _initState(mpId){
    this.setState({
      mpId:mpId
    },() => {
      this._getBaseInfo();
      this._getProInfo();
      this._getMpComment();
    });
  }
  // 获取商品基础信息
  _getBaseInfo(){
    let url = '/api/product/baseInfo';
    let params = {
      mpsIds:this.state.mpId,
      platformId:Config.platformId,
      areaCode:Config.areaCode
    };
    NetUtil.get(url,params,res => {
      // 取出轮播数组
      let lunboImage = [];
      res.data[0].securityVOList = [
        {
          title:'支持货到付款'
        },
        {
          title:'全场满68元包邮'
        },
        {
          title:'正品保证'
        },
      ];
      (res.data[0].pics || []).forEach(item => {
        lunboImage.push({
          imageUrl:item.url300x300
        });
      })
      this.setState({
        lunboImage:lunboImage,
        baseInfo:res.data[0],
        swiperShow:true
      });
    })
  }
  // 获取商品的促销信息
  _getProInfo(){
    let url = '/api/product/promotionInfo';
    let params = {
      mpIds:this.state.mpId,
      companyId:Config.companyId,
      platformId:Config.platformId
    };
    NetUtil.get(url,params,res => {
      if(res.data){
        this.setState({
          promotionInfo:res.data.promotionInfo
        })
      }
    });
  }
  // 获取商品评价信息,第一次
  _getMpComment(){
    let url = '/api/social/mpComment/get';
    let params = {
      companyId:Config.companyId,
      ut:this.props.ut,
      mpId:this.state.mpId,
      pageNo:this.state.commentSearch.pageNo,
      pageSize:10,
      hasPic:0,
      rateFlag:this.state.commentSearch.rateFlag,
      platformId:Config.platformId
    };
    NetUtil.get(url,params,res => {
      let tempArr = this.state.commentList || [];
      tempArr = tempArr.concat(res.data.mpcList.listObj || []);
      this.setState({
        comment:res.data,
        commentList:tempArr
      });
    })
  }
  // 切换顶部tab 
  _swtichTab(index){
    if(this.state.currentTab == index) return;
    
    let resultIndex = '';
    switch (this.state.currentTab) {
      case 0:
        resultIndex = index;
        break;
      case 1:
        if(index == 0){
          resultIndex = -1;
        } else{
          resultIndex = 1;
        }
        break;
      case 2:
        if(index == 1){
          resultIndex = -1;
        } else{
          resultIndex = -2;
        }
        break;

      default:
        break;
    }
    this.swiper.scrollBy(resultIndex,true);
    this.setState({
      currentTab:index
    });
  }
  // 渲染轮播子组件
  _renderSwiperItem(){
      let imageArray = [];
      var imagesDate = this.state.lunboImage || [];

      imagesDate.forEach((item,index) =>{
          imageArray.push(
              <View key={index} style={s.imageView} >
                <Image 
                key={index}
                source={{uri:item.imageUrl}}
                style={s.swiperViewImg}
                resizeMode = 'contain'
                />
              </View>
          )
      })
      return imageArray;
  }
  // 渲染促销活动
  _renderPro(){
    let pro = [];
    (this.state.promotionInfo || []).forEach((item,i) => {
      (item.promotions || []).forEach((proItem,v) => {
        pro.push(
          <View key={proItem.promotionId} style={[s.promoItem,!(i == this.state.promotionInfo.length - 1 && v == item.promotions.length - 1)?s.promoItemBorderB:'']}>
            <View style={[s.promoItemIcon,Utils.filterProBg(commonStyle,proItem.frontPromotionType)]}>
              <Text style={s.promoItemIconText}>{proItem.iconText}</Text> 
            </View>
            <Text style={s.promoItemText}>{proItem.description}</Text>
            <Image style={s.promoItemNext} source={require('../images/common_ic_next.png')}/>
          </View>
        )
      })
    });
    if(pro.length > 0){
      return (
        <View style={s.promo}>
          {pro}
        </View>
      )
    }
  }
  // 渲染商品的保障信息
  _renderSecurity(){
    let security = [];
    (this.state.baseInfo.securityVOList || []).forEach((item,v) => {
      security.push(
        <View style={s.safePromiseItem} key={v}>
          <Image style={s.safePromiseItemImg} source={require('../images/detail_ic_guarantee.png')} />
          <Text style={s.safePromiseItemText}>{item.title}</Text>
        </View>
      )
    });
    if(security.length > 0){
      return (
        <View style={s.safePromise}>
          {security}
          <Image style={s.safePromiseNext} source={require('../images/common_ic_next.png')}/>
        </View>
      )
    }
  }
  /**
   * 渲染商品评价列表
   * @type little  list 
   */
  _renderComment(type){
    let comment = [];
    if(this.state.comment.mpcList && this.state.comment.mpcList.total > 0){
      let list =  [];
      if(type == 'little'){
        list = this.state.commentList.slice(0,3);
      } else{
        list = this.state.commentList;
      }
      list.forEach((item,index) => {
        let img = [],pic = [];
        for(let i = 0; i < item.rate; i++){
          img.push(
            <Image style={s.evaluateContentItemTopImgContentImg} key={i} source={require('../images/detail_ic_comment_s.png')}/>
          );
        }
        (item.mpShinePicList || []).forEach(p => {
          pic.push(
            <Image style={s.evaluateContentItemImgContentImg} source={{uri:p}} />
          );
        });
        comment.push(
          <View key={index} style={[s.evaluateContentItem,(index != list.length - 1) ? commonStyle.borderB:'']}>
            <View style={s.evaluateContentItemTop}>
              <View style={s.evaluateContentItemTopImgContent}>
                {img}
              </View>
              <View style={s.evaluateContentItemTopName}>
                <Text style={s.evaluateContentItemTopNameText}>{item.userUsername}</Text>
              </View>
            </View>
            {item.content?
              <View style={s.evaluateContentItemContent}>
                <Text style={s.evaluateContentItemContentText}>{item.content}</Text>
              </View>
              :
              null
            }
            
            {pic.length > 0 ?
              <View style={s.evaluateContentItemImgContent}>
                {pic}
              </View>
              :
              null
            }
            <View style={s.evaluateContentItemTime}>
              <Text style={s.evaluateContentItemTimeText}>{Utils.filterDate(item.orderCreateTime,'yyyy-MM-dd')}</Text>
            </View>
          </View>
        )
      });
      return comment;
    }
  }
  _renderCommentList(commentItem){
    let item = commentItem.item;
    let index = commentItem.index;
    let img = [],pic = [];
    for(let i = 0; i < item.rate; i++){
      img.push(
        <Image style={s.evaluateContentItemTopImgContentImg} key={i + '_renderCommentListImg'} source={require('../images/detail_ic_comment_s.png')}/>
      );
    }
    (item.mpShinePicList || []).forEach((p,v) => {
      pic.push(
        <Image style={s.evaluateContentItemImgContentImg} key={v + 'mpShinePicList'} source={{uri:p}} />
      );
    });
    return (
      <View key={index + '_renderCommentList'} style={[s.pd012,s.evaluateContentItem,(index != this.state.commentList.length - 1) ? commonStyle.borderB:'']}>
        <View style={s.evaluateContentItemTop}>
          <View style={s.evaluateContentItemTopImgContent}>
            {img}
          </View>
          <View style={s.evaluateContentItemTopName}>
            <Text style={s.evaluateContentItemTopNameText}>{item.userUsername}</Text>
          </View>
        </View>
        {item.content?
          <View style={s.evaluateContentItemContent}>
            <Text style={s.evaluateContentItemContentText}>{item.content}</Text>
          </View>
          :
          null
        }
        
        {pic.length > 0 ?
          <View style={s.evaluateContentItemImgContent}>
            {pic}
          </View>
          :
          null
        }
        <View style={s.evaluateContentItemTime}>
          <Text style={s.evaluateContentItemTimeText}>{Utils.filterDate(item.orderCreateTime,'yyyy-MM-dd')}</Text>
        </View>
      </View>
    )
  }
  _holdBigSwiperChange(e,state,context){
    this.setState({
      currentTab:state.index
    });
  }
  // 切换mpId，重新加载本页面
  _reload(mpId){
    this.setState({
      mpId:mpId
    },() => {
      this._getBaseInfo();
      this._getProInfo();
      this._getMpComment();
      this.refs.detailScrollView.scrollTo({x: 0, y: 0, animated: true});
    });
  }
  // 评论下拉加载更多
  _loadMoreComment(){
    if(this.state.comment.mpcList.total > this.state.commentList.length){
      let tempObj = this.state.commentSearch;
      tempObj.pageNo += 1;
      this.setState({
        commentSearch:tempObj
      },() => {
        this._getMpComment();
      });
    }
  }
  // 渲染评价页的tab栏
  _renderCommentTab(){
    let arr = [];
    (this.state.comment.mpLabelList || []).forEach(item => {
      arr.push(
        <TouchableWithoutFeedback key={item.labelName} onPress={() => this._switchCommentTab(item.labelflag)}>
          <View style={[s.commentTopItem,this.state.commentSearch.rateFlag == item.labelflag ? s.commentTopItemActive : '']}>
            <Text style={[s.commentTopItemText,this.state.commentSearch.rateFlag == item.labelflag ? s.commentTopItemTextActive : '']}>{item.labelName}({item.labelNum})</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    });
    return arr;
  }
  // 切换评论tab
  _switchCommentTab(flag){
    if(this.state.commentSearch.rateFlag != flag){
      this.setState({
        commentList:[],
        commentSearch:{
          pageNo:1,
          rateFlag:flag
        }
      },() => {
        this._getMpComment();
      });
    }
  }
  render () {
    return (
      <View style={[commonStyle.container,isIphoneX()?commonStyle.pdT45:'',s.bgf0]}>
        <View style={s.topTab}>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
            <Image style={s.topTabBack} source={require('../images/common_btn_back.png')} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { this._swtichTab(0) }}>
            <View style={[s.topTabView,s.topTabR49]}>
              <Text style={[s.topTabTitle,this.state.currentTab == 0? s.topTabTitleActive : '']}>商品</Text>
              {this.state.currentTab == 0 ? <View style={[s.topTabBor,styles.percent]}></View> :<View></View>}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { this._swtichTab(1) }}>
            <View style={[s.topTabView,s.topTabR49]}>
              <Text style={[s.topTabTitle,this.state.currentTab == 1? s.topTabTitleActive : '']}>详情</Text>
              {this.state.currentTab == 1 ? <View style={[s.topTabBor,styles.percent]}></View> :<View></View>}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { this._swtichTab(2) }}>
            <View style={[s.topTabView]}>
              <Text style={[s.topTabTitle,this.state.currentTab == 2? s.topTabTitleActive : '']}>评价</Text>
              {this.state.currentTab == 2 ? <View style={[s.topTabBor,styles.percent]}></View> :<View></View>}
            </View> 
          </TouchableWithoutFeedback>
        </View>
        <View style={isIphoneX()?s.ipxScrollHeight:s.scrollHeight}>
          <Swiper ref={(swiper) => {this.swiper = swiper}} autoplay={false} loop={false} showsPagination={false} onMomentumScrollEnd={(e, state, context) => {this._holdBigSwiperChange(e, state, context)}}>
          
            <Animated.View>
              <ScrollView showsVerticalScrollIndicator={false} ref='detailScrollView' style={isIphoneX()?s.ipxScrollHeight:s.scrollHeight}>
                <View style={s.swiperView}>
                  {this.state.swiperShow?
                    <Swiper
                        autoplay={true}
                        loop={false}
                        paginationStyle={{bottom:18,justifyContent:'center'}}
                        dotStyle={{backgroundColor:'rgba(0, 0, 0, 0.2)',width:10,height:10,borderRadius:5}}
                        activeDotStyle={{backgroundColor:'#ff6900',width:10,height:10,borderRadius:5}}
                        >
                        {this._renderSwiperItem()}
                    </Swiper>
                    :
                    null
                  }
                </View>
                <View style={s.info}>
                  <View style={s.infoTitle}>
                    <View style={s.infoTitleIcon}><Text style={s.infoTitleIconText}>自营</Text></View>
                    <Text style={s.infoTitleText}>{this.state.baseInfo.name}</Text>
                  </View>
                  {this.state.baseInfo.subTitle?<View style={s.infoSubTitle}>
                    <Text style={s.infoSubTitleText}>{this.state.baseInfo.subTitle}</Text>
                  </View> :<View></View>}
                  {this.state.baseInfo.promotionPrice ?
                    <View style={s.infoPrice}>
                      <Text style={s.infoPriceReal}>{Utils.filterPrice(this.state.baseInfo.promotionPrice,'￥')}</Text>
                      <Text style={s.infoPriceGray}>{Utils.filterPrice(this.state.baseInfo.price,'￥')}</Text>
                    </View>
                    :
                    <View style={s.infoPrice}>
                      <Text style={s.infoPriceReal}>{Utils.filterPrice(this.state.baseInfo.price,'￥')}</Text>
                    </View>
                  }
                  <View style={s.infoSale}>
                    <Text style={s.infoSaleNum}>已售{this.state.baseInfo.mpSalesVolume}件</Text>
                    <Text style={s.infoSaleAdd}>上海</Text>
                  </View>
                </View>
                {this._renderPro()}
                {this._renderSecurity()}
                <View style={s.sendInfo}>
                  <View style={s.sendInfoAdd}>
                    <Text style={s.sendInfoAddSong}>送至</Text>
                    <Image style={s.sendInfoAddImg} source={require('../images/detail_ic_location.png')} />
                    <Text style={s.sendInfoAddDetail}>上海市 浦东新区 张江镇</Text>
                  </View>
                  <View style={s.sendInfoTime}>
                    <Text style={s.sendInfoTimeText}>20:00前下单，可预计三天内送达</Text>
                  </View>
                  <Image style={s.sendInfoNext} source={require('../images/common_ic_next.png')}/>
                </View> 
                <View style={s.evaluate}>
                  <View style={s.evaluateTop}>
                    <Text style={s.evaluateTopText}>商品评价({this.state.comment.ratingUserCount})</Text>
                    <View style={s.evaluateTopRight}> 
                      <Text style={s.evaluateTopRightName}>好评度</Text>
                      <Text style={s.evaluateTopRightRotate}>{this.state.comment.positiveRate}%</Text>
                    </View>
                    <Image style={s.next} source={require('../images/common_ic_next.png')} />
                  </View>
                  <View style={s.evaluateContent}>
                    {this._renderComment('little')}
                  </View>
                  <View style={s.evaluateAll}>
                    <Text style={s.evaluateAllText}>查看全部评价</Text>
                  </View>
                </View>
                <GuessComponent navigation={this.props.navigation} holdItemClick={this._reload} mpId={this.state.mpId} ut={this.props.ut} />
                {this.state.baseInfo.h5DetailUrl?
                  <View style={isIphoneX()?s.ipxScrollHeight:s.scrollHeight}>
                      <WebView 
                        source = {{url:this.state.baseInfo.h5DetailUrl,method:"GET"}}
                        javaScriptEnabled = {true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                      />
                  </View>
                  :
                  null
                }
              </ScrollView>
            </Animated.View>
            <View style={isIphoneX()?s.ipxScrollHeight:s.scrollHeight}>
                <WebView 
                  source = {{url:this.state.baseInfo.h5DetailUrl,method:"GET"}}
                  javaScriptEnabled = {true}
                  domStorageEnabled={true}
                  scalesPageToFit={false}
                />
            </View>
            <View style={s.comment}>
              <View style={s.commentTop}>
                {this._renderCommentTab()}
              </View>
              <View style={[s.commentContent,isIphoneX()?s.ipxCommentContentHeight:s.commentContentHeight]}>
                {this.state.comment.mpcList && this.state.commentList ?
                  <FlatList
                    ref="pro_list"
                    horizontal={false} 
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    initialNumToRender={6}
                    keyExtractor={(item,index) => index} 
                    data={this.state.commentList} 
                    renderItem={(item) => this._renderCommentList(item)}
                    onEndReachedThreshold={0.1}
                    onEndReached={(event) => this._loadMoreComment(event)}
                  />
                  :
                  null
                }
              </View>
            </View>
          </Swiper>
        </View>
        
        <View style={s.footer}>
            <View style={s.footerLabel}>
              <Image style={s.footerLabelIcon} source={require('../images/detail_btn_service.png')} />
              <Text style={s.footerLabelText}>在线客服</Text>
            </View>
            <View style={s.footerLabel}>
              <Image style={s.footerLabelIcon} source={require('../images/detail_btn_collect_n.png')} />
              <Text style={s.footerLabelText}>收藏</Text>
            </View>
            <View style={s.footerLabel}>
              <Image style={s.footerLabelIcon} source={require('../images/detail_btn_shoppingcart.png')} />
              <Text style={s.footerLabelText}>购物车</Text>
            </View>
            <View style={s.footerAddCart}>
              <Text style={s.footerAddCartText}>加入购物车</Text>
            </View>
          </View>
      </View>
    )
  }
}
function select(store){
  return {
      ut: store.userStore.ut,
  }
}
export default connect(select)(Detail);