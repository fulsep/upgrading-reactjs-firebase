import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

export default class Home extends Component {
  render() {
    return (
      <Redirect to='/chatlist' />
    )
  }
}
