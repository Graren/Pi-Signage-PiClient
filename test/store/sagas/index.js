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

const download = require('./../downloader/index');

const a_saga = (action, dispatch) => {
    switch(action.type){
        case A_FETCH:
            dispatch(action)
            break
        case A_SUCCESS:
            dispatch(action)
            break
        case A_FAILURE:
            dispatch(action)
            break
        default:
            dispatch(action)
            break
    }
}

 const b_saga = async (action, dispatch) => {
     let a 
     let result 
    switch(action.type){
        case B_FETCH:
            dispatch(action)
            a = await download(action.url, action.name, action.format)
            if(a.error) {
                result = {
                    type: B_FAILURE,
                    error: "I do not know"
                }
            }
            else{
                result = {
                    type: B_SUCCESS,
                    videos: [{
                        name: action.name + "." + action.format
                    }]
                }
                
            }
            dispatch(result)
            break;
            dispatch(action)            
            break
        case B_SUCCESS:
            dispatch(action)    
            break
        case B_FAILURE:
            dispatch(action)    
            break
        default:
            dispatch(action)    
            break
    }
}

 const c_saga = ( action, dispatch) => {
    switch(action.type){
        case C_FETCH:
            dispatch(action)        
            break
        case C_SUCCESS:
            dispatch(action)    
            break
        case C_FAILURE:
            dispatch(action)
            break
        default:
            dispatch(action)
            break
    }
}

 const combineSagas = (...sagas) => {
    const root = (action, dispatch) => {
        sagas.map( saga => {
            saga(action, dispatch)
        })
    }
    return root
}

module.exports = {
    a_saga,
    b_saga,
    c_saga,
    combineSagas
}