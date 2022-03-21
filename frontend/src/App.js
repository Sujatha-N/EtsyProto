import React, {Component, useState} from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Signup from "./Signup";
import Login from "./Login";
import Navigatorbar from './Navigatorbar';
import Profile from "./Profile";
import Editprofile from "./Editprofile";
import Changeusername from "./Changeusername";
import Sell from "./Sell";
import ShopDetails from "./ShopDetails";
import Dashboard from "./Dashboard";
import Cart from "./Cart";
import ItemDescription from "./ItemDescription";
import Purchases from "./Purchases";
import Favourites from "./Favourites";
import Orders from "./Orders";
import Footer from "./Footer";


function App() {
    
  const[filterSearch,setFilterSearch] = useState('');

    return(
      
      <Container 
        className="d-flex align-items-center justify-content-center"
        style={{minHeight: "100vh"}}
      >
        <Router>
        <Navigatorbar filterSearch = {filterSearch} setFilterSearch = {setFilterSearch}></Navigatorbar>
          <main style = {{paddingBottom: "100px"}}>
            <Route path="/signup" component = {Signup}/>
            <Route path="/login" component = {Login}/>
            <Route exact path="/dashboard" component = {() => <Dashboard filterSearch={filterSearch}/>}/>
            <Route path="/profile" component= {Profile}/> 
            <Route path="/editprofile" component = {Editprofile}/>
            <Route path ="/changeusername" component = {Changeusername}/>
            <Route path ="/sell" component = {Sell}/>
            <Route path="/cart" component = {Cart}/>
            <Route path="/itemdescription/:id" component = {ItemDescription}/>
            <Route path="/checkout" component = {Purchases}/>
            <Route path="/favourites" component = {Favourites}/>
            <Route path="/orders/:id" component = {Orders}/>
            <Route path="/shopdetails/:id" component = {ShopDetails}/>

          </main>
          <Footer/>
        </Router>  
      </Container>

    );
  }

export default App;
