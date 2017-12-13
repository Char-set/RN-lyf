import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
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
        })
      } else{
        Utils.showTips('没有找到搜索结果');
      }
    })
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
        <ScrollView style={s.proScroll} showsVerticalScrollIndicator={false}>
          <View style={s.pro}>
            {this._buildProList()}
          </View>
        </ScrollView>
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