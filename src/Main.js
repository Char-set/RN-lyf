'use strict';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Root from './Root';

import configureStore from './store/index';

let store = configureStore();



export default class Main extends Component {
  constructor(props) { 
    super(props);
    this.state = {
			isLoading: true,
			store: configureStore(()=>{this.setState({isLoading: false})})
		}
  }
  componentDidMount () {
  }
  render() {
    if(this.state.isLoading){
			console.log('loading app');
			return null;
		}
    return (
      <Provider store={this.state.store}>
        <Root />
      </Provider>
    );
  }
}

