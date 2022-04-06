import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import Orders from './Orders';
import url from './config.json';

function Purchases(){

    const token = JSON.parse(localStorage.getItem('token'));
    let history = useHistory();
    console.log("Token from Purchases page is ",token)
    if(!token){
        history.push("/login")
    }
    const[orders,setOrders] = useState([])
    const[total,setTotal] = useState();

    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.get(url.url+'/purchase')
            .then((response)=>{
                console.log(response.data);
                setOrders(response.data);
            })
    }, []);

    return(
        <div>
            {orders.length!==0 ? (
                <div>
                    {orders.map((item)=>{
                        return(
                            <Row>
                                <Col>
                                    <Link to={`/orders/${item.purchaseid}`}>Order ID: {item.purchaseid}</Link>
                                </Col>
                                <Col styles={{width:"200px"}}>
                                    Total items ordered : {item.itemstotal}
                                </Col>
                                <Col style={{width:"1000px"}}>
                                    Date Of Purchase : {item.purchasedate}
                                </Col>
            
                            </Row>
                            );
                        }) 
                    }
                </div>
            ) : (
                <div>
                    No Purchases done so far!
                </div>
            )}
        </div>
    );


}

export default Purchases;