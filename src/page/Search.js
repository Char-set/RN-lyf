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
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import {commonStyle,searchStyle} from '../styles';//样式文件引入

const s = searchStyle;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { timing } = Animated
/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import Utils from '../utils/ComUtils';//网络请求
import Config from '../config/Default';//默认配置

/**
 * 自定义组件引入
 */

import PriceComponent from '../component/Price';
// import { request } from 'https';

const {width,height} = Dimensions.get('window');

class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ut:'',//用户登录ut
      proList:[],//搜索的商品列表
      merchantId:'',//商家Id
      promotionId:'',//促销活动Id
      categoryId:'',//分类类目Id
      brandIds:[],//促销活动Id
      searchWord:'',//搜索关键词
      sortType:'10',//排序字段，默认10（综合）
      priceRange:'',//价格区间筛选
      filterType:'',//筛选字段
      shoppingGuideJson:'',//系列属性筛选
      pageNo:1,//当前页数
      pageSize:10,//一页请求数量
      refreshStatus:1,//1、下拉即可刷新，2、松开即可刷新，3、正在刷新中
      scrollDistance:new Animated.Value(0),//需要滚动的距离
      disabledScroll:false,//正在下拉中，禁用其他操作
      dragEndFlag:false,//下拉结束标识
      refreshLastTime:'12-13 19:33',//页面最后刷新时间
    }
  }
  componentDidMount() {
    console.log(this.props);
    if(this.props.params && this.props.params.categoryId){
      this.setState({
        categoryId:this.props.params.categoryId
      },() => {
        this._loadSearch();
      })
    }
  }
  componentWillUpdate(){
  }
  _loadSearch(){
    if(!this.state.categoryId && !this.state.searchWord){
      Utils.showTips('请输入搜索词');
      return;
    }
    let url = Config.apiHost + '/api/search/searchList';
    let params = {
      ut:this.state.ut,
      merchantId: this.state.merchantId,
      companyId: Config.companyId,//公司id
      shoppingGuideJson: this.state.shoppingGuideJson,//导购属性json字符串
      brandIds: this.state.brandIds.join(),//品牌id
      promotionIds: this.state.promotionId,//促销id
      coverProvinceIds: '',//覆盖省份id
      sortType: this.state.sortType,//排序字段code
      filterType: this.state.filterType,//筛选过滤
      priceRange: this.state.priceRange,//价格区间
      pageNo: this.state.pageNo,//当前页
      pageSize: this.state.pageSize,//当页显示数量
      platformId:Config.platformId,
      areaCode: '',
    }
    if(this.state.searchWord){
      params.keyword = this.state.searchWord;
    }
    if(this.state.categoryId){
      params.navCategoryIds = this.state.categoryId;
    }
    NetUtil.get(url,params,(res) => {
      if(res.data && res.data.totalCount > 0){
        this.setState({
          proList:res.data.productList
        });
        if(this.state.refreshStatus == 3){
          this.setState({
            refreshStatus:1,
            disabledScroll:false,
            dragEndFlag:false
          });
          timing(
            this.state.scrollDistance,
            { toValue: 0, duration: 200, useNativeDriver: true }
          ).start()
        }
      } else{
        Utils.showTips('没有找到搜索结果');
      }
    })
  }
  _buildRefreshText(){
    let text = '';
    switch (this.state.refreshStatus) {
      case 1:
        text = '下拉即可刷新';
        break;
      case 2:
        text = '松开即可刷新';
        break;
      case 3:
        text = '正在刷新中...';
        break;
    
      default:
        text = '下拉即可刷新';
        break;
    }
    return text;
  }
  _buildRefreshHeader(){
    return(
      <View style={s.refreshView}>
        <Image style={s.refreshViewImg} source={require('../images/loading.gif')} />
        <View style={s.refreshViewText}>
          <Text style={s.refreshViewTextStatus}>
            {this._buildRefreshText()}
          </Text>
          <Text style={s.refreshViewTextTime}>
            <Text style={s.refreshViewTextTimeF}>最后更新：</Text>
            <Text style={[s.refreshViewTextTimeS,commonStyle.pl5]}>
              {this.state.refreshLastTime}
            </Text>
          </Text>
        </View>
      </View>
    )
  }
  _buildProItem(proItem){
    let item = proItem.item;
    let index = proItem.index;
    return (
      <View style={s.proLi} key={index}>
        <Image style={s.proLiImg} source={{uri:item.picUrl}} />
        <Text numberOfLines={1} style={s.proLiTitle}>{item.name}</Text>
        <View style={s.proLiPromotion}>
          {this._buildPromotionIcon(item.promotionInfo)}
        </View>
        <View style={s.proLiPrice}>
          <PriceComponent params={{availablePrice:item.promotionPrice,originalPrice:item.price}} />
        </View>
        <View style={s.proLiComment}>
          <View style={[s.proLiCommentItem,commonStyle.mr5]}>
            <Text style={s.proLiCommentItemBer}>{item.commentInfo.commentNum}</Text>
            <Text style={s.proLiCommentItemText}>评论</Text>
          </View>
          <View style={s.proLiCommentItem}>
            <Text style={s.proLiCommentItemText}>好评</Text>
            <Text style={s.proLiCommentItemBer}>{item.commentInfo.goodRate + '%'}</Text>
          </View>
        </View>
        <Image style={s.proLiAddCart} source={require('../images/common_btn_addtoshoppingcart.png')}/>
      </View>
    )
  }
  _handleScroll(event){
    console.log(event.nativeEvent.contentOffset.y);
    let scrollDistance = event.nativeEvent.contentOffset.y;
    if(scrollDistance < -80 && !this.state.disabledScroll){
      this.setState({
        refreshStatus:2,
        disabledScroll:true
      });
      // setTimeout(() => {
      //   timing(
      //     this.state.scrollDistance,
      //     { toValue: 0, duration: 200, useNativeDriver: true }
      //   ).start()
      // }, 2000);
    }
    if(scrollDistance >= -55 && this.state.disabledScroll && this.state.dragEndFlag){
      timing(
        this.state.scrollDistance,
        { toValue: 50, duration: 100, useNativeDriver: true }
      ).start()
    }
  }
  _handleTouchEnd(event){
    if(this.state.refreshStatus == 2 && this.state.disabledScroll){
      this.setState({
        refreshStatus:3,
        dragEndFlag:true
      },() => {
        setTimeout(() => {
          this._loadSearch();
        }, 1000);
      });
    }
  }
  _buildProList(){
    var proList = [];
    this.state.proList.forEach((item,index) => {
      proList.push(
        <View style={s.proLi} key={index}>
          <Image style={s.proLiImg} source={{uri:item.picUrl}} />
          <Text numberOfLines={1} style={s.proLiTitle}>{item.name}</Text>
          <View style={s.proLiPromotion}>
            {this._buildPromotionIcon(item.promotionInfo)}
          </View>
          <View style={s.proLiPrice}>
            <PriceComponent params={{availablePrice:item.promotionPrice,originalPrice:item.price}} />
          </View>
          <View style={s.proLiComment}>
            <View style={[s.proLiCommentItem,commonStyle.mr5]}>
              <Text style={s.proLiCommentItemBer}>{item.commentInfo.commentNum}</Text>
              <Text style={s.proLiCommentItemText}>评论</Text>
            </View>
            <View style={s.proLiCommentItem}>
              <Text style={s.proLiCommentItemText}>好评</Text>
              <Text style={s.proLiCommentItemBer}>{item.commentInfo.goodRate + '%'}</Text>
            </View>
          </View>
          <Image style={s.proLiAddCart} source={require('../images/common_btn_addtoshoppingcart.png')}/>
        </View>
      )
    });
    return proList;
  }
  _buildPromotionIcon(promotion){
    if(!promotion) return;
    var arrPro=[];
    promotion[0].promotions.forEach((item,index) => {
      arrPro.push(
        <Image key={index} style={s.proLiPromotionIcon} source={{uri:item.iconUrl}} />
      )
    });
    return arrPro;
  }
  _openLink(item){
    var url = Config.apiHost + '/search.html?from=c&categoryId=' + item.categoryId;
    this.props.navigation.navigate('WebView',{webUrl:url})
  }
 
  render () {
    return (
      <View style={[commonStyle.container,isIphoneX()?commonStyle.pdT45:'']}>
        <View style={s.topSearch}>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
            <Image style={s.topSearchBack} source={require('../images/common_btn_back.png')} />
          </TouchableWithoutFeedback>
          <View style={s.topSearchView} >
            <Image style={s.topSearchViewIcon} source={require('../images/common_ic_search.png')} />
            <TextInput style={s.topSearchInput} 
              autoCapitalize={'none'}
              placeholder={'来伊份'}
              onChangeText={(searchWord) => {this.setState({searchWord})}}
              value={this.state.searchWord}
            />
          </View>
          <TouchableWithoutFeedback onPress={() => this._loadSearch()}>
            <View style={s.topSearchConfirm}>
              <Text style={s.topSearchConfirmText}>搜索</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Image style={s.topSearchScan} source={require('../images/search_btn_qrcode.png')} />
          </TouchableWithoutFeedback>
        </View>
        <Animated.View style={[s.proScroll,{transform:[{translateY:this.state.scrollDistance}]}]}>
          <FlatList 
            horizontal={false} 
            numColumns={2}
            initialNumToRender={6}
            keyExtractor={(item,index) => index} 
            columnWrapperStyle={s.pro} 
            data={this.state.proList} 
            renderItem={(item) => this._buildProItem(item)}
            ListHeaderComponent={() => this._buildRefreshHeader()}
            onScroll={(event) => this._handleScroll(event)}
            onScrollEndDrag={(event) => this._handleTouchEnd(event)}
          />
        </Animated.View>
      </View>
    )
  }
}
function select(store){
  return {
      ut: store.userStore.ut,
  }
}
export default connect(select)(Search);