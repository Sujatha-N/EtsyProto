import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import Orders from './Orders';

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
        axios.get('http://localhost:4000/purchase')
            .then((response)=>{
                console.log(response.data);
                setOrders(response.data);
            })
    }, []);

    return(
        <div>
            {orders.map((item)=>{
                return(
                    <Row>
                        <Col>
                            <Link to={`/orders/${item.id}`}>Order ID: {item.id}</Link>
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
    );


}

export default Purchases;