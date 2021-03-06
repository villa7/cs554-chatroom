// I pledge my honor that I have abided by the Stevens Honor System'

import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user'
import rooms from './rooms'
import login from './login'

function app (state = {
  working: 0,
  connected: true,
  load: {
    user: true,
    channels: false,
    messages: false,
    members: false
  },
  inviteModal: null,
  channelCreateModal: null
}, { type, data }) {
  switch (type) {
    case 'SET_WORKING':
      return {
        ...state,
        working: data ? state.working + 1 : state.working - 1
      }
    case 'SET_VALUE':
      return {
        ...state,
        [data.key]: data.value
      }
    case 'CONNECTED':
      return {
        ...state,
        connected: data || false
      }
    case 'FINISH_LOAD':
      return {
        ...state,
        load: {
          user: false,
          channels: false,
          members: false,
          messages: false,
          [data]: true
        }
      }
    case 'CREATE_INVITE':
      return {
        ...state,
        inviteModal: data
      }
    default: return state
  }
}

export default history => combineReducers({
  router: connectRouter(history),
  user,
  rooms,
  login,
  app
})
