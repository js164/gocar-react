import React, { Component } from 'react'
import AuthContext from './AuthContext'

export default class AuthState extends Component{
    constructor(){
      super()
      this.state={
        isAuth:false
      }
      this.checkAuth=this.checkAuth.bind(this)
    }
      checkAuth(){
        if(localStorage.getItem('access_token') && localStorage.getItem('refresh_token')){
            this.setState({
                isAuth:true
            })
            return true
        }else{
            this.setState({
                isAuth:false
            })
            return false
        }
      }

  render() {
    return (
      <AuthContext.Provider value={{isAuth:this.state.isAuth,checkAuth:this.checkAuth}} >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}
