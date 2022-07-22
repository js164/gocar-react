import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { Component } from 'react';
import axios from 'axios';
import GeneralContext from '../../Context/General/GeneralContext';
import { useNavigate ,Link } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { desetAdmin, desetAuth, setAlertShow, setAuth } from '../../ReduxStore/Action';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        this.LogIn = this.LogIn.bind(this)
        this.loginbygoogle = this.loginbygoogle.bind(this)
        props.dispatch(desetAdmin())
        props.dispatch(desetAuth())
    }

    LogIn(e) {
        e.preventDefault();
        let data = {
            "username": this.state.username,
            "password": this.state.password
        }

        axios.post('/auth/login', data).then((response) => {
            console.log(response);
            if (response.data.success) {
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('access_token', response.data.user.access_token);
                localStorage.setItem('refresh_token', response.data.user.refresh_token);
                localStorage.setItem('isAdmin', response.data.user.isAdmin);
                this.props.dispatch(desetAdmin())
                this.props.dispatch(setAuth())
                this.props.navigate('/dashboard', { replace: true })
                this.props.dispatch(setAlertShow('success','Congratulations!',response.data.message))
            }else{
                this.props.dispatch(setAlertShow('danger','Sorry!',response.data.message))
            }
        }).catch(err => {
            this.props.dispatch(setAlertShow('danger','Sorry!',err.message))
            console.log(err);
        })
    }

    loginbygoogle() {
        window.open('http://localhost:5000/auth/google', '_self')
    }

    render() {
        return (
            <div className='container'>
                <h2 className='text-center'>Login</h2>
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
                    <Link to="/signup" className='m-2'>Create new account?</Link>
                    <Link to="/adminLogin" className='m-2'>Login as Admin</Link>
                </Form>
                <br /><br />
                <hr /><hr />
                <button style={
                    {
                        width: "75%",
                        padding: "20px",
                        border: "solid black 2px",
                        background: "light-gray",
                        "borderRadius": "10px",
                        "fontSize": "1.5rem",
                        "marginLeft": "12.5%"
                    }
                } onClick={this.loginbygoogle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-google m-2" viewBox="0 0 16 16">
                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                    </svg>
                    Login with Google</button>
            </div>
        )
    }
}

Login.contextType = GeneralContext

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const dispatch= useDispatch()
    return <Login {...props} navigate={navigate} dispatch={dispatch} />;
}