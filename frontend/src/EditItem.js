import React, {useEffect, useState, useLayoutEffect} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Modal from 'react-modal';
import "./Styles/Styles.css";
import { uploadFile } from 'react-s3';
import url from './config.json';
window.Buffer = window.Buffer || require("buffer").Buffer;

const config = {
    bucketName: 'etsy-ecommerce',
    // albumName: 'photos',
    region: 'us-west-2',
    accessKeyId: 'AKIA2DYT56ST365MPZ5U',
    secretAccessKey: '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',
    // s3url: 'https://etsy-ecommerce.s3.us-west-2.amazonaws.com/'
}


function EditItem(props){
    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Edit Details page is ",token)
    if(!token){
        history.push("/login")
    }

    const [iname, setIname] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState()
    const [quantityAvailable, setQuantityAvailable] = useState()
    const [priceCurrency, setPriceCurrency] = useState('')
    const[message , setMessage] = useState('')
    const[items,setItems] = useState([]);
    const[image, setImage] = useState('https://upload.wikimedia.org/wikipedia/commons/6/6a/A_blank_flag.png');

    const showedit = props.showedit;
    const itemid = props.itemid;

    useLayoutEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
         axios.post(url.url+'/edititem', {id: props.itemid})
            .then(async response =>{
                console.log("Response in items ",response.data)
                await setItems(response.data)
                console.log("Items are ",items)
                setIname(items.iname);
                setPrice(items.price)
                setQuantityAvailable(items.quantity);
                setPriceCurrency(items.price_currency);
                setImage(items.itemimage);
                setCategory(items.category);
                setDescription(items.description);
            })
    

    }, []);

    const imageupload = (e)=>{
        // console.log("Target image upload file is",e.target.files[0])
        uploadFile(e.target.files[0], config)
            .then((data)=>{
                console.log("Response from react S3 is", data.location);
                setImage(data.location)
            })
            .catch((err)=>{
                console.log("Error from react S3 is ",err);
            })
    }

    const onsave = (e)=>{
        e.preventDefault();
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/updateedititem', {id: props.itemid, iname: iname, quantity: quantityAvailable, price: price, itemimage: image, category:category, description:description})
            .then(async response =>{
                console.log("Response in items ",response.data[0])
                window.location.reload();
            })
            .catch(error => {
                console.log("Error Occurred")
                setMessage('Item name already exists')
                console.log("Error message in edit item name is ",message)
            });
    }


    return(

       

            <Modal isOpen={showedit} style={{marginLeft:"100px"}}>
                <div style={{marginLeft:"650px"}}>
                    {message && <div>{message}</div>}
                    <div style={{marginTop:"100px", marginLeft: "100px"}}>
                        <strong>Edit your Item</strong>
                    </div>
                    <br/>
                    <div>
                        <label><b>Item Name: </b></label>
                        <input id="iname" type="text" value = {iname}
                        onChange={(e)=>{
                            setIname(e.target.value);
                        }}
                    
                        />
                    </div>
                    
                    <br/>

                    <div>
                        <label><b>Description: </b></label>
                        <input id="description" type="text"
                        onChange={(e)=>{
                            setDescription(e.target.value);
                        }}
                        placeholder = {items.description}
                        />
                    </div>

                    <br/>

                    <br/>

                    <div>
                        <label><b>Category: </b></label>
                        <input id="category" type="text"
                        onChange={(e)=>{
                            setCategory(e.target.value);
                        }}
                        />
                    </div>


                    <br/>

                    <div>
                        <label><b>Price: </b></label>
                        <input id="price" type="number" value = {price}
                        onChange={(e)=>{
                            setPrice(e.target.value);
                        }}
                        
                        />
                    </div>

                    <br/>

                    <div>
                        <label><b>Quantity Available: </b></label>
                        <input id="quantityavailable" type="number" value = {quantityAvailable}
                        onChange={(e)=>{
                            setQuantityAvailable(e.target.value);
                        }}
                        
                        />

                    </div>

                    <br/>

                    <div>

                    {/* onClick = {imageupload} */}
                        <div style={{width:"200px", height:"200px"}}>
                            <img src={items.itemimage} id="img" style={{width:"200px", height:"200px"}}/>
                        </div>
                        <div style={{marginTop:"-200px", marginLeft:"175px"}}>
                            <label for="itemimg"><i class="fa fa-camera" aria-hidden="true"></i></label>
                            <input id = "itemimg"type = "file" style={{display:"none", visibility:"none"}} onChange = {imageupload}></input>
                        </div>
                    </div>

                    <div style={{marginTop: "200px"}}>

                    <Button className = "w-5 mt-1" type="submit" onClick={onsave}>Save</Button>

                    </div>
            </div>
            </Modal>
     

    );
}

export default EditItem;