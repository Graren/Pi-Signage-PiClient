const { 
    A_FETCH,
    A_SUCCESS,
    A_FAILURE,
    B_FETCH,
    B_SUCCESS,
    B_FAILURE,
    B_NEW_VIDEO,
    C_FETCH,
    C_SUCCESS,
    C_FAILURE } = require('../actions')

const initial_state_a = {
    videos: [],
    syncing: false,
    error: null
}

const download = require('./../downloader/index');

const initial_state_b = {
    videos: [],
    syncing: false,
    error: null
}

const initial_state_c = {
    videos: [],
    syncing: false,
    error: null
}

const a_reducer = (action, state) => {
    state = state || initial_state_a;
    switch(action.type){
        case A_FETCH:
            return Object.assign({}, state, {
                syncing: true
            })
            break
        case A_SUCCESS:
            return Object.assign({}, state, {
                syncing: false,
                videos: [
                    ...state.videos,
                    ...action.videos
                ]
            })
            break
        case A_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            })
            break
        default:
            return state
            break
    }
}

 const b_reducer = (action, state ) => {
    state = state || initial_state_b;
    switch(action.type){
        case B_FETCH:            
            return Object.assign({}, state, {
                syncing: true
            })
            break
        case B_SUCCESS:
            return Object.assign({}, state, {
                syncing: false,
                videos: [
                    ...state.videos,
                    ...action.videos
                ]
            })
            break
        case B_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            })
            break
        default:
            return state
            break
    }
}

 const c_reducer = ( action, state ) => {
    state = state || initial_state_c;
    switch(action.type){
        case C_FETCH:
            return Object.assign({}, state, {
                syncing: true
            })
            break
        case C_SUCCESS:
            return Object.assign({}, state, {
                syncing: false,
                videos: [
                    ...state.videos,
                    ...action.videos
                ]
            })
            break
        case C_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            })
            break
        default:
            return state
            break
    }
}

 const combineReducers = (reducers) => {
    const root = (action, state) => {
        return Object.keys(reducers).reduce((acumulator, current)=> {
            acumulator[current] = reducers[current](action, state[current])
            return acumulator
        }, {})
    }
    return root
}

module.exports = {
    a_reducer,
    b_reducer,
    c_reducer,
    combineReducers
}