import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import url from './config.json';
import Modal from 'react-modal';

function CartItem(props){

    const[quantity, setQuantity] = useState(props.item.quantity);
    const cartreducer = useSelector((state)=> state.cartreducer);
    const{cart} = cartreducer;
    const[qty, setqty] = useState(props.item.qty)
    const[sendgift, setsendgift] = useState(false);
    const[description, setDescription] = useState(props.item.description);
    const[modal,setModal] = useState(false);
    const[message, setMessage] = useState(false)
    

    // const qty = cart.qty;

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
    }, [sendgift]);

    const gift = async (e)=>{

        console.log("INSIDE gift")
        e.preventDefault();
        console.log("Before setting",sendgift)
        if(sendgift === true){
            await setsendgift(false);
            await setModal(false)
        }
        else{
            await setsendgift(true);
            await setModal(true)
        }
        
        console.log("After setting",sendgift)
    }




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

    const onsave = (e)=>{
        e.preventDefault();
        dispatchEvent({type:"ADD_DESCRIPTION", payload:{item:props.item, description:description}})
        setModal(false)

    }
    const changeQuantity = async(e)=>{
        console.log("------------", props.item.quantity, props.item.qty);
        if(!message){
            dispatchEvent({type:"CHANGE_QUANTITY", payload:{item:props.item, qty:qty}})
            await setMessage(false)
        }
        else{
            setMessage(true)
        }
    }

    // const changeQuantity = async(e)=>{
    //     console.log("------------", props.item.quantity, props.item.qty);
    //     if(props.item.quantity>=qty){
    //         dispatchEvent({type:"CHANGE_QUANTITY", payload:{item:props.item, qty:qty}})
    //         await setMessage(false)
    //     }
    //     else if(props.item.quantity<qty){
    //         await setMessage(true)
    //     }
    //     else{
    //         dispatchEvent({type:"CHANGE_QUANTITY", payload:{item:props.item, qty:qty}})
    //         await setMessage(false)
    //     }
    // }

    return(
        <div style={{display:"flex"}}>
                
                {props.item.quantity>=qty && message == true ? setMessage(false): null}
                {props.item.quantity<qty && message == false ? setMessage(true): null}
                {/* {quantity == 0 && outofstock == false ? setoutofstock(true): null}
                {quantity > 0 && outofstock == true ? setoutofstock(false): null} */}
            
                <p> <b>Name: </b>{props.item.iname}</p>

                <p style={{marginLeft:"50px"}}><b>Price: </b>{currency} {props.item.price}</p>

                {/* <div style={{marginLeft:"50px"}}>
                    <label><b>Quantity: {props.item.qty}</b></label>
                </div> */}
                {/* {JSON.stringify(props.item.qty)} */}
                <div>
                    <label><b>Quantity: </b></label>
                    <input id="quantity" type="number" value={props.item.qty} min="1"
                    onChange={async (e)=>{
                        await setqty(e.target.value);
                        changeQuantity();
                        // {props.item.quantity>=props.item.qty ? dispatchEvent({type:"CHANGE_QUANTITY", payload:{item:props.item, qty:qty}}) : setMessage(true)}

                    }}></input>
                </div>
                <Col>
                {/* {JSON.stringify(message)} */}
                    {message && <div>Only a maximum of {props.item.quantity} is available</div>}
                </Col>
                <div>
                        <label for="gift">Send it as a gift</label>
                        <input type="checkbox" id="gift" name="gift" value="gift" checked = {sendgift} onChange={gift} />
                </div>

                <Modal isOpen={modal} style={{marginLeft:"100px"}}>
                <div style={{marginLeft:"650px"}}>
                    
                    <div>
                        <label><b>Description: </b></label>
                        <input id="description" type="text"
                        onChange={(e)=>{
                            setDescription(e.target.value);
                        }}
                        
                        />
                    </div>
                    <Button className = "w-5 mt-1" type="submit" onClick={onsave}>Save</Button>

                </div>
                </Modal>
                
                <div>
                    <button onClick = {removefromcart} style ={{marginLeft:"10px"}}>
                            Remove from Cart
                    </button>
                </div>
                
        </div>
        
    );
    


}

export default CartItem;