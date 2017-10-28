import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class hello extends Component {
    constructor(props) {
        console.log('---------constructor----------');
        super(props);
        console.log(this.props.xx);
    }
    //组件将要被加载
    componentWillMount() {
        console.log('---------componentWillMount----------');
        console.log(this.props.xx);
    }
    //组件加载完毕
    componentDidMount() {
        console.log('---------componentDidMount----------')
        console.log(this.props.xx);
    }
    //组件更新
    componentWillReceiveProps(nextProps) {
        console.log('---------componentWillReceiveProps----------');
        console.log(this.props.xx);
    }
    //组件是否需要更新
    shouldComponentUpdate(nextProps, nextState) {
        console.log('---------shouldComponentUpdate----------');
        console.log(this.props.xx);
        return true;
    }
    //组件将要更新
    componentWillUpdate() {
        console.log('---------componentWillUpdate----------');
        console.log(this.props.xx);
    }
    //组件已经更新
    componentDidUpdate() {
        console.log('---------componentDidUpdate----------');
        console.log(this.props.xx);
    }
    //组件呗卸载
    componentWillUnmount() {
        console.log('---------componentWillUnmount----------');
        console.log(this.props.xx);
    }
    render() {
        console.log('---render------')
        return <Text>hello,this is my first react native app.</Text>
    }
}