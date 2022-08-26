import axios from 'axios';
import React, { Component } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ContextCombined } from '../../Context/CombinedContext';
import Moment from 'moment';
import Loading from '../General/loading';

class WalletApprove extends Component {
    state = {
        walletRequests: [],
        walletApproved:[],
        loading:true
    }
    componentDidMount() {
        axios.get('/profile/walletRequest').then(response => {
            console.log(response);
            if (response && response.data && response.data.success) {
                this.setState({
                    walletRequests: response.data.data.filter(d=>d.isAdminVerified===false),
                    walletApproved: response.data.data.filter(d=>d.isAdminVerified===true),
                    loading:false
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    render() {
        return (
            <>
            {this.state.loading ? <Loading mode={this.context.generalContext.mode} /> :
            <>
                <h1 className="text-center">Pending for Approval</h1>
                <div className="d-flex flex-column container">
                    {this.state.walletRequests.length>0 ?
                    this.state.walletRequests.map(r => {
                        return <Link to='/profile/wallet' state={{ wallet: r }} key={r.mobile} className="d-flex flex-row justify-content-between p-3 m-3" style={{border:"none", position: "relative",textDecoration: "none",color: this.context.generalContext.mode === 'dark' ? 'white' : 'black', width: '100%', boxShadow: this.context.generalContext.mode === 'dark' ? '0 3px 10px rgb(255 255 255 / 0.3)' : '0 3px 10px rgb(0 0 0 / 0.2)' }}>
                                <div className="m-2 font-weight-bold" style={{ fontSize: "1.5rem" }}>+91 {r.mobile}</div>
                                <div className="m-2 font-weight-bold">Created On: {Moment(r.createdAt).format('MMM Do YY')}</div>
                            </Link>
                    })
                    :
                    <h5>No Approval Request pending!</h5> }

                </div>

                <h1 className="mt-5 text-center">Approvaled Wallets</h1>
                <div className="d-flex flex-column container">
                    {this.state.walletApproved.length>0 ? 
                    this.state.walletApproved.map(r => {
                        return <Link to='/profile/wallet' state={{ wallet: r }} key={r.mobile} className="d-flex flex-row justify-content-between p-3 m-3" style={{border:"none", position: "relative",textDecoration: "none",color: this.context.generalContext.mode === 'dark' ? 'white' : 'black', width: '100%', boxShadow: this.context.generalContext.mode === 'dark' ? '0 3px 10px rgb(255 255 255 / 0.3)' : '0 3px 10px rgb(0 0 0 / 0.2)' }}>
                                <div className="m-2 font-weight-bold" style={{ fontSize: "1.5rem" }}>+91 {r.mobile}</div>
                                <div className="m-2 font-weight-bold">Created On: {Moment(r.createdAt).format('MMM Do YY')}</div>
                            </Link>
                    })
                    :
                    <h5>No Records Avalilable!</h5>}
                </div>
            </>
            }
            </>
        )
    }
}

WalletApprove.contextType = ContextCombined

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return <WalletApprove {...props} navigate={navigate} dispatch={dispatch} />;
}

