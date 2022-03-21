import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button, Card} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import { useDispatch, useSelector } from "react-redux";
import ItemDescriptionItemCard from './ItemDescriptionItemCard';

function ItemDescription(props){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Item Description page is ",token)
    if(!token){
        history.push("/login")
    }

    const[likeditems, setLikedItems] = useState([]);
    const[qty,setqty] = useState(1);
    const[item,setItem] = useState([]);
    const [iName, setIName] = useState('')
    const[quantity,setQuantity] = useState(1)
    const[priceCurrency,setPriceCurrency] = useState('')
    const[price,setPrice] = useState('')
    const[message,setMessage] = useState(false)
    const[liked, setliked]= useState('no')
    const[shopname,setShopName]= useState('')
    const[outofstock,setoutofstock] = useState(false)
    const[desc,setDesc] = useState()
    const[salescount,setsalescount] = useState()

    let dispatchEvent = useDispatch();


    const cartreducer = useSelector((state)=> state.cartreducer);
    const currencyreducer = useSelector((state)=> state);
    console.log("CHECKING CURRENCY REDUCER DATA: ",currencyreducer.currencyreducer.currency);
    const currency = currencyreducer.currencyreducer.currency;
    
    
    useEffect((e) => {
        
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post('http://localhost:4000/itemdescription',{id : props.match.params.id})
            .then(async(response)=>{
                console.log("Response from Item description server is",response.data.name);
                await setItem(response.data);
                await setIName(response.data.iname)
                await setQuantity(response.data.quantity)
                await setPriceCurrency(response.data.price_currency)
                await setPrice(response.data.price)
                await setShopName(response.data.name)
                await setDesc(response.data.description)
                await setsalescount(response.data.salescount)
            })
        axios.get('http://localhost:4000/likeditems')
            .then(async response =>{
                console.log("Response from liked items item description page is is",response)
                await setLikedItems([...response.data])
            })

    },[]);

    console.log("LIKED ITEMS IS", likeditems)

    const likeditem = likeditems.filter(likeitem=>{
        console.log("ITEM ID OUTSIDE FILTER IS", parseInt(likeitem.itemid), props.match.params.id)
        if(parseInt(likeitem.itemid)===parseInt(props.match.params.id)){
            console.log("ITEM ID INSIDE FILTER IS", parseInt(likeitem.itemid), props.match.params.id)
            return(
                likeitem
            );
        }  
        
    
        
    })

    console.log("LIKED ITEM IN ITEMDESC PAGE IS", likeditem)

    const addtocart = (e)=>{
        e.preventDefault();
        console.log("Item from add to cart function is",item)
        if(!message){
            dispatchEvent({type:"ADD_TO_CART", payload:[{item:{item}, qty:{qty}}]})
            history.push('/cart');
        }
        else{
            history.push(`/itemdescription/${props.match.params.id}`)
        }
        
    }
    // const pricehandler = () =>{
    //     const total = parseInt(price) * quantity;
    //     setPrice(total)
    // }

    // const checkquantity = () =>{
    //     if(qty > quantity){
    //         setMessage(true)
    //     }
    //     else{
    //         setMessage(false)
    //     }
    // }

    return(
        <div>
            {qty > quantity && message == false ? setMessage(true): null}
            {qty <= quantity && message == true ? setMessage(false): null}
            {quantity == 0 && outofstock == false ? setoutofstock(true): null}
            {quantity > 0 && outofstock == true ? setoutofstock(false): null}
            
            <Row>
                <Col>
                    <ItemDescriptionItemCard item= {item} likeditem = {likeditem}/>
                </Col>
            </Row>
            <Row>
                <Link to={`/shopdetails/${props.match.params.id}`}>{shopname}</Link>
                
            </Row>
            <Row>
                <Col>
                <label><b>Quantity: </b></label>
                <input id="quantity" type="number" value={qty} min="0"
                onChange={(e)=>{
                    setqty(e.target.value);
                    // checkquantity();
                }}
                />
                </Col>
                <Col>
                    {message && <div>Only a maximum of {quantity} is available</div>}
                </Col>
            </Row>  
            <Row>
                <Col>
                    Description: {desc}
                </Col>
            </Row> 
            <Row>
                <Col>
                    Sales Count: {salescount}
                </Col>
            </Row> 

            <Row>
                <Col>
                Price per item: {currency} {price}
                </Col>
            </Row>  
            {outofstock && <div>Item is currently out of stock</div>}
            {!outofstock && <Button className = "w-100 mt-1" type="addtocart" onClick={addtocart}>Add to Cart</Button>}

            
        </div>
    );

}

export default ItemDescription;
