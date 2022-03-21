import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';

function Sell(){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Edit Profile page is ",token)
    if(!token){
        history.push("/login")
    }

    const [shopName, setShopname] = useState('')
    const[message , setMessage] = useState('')

    const checkavailability = (e)=>{
        e.preventDefault();
        axios.post('http://localhost:4000/checkshopname', {name: shopName})
            .then((response)=>{
                console.log("Response in check shop name frontend is:",response.data);
                if(response.status === 200){
                    axios.post('http://localhost:4000/updateshopname',{name: shopName})
                        .then((response)=>{
                            console.log(response)
                            if(response.status === 200){
                                setMessage('')
                                history.push('/shopdetails');
                            }
                        })
                }
            })
            .catch(error => {
                console.log("Error Occurred")
                setMessage('Shop Name already exists')
                console.log("Error message in check shop name is ",message)
            });
    }

    return(
        <React.Fragment>
            <div>
                
                {message && <div>{message}</div>}
                <input id="shopname" type="text"
                onChange={(e)=>{
                    setShopname(e.target.value);
                }}
                />
                <Button className = "w-5 mt-1" type="submit" onClick={checkavailability}>Check Availability</Button>
            </div>
        </React.Fragment>
        
    );
}

export default Sell;