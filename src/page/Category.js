import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
/**
 * 自定义工具引入
 */
import NetUtil from '../utils/NetUtil';//网络请求
import Config from '../config/Default';//默认配置

const {width,height} = Dimensions.get('window');

export default class Category extends Component {
  constructor (props) {
    super(props);
    this.state = {
      categoryList:[],
      currentCategoryId:'',
      categoryChildList:[],
      cashWarehouseW:[]
    }
  }
  componentDidMount() {
    this.getCategory();
  }
  getCategory () {
    var url = Config.apiHost + '/api/category/list';
    var params = {
      "parentId":0,
      "level":1,
      "companyId":30
    };
    NetUtil.get(url, params, (res) => {
      if(res.data){
        res.data.categorys.forEach((item) => {
          item.choosed = false;
        });
        res.data.categorys[0].choosed = true;
        this.setState({
          categoryList:res.data.categorys,
          currentCategoryId:res.data.categorys[0].categoryId
        });
        this._getCategoryChild(this.state.currentCategoryId);
      }
    })
  }
  _getCategoryChild(parentId){
    let cashWarehouseW = this.state.cashWarehouseW;

    if(cashWarehouseW[parentId]){
      this.setState({
        categoryChildList:cashWarehouseW[parentId]
      });
      return;
    }


    let url = Config.apiHost + '/api/category/list';
    var params = {
      "parentId":parentId,
      "level":2,
      "companyId":30
    };
    NetUtil.get(url,params,(res) => {
      if(res.data && res.data.categorys){
        cashWarehouseW[parentId] = res.data.categorys;
        this.setState({
          cashWarehouseW:cashWarehouseW,
          categoryChildList:res.data.categorys
        })
      }
    })
  }
  _openLink(item){
    var url = Config.apiHost + '/search.html?from=c&categoryId=' + item.categoryId;
    this.props.navigation.navigate('WebView',{webUrl:url})
}
  _switch(item){
    if(this.state.currentCategoryId != item.categoryId){
      var temp = this.state.categoryList;
      temp.forEach((v) => {
        if(v.categoryId == item.categoryId){
          v.choosed = true;
        } else{
          v.choosed = false;
        }
      })
      this.setState({
        categoryList:temp,
        currentCategoryId:item.categoryId
      });
      this._getCategoryChild(item.categoryId);
    }
  }
  _buildCategory(){
    var cateArray = [];
    this.state.categoryList.forEach((item,index) => {
      cateArray.push(
        <View style={[item.choosed ? styles.categoryItemActive:styles.categoryItem]} key={item.categoryId}>
          <TouchableWithoutFeedback onPress={ () => {
              this._switch(item);
            }}>
            <View style={[item.choosed ? styles.categoryItemActive:styles.categoryItem]} key={item.categoryId}>
              <Image style={styles.categoryItemImg} source={{uri:item.pictureUrl}} />
              <Text style={[item.choosed ? styles.categoryItemTextActive:styles.categoryItemText]}>{item.categoryName}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    });
    return cateArray;
  }
  _buildCategoryChild(){
    let childList = [];
    this.state.categoryChildList.forEach((item) => {
      let itemList = [];
      if(item.children){
        item.children.forEach((itemTwo) => {
          itemList.push(
            <TouchableWithoutFeedback key={itemTwo.categoryId} onPress={() => {
                this._openLink(itemTwo);
              }}>
              <View style={styles.categoryContentItemChild}> 
                <View style={styles.categoryContentItemChildContent}>
                  <Image style={styles.categoryContentItemChildImg} source={{uri:itemTwo.pictureUrl}} />
                  <Text numberOfLines={1} style={styles.categoryContentItemChildText}>{itemTwo.categoryName}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )
        });
      }
      childList.push(
        <View style={styles.categoryContentItem} key={item.categoryId}>
          <View style={styles.categoryContentItemTitle}>
            <Text>{item.categoryName}</Text>
          </View>
          <View style={styles.categoryContentItemChilds}>
            {itemList}
          </View>
        </View>
      )
    });
    return childList;
  }
  render () {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.categoryView}>
          <View style={styles.categoryWraper}>
            {this._buildCategory()}
          </View>
        </ScrollView>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.categoryContentView}>
          <View style={styles.categoryContent}>
            {this._buildCategoryChild()}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    paddingTop:20,
    display:'flex',
    flexDirection:'row',
    // overflow:'hidden',
    backgroundColor:'#f0f0f0'
  },
  categoryView:{
    width:90,
  },
  categoryWraper:{
    width:90,
    height:'100%',    
    justifyContent:"center",
    alignItems:"center",
  },
  categoryContentView:{
    width:width - 90,
    height:'100%',
  },
  categoryContent:{
    width:"100%",
    height:"100%",    
    // justifyContent:"center",
    alignItems:"center",
    backgroundColor:'#f0f0f0',
  },
  categoryItem:{
    height:56,
    width:'100%',
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:'#ddd',
    borderBottomWidth:0.5,
  },
  categoryItemActive:{
    height:56,
    width:'100%',
    backgroundColor:'#fafafa',
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor:'#ddd',
    borderBottomWidth:0.5,
    borderLeftColor:Config.css.themeColor,
    borderLeftWidth:1,
  },
  categoryItemImg:{
    width:18,
    height:18
  },
  categoryItemText:{
    marginTop:5,
    fontSize:13
  },
  categoryItemTextActive:{
    marginTop:5,
    fontSize:13,
    color:Config.css.themeColor
  },
  categoryContentItem:{
    paddingRight:10,
    width:'100%'
  },
  categoryContentItemTitle:{
    width:'100%',
    height:40,
    paddingLeft:8,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  categoryContentItemChilds:{
    display:'flex',
    flexDirection:'row',
    flexWrap:'wrap',
  },

  categoryContentItemChild:{
    width:'33%',
    justifyContent:'center',
    alignItems:'center'
  },
  categoryContentItemChildContent:{
    width:'90%',
    marginLeft:10,
    marginBottom:10,
    padding:8,
    justifyContent:"center",
    alignItems:'center',
    backgroundColor:"#fff",
  },
  categoryContentItemChildImg:{
    width:'100%',
    height:64
  },
  categoryContentItemChildText:{
    color:"#666"
  }
})