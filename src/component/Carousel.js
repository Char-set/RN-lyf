import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import Swiper from 'react-native-swiper';
var {height, width} = Dimensions.get('window');
export default class Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateArray:[],
            swiperShow:false
        }
    }
    _openLink(item){
        this.props.navigation.navigate('WebView',{webUrl:item.linkUrl})
    }
    getSwiperItem(){
        let imageArray = [];
        var imagesDate = this.props.images || [];

        imagesDate.forEach((item,index) =>{
            imageArray.push(
                <View key={index} style={styles.imageView} >
                    <TouchableWithoutFeedback onPress={() => {
                            this._openLink(item)
                        }}>
                        <Image 
                        key={index}
                        source={{uri:item.imageUrl}}
                        style={styles.imageItem}
                        resizeMode = 'contain'
                        />
                    </TouchableWithoutFeedback>
                </View>
            )
        })
        return imageArray;
    }
    componentDidMount(){
        setTimeout(() => {
            this.setState({
                swiperShow:true
            })
        },300)
    }
    render() {
    // this.getSwiperItem();
        if(this.state.swiperShow){
            return (
                <View style={{height:150}}>
                    <Swiper
                    autoplay={true}
                    paginationStyle={{bottom:0,justifyContent:'flex-end'}}
                    dotStyle={{backgroundColor:'#fff'}}
                    activeDotStyle={{backgroundColor:'#ff6900'}}
                    >
                    {this.getSwiperItem()}
                    </Swiper>
                </View>
            );
        } else{
            return (
                <View style={{height:150}}>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    imageItem:{
        width:width,
        height:150,
    },
    SwiperStyle:{
        height:150,
        width:width
    },
    imageView:{
        height:150,
        width:width,
        flex:1
    }
});