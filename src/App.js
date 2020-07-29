import React, {Component} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'


// Import pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ChatList from './pages/ChatList'

export default class App extends Component {
  render(){
    return(
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/chatlist' component={ChatList} />
        </Switch>
      </BrowserRouter>
    )
  }
}