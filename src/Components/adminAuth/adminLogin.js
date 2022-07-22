import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { Component } from 'react';
import axios from 'axios';
import GeneralContext from '../../Context/General/GeneralContext';
import { useNavigate ,Link } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { setAdmin , desetAdmin, desetAuth, setAuth ,setAlertShow} from '../../ReduxStore/Action';

class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        this.LogIn = this.LogIn.bind(this)
        props.dispatch(desetAdmin())
        props.dispatch(desetAuth())
    }

    LogIn(e) {
        e.preventDefault();
        let data = {
            "username": this.state.username,
            "password": this.state.password
        }

        axios.post('/adminAuth/login', data).then((response) => {
            console.log(response);
            if (response.data.success) {
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('access_token', response.data.user.access_token);
                localStorage.setItem('refresh_token', response.data.user.refresh_token);
                localStorage.setItem('isAdmin', response.data.user.isAdmin);
                this.props.dispatch(setAdmin())
                this.props.dispatch(setAuth())
                this.props.dispatch(setAlertShow('success','Congratulations!',response.data.message))
                this.props.navigate('/adminDashboard', { replace: true })
            }else{
                this.props.dispatch(setAlertShow('success','Sorry!',response.data.message))
            }
        }).catch(err => {
            this.props.dispatch(setAlertShow('success','Soory!',err.message))
            console.log(err);
        })
    }


    render() {
        return (
            <div className='container'>
                <h2 className='text-center'>Admin Login</h2>
                <Form onSubmit={this.LogIn}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} placeholder="Enter Username" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Log In
                    </Button>
                    <Link to="/adminSignup" className='m-2'>Create new Admin account?</Link>
                    <Link to="/login" className='m-2'>Login as Customer</Link>
                </Form>
            </div>
        )
    }
}

AdminLogin.contextType = GeneralContext

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const dispatch= useDispatch()
    return <AdminLogin {...props} navigate={navigate} dispatch={dispatch} />;
}