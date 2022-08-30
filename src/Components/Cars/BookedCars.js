import React, { Component } from 'react'
import { ContextCombined } from '../../Context/CombinedContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import Loading from '../General/loading';
import Collapse from 'react-bootstrap/Collapse';
import Moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

class BookedCars extends Component {

    constructor() {
        super()
        this.state = {
            bookings: [],
            loading: true,
            bookingDetails: false,
            car: '',
            deletemodalShow: false,
            remark:''
        }
        this.changeText=this.changeText.bind(this)
        this.openBookingDetails=this.openBookingDetails.bind(this)
        this.deletehandleClose=this.deletehandleClose.bind(this)
        this.cancelBooking=this.cancelBooking.bind(this)
    }

    cancelBooking(){
        // axios.put('/booking/cancel',{id:})
    }

    changeText(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    deletehandleClose(){
        this.setState({
            deletemodalShow:false
        })
    }

    componentDidMount() {
        axios.get('/booking/all').then(response => {
            console.log(response)
            if (response.data.success) {
                this.setState({
                    bookings: response.data.data,
                    loading: false
                })
            }
        }).catch(err => {
            console.log(err);
            setAlertShow('danger', 'Sorry!', 'somthings wents wrong.')
        })
    }

    openBookingDetails(e, b) {
        e.preventDefault()
        axios.get('/car/byId/' + b.car).then(response => {
            console.log(response)
            this.setState({
                bookingDetails: !this.state.bookingDetails,
                car: response.data.data
            })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <>
                {this.state.loading ? <Loading mode={this.context.generalContext.mode} /> :
                    <>
                        {this.props.AdminState ?
                            <div>
                                <div className="container">
                                    <h1 className="text-center m-3">Car Category</h1>
                                    {this.state.bookings.length !== 0 &&
                                        this.state.bookings.map((i,b) => {
                                            return <div>
                                                <div key={b._id} className="d-flex flex-row justify-content-between p-3 m-3" style={{ position: "relative", width: '100%', boxShadow: this.context.generalContext.mode === 'dark' ? '0 3px 10px rgb(255 255 255 / 0.3)' : '0 3px 10px rgb(0 0 0 / 0.2)' }}>
                                                    <div className="d-flex flex-column">
                                                        <div className="px-4"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-video2" viewBox="0 0 16 16">
                                                            <path d="M10 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                                            <path d="M2 1a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2ZM1 3a1 1 0 0 1 1-1h2v2H1V3Zm4 10V2h9a1 1 0 0 1 1 1v9c0 .285-.12.543-.31.725C14.15 11.494 12.822 10 10 10c-3.037 0-4.345 1.73-4.798 3H5Zm-4-2h3v2H2a1 1 0 0 1-1-1v-1Zm3-1H1V8h3v2Zm0-3H1V5h3v2Z" />
                                                        </svg> {b.name}</div>
                                                        <div className="px-4"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                                        </svg> {b.mobile}</div>
                                                    </div>
                                                    <div className="d-flex flex-row">
                                                        <div className="m-2 font-weight-bold" style={{ fontSize: "1.5rem" }}>{Moment(b.pickUpDateTime).format('MMM Do YY, HH:mm A')}</div>
                                                        <button className="mx-3" style={{ background: 'none', border: 'none' }}
                                                            onClick={(e) => this.openBookingDetails(e, b)}
                                                            aria-controls="bookingDetails"
                                                            aria-expanded={this.state.bookingDetails} >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                            </svg></button>
                                                    </div>
                                                </div>
                                                <Collapse in={this.state.bookingDetails}>
                                                    <div id={"bookingDetails"}>
                                                        <div className="card card-body p-3 m-3 w-100">
                                                            <Badge bg="danger" onClick={() => {
                                                                this.setState({ deletemodalShow: true })
                                                            }} style={{ position: "absolute", right: "30px", top: "-10px", cursor: "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                                                                </svg></Badge>
                                                            <div className="d-flex flex-row justify-content-between">
                                                                <div className='d-flex flex-column'>
                                                                    <div className="m-2">Name:<h5> {b.name} </h5> </div>
                                                                    <div className="m-2">Mobile:<h5> {b.mobile}</h5></div>
                                                                    <div className="m-2">Pick Up Date & Time:<h5> {Moment(b.pickUpDateTime).format('MMM Do YY, HH:mm A')}</h5></div>
                                                                    <div className="m-2">Drop Up Date & Time:<h5> {Moment(b.dropUpDateTime).format('MMM Do YY, HH:mm A')}</h5></div>
                                                                    <div className="m-2">Estimated Km:<h5> {b.estimateKm}</h5></div>
                                                                    <div className="m-2">Estimated Price:<h5> {b.estimatePrice}</h5></div>
                                                                </div>
                                                                <div className='d-flex flex-column mx-5'>
                                                                    <h2>Car Deatils</h2>
                                                                    <img style={{ maxWidth: "300px" }} src={this.state.car.image ? 'data:image/jpeg;base64,' + this.state.car.image : "https://wallpapercave.com/wp/wp5055262.jpg"} alt="not found!" />
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <div>
                                                                            <div className="m-2">Car Name:<h5> {this.state.car.name} </h5> </div>
                                                                            <div className="m-2">Car Company: <h5>{this.state.car.carCompany} </h5></div>
                                                                            <div className="m-2">Car Class:<h5> {this.state.car.category} </h5></div>

                                                                        </div>
                                                                        <div>
                                                                            <div className="m-2">Car Colour:<h5> {this.state.car.colour} </h5></div>
                                                                            <div className="m-2">Car Register Number:<h5> {this.state.car.registerNumber} </h5></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Collapse>
                                            </div>
                                        })
                                    }
                                </div>
                                <Modal show={this.state.deletemodalShow} onHide={this.deletehandleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Are you sure?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Add Remark here..."
                                                aria-label="remark"
                                                aria-describedby="basic-addon2"
                                                name="remark"
                                                value={this.state.remark}
                                                onChange={this.changeText}
                                            />
                                            <Button variant="outline-danger" id="button-addon2" onClick={this.cancelBooking}>
                                                Cancel Booking
                                            </Button>
                                        </InputGroup>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={this.deletehandleClose}>
                                            No
                                        </Button>
                                    </Modal.Footer>
                                </Modal>


                            </div>
                            :
                            <div>

                            </div>
                        }
                    </>
                }
            </>
        )
    }
}



BookedCars.contextType = ContextCombined

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const AdminState = useSelector((state) => state.AdminStatus)
    const dispatch = useDispatch()
    const params = useParams()
    return <BookedCars {...props} params={params} navigate={navigate} AdminState={AdminState} dispatch={dispatch} />;
}
