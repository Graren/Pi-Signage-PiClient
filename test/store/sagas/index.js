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
    B_NEW_PLAYLIST,
    C_FETCH,
    C_SUCCESS,
    C_FAILURE,
    C_DELETE,
    C_DELETE_SUCCESS,
    C_DELETE_FAILURE,
    A_DELETE_PLAYLIST,
    C_DELETE_PLAYLIST
} = require('../actions')

const download = require('./../downloader/index');
const deleteFile = require('./../downloader/deleter');

const a_saga = async(action, dispatch, root) => {
    let state
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
        
        case A_DELETE:
            state = dispatch(action);
            (async (state, dispatch) => {
                const mutableState = Object.assign({},state)
                const vid = mutableState.a.videos.filter((video) => video.id === action.id)
                if(vid.length > 0){
                    const res = await deleteFile(vid[0].path)
                    if(res.error){
                        const result = {
                            type: A_DELETE_FAILURE,
                            err: res.error
                        }
                        dispatch(result)
                    }
                    else{
                        const result = {
                            type: A_DELETE_SUCCESS,
                            id: vid[0].id
                        }
                        dispatch(result)
                    }
                }
                else{
                    const result = {
                        type: A_DELETE_FAILURE,
                        error: 'File not found'
                    }
                    dispatch(result)
                }
            })(state, dispatch);
            break
        case A_DELETE_SUCCESS:
            dispatch(action)
            break
        case A_DELETE_FAILURE:
            dispatch(action)
            break
        case A_DELETE_PLAYLIST:
            state = dispatch({ type: 'Filler' });
            (async (state, dispatch, root) => {
                const mutableState = Object.assign({},state)
                const vidPromises = mutableState.a.videos.map((video) => {
                    return deleteFile(video.path)
                })
                const res = await Promise.all(vidPromises).catch(e => ({ error: e.error }))
                if (res.error) {
                    const result = {
                        type: A_DELETE_FAILURE,
                        error: 'File not found'
                    }
                    dispatch(result)
                }
                else{
                    dispatch({type: A_DELETE_PLAYLIST})
                }
            })(state, dispatch, root)
            break;
        default:
            break;
    }
}

 const b_saga = async (action, dispatch, root) => {
     let a 
     let result
     let action2     
     switch(action.type){
        case B_FETCH:
            dispatch(action)
            action2 = Object.assign({}, action, { type: C_FETCH })
            root(action2, dispatch)
            break
        case B_SUCCESS:
            dispatch(action)
            break
        case B_FAILURE:
            dispatch(action)    
            break
        case B_DELETE_VIDEO:
            action2 = Object.assign({}, action, { type: C_DELETE })
            root(action2, dispatch)    
            break;
        case B_DELETE_PLAYLIST:
            action2 = { type: C_DELETE_PLAYLIST }
            root(action2, dispatch)
            break
        case B_NEW_PLAYLIST:
            action.playlist.map(video => {
                const action2 = {
                    type: C_FETCH,
                    url: video.url,
                    name: video.name,
                    format: video.format,
                    id: video.id
                }
                root(action2, dispatch)
            })
        default:
            break;
    }
}

 const c_saga = async ( action, dispatch, root) => {
    let a;
    let result
    let state
    let mutableState
    switch(action.type){
        case C_FETCH:
            dispatch(action)
            a = await download(action.url, action.name, action.format).catch(e => ({ error: e.error }))
            if(a.error) {
                result = {
                    type: C_FAILURE,
                    error: a.error
                }
            }
            else{
                result = {
                    type: C_SUCCESS,
                    videos: [{
                        id: action.id,
                        name: action.name + '.' + action.format,
                        format: action.format,
                        path: a.data
                    }]
                }
            }
            root(result, dispatch)
            break
        case C_SUCCESS:
            dispatch(action)

            break
        case C_FAILURE:
            dispatch(action)
            break
        case C_DELETE:
            state = dispatch(action);
            
            ((state, dispatch, root) => {
                const mutableState = Object.assign({},state)
                const vid = mutableState.c.videos.filter((video) => video.id === action.id)
                if(vid.length > 0){
                    const res = deleteFile(vid[0].path).catch(e => ({ error: e.error }))
                    if(res.error){
                        const result = {
                            type: C_DELETE_FAILURE,
                            err: res.error
                        }
                        dispatch(result)
                    }
                    else{
                        const result = {
                            type: C_DELETE_SUCCESS,
                            id: vid[0].id
                        }
                        const act = Object.assign({}, action, { type: A_DELETE })
                        dispatch(result)
                        root(act, dispatch)
                    }
                }
                else{
                    const result = {
                        type: C_DELETE_FAILURE,
                        error: 'File not found'
                    }
                    dispatch(result)
                }
            })(state, dispatch, root)
            break
        case C_DELETE_PLAYLIST:
            state = dispatch({ type: 'Filler' });
            (async (state, dispatch, root) => {
                const mutableState = Object.assign({},state)
                const vidPromises = mutableState.c.videos.map((video) => {
                    return deleteFile(video.path)
                })
                const res = await Promise.all(vidPromises)
                if (res.error){
                    const result = {
                        type: C_DELETE_FAILURE,
                        error: 'File not found'
                    }
                    dispatch(result)
                }
                else{
                    dispatch({type: C_DELETE_PLAYLIST})
                }
                root({ type: A_DELETE_PLAYLIST } ,dispatch)
            })(state, dispatch, root)
            break;
        default:
            break;
    }
}

 const combineSagas = (...sagas) => {
    const root = (action, dispatch) => {
        sagas.map( saga => {
            saga(action, dispatch, root)
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