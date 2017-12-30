const { a_saga, b_saga, c_saga, combineSagas } = require('../sagas/index');
const fs = require('fs');
const path = require('path')

const writeState = (state) => {
    fs.writeFile(path.join(__dirname, 'state.json'), JSON.stringify(state), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

const readState = () => {
    fs.readFile(path.join(__dirname, 'state.json'), 'utf8', function (err, data) {
        if (err) throw err;
        const obj = JSON.parse(data);
        return obj
      });
}

const _state = {};

const createStore= (rootReducer, publisher) => {
    const state = rootReducer({type:null, payload:null}, {})
    const rootSaga = combineSagas(a_saga, b_saga, c_saga)
    _state.pub = publisher
    _state.state = state
    _state.rootReducer = rootReducer
    _state.rootSaga = rootSaga
    _state.interval = setInterval(() => {
        writeState(_state.state)
    }, 30000)
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