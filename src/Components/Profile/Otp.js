import axios from 'axios'
import React, { Component } from 'react'
import { ContextCombined } from '../../Context/CombinedContext'
import { useDispatch } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';
import { useNavigate } from 'react-router-dom';

export class Otp extends Component {
    constructor(){
        super()
        this.state={
            otp:''
        }
        this.setOtp=this.setOtp.bind(this)
        this.verify=this.verify.bind(this)
    }
    setOtp(e){
        if(e.target.value.length<=6){
            this.setState({
                otp: e.target.value
            })
        }
    }
    verify(e){
        e.preventDefault();
        axios.post('/profile/wallet/otpverify',{otp:this.state.otp}).then(response=>{
            console.log(response);
            if(response.data.success){
                this.props.dispatch(setAlertShow('success', 'Congratulations!', response.data.message))
                this.props.navigate('/profile')
            }else{
                this.props.dispatch(setAlertShow('danger', 'Sorry!', response.data.message))
            }
        }).catch(err=>{
            this.props.dispatch(setAlertShow('danger', 'Sorry!', err.message))
        })
    }
  render() {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{height:"90vh"}}>
       <div className="d-flex flex-column align-items-center container text-center w-50" style={{ boxShadow: this.context.generalContext.mode === 'dark' ? '0 3px 10px rgb(255 255 255 / 0.3)' : '0 3px 10px rgb(0 0 0 / 0.2)' }}>
            <h3 className="text-center pt-4">Enter OTP</h3>
            <p>OTP will be sended on your registerd mobile number.</p>
            {/* <input className='m-4' type="number" /> */}
            <input type="number" className="form-control mt-4 w-25" value={this.state.otp} onChange={this.setOtp} placeholder="OTP..."></input>
            <button className="btn btn-success m-3" disabled={this.state.otp.length !== 6} onClick={this.verify}>Verify</button>
        </div> 
      </div>
    )
  }
}


Otp.contextType=ContextCombined

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    return <Otp {...props} navigate={navigate} dispatch={dispatch} />;
  }