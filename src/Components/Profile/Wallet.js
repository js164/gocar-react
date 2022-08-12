import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '../General/loading';
import { ContextCombined } from '../../Context/CombinedContext';
import Modal from 'react-bootstrap/Modal';

export class Wallet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            KYCdocType: 'Adhar Card',
            KYCdoc: '',
            KYCdocNumber: '',
            mobile: '',
            displayImage: null,
            WalletCreated: false,
            loading: true,
            updatemodalShow:false
        }
        this.imagesPreview = this.imagesPreview.bind(this)
        this.chnageText = this.chnageText.bind(this)
        this.submit = this.submit.bind(this)
        this.setCategory = this.setCategory.bind(this)
        this.clearData = this.clearData.bind(this)
        this.sendOTP= this.sendOTP.bind(this)
        this.updatehandleClose=this.updatehandleClose.bind(this)
        this.updatehandleShow=this.updatehandleShow.bind(this)
    }
    
    updatehandleClose() {
        this.setState({
            updatemodalShow: false
        })
    }
    updatehandleShow(){
        this.setState({
            updatemodalShow: true,
            mobile:this.state.wallet.mobile,
            KYCdocType: this.state.wallet.KYCdocType,
            KYCdoc: this.state.wallet.KYCdoc,
            KYCdocNumber: this.state.wallet.KYCdocNumber,
            displayImage: 'data:image/jpeg;base64,'+this.state.wallet.KYCdoc
        })
    }

    clearData() {
        this.setState({
            KYCdocType: 'Adhar Card',
            KYCdoc: '',
            KYCdocNumber: '',
            mobile: '',
            displayImage: null,
            wallet: null
        })
        document.getElementById('image').value = ""
    }

    submit(e) {
        e.preventDefault()
        let formData = new FormData();

        formData.append('KYCdocType', this.state.KYCdocType)
        formData.append('KYCdocNumber', this.state.KYCdocNumber)
        formData.append('mobile', this.state.mobile)
        formData.append('KYCdoc', this.state.KYCdoc)
        if (this.props.location.state && this.props.location.state.data) {
            axios.put('/profile/wallet/update', formData, { headers: { 'content-type': 'multipart/form-data' } }).then(response => {
                console.log(response);
                if (response.data.success) {
                    this.props.dispatch(setAlertShow('success', 'Congratulations!', response.data.message))
                    this.clearData()
                    // this.props.navigate('/cardetail/' + response.data.data.carId, { replace: true })
                }
            }).catch(err => {
                this.props.dispatch(setAlertShow('success', 'Sorry!', err.message))
                console.log(err);
            })
        } else {
            axios.post('/profile/wallet/create', formData, { headers: { 'content-type': 'multipart/form-data' } }).then(response => {
                console.log(response);
                if (response.data.success) {
                    this.props.dispatch(setAlertShow('success', 'Congratulations!', response.data.message))
                    this.clearData()
                    this.setState({
                        WalletCreated: true
                    })
                    this.props.navigate('/profile/wallet/otp', { replace: true })
                }
            }).catch(err => {
                this.props.dispatch(setAlertShow('success', 'Sorry!', err.message))
                console.log(err);
            })
        }
    }

    setCategory(e) {
        this.setState({ KYCdocType: e.target.value })
    }
    imagesPreview(e) {
        if (e.target.files) {
            this.setState({
                KYCdoc: e.target.files[0],
                displayImage: URL.createObjectURL(e.target.files[0])
            })
        }
    };
    chnageText(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.wallet) {
            this.setState({
                WalletCreated: true,
                wallet: this.props.location.state.wallet,
                loading: false
            })
        } else {
            axios.get('/profile/wallet').then(response => {
                console.log(response);
                this.setState({
                    WalletCreated: response.data.WalletCreated,
                    wallet: response.data.data,
                    loading: false
                })
            }).catch(err => {
                console.log(err)
            })

        }
    }
    sendOTP(e){
        e.preventDefault();
        axios.get('/profile/wallet/otp/resend').then(response=>{
            console.log(response)
            this.props.navigate('/profile/wallet/otp', { replace: true })
        })
    }

    render() {
        return (
            <>
                {this.state.loading ? <Loading mode={this.context.generalContext.mode} /> :
                    this.state.WalletCreated ?
                        <div className="container my-4">
                            <Card >
                                <Card.Body>
                                    {this.state.wallet.username && <Card.Title>{this.state.wallet.username.toUpperCase()}</Card.Title>}
                                    <Card.Title>Amount: &#x20b9;{this.state.wallet.amount}</Card.Title>
                                    <Card.Text>
                                        Mobile: {this.state.wallet.mobile} <br />
                                        {!this.state.wallet.isActive ? <div className="text-danger">Not active <button onClick={this.sendOTP} className="btn btn-primary">Activate</button></div> :
                                        <h5 className="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-patch-check" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                        <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"/>
                                      </svg> Active</h5>}
                                        {!this.state.wallet.isAdminVerified &&
                                            this.props.AdminState ?
                                            <Button variant="primary m-4">Verify Wallet</Button>
                                            :
                                            <div className="text-danger"> Pending for verification by Admin!</div>}
                                        <button className="btn btn-secondary" onClick={this.updatehandleShow}>Update</button>
                                        <h4>KYC details:</h4>
                                        <img style={{ width: "100%" }} src={'data:image/jpeg;base64,' + this.state.wallet.KYCdoc} alt="" />
                                        <p>KYC Document: {this.state.wallet.KYCdocType}</p>
                                        <p>KYC Document Number: {this.state.wallet.KYCdocNumber}</p>
                                    </Card.Text>
                                    {this.state.wallet.isActive && this.state.wallet.isAdminVerified && <Button variant="primary">Add Money</Button>}
                                </Card.Body>
                            </Card>
                        </div> :
                        <div className="container">
                            <button className="btn btn-primary w-100 m-4 p-2" disabled><h4>Wallet</h4></button>
                            <Form onSubmit={this.submit}>
                                <Form.Group className="mb-3" controlId="formBasicMobile">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control type="number" placeholder="Enter mobile number..." name="mobile" value={this.state.mobile} onChange={this.chnageText} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Class</Form.Label>
                                    <Form.Select onChange={this.setCategory} required>
                                        <option value="Select Document" disabled>Select Class</option>
                                        <option value="Adhar Card" onClick={this.setCategory}>Adhar Card</option>
                                        <option value="Voting Card" onClick={this.setCategory}>Voting Card</option>
                                        <option value="Driving License" onClick={this.setCategory}>Driving License</option>
                                        <option value="PAN card" onClick={this.setCategory}>PAN card</option>
                                        <option value="Passport" onClick={this.setCategory}>Passport</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicdocnumber">
                                    <Form.Label>KYC Document Number</Form.Label>
                                    <Form.Control type="text" placeholder="Enter document number..." name="KYCdocNumber" value={this.state.KYCdocNumber} onChange={this.chnageText} required />
                                    <Form.Text className="text-muted">
                                        We'll never share your documents with anyone else.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select a Image of document</Form.Label>
                                    <Form.Control type="file" id="image" name="image" onChange={this.imagesPreview} />
                                    <br />
                                    {this.state.displayImage &&
                                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                        <Image src={this.state.displayImage} alt="Please select valid image!" style={{ maxWidth: "200px" }} ></Image>
                                    }
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Save & Get OTP
                                </Button>
                            </Form>
                        </div>
                }


<Modal show={this.state.updatemodalShow} onHide={this.updatehandleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Wallet</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicMobile">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control type="number" placeholder="Enter mobile number..." name="mobile" value={this.state.mobile} onChange={this.chnageText} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Class</Form.Label>
                                    <Form.Select onChange={this.setCategory} required>
                                        <option value="Select Document" disabled>Select Class</option>
                                        <option value="Adhar Card" onClick={this.setCategory}>Adhar Card</option>
                                        <option value="Voting Card" onClick={this.setCategory}>Voting Card</option>
                                        <option value="Driving License" onClick={this.setCategory}>Driving License</option>
                                        <option value="PAN card" onClick={this.setCategory}>PAN card</option>
                                        <option value="Passport" onClick={this.setCategory}>Passport</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicdocnumber">
                                    <Form.Label>KYC Document Number</Form.Label>
                                    <Form.Control type="text" placeholder="Enter document number..." name="KYCdocNumber" value={this.state.KYCdocNumber} onChange={this.chnageText} required />
                                    <Form.Text className="text-muted">
                                        We'll never share your documents with anyone else.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select a Image of document</Form.Label>
                                    <Form.Control type="file" id="image" name="image" onChange={this.imagesPreview} />
                                    <br />
                                    {this.state.displayImage &&
                                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                        <Image src={this.state.displayImage} alt="Please select valid image!" style={{ maxWidth: "200px" }} ></Image>
                                    }
                                </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.updatehandleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.submit}>
                            Update Wallet
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

Wallet.contextType = ContextCombined

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const AdminState = useSelector((state) => state.AdminStatus)
    const dispatch = useDispatch()
    return <Wallet {...props} location={useLocation()} AdminState={AdminState} navigate={navigate} dispatch={dispatch} />;
}