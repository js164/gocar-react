import axios from 'axios';
import React, { Component } from 'react'
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';

export class AddCar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      category: 'A',
      carCompany: '',
      colour: '',
      registerNumber: '',
      image: null,
      displayImage: null,
      allCategory: [],
      carId: '',
      carobj_ID: '',
    }
    this.imagesPreview = this.imagesPreview.bind(this)
    this.chnageText = this.chnageText.bind(this)
    this.submit = this.submit.bind(this)
    this.setCategory = this.setCategory.bind(this)
    this.clearData = this.clearData.bind(this)
  }

  clearData() {
    this.setState({
      name: '',
      category: 'A',
      carCompany: '',
      colour: '',
      registerNumber: '',
      image: null,
      displayImage: null
    })
    document.getElementById('image').value = ""
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.data) {
      this.setState({
        carCompany: this.props.location.state.data.carCompany,
        carId: this.props.location.state.data.carId,
        category: this.props.location.state.data.category,
        colour: this.props.location.state.data.colour,
        displayImage: 'data:image/jpeg;base64,' + this.props.location.state.data.image,
        name: this.props.location.state.data.name,
        registerNumber: this.props.location.state.data.registerNumber,
        carobj_ID: this.props.location.state.data._id

      })
    }
    axios.get('/category/all').then(allCategory => {
      console.log(allCategory);
      if (allCategory && allCategory.data.success) {

        this.setState({
          allCategory: allCategory.data.data
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }
  submit(e) {
    e.preventDefault()
    let formData = new FormData();

    formData.append('name', this.state.name)
    formData.append('category', this.state.category)
    formData.append('carCompany', this.state.carCompany)
    formData.append('colour', this.state.colour)
    formData.append('registerNumber', this.state.registerNumber)
    formData.append('image', this.state.image)
    if (this.props.location.state && this.props.location.state.data) {
      axios.put('/car/update/' + this.state.carobj_ID, formData, { headers: { 'content-type': 'multipart/form-data' } }).then(response => {
        console.log(response);
        if (response.data.success) {
          this.props.dispatch(setAlertShow('success', 'Congratulations!', response.data.message))
          this.clearData()
          this.props.navigate('/cardetail/' + response.data.data.carId, { replace: true })
        }
      }).catch(err => {
        this.props.dispatch(setAlertShow('success', 'Sorry!', err.message))
        console.log(err);
      })
    } else {
      axios.post('/car/addCar', formData, { headers: { 'content-type': 'multipart/form-data' } }).then(response => {
        console.log(response);
        if (response.data.success) {
          this.props.dispatch(setAlertShow('success', 'Congratulations!', response.data.message))
          this.clearData()
          this.props.navigate('/cardetail/' + response.data.data.carId, { replace: true })
        }
      }).catch(err => {
        this.props.dispatch(setAlertShow('success', 'Sorry!', err.message))
        console.log(err);
      })
    }
  }
  setCategory(e) {
    console.log(e.target.value);
    this.setState({ category: e.target.value })
  }
  imagesPreview(e) {
    if (e.target.files) {
      this.setState({
        image: e.target.files[0],
        displayImage: URL.createObjectURL(e.target.files[0])
      })
    }
  };
  chnageText(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    return (
      <>
        <div className="container">
          <h1 className="m-2 text-center">Add New Car</h1>
          <Form onSubmit={this.submit}>

            <Form.Group className="mb-3">
              <Form.Label>Car Name</Form.Label>
              <Form.Control placeholder="Enter name..." name="name" value={this.state.name} onChange={this.chnageText} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Car Company</Form.Label>
              <Form.Control placeholder="Enter company name..." name="carCompany" value={this.state.carCompany} onChange={this.chnageText} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Car Colour</Form.Label>
              <Form.Control placeholder="Enter colour..." name="colour" value={this.state.colour} onChange={this.chnageText} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Car Regisration Number</Form.Label>
              <Form.Control placeholder="Enter register number..." name="registerNumber" value={this.state.registerNumber} onChange={this.chnageText} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Class</Form.Label>
              <Form.Select onChange={this.setCategory} required>
                <option value="Select Class" defaultValue disabled>Select Class</option>
                {this.state.allCategory.length !== 0 && this.state.allCategory.map(c => {
                  return <option key={c.category} value={c.category} onClick={() => this.setCategory(c)}>{c.category}</option>
                })
                }
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Select a Image of car</Form.Label>
              <Form.Control type="file" id="image" name="image" onChange={this.imagesPreview} />
              <br />
              {this.state.displayImage &&
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <Image src={this.state.displayImage} alt="Please select valid image!" style={{ maxWidth: "200px" }} ></Image>
              }
            </Form.Group>
            {this.props.location.state && this.props.location.state.data ?
              <Button variant="primary" type="submit">Save Change</Button> :
              <Button variant="primary" type="submit">Save Car</Button>
            }
            <Link to="/adminDashboard" className="btn btn-danger mx-3">Cancel</Link>
          </Form>
        </div>
      </>
    )
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  return <AddCar {...props} location={useLocation()} navigate={navigate} dispatch={dispatch} />;
}