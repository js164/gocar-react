import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import axios from 'axios'
import { useDispatch } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';
import { useNavigate, useLocation } from 'react-router-dom';

export class Wallet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            KYCdocType: 'Adhar Card',
            KYCdoc: '',
            KYCdocNumber: '',
            mobile: '',
            displayImage: null,
            WalletCreated: false
        }
        this.imagesPreview = this.imagesPreview.bind(this)
        this.chnageText = this.chnageText.bind(this)
        this.submit = this.submit.bind(this)
        this.setCategory = this.setCategory.bind(this)
        this.clearData = this.clearData.bind(this)
    }


    clearData() {
        this.setState({
            KYCdocType: 'Adhar Card',
            KYCdoc: '',
            KYCdocNumber: '',
            mobile: '',
            displayImage: null,
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
                        WalletCreated:true
                    })
                    // this.props.navigate('/profile/wallet/otp', { replace: true })
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
        axios.get('/profile/wallet').then(response => {
            console.log(response);
            this.setState({
                WalletCreated: response.data.WalletCreated
            })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <>
                {this.state.WalletCreated ?
                    <>
                        hello
                    </> :
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
            </>
        )
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    return <Wallet {...props} location={useLocation()} navigate={navigate} dispatch={dispatch} />;
}