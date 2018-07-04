import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {commonStyle} from '../styles';//样式文件引入
import { debug } from 'util';
import ComUtils from '../utils/ComUtils';
export default class Price extends Component{
  constructor(props){
    super(props);
    this.state = {
      availablePrice:'',
      originalPrice:''
    }
  }
  componentWillReceiveProps(){
    if(!this.props.params) return;
    this.setState({
      availablePrice:ComUtils.filterPrice(this.props.params.availablePrice,'￥'),
      originalPrice:ComUtils.filterPrice(this.props.params.originalPrice,'￥')
    })
  }
  componentDidMount(){
    if(!this.props.params) return;
    this.setState({
      availablePrice:ComUtils.filterPrice(this.props.params.availablePrice,'￥'),
      originalPrice:ComUtils.filterPrice(this.props.params.originalPrice,'￥')
    })
  }
  //组件是否需要更新
  // shouldComponentUpdate(nextProps, nextState){
  //     // debugger
  //   if(this.state.availablePrice != (nextProps.params.availablePrice||'') || this.state.originalPrice != (nextProps.params.originalPrice ||'')){
  //     return true;
  //   } else{
  //     return false;
  //   }
  // }
  // componentDidUpdate(){
  //   if(!this.props.params) return;
  //   if(this.state.availablePrice != (this.props.params.availablePrice||'') || this.state.originalPrice != (this.props.params.originalPrice ||'')){
  //     this.setState({
  //       availablePrice:ComUtils.filterPrice(this.props.params.availablePrice,'￥'),
  //       originalPrice:ComUtils.filterPrice(this.props.params.originalPrice,'￥')
  //     })
  //   }
  // }
  render() {
    if(this.state.availablePrice && this.state.originalPrice){
      return (
        <View style={commonStyle.priceView}>
          <Text style={commonStyle.priceViewAvailablePrice}>
          {this.state.availablePrice}
          </Text>
          <Text style={commonStyle.priceViewOriginalPrice}>
          {this.state.originalPrice}
          </Text>
        </View>
      );
    } else if(!this.state.availablePrice){
      return (
        <View style={commonStyle.priceView}>
          <Text style={commonStyle.priceViewAvailablePrice}>
          {this.state.originalPrice}
          </Text>
        </View>
      )
    } else{
      return <View></View>
    }
  }
}