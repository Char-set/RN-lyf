import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableWithoutFeedback,
    Image,
    Animated,
    Easing,
    StyleSheet
} from 'react-native';
import {commonStyle,loadingStyle} from '../styles';//样式文件引入
import usuallyStyle from '../common/Style';
const s = loadingStyle;
const u = usuallyStyle;
export default class Loading extends Component{
  constructor(props){
    super(props);
    this.state = {
        isShow:false,
        isAnimate:false,
        size:new Animated.Value(80),
        opacity:new Animated.Value(1)
    }
  }
  componentDidMount(){
      this.setState({
          isShow:(this.props.isShow != undefined) ? this.props.isShow : false
      });
  }
  componentWillReceiveProps(nextProps){
      if(this.state.isShow && nextProps.isShow == false){
        this._hide();
      }
      if(!this.state.isShow && nextProps.isShow == true){
        this.setState({
            isShow:true
        });
      }
  }
  _hide(){
      Animated.parallel(['size','opacity'].map(item => {
        return Animated.timing(this.state[item],{
            toValue: 0,
            duration: 1000,
            // useNativeDriver:true,
            easing: Easing.out(Easing.ease)
        });
      })).start(({finished}) => {
        if (finished) {
            this.setState({
                isShow:false,
                size:new Animated.Value(80),
                opacity:new Animated.Value(1)
            });
        }
    });
  }
  render() {
    return (this.state.isAnimate || this.state.isShow)?
        <View style={[s.loading]}>
            <Animated.Image style={{height:this.state.size,width:this.state.size,opacity:this.state.opacity}} source={require('../images/page-loading.gif')} />
        </View>
        :null;
  }
}