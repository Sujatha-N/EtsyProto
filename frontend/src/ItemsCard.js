import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button, Card} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import {useDispatch, useSelector} from 'react-redux';
import { userfavouritesreducer } from './redux/reducers/UserReducer';
import url from './config.json';

function ItemsCard(props){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Items card page is ",token)
    if(!token){
        history.push("/login")
    }

    const currencyreducer = useSelector((state)=> state);
    console.log("CHECKING CURRENCY REDUCER DATA: ",currencyreducer.currencyreducer.currency);
    const currency = currencyreducer.currencyreducer.currency;


    const[bgcolor, setbgcolor] = useState('red');
    const[liked, setLiked]= useState(props.item.liked);

    useEffect((e) => {
        if(props.item.liked === 'yes'){
            setbgcolor('red');
        }
    }, []);

    console.log("Like is", props.item.liked);

    
    const addorremovefavourite = (e)=>{
        e.preventDefault();

        axios.defaults.headers.common["x-auth-token"] = token;
        console.log("Item id is", props.item.itemid);
        axios.post(url.url+'/favouritesid', {itemid:props.item.itemid})
            .then((response)=>{
                console.log("Liked data is",response.data.liked);
                setLiked(response.data.liked);
                console.log("Set liked is", liked);
                if(liked==='yes'){
                    setLiked('no')
                    setbgcolor('#DCDCDC')
                    axios.defaults.headers.common["x-auth-token"] = token;
                    axios.post(url.url+'/removefromfavourites', {itemid: props.item.itemid})
                        .then((response)=>{
                            console.log(response.status);
                            if(response.status===200){
                                console.log("Removed from favourites")
                            }
                            // window.location.reload();
                        }
                    )
        
                }
                // else{
                //     setLiked('yes');
                //     setbgcolor('red');
                //     axios.defaults.headers.common["x-auth-token"] = token;
                //     axios.post('http://localhost:4000/addtofavourites', {itemid: props.item.id, itemname: props.item.iname, itemprice: props.item.price, itemcurrency: props.item.price_currency, liked:'yes', image:props.item.itemimage})
                //         .then((response)=>{
                //             console.log(response);
                //             if(response.status===200){
                //                 console.log("Inside 200")
                //             }
                //         }
                //     )
        
                // }
        
            })
    }


    return(
        <Card classname="my-3 p-3 rounded" style={{ width: "18rem", marginTop: "50px"}}>
            {/* <Link to={`/getItems/${items.item_id}`}>
                <Card.Img src={} variant="top" />
            </Link> */}
            <Card.Body>
                <Row>
                    <Col>
                        <Link to={`/itemdescription/${props.item.itemid}`}>
                            {/* <Card.Title as="div"> */}
                            <strong>{props.item.itemname}</strong>
                            {/* </Card.Title> */}
                        </Link>
                    </Col>
                    <Col>
                        <Button
                            variant="light"
                            className = "fa fa-heart"
                            style={{color: bgcolor, background: "none", marginLeft: "200px"}}
                            onClick = {addorremovefavourite}
                        >
                        </Button>
                    </Col>
                    <Col>
                        <img src={props.item.image} width="250px" height="250px"></img>
                    </Col>
                    <Col>
                        <strong>{currency} {props.item.itemprice}</strong>
                    </Col>
                    
                    
                </Row>
            </Card.Body>
      </Card>
    );

}

export default ItemsCard;