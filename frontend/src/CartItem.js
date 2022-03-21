import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';

function CartItem(props){

    const[quantity, setQuantity] = useState(props.item.quantity);
    const cartreducer = useSelector((state)=> state.cartreducer);
    const{cart} = cartreducer;

    const qty = cart.qty;

    console.log("PROPS FROM CART PAGE IS", props.item)

    let dispatchEvent = useDispatch();
    

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Cart item page is ",token)
    if(!token){
        history.push("/login")
    }

    useEffect((e) => {
        
        axios.defaults.headers.common["x-auth-token"] = token;
        // axios.get('http://localhost:4000/getshopname')
        // .then(async response =>{
        //     console.log("Response from shopname api is",response)
            
        // })
    }, []);


    const currencyreducer = useSelector((state)=> state);
    console.log("CHECKING CURRENCY REDUCER DATA: ",currencyreducer.currencyreducer.currency);
    const currency = currencyreducer.currencyreducer.currency;

    const pricehandler = () =>{
        const total = cart.reduce(
            (previousValue, currentValue) => previousValue + currentValue.price * currentValue.quantity, 0
        );
        props.stp(total);
    }

    const removefromcart = () =>{
        dispatchEvent({type:"REMOVE_FROM_CART", payload:{item:props.item}}
        )
    }

    return(
        <div style={{display:"flex"}}>
            
                <p> <b>Name: </b>{props.item.iname}</p>

                <p style={{marginLeft:"50px"}}><b>Price: </b>{currency} {props.item.price}</p>

                <div style={{marginLeft:"50px"}}>
                    <label><b>Quantity: {props.item.qty}</b></label>
                </div>
                <div>
                <button onClick = {removefromcart} style ={{marginLeft:"10px"}}>
                        Remove from Cart
                </button>
                </div>
        </div>
        
    );
    


}

export default CartItem;