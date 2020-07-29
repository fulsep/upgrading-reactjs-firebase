import React, { Component } from 'react'
import {Row, Col, Container, Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap'
import {FaUser, FaPowerOff} from 'react-icons/fa'
import firebase from '../helper/firebase'

import ChatRoom from './ChatRoom'

class UserList extends Component {
  render(){
    return(
      <div className={`chat-item ${this.props.focus && 'focus'}`} onClick={this.props.onClick}>
        <div className="chat-avatar">
          <FaUser />
        </div>
        <div className="chat-content">
          <span>{this.props.email}</span>
        </div>
      </div>
    )
  }
}

export default class ChatList extends Component {
  constructor(props){
    super(props)
    this.state = {
      focus: null,
      modalOpen: false,
      email: '',
      uid: '',
      listChat: [],
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(e=>{
      if(e===null){
        this.props.history.push('/login')
      }else{
        const {email, uid} = firebase.auth().currentUser
        this.setState({email, uid})
        const database = firebase.database()
        database.ref('/users').on('value',item =>{
          const data = item.val()
          const user = []
          for( let keys in data){
            const a = {
              id: data[keys].uid,
              email: data[keys].email
            }
            user.push(a)
          }
          this.setState({listChat: user})
        })
      }
    })
  }

  render() {
    return (
      <>
        <div className="h-100 parent-chat pt-5">
          <div className="accent-chat" />
          <Container className="container-chat h-100">
            <Row className="component-chat no-gutters">
              <Col md={4} className="chat-scroll">
                <div className="title">
                  <div className="avatar" onClick={()=>console.log(this.state.listChat)}>
                    <FaUser />
                  </div>
                  <span className="user">{this.state.email}</span>
                  <button className="logout" onClick={()=>this.setState({modalOpen: true})}>
                    <FaPowerOff />
                  </button>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search or start new chat"/>
                </div>
                <div className="chat-list">
                  {this.state.listChat.map(item=>(
                    <UserList key={item.id} focus={item.id===this.state.focus} onClick={()=>this.setState({focus: item.id})} email={item.email} />
                  ))}
                </div>
              </Col>
              <Col md={8} className="chat-room">
                {this.state.focus!==null?(
                  <ChatRoom user={this.state.focus} currentUser={{email: this.state.email, uid: this.state.uid}}/>
                ): 
                <div className="not-selected">
                  Select a user
                </div>

                }
              </Col>
            </Row>
          </Container>
        </div>
        <Modal isOpen={this.state.modalOpen}>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>
            Are you sure want to Logout?
          </ModalBody>
          <ModalFooter>
            <Button onClick={()=>this.setState({modalOpen: false})}>Cancel</Button>
            <Button onClick={()=>firebase.auth().signOut()}>OK</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}
