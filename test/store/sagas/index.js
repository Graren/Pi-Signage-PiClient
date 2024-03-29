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
    C_DELETE_PLAYLIST,
    C_START,
    B_COMPARE_PLAYLIST,
    A_RESTART,
    B_RESTART,
    C_RESTART,
    RESTART
} = require('../actions')
const fs = require('fs')
const path = require('path')

const download = require('./../downloader/index')
const deleteFile = require('./../downloader/deleter')
const readState = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '..', 'store', 'state.json'), 'utf8', function (err, data) {
      if (err) reject(err)
      const obj = JSON.parse(data)
      resolve(obj)
    })
  })
}

const a_saga = async(action, dispatch, root) => {
  let state
  switch (action.type) {
    case A_FETCH:
      dispatch(action)
      break
    case A_SUCCESS:
      dispatch(action)
      break
    case A_FAILURE:
      dispatch(action)
      break
    case A_RESTART:
      dispatch(action)
      break
    case A_DELETE:
      state = dispatch(action);
      (async(state, dispatch) => {
        const mutableState = Object.assign({}, state)
        const vid = mutableState.a.content.filter((c) => c.id === action.id)
        if (vid.length > 0) {
          const res = await deleteFile(vid[0].path)
          if (res.error) {
            const result = {
              type: A_DELETE_FAILURE,
              err: res.error
            }
            dispatch(result)
          } else {
            const result = {
              type: A_DELETE_SUCCESS,
              id: vid[0].id
            }
            dispatch(result)
          }
        } else {
          const result = {
            type: A_DELETE_FAILURE,
            error: 'File not found'
          }
          dispatch(result)
        }
      })(state, dispatch)
      break
    case A_DELETE_SUCCESS:
      dispatch(action)
      break
    case A_DELETE_FAILURE:
      dispatch(action)
      break
    case A_DELETE_PLAYLIST:
      state = dispatch({
        type: 'Filler'
      });
      (async(state, dispatch, root) => {
        const mutableState = Object.assign({}, state)
        const vidPromises = mutableState.a.content.map((c) => {
          return deleteFile(c.path)
        })
        const res = await Promise.all(vidPromises).catch(e => ({
          error: e.error
        }))
        if (res.error) {
          const result = {
            type: A_DELETE_FAILURE,
            error: 'File not found'
          }
          dispatch(result)
        } else {
          dispatch({
            type: A_DELETE_PLAYLIST
          })
        }
      })(state, dispatch, root)
      break
    default:
      break
  }
}

const b_saga = async(action, dispatch, root) => {
  let a
  let result
  let action2
  let helper
  let helper_2
  switch (action.type) {
    case B_FETCH:
      dispatch(action)
      action2 = Object.assign({}, action, {
        type: C_FETCH
      })
      root(action2, dispatch)
      break
    case B_SUCCESS:
      dispatch(action)
      break
    case B_FAILURE:
      dispatch(action)
      break
    case B_RESTART:
      dispatch(action)
      const actions = [
        {
          type: A_RESTART
        },
        {
          type: C_RESTART
        }
      ]
      actions.map(act => {
        root(act, dispatch)
      })
      break
    case RESTART:
      const data = await readState()
      const a = {
        type: RESTART,
        state: data
      }
      dispatch(a)
      break
    case B_DELETE_VIDEO:
      action2 = Object.assign({}, action, {
        type: C_DELETE
      })
      root(action2, dispatch)
      break
    case B_DELETE_PLAYLIST:
      action2 = {
        type: C_DELETE_PLAYLIST
      }
      root(action2, dispatch)
      break
    case B_COMPARE_PLAYLIST:
      result = dispatch(action)
      helper = result.b.content.map(video => {
        if (result.a.content.filter(e => e.id === video.id).length > 0) {
          return { type: 'somerandomstringhaha'}
        } else {
          return {
            type: C_FETCH,
            ...video
          }
        }
      })
      helper_2 = result.a.content.map(video => {
        if (result.b.content.filter(e => e.id === video.id).length > 0) {
          return { type: 'somerandomstringhaha'}
        } else {
          return {
            type: C_DELETE,
            ...video
          }
        }
      })
      helper = [...helper, ...helper_2]
      helper.map(act => {
        root(act, dispatch)
      })
      break
    case B_NEW_PLAYLIST:
      action2 = Object.assign({}, action, {
        type: C_DELETE_PLAYLIST
      })
      root(action2, dispatch)
      action.playlist.map(c => {
        const action2 = {
          type: C_FETCH,
          ...c
        }
        root(action2, dispatch)
      })
      break
    default:
      break
  }
}

const c_saga = async(action, dispatch, root) => {
  let a
  let result
  let state
  let mutableState
  let isImage
  let name
  switch (action.type) {
    case C_FETCH:
      dispatch(action)
      isImage = !!/jpg|png|bmp/.test(action.format)
      name = isImage
                ? action.id + '_' + action.time + '.' + action.format
                : action.id + '.' + action.format
      a = await download(action.url, name.split('.')[0], action.format).catch(e => ({
        error: e.error
      }))
      if (a.error) {
        result = {
          type: C_FAILURE,
          error: a.error
        }
      } else {
        result = {
          type: C_SUCCESS,
          content: [{
            id: action.id,
            name,
            format: action.format,
            path: a.data,
            time: isImage ? action.time : null
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
    case C_RESTART:
      dispatch(action)
      break
    case C_DELETE:
      state = dispatch(action);

      ((state, dispatch, root) => {
        const mutableState = Object.assign({}, state)
        const vid = mutableState.c.content.filter((c) => c.id === action.id)
        if (vid.length > 0) {
          const res = deleteFile(vid[0].path).catch(e => ({
            error: e.error
          }))
          if (res.error) {
            const result = {
              type: C_DELETE_FAILURE,
              err: res.error
            }
            dispatch(result)
          } else {
            const result = {
              type: C_DELETE_SUCCESS,
              id: vid[0].id
            }
            const act = Object.assign({}, action, {
              type: A_DELETE
            })
            dispatch(result)
            root(act, dispatch)
          }
        } else {
          const result = {
            type: C_DELETE_FAILURE,
            error: 'File not found'
          }
          dispatch(result)
        }
      })(state, dispatch, root)
      break
    case C_DELETE_PLAYLIST:
      state = dispatch({
        type: 'Filler'
      });
      (async(state, dispatch, root) => {
        const mutableState = Object.assign({}, state)
        const vidPromises = mutableState.c.content.map((c) => {
          return deleteFile(c.path)
        })
        const res = await Promise.all(vidPromises)
        if (res.error) {
          const result = {
            type: C_DELETE_FAILURE,
            error: 'File not found'
          }
          dispatch(result)
        } else {
          dispatch({
            type: C_DELETE_PLAYLIST
          })
        }
        root({
          type: A_DELETE_PLAYLIST
        }, dispatch)
      })(state, dispatch, root)
      break
    case C_START:
      dispatch(action)
    default:
      break
  }
}

const combineSagas = (...sagas) => {
  const root = (action, dispatch) => {
    sagas.map(saga => {
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
