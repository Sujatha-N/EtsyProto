import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import CartItem from './CartItem'
import {useDispatch, useSelector} from 'react-redux';
import url from './config.json';

function Cart(){
    
    let dispatchEvent = useDispatch();

    const cartreducer = useSelector((state)=> state);
    console.log("CHECKING CART REDUCER DATA: ",cartreducer);
    const cart = cartreducer.cartreducer.cart;

    console.log('URL', url)

    console.log("Cart from Cart reducer data is",cart);

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Cart page is ",token)
    if(!token){
        history.push("/login")
    }

    const total = cart.reduce(
        (previousValue, currentValue) => previousValue + currentValue.price * currentValue.quantity, 0
    );

    const [totalPrice, setTotalPrice] = useState(total);
    const[addmsg, setaddmsg] = useState(false);

    

    const checkouthandler = (e) =>{
        e.preventDefault();
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/purchase', {itemstotal:cart.length})
            .then((response)=>{
                console.log("Inserted data is",response);
                if(response.status===200){
                    console.log("Inserted into purchases and moves on to inserting in orders")
                    cart.map((item)=>{
                        console.log("Item from cart is",item)
                        axios.post(url.url+'/orders', {ordername:item.iname, orderquantity: item.quantity, orderprice: item.price, orderitemid: item.id, orderimage: item.itemimage})
                            .then((response)=>{
                                console.log(response);
                                if(response.status === 200){
                                    axios.post(url.url+'/updatequantity', {orderitemid:item.id})
                                        .then((response)=>{
                                            console.log("Updated quantity for items")
                                            if(response.status===200){
                                                dispatchEvent({type:"CLEAR_CART", payload:{item}})
                                            }
                                        })  
                                }
                            })
                    })
                }
            })
        axios.get(url.url+'/editprofile')
            .then((response) =>{
                console.log(response)
                if(response.data.address!=null){
                    history.push("/checkout");
                }
                else{
                    setaddmsg(true);
                    history.push('/cart');
                }
            })
        
    }

    useEffect((e) => {

        setTotalPrice(total);
        console.log("Total price is",totalPrice);

    }, []);

    return(
        <div>
            {addmsg && <div>Please fill in your address in your profile</div>}
            {cart.length!==0 ? (
                <div>
                    {cart.map((item)=>{
                        console.log("ITEM IN LOOP IS", item)
                        return(
                        <CartItem item = {item} stp = {setTotalPrice}/>
                        );
                    })}
                    <div>
                        <span>TOTAL: ({cart.length} items)</span>
                        <span>$ {totalPrice}</span>
                    </div>

                    <button onClick = {checkouthandler}>
                        Checkout
                    </button>
                </div>

            ) : (
                <div>
                    Cart is empty !
                </div>
            )}

        </div>
    );

}

export default Cart;