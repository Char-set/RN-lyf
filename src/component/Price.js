import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {commonStyle} from '../styles';//样式文件引入
import { debug } from 'util';

export default class Price extends Component{
  constructor(props){
    super(props);
    this.state = {
      availablePrice:'',
      originalPrice:''
    }
  }
  _filterPrice(price){
    if(!price) return;
    var newPrice = 0;
    if(typeof price == 'string'){
      newPrice = Number(price).toFixed(2);
    } else if(typeof price == 'number'){
      newPrice = price.toFixed(2);
    }
    return newPrice;
  }
  componentDidMount(){
    if(!this.props.params) return;
    this.setState({
      availablePrice:this._filterPrice(this.props.params.availablePrice),
      originalPrice:this._filterPrice(this.props.params.originalPrice)
    })
  }
  render() {
    if(this.state.availablePrice && this.state.originalPrice){
      return (
        <View style={commonStyle.priceView}>
          <Text style={commonStyle.priceViewAvailablePrice}>
          ￥{this.state.availablePrice}
          </Text>
          <Text style={commonStyle.priceViewOriginalPrice}>
          ￥{this.state.originalPrice}
          </Text>
        </View>
      );
    } else if(!this.state.availablePrice){
      return (
        <View style={commonStyle.priceView}>
          <Text style={commonStyle.priceViewAvailablePrice}>
          ￥{this.state.originalPrice}
          </Text>
        </View>
      )
    }
  }
}