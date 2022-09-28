import axios from 'axios';
import React, { Component } from 'react'
import { ContextCombined } from '../../Context/CombinedContext';
import { useNavigate, Link , useParams  } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';
import Loading from '../General/loading';
import DatePicker from "react-datepicker";

export class CarDetail extends Component {
    constructor() {
        super()
        this.state = {
            car: {},
            rates: {},
            EpricePerHour: 0,
            EpricePerKm: 0,
            loading:true,
            WalletCreated:false,
            start_date_time:new Date(),
            end_date_time:new Date()
        }
        this.getData = this.getData.bind(this)
        this.EHourPlus = this.EHourPlus.bind(this)
        this.EHourMinus = this.EHourMinus.bind(this)
        this.EKmPlus = this.EKmPlus.bind(this)
        this.EKmMinus = this.EKmMinus.bind(this)
        this.getEstimatedPrice = this.getEstimatedPrice.bind(this)
        this.checkAvailiblity=this.checkAvailiblity.bind(this)
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
        axios.get('/profile/wallet').then(response => {
            console.log(response);
                this.setState({
                    WalletCreated: response.data.WalletCreated,
                })
        }).catch(err => {
            console.log(err)
        })
    }
    getEstimatedPrice(e) {
        e.preventDefault()
        let cal = document.getElementById('Calculation')
        let text = ''
        if (this.state.EpricePerHour === 0 || this.state.EpricePerKm === 0) {
            text = 'Please provide a valid input!';
        }else{
            let val1=(this.state.EpricePerKm * this.state.rates.pricePerKm);
            let val2=(this.state.EpricePerHour * this.state.rates.pricePerHour);
            text = `Estimated Price for ${this.state.EpricePerKm} Km will be ` + val1 + '<br />'
            text += `Estimated Price for ${this.state.EpricePerHour} Hour will be ` + val2 +'<br />'
            text += `Estimated Total Price: ${val1+val2}`
        }
        cal.innerHTML = text
    }
    checkAvailiblity(e){
        e.preventDefault()
        console.log(this.state.start_date_time)
        axios.get('/booking/car/byDateRange/'+this.state.car._id+'/'+this.state.start_date_time+'/'+this.state.end_date_time).then(response=>{
            console.log(response)
            if(response){
                let avl = document.getElementById('availableStatus')
                if(response.data.available){
                    avl.innerHTML ='<h4 style="color:green"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-patch-check" viewBox="0 0 16 16">'+
                    '<path fillRule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>'+
                    '<path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"/>'+
                  '</svg>Available</h4>' 
                }else{
                    avl.innerHTML ='<h4 style="color:red"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-emoji-frown" viewBox="0 0 16 16">'+
                    '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>'+
                   '<path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>'+
                  '</svg>Not Available</h4>' 
                }
            }
        })
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
                                        {this.state.WalletCreated ? 
                                        <Link to='book' className="btn btn-success w-100 my-1">Book a Car</Link> : 
                                        <Link to='/profile/wallet' className="btn btn-success w-100 my-1">Create Wallet to Book</Link> }
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
                                            <h6 style={{ marginTop: "20px" }}>&</h6>
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
                                        <button className="btn btn-success w-100 my-5" disabled={this.state.EpricePerHour <= 0 || this.state.EpricePerKm <= 0} onClick={this.getEstimatedPrice}>Calculate Estimated Price</button>
                                        <h5 id="Calculation"> </h5>

                                        <h3 className='m-4'> Check Availiblity </h3>
                                        Select Pick Up Date & time: <DatePicker minDate={Date.now()} showTimeSelect selected={this.state.start_date_time} onChange={(date) => { this.setState({ start_date_time: date }); if (date > this.state.end_date_time) { this.setState({ end_date_time: date }) } }} /> <br /> <br />
                                        Select Drop Up Date & time: <DatePicker minDate={this.state.start_date_time} showTimeSelect selected={this.state.end_date_time} onChange={(date) => this.setState({ end_date_time: date })} /> <br /> <br />
            
                                        <button className="btn btn-success w-100 my-5" onClick={this.checkAvailiblity}>Check Status</button>
                                        <h5 id="availableStatus"> </h5>
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

