import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';

function Changeusername(){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Change UserName page is ",token)
    if(!token){
        history.push("/login")
    }

    const [userNamePro, setUserNamePro] = useState('')


    const saveChanges = (e)=>{
        e.preventDefault();
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post('http://localhost:4000/changeusername',{username: userNamePro})
            .then((response)=>{
                if(response.status === 200)
                console.log("Inside 200 for Change Username");
                history.push('/profile')
        })
    }

    return(
        <div>
            <label>
                New Name:
            </label>
            <input type="text" onChange={(e)=>{setUserNamePro(e.target.value)}}/>
            <button onClick = {saveChanges} >Done</button>
        </div>
    );

}

export default Changeusername;

