import React from 'react'
import { acceptInvite } from '../actions/rooms'
import './invite.scss'

const Invite = props => (
  <div className='invite flex-container'>
    <div className='flex flex-container flex-vertical'>
      <h1 className='flex'>{`#${props.name}`}</h1>
      <span className='channel-info'>{props.info}</span>
    </div>
    {props.joined && <button disabled className='btn'>Joined</button>}
    {!props.joined && <button className='btn' onClick={e => props.dispatch(acceptInvite(props.slug))}>Join</button>}
  </div>
)

export default Invite
