import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonUtils from '../utils/ComUtils';
export default class footer extends Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
  }
  jumpPage(name){
    if(this.props.navigation.state.routeName == name){
      return;
    }
    this.props.navigation.navigate(name);
  }
  render() {
    return (
      <View style={styles.footerView}>
        <View style={styles.footerItem}>
          <TouchableOpacity onPress={() => {this.jumpPage('Index')}}>
          <Ionicons
            name= 'ios-chatboxes'
            size={26}
            style={{ color: "red" }}
          />
            <Text>首页</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerItem}>
          <Text>分类</Text>
        </View>
        <View style={styles.footerItem}>
          <Text>购物车</Text>
        </View>
        <View style={styles.footerItem}>
          <TouchableOpacity onPress={() => {
              this.jumpPage('My')
            }}>
            <Ionicons
            name="ios-home"
            size={26}
            style={{ color: "red" }}
          />
            <Text>我</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  footerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height:44,
    position:'absolute',
    bottom:0,
    width:'100%',
    flexDirection:'row'
  },
  footerItem:{
    width:'25%',
    height:30,
    justifyContent:'center',
    alignItems:'center',
    borderRightWidth:1,
    borderColor:'#bbb'
  }
});