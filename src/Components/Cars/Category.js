import axios from 'axios'
import React, { Component } from 'react'
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ContextCombined } from '../../Context/CombinedContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { setAlertShow } from '../../ReduxStore/Action';

export class Category extends Component {
    constructor() {
        super()
        this.state = {
            allCategory: [],
            modalShow: false,
            updatemodalShow:false,
            deletemodalShow:false,
            category:'',
            pricePerHour:0,
            pricePerKm:0,
            id:'',
            toBeDeletedId:''
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleShow = this.handleShow.bind(this)
        this.chnageText = this.chnageText.bind(this)
        this.saveCategory = this.saveCategory.bind(this)
        this.updatehandleClose = this.updatehandleClose.bind(this)
        this.updateCategory = this.updateCategory.bind(this)
        this.deletehandleClose = this.deletehandleClose.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)
    }

    componentDidMount() {
        axios.get('/category/all').then(allCategory => {
            console.log(allCategory);
            if(allCategory && allCategory.data.success){

                this.setState({
                    allCategory: allCategory.data.data
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }

    handleClose() {
        this.setState({
            modalShow: false
        })
    }
    handleShow() {
        this.setState({
            modalShow: true
        })
    }
    deletehandleClose() {
        this.setState({
            deletemodalShow: false
        })
    }
    updatehandleClose() {
        this.setState({
            updatemodalShow: false
        })
    }
    chnageText(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    saveCategory(){
        let data={
            category:this.state.category,
            pricePerHour:this.state.pricePerHour,
            pricePerKm:this.state.pricePerKm
        }
        axios.post('/category/add',data).then(response=>{
            console.log(response);
            if(response && response.data.success){
                this.props.dispatch(setAlertShow('success','Congratulations!',response.data.message))
                this.state.allCategory.push(response.data.data)
                this.setState({
                    category:"",
                    pricePerHour:0,
                    pricePerKm:0
                })
                this.handleClose()
            }
            else{
                //error
                this.props.dispatch(setAlertShow('danger','Sorry!',response.data.message))
            }
        })
    }

    updateCategory(){
        let data={
            category:this.state.category,
            pricePerHour:this.state.pricePerHour,
            pricePerKm:this.state.pricePerKm
        }
        axios.put('http://localhost:5000/category/update/'+this.state.id,data).then(response=>{
            console.log(response);
            if(response && response.data.success){
                this.props.dispatch(setAlertShow('success','Congratulations!',response.data.message))
                // this.state.allCategory.push(response.data.data)
                let tempallCategory=this.state.allCategory;
                for(let i=0;i< tempallCategory.length ; i++){
                    if(tempallCategory[i]._id===response.data.data._id){
                        tempallCategory[i] = response.data.data;
                        break
                    }
                }
                this.setState({
                    allCategory:tempallCategory,
                    category:"",
                    pricePerHour:0,
                    pricePerKm:0,
                    id:''
                })
                this.updatehandleClose()
            }
            else{
                this.props.dispatch(setAlertShow('danger','Sorry!',response.data.message))
                //error
            }
        })
    }

    deleteCategory(){

        axios.delete('/category/remove/'+this.state.toBeDeletedId).then(response=>{
            console.log(response);
            if(response && response.data.success){
                this.props.dispatch(setAlertShow('success','Congratulations!',response.data.message))
                this.setState({
                    allCategory:this.state.allCategory.filter(d=>d._id!==this.state.toBeDeletedId),
                    toBeDeletedId:''
                })
                this.deletehandleClose()
            }
            else{
                //error
                this.props.dispatch(setAlertShow('danger','Sorry!',response.data.message))
            }
        })
    }
    
    render() {
        return (
            <>
                <div className="container">
                    <h1 className="text-center m-3">Car Category</h1>
                    {this.state.allCategory.length !== 0 &&
                        this.state.allCategory.map(c => {
                            return <div key={c.category} className="d-flex flex-row justify-content-between p-3 m-3" style={{ position: "relative", width: '100%', boxShadow: this.context.generalContext.mode === 'dark' ? '0 3px 10px rgb(255 255 255 / 0.3)' : '0 3px 10px rgb(0 0 0 / 0.2)' }}>
                                <Badge bg="primary" onClick={()=>{
                                     this.setState({
                                        updatemodalShow: true,
                                        category:c.category,
                                        pricePerHour:c.pricePerHour,
                                        pricePerKm:c.pricePerKm,
                                        id:c._id
                                    })
                                }} style={{ position: "absolute", right: "-10px", top: "-10px", cursor: "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg></Badge>

                                <Badge bg="danger" onClick={()=>{
                                     this.setState({
                                        deletemodalShow: true,
                                        toBeDeletedId:c._id
                                    })
                                }} style={{ position: "absolute", right: "30px", top: "-10px", cursor: "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                              </svg></Badge>


                                <div className="m-2 font-weight-bold" style={{ fontSize: "1.5rem" }}>{c.category}</div>
                                <div className="d-flex flex-column">
                                    <div className="px-4">Price for an Hour:&#x20b9; {c.pricePerHour}</div>
                                    <div className="px-4">Price for a Km:&#x20b9; {c.pricePerKm}</div>
                                </div>
                            </div>

                        })
                    }
                    <div className="text-center m-3">
                        <button className="btn btn-primary p-2" onClick={this.handleShow}>Add Category</button>
                    </div>
                </div>



                <Modal show={this.state.modalShow} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Car Category</Form.Label>
                            <Form.Control type="text" name="category" value={this.state.category} onChange={this.chnageText} placeholder="Enter Car Category..." />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price for an Hour</Form.Label>
                            <Form.Control type="number" name="pricePerHour" value={this.state.pricePerHour} onChange={this.chnageText} placeholder="Enter Price for an Hour..." />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price for a Km</Form.Label>
                            <Form.Control type="number" name="pricePerKm" value={this.state.pricePerKm} onChange={this.chnageText} placeholder="Enter Price for a Km..." />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.saveCategory}>
                            Save Category
                        </Button>
                    </Modal.Footer>
                </Modal>



                <Modal show={this.state.updatemodalShow} onHide={this.updatehandleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Car Category</Form.Label>
                            <Form.Control type="text" name="category" value={this.state.category} onChange={this.chnageText} placeholder="Enter Car Category..." disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price for an Hour</Form.Label>
                            <Form.Control type="number" name="pricePerHour" value={this.state.pricePerHour} onChange={this.chnageText} placeholder="Enter Price for an Hour..." />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price for a Km</Form.Label>
                            <Form.Control type="number" name="pricePerKm" value={this.state.pricePerKm} onChange={this.chnageText} placeholder="Enter Price for a Km..." />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.updatehandleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.updateCategory}>
                            Update Category
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.deletemodalShow} onHide={this.deletehandleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        it will delete category and all cars for this perticuler category!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.deletehandleClose}>
                            No
                        </Button>
                        <Button variant="danger" onClick={this.deleteCategory}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

Category.contextType=ContextCombined

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const dispatch= useDispatch()
    return <Category {...props} navigate={navigate} dispatch={dispatch} />;
}

