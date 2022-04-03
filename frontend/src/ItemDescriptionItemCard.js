import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button, Card} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import {useDispatch, useSelector} from 'react-redux';
import { userfavouritesreducer } from './redux/reducers/UserReducer';
import {currencyreducer} from './redux/reducers/UserReducer';
import url from './config.json';

function ItemDescriptionItemCard(props){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Item Description Item card page is ",token)
    if(!token){
        history.push("/login")
    }

    const currencyreducer = useSelector((state)=> state);
    console.log("CHECKING CURRENCY REDUCER DATA: ",currencyreducer.currencyreducer.currency);
    const currency = currencyreducer.currencyreducer.currency;


    const[bgcolor, setbgcolor] = useState(props.bgcolor);
    const[liked, setLiked]= useState(props.liked);


    console.log("CHECKING - 1 is", props)

    useEffect(() => {
        console.log("CHECKING - 2 is", props.bgcolor)
        if(props.bgcolor === 'red'){
            setbgcolor('red');
        }
        else{
            setbgcolor('#DCDCDC')
        }

    });

    
    const addorremovefavourite = (e)=>{
        e.preventDefault();

        // axios.defaults.headers.common["x-auth-token"] = token;
        // axios.post(url.url+'/favouritesid', {itemid:props.item.id})
        //     .then((response)=>{
        //         console.log("Liked data is",response.data);
        //         setLiked(response.data);
                if(liked==='yes'){
                    setLiked('no')
                    setbgcolor('#DCDCDC')
                    axios.defaults.headers.common["x-auth-token"] = token;
                    axios.post(url.url+'/removefromfavourites', {itemid: props.item.id})
                        .then((response)=>{
                            console.log(response.status);
                            if(response.status===200){
                                console.log("Removed from favourites")
                            }
                        }
                    )
        
                }
                else{
                    setLiked('yes');
                    setbgcolor('red');
                    axios.defaults.headers.common["x-auth-token"] = token;
                    axios.post(url.url+'/addtofavourites', {itemid: props.item.id, itemname: props.item.iname, itemprice: props.item.price, itemcurrency: props.item.price_currency, liked:'yes', image: props.item.itemimage})
                        .then((response)=>{
                            console.log(response);
                            if(response.status===200){
                                console.log("Inside 200")
                            }
                        }
                    )
        
                }
        
            // })
    }


    return(
        <Card classname="my-3 p-3 rounded" style={{ width: "18rem", marginTop: "50px"  }}>
            {/* <Link to={`/getItems/${items.item_id}`}>
                <Card.Img src={} variant="top" />
            </Link> */}
            <Card.Body>
                <Row>
                    <Col>
                        
                            <Card.Title as="div">
                            <strong>{props.item.iname}</strong>
                            </Card.Title>
                        {/* </Link> */}
                    </Col>
                    <Col>
                        {/* {JSON.stringify(bgcolor)} */}
                        <Button
                            variant="light"
                            className = "fa fa-heart"
                            style={{color: bgcolor, background: "none", marginLeft: "200px"}}
                            // onClick = {addorremovefavourite}
                        >
                        </Button>
                    </Col>
                    <Col>
                        <img src={props.item.itemimage} width="250px" height="200px"></img>
                    </Col>
                </Row>
                <Row>
                <Col>
                    <strong>{currency} {props.item.price}</strong>
                </Col>
                </Row>
            </Card.Body>
      </Card>
    );

}

export default ItemDescriptionItemCard;