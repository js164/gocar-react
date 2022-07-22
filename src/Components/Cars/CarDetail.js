import axios from 'axios';
import React, { Component } from 'react'
import { ContextCombined } from '../../Context/CombinedContext';
import { useNavigate, Link , useParams  } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';
import Loading from '../General/loading';

export class CarDetail extends Component {
    constructor() {
        super()
        this.state = {
            car: {},
            rates: {},
            EpricePerHour: 0,
            EpricePerKm: 0,
            loading:true
        }
        this.getData = this.getData.bind(this)
        this.EHourPlus = this.EHourPlus.bind(this)
        this.EHourMinus = this.EHourMinus.bind(this)
        this.EKmPlus = this.EKmPlus.bind(this)
        this.EKmMinus = this.EKmMinus.bind(this)
        this.getEstimatedPrice = this.getEstimatedPrice.bind(this)
    }
    getData(){
        axios.get('/car/id/' + this.props.params.id).then(response => {
            console.log(response);
            if (response && response.data.success) {
                this.setState({
                    car: response.data.data
                })
            } else {
                this.props.dispatch(setAlertShow('danger', 'Sorry!', response.data.message));
            }
        }).catch(err => {
            this.props.dispatch(setAlertShow('danger', 'Sorry!', err.message));
        }).finally(() => {
            if (this.state.car.carId)
                axios.get('/category/car/' + this.state.car.carId).then(response => {
                    console.log(response);
                    if (response && response.data.success) {
                        this.setState({
                            rates: response.data.data,
                            loading: false
                        })
                    } else {
                        this.props.dispatch(setAlertShow('danger', 'Sorry!', response.data.message));
                    }
                }).catch(err => {
                    this.props.dispatch(setAlertShow('danger', 'Sorry!', err.message));
                })
        })

    }
    EHourPlus() {
        this.setState({
            EpricePerHour: this.state.EpricePerHour + 1
        })
    }
    EHourMinus() {
        if (this.state.EpricePerHour > 0) {
            this.setState({
                EpricePerHour: this.state.EpricePerHour - 1
            })
        }
    }
    EKmPlus() {
        this.setState({
            EpricePerKm: this.state.EpricePerKm + 1
        })
    }
    EKmMinus() {
        if (this.state.EpricePerKm > 0) {
            this.setState({
                EpricePerKm: this.state.EpricePerKm - 1
            })
        }
    }
    componentDidMount() {
        this.getData()
    }
    getEstimatedPrice(e) {
        e.preventDefault()
        let cal = document.getElementById('Calculation')
        let text = ''
        if (this.state.EpricePerKm !== 0) {
            text = `Estimated Price for ${this.state.EpricePerKm} Km will be ` + (this.state.EpricePerKm * this.state.rates.pricePerKm) + '<br />'
        }
        if (this.state.EpricePerHour !== 0) {
            text += `Estimated Price for ${this.state.EpricePerHour} Hour will be ` + (this.state.EpricePerHour * this.state.rates.pricePerHour);

        }
        if (this.state.EpricePerHour === 0 && this.state.EpricePerKm === 0) {
            text = 'Please provide a valid input!';
        }
        cal.innerHTML = text
    }
    render() {
        const darkMode = {
            background: this.context.generalContext.mode === 'dark' ? '#061020' : 'white',
            color: this.context.generalContext.mode === 'dark' ? 'white' : 'black',
            // borderBottom:this.context.generalContext.mode === 'dark' ? '1px solid white' : '1px solid #495057'
        }
        return (
            <>
                {this.state.loading ? <Loading mode={this.context.generalContext.mode} /> : 
                    <>
                        <h1 className="text-center">{this.state.car.name}</h1>
                        <h4 className="text-center text-muted" style={darkMode}>{this.state.car.carCompany}</h4>
                        <div className='d-flex flex-row container justify-content-around my-3'>
                            <div className='m-2' style={{ background: this.context.generalContext.mode === 'dark' ? '#061020' : 'white', color: this.context.generalContext.mode === 'dark' ? 'white' : 'black', border: "none" }}>
                                <img style={{ maxWidth: "800px" }} src={this.state.car.image ? 'data:image/jpeg;base64,' + this.state.car.image : "https://wallpapercave.com/wp/wp5055262.jpg"} alt="not found!" />

                            </div>
                            <div>
                                <h4 style={darkMode}>Colour: {this.state.car.colour}</h4>
                                <h4 style={darkMode}>Registration Number: {this.state.car.registerNumber}</h4>
                                <h4 style={darkMode}>Price for an Hour: &#x20b9; {this.state.rates.pricePerHour} </h4>
                                <h4 style={darkMode}>Price for a Km: &#x20b9; {this.state.rates.pricePerKm} </h4>
                                {this.props.AdminState ?
                                    <>
                                        <Link to='/addCar' state={{ data: this.state.car }} className='btn btn-primary m-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>Update</Link>
                                    </>
                                    :
                                    <>
                                        <hr />
                                        <Link to='/book' className="btn btn-success w-100 my-1">Book a Car</Link>
                                        <br />
                                        <br />
                                        <h3 className='m-4'> Calculate Estimated Price </h3>
                                        <div className="d-flex flex-row justify-content-between">
                                            <div>
                                                <h6>Estimated KM</h6>
                                                <div onClick={this.EKmMinus} className='btn btn-secondary'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
                                                </svg> </div>
                                                <button className='btn btn-light' disabled> {this.state.EpricePerKm} </button>
                                                <div onClick={this.EKmPlus} className='btn btn-secondary'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                                </svg> </div>
                                            </div>
                                            <h6 style={{ marginTop: "20px" }}>or</h6>
                                            <div>
                                                <h6>Estimated Hours</h6>
                                                <div onClick={this.EHourMinus} className='btn btn-secondary'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
                                                </svg> </div>
                                                <button className='btn btn-light' disabled> {this.state.EpricePerHour} </button>
                                                <div onClick={this.EHourPlus} className='btn btn-secondary'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                                </svg> </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-success w-100 my-5" onClick={this.getEstimatedPrice}>Calculate Estimated Price</button>
                                        <h5 id="Calculation"> </h5>
                                    </>
                                }
                            </div>
                        </div>
                    </>
                }
            </>
        )
    }
}

CarDetail.contextType = ContextCombined

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const AdminState = useSelector((state) => state.AdminStatus)
    const dispatch = useDispatch()
    const params = useParams()
    return <CarDetail {...props} params={params} navigate={navigate} AdminState={AdminState} dispatch={dispatch} />;
}

