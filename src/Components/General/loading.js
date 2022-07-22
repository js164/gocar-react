import React, { Component } from 'react'

export default class Loading extends Component {
  render() {
    return (
        <div className='text-center my-5' style={{background:this.props.mode === 'dark' ? '#061020' : 'white',color:this.props.mode === 'dark' ? 'white' : 'black'}}>
      <img src={process.env.PUBLIC_URL+"/Spinner-2.gif"} alt="loading..."/>
        </div>
    )
  }
}
