import React, { Component } from 'react'
import GeneralContext from './GeneralContext'

export default class GeneralState extends Component{
    state={
        mode:'light'
    }
    toggleMode=()=>{
        if(this.state.mode === 'light'){
            this.setState({
                mode:'dark'
            })
            document.body.style.background = '#061020'
            document.body.style.color = 'white'
        }else{
            this.setState({
                mode:'light'
            })
            document.body.style.background = 'white'
            document.body.style.color = 'black'
        }
    }
  render() {
    return (
      <GeneralContext.Provider value={{mode:this.state.mode,toggleMode:this.toggleMode}} >
        {this.props.children}
      </GeneralContext.Provider>
    )
  }
}
