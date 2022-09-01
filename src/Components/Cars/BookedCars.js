import React, { Component } from 'react'
import { ContextCombined } from '../../Context/CombinedContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import Loading from '../General/loading';
import Moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';

class BookedCars extends Component {

    constructor() {
        super()
        this.state = {
            bookings: [],
            loading: true,
            deletemodalShow: false,
            remark: '',
            bookingId: ''
        }
        this.changeText = this.changeText.bind(this)
        this.deletehandleClose = this.deletehandleClose.bind(this)
        this.cancelBooking = this.cancelBooking.bind(this)
    }

    cancelBooking(e) {
        axios.put('/booking/cancel', { id: this.state.bookingId, remark: this.state.remark }).then(response => {
            console.log(response)
            if (response.data.success) {
                this.setState({
                    bookings: this.state.bookings.filter(b => b._id !== response.data.data._id)
                })
                setAlertShow('success', 'Congratulations!', response.data.message)
            }
        }).catch(err => {
            console.log(err)
            setAlertShow('danger', 'Sorry!', 'somthings wents wrong.')
        })
        this.deletehandleClose()
    }

    changeText(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    deletehandleClose() {
        this.setState({
            deletemodalShow: false,
            remark: '',
            bookingId: ''
        })
    }

    componentDidMount() {
        if (this.props.AdminState) {
            axios.get('/booking/active').then(response => {
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
        } else {
            axios.get('/booking/myBookings').then(response => {
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
    }


    render() {
        return (
            <>
                {this.state.loading ? <Loading mode={this.context.generalContext.mode} /> :
                    <>
                        {/* {this.props.AdminState ? */}
                        <div>
                            <div className="container">
                                <h1 className="text-center m-3">Uplcoming Bookings</h1>
                                <Accordion defaultActiveKey="0">
                                    {this.state.bookings.length !== 0 &&
                                        this.state.bookings.map((b, i) => {
                                            return <div>
                                                <Accordion.Item eventKey={i} style={{ border: 'none', background: b.status === "Active" ? "#0080002b" : "#ff00002b", boxShadow: this.context.generalContext.mode === 'dark' ? '0 3px 10px rgb(255 255 255 / 0.3)' : '0 3px 10px rgb(0 0 0 / 0.2)' }} className="p-1 m-3">
                                                    <Accordion.Header>
                                                        <div key={b._id} className="d-flex flex-row justify-content-between" style={{ position: "relative", width: '100%', color: this.context.generalContext.mode === 'dark' ? 'white' : 'black' }}>
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
                                                            </div>
                                                        </div>
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        <div className="card card-body w-100">
                                                            {b.status === "Active" &&
                                                                <>
                                                                    <Badge bg="primary" onClick={() => {
                                                                        this.props.navigate('/cardetail/'+b.carData.carId+'/book',{state:{booking:b}})
                                                                    }} style={{ position: "absolute", right: "-10px", top: "-10px", cursor: "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                                        </svg></Badge>

                                                                    <Badge bg="danger" onClick={() => {
                                                                        this.setState({ deletemodalShow: true, bookingId: b._id })
                                                                    }} style={{ position: "absolute", right: "30px", top: "-10px", cursor: "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                                                                        </svg></Badge>
                                                                </>}
                                                            <div className="d-flex flex-row justify-content-between">
                                                                <div className='d-flex flex-column'>
                                                                {b.status === 'Canceled' && <div className="m-2"><h5 className='text-danger'>Canceled</h5></div>}
                                                                {b.status === 'Active' && <div className="m-2"><h5 className='text-success'>Active</h5></div>}
                                                                    <div className="m-2">Name:<h5> {b.name} </h5> </div>
                                                                    <div className="m-2">Mobile:<h5> {b.mobile}</h5></div>
                                                                    <div className="m-2">Booking Id:<h5> {b.bookingId}</h5></div>
                                                                    <div className="m-2">Pick Up Date & Time:<h5> {Moment(b.pickUpDateTime).format('MMM Do YY, HH:mm A')}</h5></div>
                                                                    <div className="m-2">Drop Up Date & Time:<h5> {Moment(b.dropUpDateTime).format('MMM Do YY, HH:mm A')}</h5></div>
                                                                    <div className="m-2">Estimated Km:<h5> {b.estimateKm}</h5></div>
                                                                    <div className="m-2">Estimated Price:<h5> {b.estimatePrice}</h5></div>
                                                                    {b.status === 'Canceled' && <div className="m-2">Remarks:<h5> {b.remarks}</h5></div>}
                                                                </div>
                                                                <div className='d-flex flex-column mx-5'>
                                                                    <h2>Car Deatils</h2>
                                                                    <img style={{ maxWidth: "300px" }} src={b.carData.image ? 'data:image/jpeg;base64,' + b.carData.image : "https://wallpapercave.com/wp/wp5055262.jpg"} alt="not found!" />
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <div>
                                                                            <div className="m-2">Car Name:<h5> {b.carData.name} </h5> </div>
                                                                            <div className="m-2">Car Company: <h5>{b.carData.carCompany} </h5></div>
                                                                            <div className="m-2">Car Class:<h5> {b.carData.category} </h5></div>

                                                                        </div>
                                                                        <div>
                                                                            <div className="m-2">Car Colour:<h5> {b.carData.colour} </h5></div>
                                                                            <div className="m-2">Car Register Number:<h5> {b.carData.registerNumber} </h5></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </div>
                                        })
                                    }
                                </Accordion>
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
                        {/* :
                            <div>
                            </div> */}
                        {/* } */}
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
