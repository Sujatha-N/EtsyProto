import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import url from './config.json';

function Orders(props){

    const token = JSON.parse(localStorage.getItem('token'));
    let history = useHistory();
    console.log("Token from Orders page is ",token)
    if(!token){
        history.push("/login")
    }
    
    const[orders,setOrders]= useState([]);

    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        console.log("Params id is", props.match.params.id)
        axios.post(url.url+'/orderid', {orderid: props.match.params.id})
            .then((response)=>{
                console.log("Response from Get orders API is",response.data);
                setOrders(response.data);
            })
        // window.location.reload();
    }, []);

    return(
        <div>
            <h2>Order {props.match.params.id} list</h2>
            {orders.map((item)=>{
                return(
                    <React.Fragment>
                        <Row>
                            <Col>
                                {item.ordername}
                            </Col>
                            <Col>
                                <img src={item.orderimage} width="250px" height="250px"></img>
                            </Col>
                            <Col>
                                Quantity: {item.orderquantity}
                            </Col>
                            <Col>
                                Price: {item.orderprice}
                            </Col>
                            <Col>
                                Shop Name: {item.shopname}
                            </Col>
                            <Col>
                                Sending as gift: {item.sendgift}
                            </Col>
                            {item.sendgift === 'yes' &&
                            <Col>
                                {item.giftdescription}
                            </Col>
                            }
                        </Row>
                    </React.Fragment>
                    
                    );
                })
            }
        </div>
    );


}

export default Orders;