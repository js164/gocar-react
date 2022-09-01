import React, { Component } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ContextCombined } from '../../Context/CombinedContext'

class Profile extends Component {
    render() {
        return (
            <>
                Welcome User
                {this.props.AdminState ?
                <Link to='/profile/walletRequest' style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }} ><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-wallet2 m-1" viewBox="0 0 16 16">
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
            </svg>Wallet</Link>
                :
                <Link to='/profile/wallet' style={{ color: `${this.context.generalContext.mode === 'dark' ? 'white' : 'black'}`, textDecoration: "none" }} ><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-wallet2 m-1" viewBox="0 0 16 16">
                    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
                </svg>Wallet</Link>
                }

                <h5><Link to='/profile/bookings'>Bookings</Link></h5>
            </>
        )
    }
}

Profile.contextType = ContextCombined

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const AdminState = useSelector((state) => state.AdminStatus)
    return <Profile {...props} AdminState={AdminState} />;
}
