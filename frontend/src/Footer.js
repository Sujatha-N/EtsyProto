import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Navbar, NavDropdown, Nav, Container, Button, Form, FormControl} from 'react-bootstrap';
import Modal from 'react-modal';
import {countries, languages, pricecurrency} from './common/countrieslist';
import {useDispatch} from 'react-redux';
import url from './config.json';




function Footer(){

    const dispatchEvent = useDispatch();

    const[show,setShow] = useState(false);
    const[country,setCountry] = useState([]);
    const[language, setLanguage] = useState([]);
    const[currency, setCurrency] = useState([]);

    const handlecountry = (e) =>{
        e.preventDefault();

        console.log("COUNTRY IS", e.target.value);
        console.log("Countries is", countries);
        let index = countries.indexOf(e.target.value);
        console.log('INDEX IS', index)

        const con = countries[index]
        const lan = languages[index]
        const pri = pricecurrency[index]

        setCountry(con);
        setLanguage(lan);
        setCurrency(pri);
        
    }

    const handlelanguage = (e) =>{
        e.preventDefault();
        
        console.log("language IS", e.target.value);
        console.log("languages are", languages);
        let index = languages.indexOf(e.target.value);
        console.log('INDEX IS', index)

        const con = countries[index]
        const lan = languages[index]
        const pri = pricecurrency[index]

        setCountry(con);
        setLanguage(lan);
        setCurrency(pri);
        
    }

    const handlecurrency = (e) =>{
        e.preventDefault();
        
        console.log("Currency IS", e.target.value);
        console.log("Currency is", pricecurrency);
        let index = pricecurrency.indexOf(e.target.value);
        console.log('INDEX IS', index)

        const con = countries[index]
        const lan = languages[index]
        const pri = pricecurrency[index]

        setCountry(con);
        setLanguage(lan);
        setCurrency(pri);
        
    }

    const onsave = (e) =>{
        e.preventDefault();
        setShow(false)
        dispatchEvent({type:"CHANGE_CURRENCY", payload:{currency}})
        // window.location.reload();
    }




  return (
        
    // <Navbar class="navbar fixed-bottom navbar-light bg-light">
    //     <a class="navbar-brand" href="#">Fixed bottom</a>
    // </Navbar>

    // style={{backgroundColor:"#45637d"}}

    

    <React.Fragment>

        <Navbar fixed="bottom" style={{backgroundColor:"#DCDCDC", backgroundAttachment: "scroll", backgroundPosition: "0% 0%", backgroundRepeat: "repeat", position: "fixed", bottom: "0", height: "40px"}}>
            <Container>
                {/* <Navbar.Brand>Etsy</Navbar.Brand> */}
                <Nav className="me-auto">
                    <Nav.Link onClick={()=>setShow(true)} style={{marginLeft: "500px"}}>@ {country}</Nav.Link>
                    <Nav.Link onClick={()=>setShow(true)}>{language}</Nav.Link>
                    <Nav.Link onClick={()=>setShow(true)}>{currency}</Nav.Link>
                    
                </Nav>
            </Container>
        </Navbar>

        <Modal isOpen={show}>

            <div style ={{marginTop: "100px"}}>
                
                <label><b>Country Name </b></label>
                <select
                value={country}
                onChange={handlecountry}
                >
                {countries.map((index) => <option>{index}</option>)}
                </select>
            </div>

            <div>
            
                <label><b>Language </b></label>
                <select
                value={language}
                onChange={handlelanguage}
                >
                {languages.map((index) => <option>{index}</option>)}
                </select>
            </div>

            <div>
            
                <label><b>Currency </b></label>
                <select
                value={currency}
                onChange={handlecurrency}
                
                >
                {pricecurrency.map((index) => <option>{index}</option>)}
                </select>
            </div>



            <Button className = "w-5 mt-1" type="submit" onClick={onsave}>Save</Button>

        </Modal>


    </React.Fragment>

    



    // <nav class="navbar fixed-bottom navbar-light bg-light">
    //     <a class="navbar-brand" href="#">Fixed bottom</a>
    // </nav>

  );
}
export default Footer;