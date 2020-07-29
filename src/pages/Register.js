import React, { Component } from 'react'
import {Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {Link} from 'react-router-dom'
import firebase from '../helper/firebase'

export default class Register extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
      errorMessage: '',
      modalOpen: false,
      buttonDisabled: true,
      processing: false
    }
  }
  register = async(e) => {
    e.preventDefault()
    const {email, password} = this.state
    try{
      this.setState({processing: true, buttonDisabled: true})
      const result = await firebase.auth().createUserWithEmailAndPassword(
        email, password
      )
      const db = firebase.database()
      db.ref(`/users/${result.user.uid}`).set({
        uid: result.user.uid,
        email: result.user.email
      })
      this.setState({processing: false, buttonDisabled: false})
    }catch(e){
      this.setState({modalOpen: true, errorMessage: e.code, processing: false, buttonDisabled: false})
    }
  }

  changeText = (e) => {
    this.setState({[e.target.name]:e.target.value})
  }
  formValidation = () => {
    const {email, password, passwordConfirmation} = this.state
    if(email!=='' && password!=='' && passwordConfirmation!==''){
      if(password === passwordConfirmation){
        this.setState({buttonDisabled: false})
      }else{
        this.setState({buttonDisabled: true})
      }
    }else{
      this.setState({buttonDisabled: true})
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(e=>{
      if(e){
        this.props.history.push('/chatlist')
      }
    })
  }

  render() {
    return (
      <>
        <div className="d-flex justify-content-center align-items-center h-100">
          <Form onSubmit={this.register} className="form-login">
            <h3 className="text-center">Chatoo Register</h3>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input onChange={this.changeText} onKeyUp={this.formValidation} id="email" type="email" name="email" autoComplete="off" />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input onChange={this.changeText} onKeyUp={this.formValidation} id="password" type="password" name="password" />
            </FormGroup>
            <FormGroup>
              <Label for="passwordConfirmation">Password Confirmation</Label>
              <Input onChange={this.changeText} onKeyUp={this.formValidation} id="passwordConfirmation" type="password" name="passwordConfirmation" />
            </FormGroup>
            <Button disabled={this.state.buttonDisabled} block>{this.state.processing?'Loading...':'Register'}</Button>
            <div className="mt-2">
              <span>Already have account? <Link to="/login">Login Here</Link></span>
            </div>
          </Form>
        </div>
        <Modal isOpen={this.state.modalOpen}>
          <ModalHeader>
            Alert
          </ModalHeader>
          <ModalBody>
            {this.state.errorMessage}
          </ModalBody>
          <ModalFooter>
            <Button onClick={()=>this.setState({modalOpen: false})} color='primary'>OK</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}
