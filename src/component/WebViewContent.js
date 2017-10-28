import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    WebView,
} from 'react-native';
const {width,height} = Dimensions.get('window');
export default class WebViewContent extends Component {
  constructor(props){
    super(props)
  }
  render(){
    // console.log(this.props.navigation.state.params.webUrl)
    var url = this.props.params?this.props.params.webUrl:'http://m.laiyifen.com/category.html'
    return(
      <View style = {styles.container}>
        <WebView 
        style = {styles.webViewStyle}
        source = {{url:url,method:"GET"}}
        javaScriptEnabled = {true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:20
  },
  webViewStyle:{
    width:width,
    height:height - 20,
    backgroundColor:"#b2b2b2"
  }
})