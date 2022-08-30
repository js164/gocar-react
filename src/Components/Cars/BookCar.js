import React, { Component } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { setAlertShow } from '../../ReduxStore/Action';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Moment from 'moment';

export class BookCar extends Component {
  constructor() {
    super()
    this.state = {
      book_for: 'Me',
      start_date_time: Date.now(),
      end_date_time: Date.now(),
      EKm: 0,
      name: '',
      mobile: '',
      wallet: null,
      rates: null,
      booking: null,
      confirmModelShow: false
    }
    this.getEstimatedPrice = this.getEstimatedPrice.bind(this)
    this.confirmShow = this.confirmShow.bind(this)
    this.confirmClose = this.confirmClose.bind(this)
    this.confirmBooking = this.confirmBooking.bind(this)
  }

  componentDidMount() {
    axios.get('/profile/wallet').then(response => {
      console.log(response);
      if (response.data.WalletCreated) {
        this.setState({
          wallet: response.data.data,
          name: response.data.data.username,
          mobile: response.data.data.mobile
        })
      }
    }).catch(err => {
      console.log(err)
    })
    axios.get('/category/car/' + this.props.params.id).then(response => {
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
  }

  getEstimatedPrice() {
    // e.preventDefault()
    let cal = document.getElementById('Calculation')
    let text = ''
    let val = (Math.abs(this.state.end_date_time - this.state.start_date_time)) / 36e5;
    if (val <= 0) {
      text = 'Please provide a valid input!';
    }
    let val2=((val * this.state.rates.pricePerHour) + (this.state.EKm * this.state.rates.pricePerKm))
    text = `Estimated Price for givin date and Kms will be &#8377;` + val2 + '<br />';
    cal.innerHTML = text
    return val2
  }

  confirmShow() {
    let eprice=this.getEstimatedPrice()
    let minBalance= eprice + Math.max(eprice/10,1000)
    let b = {
      name: this.state.name,
      mobile: this.state.mobile,
      car: this.props.params.id,
      pickUpDateTime: this.state.start_date_time,
      dropUpDateTime: this.state.end_date_time,
      estimateKm: this.state.EKm,
      estimatePrice: eprice,
      minBalance: minBalance,
    }
    this.setState({
      booking: b,
      confirmModelShow: true
    })
  }

  confirmClose() {
    this.setState({
      confirmModelShow: false
    })
  }

  confirmBooking(e){
    e.preventDefault();
    axios.post('/booking/create',this.state.booking).then(response=>{
      console.log(response)
    }).catch(err=>{
      console.log(err)
    })
  }

  render() {
    return (
      <div>
        <div className="container">
          <h1 className="text-center">Confirm Booking</h1>
          <div>
            Book For:
            <input type="radio" id="me" name="book_for" value="Me" checked={this.state.book_for === 'Me'} onChange={() => this.setState({ book_for: 'Me', name: this.state.wallet.username, mobile: this.state.wallet.mobile })} />
            <label htmlFor="me">Me</label>
            <input type="radio" id="other" name="book_for" value="Other" checked={this.state.book_for === 'Other'} onChange={() => this.setState({ book_for: 'Other', name: '', mobile: '' })} />
            <label htmlFor="other">Other</label>
          </div><br /> <br />

          <Form.Group className="mb-3" controlId="formBasicname">
            <Form.Label>Name</Form.Label>
            <Form.Control type="string" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} disabled={this.state.book_for === 'Me'} placeholder="Enter name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicmobile">
            <Form.Label>Mobile</Form.Label>
            <Form.Control type="number" value={this.state.mobile} onChange={(e) => this.setState({ mobile: e.target.value })} disabled={this.state.book_for === 'Me'} placeholder="Enter Mobile Number" />
          </Form.Group>

          <div>
            Select Pick Up Date & time: <DatePicker minDate={Date.now()} showTimeSelect selected={this.state.start_date_time} onChange={(date) => { this.setState({ start_date_time: date }); if (date > this.state.end_date_time) { this.setState({ end_date_time: date }) } }} /> <br /> <br />
            Select Drop Up Date & time: <DatePicker minDate={this.state.start_date_time} showTimeSelect selected={this.state.end_date_time} onChange={(date) => this.setState({ end_date_time: date })} /> <br /> <br />
            <h6>Estimated KM</h6>
            <div onClick={() => { if (this.state.EKm > 0) { this.setState({ EKm: this.state.EKm - 1 }) } }} className='btn btn-secondary'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
            </svg> </div>
            <input type="number" className='btn btn-light' onChange={(e) => { this.setState({ EKm: parseInt(e.target.value) }) }} value={this.state.EKm} />
            <div onClick={() => this.setState({ EKm: this.state.EKm + 1 })} className='btn btn-secondary'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg> </div>
          </div>
          <br /> <br />
          <button className="btn btn-success w-100 my-5" disabled={this.state.start_date_time - this.state.end_date_time >= 0 || this.state.EKm <= 0} onClick={this.getEstimatedPrice}>Calculate Estimated Price</button>
          <h5 id="Calculation"> </h5>
          <div className="d-flex flex-row justify-content-around">
            <button className="btn btn-success w-25" disabled={this.state.start_date_time - this.state.end_date_time >= 0 || this.state.EKm <= 0 || !this.state.name || this.state.mobile.length<10} onClick={this.confirmShow}>Book Car</button>
            <div className='w-25'>
              <button className="btn" disabled>Wallet:<strong> &#8377;{this.state.wallet && this.state.wallet.amount} </strong></button>
              <Link to='/profile/wallet' className='mx-2 btn btn-primary'>Add Money</Link>
            </div>
          </div>
        </div>



        <Modal show={this.state.confirmModelShow} onHide={this.confirmClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.booking !== null &&
              <div>
                Name: <strong> {this.state.booking.name}</strong><br />
                Mobile:<strong>{this.state.booking.mobile}</strong><br />
                Pick Up Date & Time:<strong> {Moment(this.state.booking.pickUpDateTime).format('MMM Do YY, HH:mm A')}</strong><br />
                Drop Up Date & Time:<strong> {Moment(this.state.booking.dropUpDateTime).format('MMM Do YY, HH:mm A')}</strong><br />
                Estimated Km: <strong> {this.state.booking.estimateKm}</strong><br />
                Estimated Price:<strong> {this.state.booking.estimatePrice}</strong><br />
              </div>
            }
            {this.state.wallet && this.state.booking && (this.state.wallet.amount < this.state.booking.minBalance) && 
            <p className='text-danger'> You don't have sufficient balace to book a car! <br />Please add <strong> &#8377; {this.state.booking.minBalance - this.state.wallet.amount } </strong> to wallet to continue.</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.confirmClose}>
              Close
            </Button>
            <Button variant="primary" disabled={this.state.wallet && this.state.booking && (this.state.wallet.amount < this.state.booking.minBalance)} onClick={this.confirmBooking}>
              Confirm Booking
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const params = useParams()
  return <BookCar {...props} params={params} />;
}