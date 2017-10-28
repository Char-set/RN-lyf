import React, { Component } from 'react';

import { StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

// const ChannelItem = ({imageUrl,title}) => {
//   <View style={styles.channelView}>
//     <Image source={{uri:imageUrl}} style={styles.channelImg} />
//     <Text style={styles.channelText}>{title}</Text>
//   </View>
// }

export default class ChannelItem extends Component {
  constructor(props) {
    super(props);
  }
  _openWebView(item) {
    this.props.navigation.navigate('WebView',{webUrl:item.linkUrl})
  }
  render(){
    return(
      <View style={styles.channelView} >
        <TouchableOpacity style={styles.channelBtn} onPress={() => {
          this._openWebView(this.props.item)
        }}>
          <Image source={{uri:this.props.item.imageUrl}} style={styles.channelImg} />
          <Text style={styles.channelText}>{this.props.item.name}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  channelView:{
    width:'20%',
    height:70,
    justifyContent:'flex-end',
    alignItems:'center'
  },
  channelBtn:{
    width:'100%',
    alignItems:'center'
  },
  channelImg:{
    width:36,
    height:36,
    marginBottom:5
  },
  channelText:{
    fontSize:11,
    color:'#999',
    textAlign:'center'
  }
})
