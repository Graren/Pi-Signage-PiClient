const { 
    A_FETCH,
    A_SUCCESS,
    A_FAILURE,
    A_DELETE,
    A_DELETE_FAILURE,
    A_DELETE_SUCCESS,
    B_FETCH,
    B_SUCCESS,
    B_FAILURE,
    B_NEW_VIDEO,
    B_DELETE_VIDEO,
    B_DELETE_PLAYLIST,
    C_FETCH,
    C_SUCCESS,
    C_FAILURE,
    C_DELETE,
    C_DELETE_SUCCESS,
    C_DELETE_FAILURE,
    A_DELETE_PLAYLIST,
    C_DELETE_PLAYLIST,
    C_START
} = require('../actions')

const download = require('./../downloader/index');

const initial_state_a = {
    content: [],
    syncing: false,
    error: null
}


const initial_state_b = {
    content: [],
    syncing: false,
    error: null
}

const initial_state_c = {
    content: [],
    syncing: false,
    error: null
}

const a_reducer = (action, state) => {
    state = state || initial_state_a;
    let v
    switch(action.type){
        case A_FETCH:
            return Object.assign({}, state, {
                syncing: true
            })
            break
        case A_SUCCESS:
            return Object.assign({}, state, {
                syncing: false,
                content: [
                    ...state.content,
                    ...action.content
                ]
            })
            break
        case A_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            })
            break
        case A_DELETE:
            return Object.assign({}, state, {
                syncing: true
            })
            break
        case A_DELETE_SUCCESS:
            v = state.content.filter((c) => c.id !== action.id)
            return Object.assign({}, state, {
                content: v
            })
            break
        case A_DELETE_PLAYLIST:
            return Object.assign({}, state, {
                content: []
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
                content: [
                    ...state.content,
                    ...action.content
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
                content: [
                    ...state.content,
                    ...action.content
                ]
            })
            break
        case C_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            })
            break
        case C_DELETE:
            return Object.assign({}, state, {
                syncing: true
            })
            break;
        case C_DELETE_FAILURE:
            return Object.assign({}, state, {
                error: action.error
            })
            break;
        case C_DELETE_SUCCESS:
            v = state.content.filter((c) => c.id !== action.id)
            return Object.assign({}, state, {
                content: v
            })
            break;
        case C_DELETE_PLAYLIST:
            return Object.assign({}, state, {
                content: []
            })
            break
        case C_START:
            return Object.assign({}, state, {
                content: [
                    ...state.content,
                    ...action.content
                ]
            })
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