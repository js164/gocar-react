import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { Component } from 'react'
import { Link , useNavigate} from 'react-router-dom';
import { ContextCombined } from '../../Context/CombinedContext';
import axios from 'axios';
import { desetAdmin, desetAuth } from '../../ReduxStore/Action';
import { useSelector , useDispatch } from "react-redux"

class NavBar extends Component {
    constructor(){
        super()
        this.state={
            isAuth:false
        }
        this.logOut=this.logOut.bind(this)
    }
    componentDidMount(){
       this.setState({
        isAuth:this.context.authContext.checkAuth()
       })
   }
   logOut(){
    axios.get('/auth/logout').then((response) => {
      console.log(response);
      if (response && response.data.success) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('username')
        localStorage.removeItem('isAdmin')
        this.props.dispatch(desetAuth())
        this.props.dispatch(desetAdmin())
        this.props.navigate('/login', { replace: true })
      }
  }).catch(err => {
      console.log(err);
  })
    

   }
  render() {
    return (
      <>
       <Navbar bg={this.context.generalContext.mode} variant={this.context.generalContext.mode} expand="lg">
      <Container>
        <Navbar.Brand to="/dashboard"><img src={`${process.env.PUBLIC_URL}/gocar-${this.context.generalContext.mode ==='dark' ? 'light' : 'dark'}.png`} style={{maxWidth:"100px"}} alt="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/dashboard" className='mx-1' style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }}>Home</Link>
          </Nav>
            {this.props.AuthState?
            <>
            <Link to='/cars' className='mx-1' style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }}>Cars</Link>
            { this.props.AdminState ? <Link to='/carCategory' className='mx-1' style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }}>Category</Link> : "" }
            <Link to='/logout' onClick={this.logOut} className='mx-1' style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }}>LogOut</Link>
            <Link to='/profile'  style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }} ><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-circle m-1" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
</svg></Link>
            </>:
            <>
            <Link to='/login' className='mx-1' style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }}>LogIn</Link>
            <Link to='/signup' className='mx-1' style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }}>SignUp</Link>
            </>
            }
        </Navbar.Collapse>
      </Container>
            <div className="form-check form-switch mx-5">
                <input className="form-check-input" onChange={(e) => { this.context.generalContext.toggleMode(e); this.context.generalContext.toggleMode() }} type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                <label className={`form-check-label text-${this.context.generalContext.mode === 'dark' ? 'light' : 'dark'}`} htmlFor="flexSwitchCheckDefault">Dark Mode</label>
              </div>
    </Navbar> 
      </>
    )
  }
}


NavBar.contextType= ContextCombined

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const navigate = useNavigate();
  const AdminState= useSelector((state)=> state.AdminStatus)
  const AuthState= useSelector((state)=>state.AuthStatus)
  const dispatch= useDispatch()
  return <NavBar {...props} navigate={navigate} AdminState={AdminState} AuthState={AuthState} dispatch={dispatch} />;
}