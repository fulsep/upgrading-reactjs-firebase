import React, { Component } from 'react'
import {FaUser} from 'react-icons/fa'
import firebase from '../helper/firebase'

export default class ChatRoom extends Component {
  constructor(props){
    super(props)
    this.state = {
      recipent: '',
      recipentEmail: '',
      chat: [],
      message: ''
    }
    this.chat = React.createRef();
  }

  typing = (e) => {
    const {chat} = this.state
    if(e.keyCode === 13 && !e.shiftKey){
      if(e.target.value!==''){
        const {message} = this.state
        const time = new Date().getTime()
        this.setState({chat: [...[{
          senderName: this.props.currentUser.email,
          message: this.state.message,
          id: time
        }], ...chat], message: ''},()=>{
          const db = firebase.database()
          db.ref(`/chat/${this.props.currentUser.uid}/${this.state.recipent}/${time}`).set({
            message,
            senderName: this.props.currentUser.email
          })
          db.ref(`/chat/${this.state.recipent}/${this.props.currentUser.uid}/${time}`).set({
            message,
            senderName: this.props.currentUser.email
          })
          this.chat.current.scrollTop = this.chat.current.scrollHeight
        })
      }
    }
  }

  changeInput = (e) => {
    this.setState({message: e.target.value})
  }

  checkMessage = ()=> {
    const db = firebase.database()
    db.ref(`/chat/${this.props.currentUser.uid}/${this.state.recipent}`).on('value',res=>{
      const data = res.val()
      const chat = []
      for(let keys in data){
        const a = {
          senderName: data[keys].senderName,
          message: data[keys].message,
          id: keys
        }
        chat.push(a)
      }
      this.setState({chat: chat.reverse()},()=>{
        this.chat.current.scrollTop = this.chat.current.scrollHeight
        console.log('logged?')
      })
    })
  }

  componentDidMount(){
    this.setState({recipent: this.props.user},()=>{
      firebase.database().ref(`/users/${this.props.user}`).once('value', res => {
        this.setState({recipentEmail: res.val().email}, ()=>{
          this.checkMessage()
        })
      })
    })
  }

  componentDidUpdate(){
    if(this.state.recipent!==this.props.user){
      firebase.database().ref(`/users/${this.props.user}`).once('value', res => {
        this.setState({recipentEmail: res.val().email}, ()=>{
          this.checkMessage()
        })
      })
      this.setState({recipent: this.props.user})
    }
  }

  render() {
    const {chat} = this.state
    return (
      <>
        <div className="chat-info">
          <div className="avatar">
            <FaUser />
          </div>
          <div className="name">{this.state.recipentEmail}</div>
        </div>
        <div className="chat-container" ref={this.chat}>
          <div>
            <div className="h-100 d-flex flex-column-reverse">
              {chat.map(item=>(
                <div key={item.id} className={`chat-baloon ${item.senderName===this.props.currentUser.email && 'text-right'}`}>
                  <div className={`chat-message ${item.senderName===this.props.currentUser.email && 'sender'}`}>{item.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chat-input">
          <input onKeyUp={this.typing} onChange={this.changeInput} type="text" value={this.state.message} />
        </div>
      </>
    )
  }
}
