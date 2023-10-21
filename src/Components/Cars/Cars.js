import axios from 'axios'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { Component } from 'react'
import Badge from 'react-bootstrap/esm/Badge';
import { ContextCombined } from '../../Context/CombinedContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from "react-redux"
import Loading from '../General/loading';

export class Cars extends Component {
    constructor() {
        super()
        this.state = {
            allcars: [],
            // allCategory: [],
            selectedCategory: "All",
            selectedCar:[],
            loading:true,
        }
        this.setSelectedCategory=this.setSelectedCategory.bind(this)
        this.setSelectedCar=this.setSelectedCar.bind(this)
    }
    componentDidMount() {
        axios.get('/car/all').then(response => {
            console.log(response);
            if (response && response.data.success) {
                this.setState({
                    allcars: response.data.data,
                    loading:false
                })
                this.setSelectedCar(this.state.selectedCategory)
            } else {
                //error
            }
        }).catch(err => {
            console.log(err);
        })

    }
    setSelectedCategory(val){
        this.setState({
            selectedCategory:val
        })
        this.setSelectedCar(val)
    }
    setSelectedCar(val){
        if(val==='All'){
            this.setState({
                selectedCar: this.state.allcars
            })
        }else{
            this.setState({
                selectedCar: this.state.allcars.filter(c=> c.category[0]===val)
            })
        }
    }

    render() {
        const darkMode = {
            background: this.context.generalContext.mode === 'dark' ? '#061020' : 'white',
            color: this.context.generalContext.mode === 'dark' ? 'white' : 'black',
            // borderBottom:this.context.generalContext.mode === 'dark' ? '1px solid white' : '1px solid #495057'
        }
        return (
            <div className='container'>
                <h1 className="text-center">Cars</h1>
                <div className="d-flex justify-content-between m-2">
                    <h2>{this.state.selectedCategory} Class Cars</h2>
                    <div>

                    <Button variant={this.state.selectedCategory==='All'?'info':"outline-info"} className='m-1' onClick={()=>this.setSelectedCategory("All")}>All</Button>{' '}
                    <Button variant={this.state.selectedCategory==='A'?'success':"outline-success"} className='m-1' onClick={()=>this.setSelectedCategory("A")}>A</Button>{' '}
                    <Button variant={this.state.selectedCategory==='B'?'primary':"outline-primary"} className='m-1' onClick={()=>this.setSelectedCategory("B")}>B</Button>{' '}
                    <Button variant={this.state.selectedCategory==='C'?'secondary':"outline-secondary"} className='m-1' onClick={()=>this.setSelectedCategory("C")}>C</Button>{' '}
                    </div>

                </div>
                <div className="row">
                    {this.state.loading ? <Loading mode={this.context.generalContext.mode} /> :
                    this.state.selectedCar.length === 0 ? "No car Available!" :
                     this.state.selectedCar.map(car => {
                        return <div key={car._id} className="col-md-4">
                            <Card className='m-2' style={{ background: this.context.generalContext.mode === 'dark' ? '#061020' : 'white', color: this.context.generalContext.mode === 'dark' ? 'white' : 'black', border: "solid;black;1px;", boxShadow:this.context.generalContext.mode === 'dark' ? "0 4px 8px 0 rgba(100, 100, 100, 1), 0 6px 20px 0 rgba(100, 100, 100, 0.19)" : "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                                <Badge bg={car.category[0] === 'A' ? 'success' : car.category[0] === 'B' ? 'primary' : 'secondary'} style={{ position: "absolute", right: "-10px", top: "-10px", cursor: "pointer" }}>{car.category}</Badge>
                                <Card.Img variant="top" style={{height: "20vh", objectFit:"contain"}} src={car.image ? 'data:image/jpeg;base64,'+car.image : "https://wallpapercave.com/wp/wp5055262.jpg"} />
                                <Card.Body>
                                    <Card.Title>{car.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 font-weight-light" style={darkMode}>{car.carCompany}</Card.Subtitle>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item style={darkMode}>Colour: {car.colour}</ListGroup.Item>
                                        <ListGroup.Item style={darkMode}>Registration Number: {car.registerNumber}</ListGroup.Item>
                                        {/* <ListGroup.Item style={darkMode}>Price for an Hour: &#x20b9; </ListGroup.Item>
                                        <ListGroup.Item style={darkMode}>Price for a Km: &#x20b9; </ListGroup.Item> */}
                                    </ListGroup>
                                    <Link to={"/cardetail/" + car.carId} className='m-1 text-center btn btn-primary'>View</Link>
                                </Card.Body>
                            </Card>
                        </div>
                    })}
                </div>

                {this.props.adminState ? 
                <Link to="/addCar" className="float" style={{
                    position:"fixed",
                    width:"60px",
                    height:"60px",
                    bottom:"40px",
                    right:"40px",
                    backgroundColor:"rgb(37 136 189)",
                    color:"#FFF",
                    borderRadius:"50px",
                    textAlign:"center",
                    boxShadow: "2px 2px 3px #999",
                }}>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" style={{marginTop:"15px"}} className="bi bi-plus-lg" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
</svg>
</Link> : "" }

            </div>
        )
    }
}

Cars.contextType = ContextCombined
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
    const navigate = useNavigate();
    const adminState= useSelector((state)=>state.AdminStatus)
    return <Cars {...props} navigate={navigate} adminState={adminState} />;
}