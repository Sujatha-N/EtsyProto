import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import url from './config.json';

function Sell(){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Sell page is ",token)
    if(!token){
        history.push("/login")
    }

    const [shopName, setShopname] = useState()
    const[message , setMessage] = useState('')
    const[gotoshop, setgotoshop] = useState(false)
    


    const checkshopname = (e)=>{
        e.preventDefault();
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/checkshopname', {name: shopName})
            .then((response)=>{
                console.log("Response in check shop name frontend is:",response.data);
                if(response.status === 200){
                    axios.post(url.url+'/updateshopname',{name: shopName})
                        .then((response)=>{
                            console.log(response)
                            if(response.status === 200){
                                setMessage('')
                                setgotoshop(true)
                                history.push('/shopdetails/0');
                            }
                        })
                }
            })
            .catch(error => {
                console.log("Error Occurred")
                setMessage('Shop Name already exists')
                setgotoshop(false)
                console.log("Error message in check shop name is ",message)
            });
    }

    return(
        <React.Fragment>
            <div>
                {gotoshop && history.push("/shopdetails/0")}
                
                {message && <div>{message}</div>}
                <input id="shopname" type="text"
                onChange={(e)=>{
                    setShopname(e.target.value);
                }}
                />
                <Button className = "w-5 mt-1" type="submit" onClick={checkshopname}>
                Check Availability
                </Button>
            </div>
        </React.Fragment>
        
    );
}

export default Sell;