import React, { Component } from 'react'
import {Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {Link} from 'react-router-dom'
import firebase from '../helper/firebase'

export default class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      successMessage: '',
      buttonDisabled: true,
      errorMessage: '',
      modalOpen: false,
      processing: false
    }
  }
  login = async(e) => {
    e.preventDefault()
    const {email, password} = this.state
    try{
      this.setState({processing: true, buttonDisabled: true})
      await firebase.auth().signInWithEmailAndPassword(email, password)
      this.setState({processing: false, buttonDisabled: false}, ()=>{
        this.props.history.push('/chatlist')
      })
    } catch (e){
      this.setState({modalOpen: true, errorMessage: e.code, processing: false, buttonDisabled: false})
    }
  }
  changeText = (e) => {
    this.setState({[e.target.name]:e.target.value})
  }
  formValidation = () => {
    const {email, password} = this.state
    if(email!=='' && password!==''){
      this.setState({buttonDisabled: false})
    }else{
      this.setState({buttonDisabled: true})
    }
  }
  componentDidMount(){
    if(this.props.location.state){
      const {successMessage} = this.props.location.state
      this.setState({successMessage})
    }

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
          <Form onSubmit={this.login} className="form-login">
            <h3 className="text-center">Chatoo Login</h3>
            {this.state.successMessage!==''&&(
              <h5 className="text-center success-message">
                {this.state.successMessage}
              </h5>
            )}
            <FormGroup>
              <Label for="email">Email</Label>
              <Input onChange={this.changeText} onKeyUp={this.formValidation} id="email" type="email" name="email" autoComplete='off' />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input onChange={this.changeText} onKeyUp={this.formValidation} id="password" type="password" name="password" />
            </FormGroup>
            <Button disabled={this.state.buttonDisabled} block>{this.state.processing?'Loading...':'Login'}</Button>
            <div className="mt-2">
              <span>Don't have an account? <Link to="/register">Register Here</Link></span>
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
