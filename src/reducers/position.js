'use strict';

import * as TYPES from '../actions/types';

const initialState = {
    province:{},
    city:{},
    regoin:{},
    receiverId:''
};

export default function position(state=initialState, action){
	switch(action.type){
		case TYPES.POSITION_SET:
			return {
				...state,
                province: action.province,
                city: action.city,
                regoin: action.regoin,
                receiverId:action.receiverId
            };
        case TYPES.POSITION_UPDATE:
			return {
				...state,
                province: action.province,
                city: action.city,
                regoin: action.regoin,
                receiverId:action.receiverId
			};
        case TYPES.POSITION_CLEAR:
			return {
				...state,
                province:{},
                city:{},
                regoin:{},
                receiverId:''
			};
		default: 
			return state;
	}

}