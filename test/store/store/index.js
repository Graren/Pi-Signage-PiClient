const { a_saga, b_saga, c_saga, combineSagas } = require('../sagas/index');

const _state = {};

const createStore= (rootReducer, publisher) => {
    const state = rootReducer({type:null, payload:null}, {})
    const rootSaga = combineSagas(a_saga, b_saga, c_saga)
    _state.pub = publisher
    _state.state = state
    _state.rootReducer = rootReducer
    _state.rootSaga = rootSaga
}

const getState = () => {
    const { state } = _state
    return state
}

const dispatch = ( action ) => {
    const state = _state.rootReducer(action, _state.state)
    _state.state = state
    console.log(JSON.stringify(state))
    _state.pub.send(['client', JSON.stringify(state)])
    return _state.state
}

const sagaDispatch = ( action ) => {
    _state.rootSaga(action, dispatch);
}


module.exports = {
    _state,
    createStore,
    getState,
    dispatch,
    sagaDispatch
}