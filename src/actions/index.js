// I pledge my honor that I have abided by the Stevens Honor System

import io from 'socket.io-client'
import Ajax from '../lib/Ajax'
import { push } from 'connected-react-router'

let socket
let u = window.location.origin
if (/8081/.test(u)) u = u.replace('8081', '3000')
const getUrl = str => `${u}/api/${str}`

export const connect = () => (dispatch, getState) => {
  socket = io.connect(u)

  socket.on('connect', () => {
    const sessionID = getState().user.self.sessionid
    socket.emit('session.start', sessionID, (err, res) => {
      dispatch({
        type: 'CONNECTED',
        data: true
      })
    })
  })

  socket.on('disconnect', () => {
    dispatch({
      type: 'CONNECTED',
      data: false
    })
  })

  socket.on('message.receive', (m) => {
    dispatch({
      type: 'ADD_MESSAGE',
      data: m
    })
  })
}

export const setWorking = (b) => ({
  type: 'SET_WORKING',
  data: b
})

export const setValue = (k, v) => ({
  type: 'SET_VALUE',
  data: { key: k, value: v }
})

export const load = () => async (dispatch, getState) => {
  try {
    dispatch(setWorking(true))
    const user = await Ajax.get(getUrl('users/me'))
    dispatch({ type: 'SET_USER', data: user })
    dispatch({ type: 'FINISH_LOAD', data: 'user' })

    const channels = await Ajax.get(getUrl('channels'))
    dispatch({ type: 'ADD_CHANNEL', data: channels })
    dispatch({ type: 'FINISH_LOAD', data: 'channels' })

    const firstChannel = channels[0]
    if (firstChannel) {
      let id = firstChannel.id
      let lid
      if ((lid = sessionStorage.getItem('lastChannel')) && channels.find(x => x.id === lid)) id = lid

      const members = await Ajax.get(getUrl(`channels/${id}/members`))
      dispatch({ type: 'ADD_MEMBER', data: members })

      const messages = await Ajax.get(getUrl(`channels/${id}/messages`))
      if (messages && messages.length) dispatch({ type: 'ADD_MESSAGE', data: messages })
      dispatch({ type: 'SET_CHANNEL_LOADED', data: id })

      dispatch(push(`/channels/${id}`))
    } else {
      dispatch(push(`/channels`))
    }
    dispatch({ type: 'FINISH_LOAD', data: 'channels' })

    dispatch(connect())
  } catch (e) {
    console.error(e)
    sessionStorage.clear()
    dispatch(push('/login'))
  } finally {
    dispatch(setWorking(false))
  }
}

export const saveUser = user => async (dispatch, getState) => {
  try {
    dispatch(setWorking(true))
    await Ajax.post(getUrl(`users/me`), {
      data: user
    })
  } catch (e) {

  } finally {
    dispatch(setWorking(false))
  }
}

export const sendMessage = (channel, message) => async (dispatch, getState) => {
  socket.emit('message.send', { channel, message }, (response) => {
    
  })
}
