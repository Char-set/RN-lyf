import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import {commonStyle,headerStyle} from '../styles';//样式文件引入
const s = headerStyle;
export default class Header extends Component{
  constructor(props){
    super(props);
    this.state = {
        title:'',
        showBack:true
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
        title:nextProps.title || '',
        showBack:(typeof nextProps.showBack == 'boolean') ? nextProps.showBack : true
    });
  }
  componentDidMount(){
    this.setState({
        title:this.props.title || '',
        showBack:(typeof this.props.showBack == 'boolean') ? this.props.showBack : true
    });
  }
  render() {
    return (
      <View style={s.header}>
        {this.state.showBack?
            <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                <Image style={s.headerBack} source={require('../images/common_btn_back.png')} />
            </TouchableWithoutFeedback>
            :null
        }
        <View style={s.headerTitle}>
            <Text style={s.headerTitleText}>{this.state.title}</Text>
        </View>
        
      </View>
    );
  }
}