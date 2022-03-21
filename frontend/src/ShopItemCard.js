import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button, Card} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import {useDispatch, useSelector} from 'react-redux';
import { userfavouritesreducer } from './redux/reducers/UserReducer';
import EditItem from './EditItem';

function ShopItemCard(props){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Shop Item Card page is ",token)
    if(!token){
        history.push("/login")
    }

    const currencyreducer = useSelector((state)=> state);
    console.log("CHECKING CURRENCY REDUCER DATA: ",currencyreducer.currencyreducer.currency);
    const currency = currencyreducer.currencyreducer.currency;

    const[showedit, setshowedit] = useState(false);
    const isOwner = props.msg;
    console.log("IS OWNER FROM SHOP ITEM CARD IS", isOwner);

    const edit = (e)=>{
        e.preventDefault();
        setshowedit(true)
    }


    return(
        <div>
            <Card classname="my-3 p-3 rounded" style={{ width: "18rem", marginTop: "50px"}}>
            
                <Card.Body>
                    <Row>
                        <Col>
                        <Link to={`/itemdescription/${props.item.id}`}>{props.item.iname}</Link>

                        </Col>
                        <Col style={{paddingBottom:"6px"}}>
                            
                            { isOwner && 
                                <Button
                                variant="primary"
                                style={{color: "GREY", background: "none", marginLeft: "200px", height: "30px"}}
                                onClick = {()=>setshowedit(true)}
                            >
                                Edit
                                </Button>
                            }
                            
                        </Col>
                        <Col>
                            <img src={props.item.itemimage} width="250px" height="250px"></img>
                        </Col>
                        <Col>
                            <strong>{currency} {props.item.price}</strong>
                        </Col>
                        <Col>
                            SalesCount is: {props.item.salescount}
                        </Col>
                        
                    </Row>
                </Card.Body>
            </Card>

            {showedit && <EditItem showedit = {showedit} itemid = {props.item.id}/>}

        </div>
        
    );

}

export default ShopItemCard;