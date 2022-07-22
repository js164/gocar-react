import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { desetAdmin, setAuth , setAlertShow} from '../../ReduxStore/Action';

export class Success extends Component {
constructor(props){
    super(props);
    const queryParams = new URLSearchParams(window.location.search);

    localStorage.setItem('username',queryParams.get('username'));
    localStorage.setItem('access_token',queryParams.get('access_token'));
    localStorage.setItem('refresh_token',queryParams.get('refresh_token'));
    localStorage.setItem('isAdmin', 'false');
    props.dispatch(setAuth())
    props.dispatch(desetAdmin())
    this.props.dispatch(setAlertShow('success','Congratulations!','you are successfully logged in!'))
    props.navigate('/dashboard', { replace: true })
}
  render() {
    return (
      <div>Success</div>
    )
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const navigate = useNavigate();
  const dispatch= useDispatch()
  return <Success {...props} navigate={navigate} dispatch={dispatch} />;
}