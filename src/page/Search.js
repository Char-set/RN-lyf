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
  TextInput,
  UIManager,
  findNodeHandle,
  DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import {commonStyle,searchStyle} from '../styles';//样式文件引入

const s = searchStyle;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { timing } = Animated

const styles = StyleSheet.create({
  filterStateTab:{
    backgroundColor:'rgba(0,0,0,0.5)'
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
import Session from '../utils/Session';
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
      sortByList:[],//排序列表
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
      promotionDetail:{},//促销活动详情
      cartPromotion:{},//促销顶部计算信息
      currentFilter:{},//选中的排序信息
      showFilterState:false,//显示排序列表
    }
  }
  componentDidMount() {
    Session.getSessionId().then(sid => {
      if(this.props.params){
        this.setState({
          categoryId:this.props.params.categoryId || '',
          promotionId:this.props.params.promotionId || '',
          sessionId:sid
        },() => {
          this._loadSearch();
          if(this.state.promotionId){
            this._getPromotionDetail();
            this._getPromotionExt();
          }
        })
      }
    });
    
  }
  componentWillUpdate(){
  }
  // 获取促销信息
  _getPromotionDetail = () => {
    let url = '/api/product/promotionDetail';
    let params = {
      promotionId:this.state.promotionId,
      platformId:Config.platformId
    };
    NetUtil.get(url,params,res => {
      this.setState({
        promotionDetail:res.data || {}
      })
    });
  }
  // 获取促销计算信息
  _getPromotionExt = () => {
    let url = '/api/cart/ext';
    let params = {
      ut:this.state.ut || '',
      sessionId:this.state.sessionId,
      companyId:Config.companyId,
      promotionId:this.state.promotionId,
      platformId:Config.platformId
    };
    NetUtil.get(url,params,res => {
      this.setState({
        cartPromotion:res.data || {}
      });
    });
  }
  //flag为真是，表示是滚动加载
  _loadSearch(flag){
    if(!this.state.categoryId && !this.state.searchWord && !this.state.promotionId){
      Utils.showTips('请输入搜索词');
      return;
    }
    let url = '/api/search/searchList';
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
        let productList = [];
        switch(flag){
          case true:
            productList = this.state.proList.concat(res.data.productList);
            break;
          case false:
            productList = res.data.productList;
            break;
          default:
            productList = res.data.productList;
            break;
        }
        let currentFilter = this.state.currentFilter;
        if (res.data.sortByList) {
            for(let sort of res.data.sortByList){
                if(sort.sortTypeCode==this.state.sortType)
                currentFilter=sort;
            }
        }
        this.setState({
          proList:productList,
          sortByList:res.data.sortByList || [],
          currentFilter:currentFilter,
        });
        if(this.state.refreshStatus == 3){
          let timeStr = '';
          timeStr = timeFormat.dateformat(new Date(),'MM-dd hh:mm');
          this.setState({
            refreshStatus:1,
            disabledScroll:false,
            dragEndFlag:false,
            refreshLastTime:timeStr
          });
          timing(
            this.state.scrollDistance,
            { toValue: 0, duration: 200, useNativeDriver: true }
          ).start()
        }
      } else{
        Utils.showTips('没有找到搜索结果');
        this.setState({
          proList:[]
        });
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
  _goDetais(item){
    this.props.navigation.navigate('DetailView',{mpId:item.mpId});
  }
  _searchBack = () => {
    this.props.navigation.goBack();
    DeviceEventEmitter.emit('updateCartScreen');
  }
  _goCart = () => {
    const backAction = NavigationActions.back({
      key: 'IndexView',
    });
    this.props.navigation.dispatch(backAction);
  }
  _buildProItem(proItem){
    let item = proItem.item;
    let index = proItem.index;
    return (
      <View style={s.proLi} key={index}>
        <TouchableWithoutFeedback onPress={() => this._goDetais(item)}>
          <Image style={s.proLiImg} source={{uri:item.picUrl}} />
        </TouchableWithoutFeedback>
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
        <TouchableWithoutFeedback onPress={() => this._checkSerialPro(item)}>
          <Image style={s.proLiAddCart} source={require('../images/common_btn_addtoshoppingcart.png')}/>
        </TouchableWithoutFeedback>
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
      // timing(
      //   this.state.scrollDistance,
      //   { toValue: 50, duration: 100, useNativeDriver: true }
      // ).start()
    }
  }
  _handleTouchEnd(event){
    if(this.state.refreshStatus == 2 && this.state.disabledScroll){
      this.setState({
        refreshStatus:3,
        dragEndFlag:true,
        pageNo:1
      },() => {
        if(this.state.disabledScroll && this.state.dragEndFlag){
          timing(
            this.state.scrollDistance,
            { toValue: 50, duration: 500, useNativeDriver: true }
          ).start()
        }
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
    var url = '/search.html?from=c&categoryId=' + item.categoryId;
    this.props.navigation.navigate('WebView',{webUrl:url})
  }
  _pullUp(event){
    // Utils.showTips('22222')
    // let listRef = findNodeHandle(this.refs.pro_list);
    // console.log(listRef);
    // UIManager.measure(listRef, (x, y, width, height, pageX, pageY) => {
    //   debugger
    // });
    // let pageNo = this.data.pageNo + 1;
    this.setState({
      pageNo:this.state.pageNo + 1
    },()=>{
      this._loadSearch(true);
    })
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
  _addCart(mpId){
    // Utils.showTips(JSON.stringify(item));
    // console.info(item);
    let url = '/api/cart/addItem';
    let params = {
      sessionId:this.state.sessionId,
      mpId:mpId,
      num:1,
      ut:this.state.ut || ''
    };
    NetUtil.postForm(url,params,res => {
      Utils.showTips('添加成功');
      if(this.state.promotionId){
        this._getPromotionExt();
      }
    })

  }
  _renderFilterState = () => {
    let arr = [];
    (this.state.sortByList || []).forEach(item => {
      arr.push(
        <TouchableWithoutFeedback onPress={() => this._chooseSort(item)}>
          <View style={s.filterStateTabContentItem}>
            <Text style={[s.filterStateTabContentItemText,item.sortTypeCode == this.state.sortType ? s.filterStateTabContentItemTextActive : '']}>{item.sortTypeDesc}</Text>
            {item.sortTypeCode == this.state.sortType ? 
            <Image style={s.filterStateTabContentItemImg} source={require('../images/common_ic_select.png')} />
            :null
            }
          </View>
        </TouchableWithoutFeedback>
      )
    });
    return arr;
  }
  // 选择排序方式
  _chooseSort = (item) => {
    this.setState({
      sortType:item.sortTypeCode,
      showFilterState:false,
      currentFilter:item
    },() => {
      this._loadSearch();
    });
  }
  //设置排序方式为销量优先
  _setSortByVo = () => {
    this.setState({
      sortType:'volume4sale_desc'
    },() => {
      this._loadSearch();
    })
  }
  render () {
    return (
      <View style={[commonStyle.container,isIphoneX()?commonStyle.pdT45:'']}>
        {!this.state.promotionId ?
          <View style={s.topSearch}>
            <TouchableWithoutFeedback onPress={() => this._searchBack()}>
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
          </View>:null
        }
        {this.state.promotionId ? 
          <View style={s.topSearch}>
            <TouchableWithoutFeedback onPress={() => this._searchBack()}>
              <Image style={s.topSearchBack} source={require('../images/common_btn_back.png')} />
            </TouchableWithoutFeedback>
            <Text style={s.topSearchPromotionText}>活动商品</Text>
          </View>:null
        }
        {this.state.promotionId ? 
          <View style={s.promotionTips}>
            <Text style={s.promotionTipsText} numberOfLines={1}>活动说明：{this.state.promotionDetail.description}</Text>
          </View>:null
        }
        {this.state.promotionId?
          <View style={s.promotionFooter}>
            <View style={s.promotionFooterInfo}>
              <Text style={s.promotionFooterInfoTotal}>
                合计：<Text style={s.promotionFooterInfoTotalMoney}>{Utils.filterPrice(this.state.cartPromotion.totalPrice,'￥',0)}</Text>
              </Text>
              <Text style={s.promotionFooterInfoTips} numberOfLines={1}>
                {this.state.cartPromotion.message}
              </Text>
            </View>
            <View style={s.promotionFooterBtn}>
              <View style={s.promotionFooterBtnOne}>
                <Text style={s.promotionFooterBtnOneText}>查看赠品</Text>
              </View>
              <TouchableWithoutFeedback onPress={() => this._goCart()}>
                <View style={s.promotionFooterBtnTwo}>
                  <Text style={s.promotionFooterBtnTwoText}>进入购物车</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>:null
        }
        {this.state.proList.length > 0 ? 
          <View style={[s.filterTab]}>
            <TouchableWithoutFeedback onPress={() => this.setState({showFilterState:true})}>
              <View style={s.filterTabOne}>
                <Text style={[s.filterTabOneText,this.state.sortType == this.state.currentFilter.sortTypeCode ? s.filterTabOneTextActive:'']}>{this.state.currentFilter.sortTypeShort}</Text>
                <Image style={s.filterTabOneImg} source={this.state.sortType == this.state.currentFilter.sortTypeCode ? require('../images/icon_Start_red.png') : require('../images/icon_Start_gray.png')}/>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this._setSortByVo()}>
              <View style={s.filterTabOne}>
                <Text style={[s.filterTabOneText,this.state.sortType == 'volume4sale_desc' ? s.filterTabOneTextActive : '']}>销量优先</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={s.filterTabOne}>
              <Text style={s.filterTabOneText}>筛选</Text>
              <Image style={s.filterTabOneImg} source={require('../images/search_btn_filter.png')}/>
            </View>
            <View style={s.filterTabTwo}>
              <Image style={s.filterTabTwoImg} source={require('../images/search_btn_list.png')}/>
            </View>
          </View>
          :null
        }
        {this.state.showFilterState ? 
          <TouchableWithoutFeedback onPress={() =>  this.setState({showFilterState:false})}>
            <View style={[s.filterStateTab,styles.filterStateTab,this.state.promotionId?s.filterStateTabPromotionHeight:'']}>
              <View style={s.filterStateTabContent}>
                {this._renderFilterState()}
              </View>
            </View>
          </TouchableWithoutFeedback>
          :null
        }
        {this.state.proList.length>0?<Animated.View style={[s.proScroll,{transform:[{translateY:this.state.scrollDistance}]}]}>
          <FlatList
            ref="pro_list"
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
            onEndReachedThreshold={0.1}
            onEndReached={(event) => this._pullUp(event)}
          />
        </Animated.View>:null}
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