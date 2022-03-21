import React, {useEffect, useState} from 'react';
import { NavLink, Redirect, useHistory, Link } from 'react-router-dom';
import { Navbar, NavDropdown, Nav, Container, Button, Form, FormControl} from 'react-bootstrap';
import axios from 'axios';
import url from './config.json';

function Navigatorbar(props){
  const token = JSON.parse(localStorage.getItem('token'));
  let history = useHistory();
  console.log("Token in navbar is",token)
  if(!token){
    history.push("/login")
  }
  const[items,setItems] = useState([]);
  const ownid = 0;

  const shop = (e)=>{
    e.preventDefault();
    axios.defaults.headers.common["x-auth-token"] = token;
    console.log("Token in Nav bar is", token)
    axios.get(url.url+'/shopdetails')
      .then((response)=>{
        console.log("Response from axios shop details from navbar is",response.data.name);
        if(response.data.name !== ''){
          console.log("Inside shop details response");
          history.push(`/shopdetails/${ownid}`)
        }
      })
      .catch((err)=>{
        console.log("INSIDE CATCH ");
        history.push("/sell");
    })
  }


  const search = (e)=>{
    e.preventDefault();
    history.push("/dashboard");
  }



  return (
    <div>
        <Navbar bg="light" expand="lg" className="ml-10 fixed-top">
          <Container>
            <Navbar.Brand><Link to="/dashboard" style={{color:'#F56400'}}>Etsy</Link> </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              
              <Form className="d-flex" style={{width: '90%'}}>
                
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e)=>{props.setFilterSearch(e.target.value)}}
                />

                <Button variant="outline-success" onClick = {search}>Search</Button>
              </Form>

              <Nav className="me-auto" >
              <i class="fa fa-shopping-bag" aria-hidden="true" onClick={shop}></i>
              </Nav>

              <Nav className="me-auto" >
              <i class="fa fa-heart" aria-hidden="true" onClick={()=>history.push("/profile")}></i>
              </Nav>


              <Nav className="me-auto">
              <i class="fa fa-shopping-cart" aria-hidden="true" onClick={()=>history.push('/cart')}></i>
              </Nav>
              
              <NavDropdown id="basic-nav-dropdown" className="fa fa-user" style={{}}>
                <NavDropdown.Item onClick={()=>{history.push("/profile")}}>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>{history.push("/checkout")}}>Purchases</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>{history.push("/login")}}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>

    </div>
    
  );
}
export default Navigatorbar;