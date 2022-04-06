import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button, FormControl} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import ItemsCard from './ItemsCard';
import url from './config.json';

function Favourites(){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Item Description page is ",token)
    if(!token){
        history.push("/login")
    }

    const[items,setItems] = useState([]);
    const[search,setSearch] = useState('');

    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.get(url.url+'/favourites')
            .then(async response =>{
                console.log("Response in favourites items is ",response.data)
                await setItems([...response.data])
                console.log("Items are ",items)
            })

    }, []);

    const filteredItems = items.filter((item)=>{
        console.log("Item is", item)
        const lowercase = search.toLowerCase()
        console.log('Return statement in filter', item.itemname.toLowerCase().includes(lowercase))
        // if(!item.itemname.includes(search)){
        //     setMessage("Item not found")
        // }
        return (
            item.itemname.toLowerCase().includes(lowercase)
        );
    })


    const filtersearch = (e) =>{
        e.preventDefault();
        history.push("/favourites")
    }


    return(
        <div style={{width: "1250px"}}>

            <div style={{display:"flex", marginTop: "180px"}}>
           
                    {/* <div > */}
                        <h2 style={{width: "250px"}}>Favourite Items</h2>
                    {/* </div> */}
                    <Form className="d-flex" style={{width: '50%',height:"40px", marginLeft:"450px"}}>
                        
                        <FormControl
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        onChange={(e)=>{setSearch(e.target.value)}}
                        />

                        <Button variant="outline-success" onClick = {filtersearch}>Search</Button>
                    </Form>
              

                {/* <Row> */}
                
                {/* {message && <div> Item not found </div>} */}
                    
                {/* </Row> */}

            </div>

            <div>
            {filteredItems.length!==0 ? (
                    <Row>

                        {filteredItems.map((item)=>{
                            return (
                                <Col>
                                    <ItemsCard item= {item}/>
            
                                </Col>
                            );
                        }
                        )}

                    </Row>
            ) : (
                <div>
                    No favourites so far!
                </div>
            )}   
                
            </div>
        </div>
    );
}

export default Favourites;










