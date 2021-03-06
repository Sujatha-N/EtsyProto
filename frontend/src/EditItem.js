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
    bucketName: 'upload-s3-bucket-1',
    // albumName: 'photos',
    region: 'us-west-2',
    accessKeyId: 'AKIAXBQK7SIGXJ7MIUUH',
    secretAccessKey: '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',
    // s3url: 'https://reactetsybucket.s3.us-east-2.amazonaws.com/',
    
}


function EditItem(props){
    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Edit Details page is ",token)
    if(!token){
        history.push("/login")
    }

    const [iname, setIname] = useState(props.item.iname)
    const [category, setCategory] = useState(props.item.category)
    const [description, setDescription] = useState(props.item.description)
    const [price, setPrice] = useState(props.item.price)
    const [quantityAvailable, setQuantityAvailable] = useState(props.item.quantity)
    const [priceCurrency, setPriceCurrency] = useState('')
    const[message , setMessage] = useState('')
    const[items,setItems] = useState([]);
    const[image, setImage] = useState('https://upload.wikimedia.org/wikipedia/commons/6/6a/A_blank_flag.png');
    const[allcategories, setallcategories] = useState([])
    const[catdesc, setCatDesc] = useState('');

    const showedit = props.showedit;
    const itemid = props.itemid;

    useEffect((e) => {
        setCategory(props.item.category)
        axios.get(url.url+'/category')
            .then(async (response)=>{
                console.log("RESPONSE FROM CATEGORIES IS", response);
                if(response){
                    if(response.status===200){
                        await setallcategories(response.data);
                    }
                    else{
                        console.log("Some error occurred")
                    }
                }
            });
    }, []);


    const addcategory = async (e)=>{
        e.preventDefault();
        await setCategory(catdesc)
        console.log("ADDED CATEGORY", catdesc)
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/addcategory', {description:catdesc})
                            .then(async(response)=>{
                                console.log("RESPONSE LIST FROM CATEGORY ISs ",response.data);
                                if(response.data){
                                    console.log("category added")
                                    axios.get(url.url+'/category')
                                        .then(async (response)=>{
                                            console.log("RESPONSE FROM CATEGORIES IS", response);
                                            if(response){
                                                if(response.status===200){
                                                    await setallcategories(response.data);
                                                }
                                                else{
                                                    console.log("Some error occurred")
                                                }
                                            }
                                        });
                                }else{
                                    console.log("some error occurred")
                                }   
                            });

    }

    const imageupload = (e)=>{
        console.log("Target image upload file is",e.target.files[0])
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
        axios.post(url.url+'/updateedititem', {id: props.itemid, iname: props.item.iname, quantity: quantityAvailable, price: price, itemimage: image, category:category, description:description})
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
                        <input id="iname" type="text" value = {props.item.iname}
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
                        value={props.item.description}
                        />
                    </div>
                    <br/>
                    <div style ={{marginTop: "100px"}}> 
                        <label><b>Category </b></label>
                            {/* {JSON.stringify(category)} */}
                            <select
                            value={category}
                            onChange={(e)=>setCatDesc(e.target.value)}
                            >
                            {allcategories.map((item)=><option>{item.description}</option>)}
                            </select>
                            <label><b>Add new Category </b></label>
                            <input id="cat" type="text"
                                onChange={(e)=>{
                                    setCatDesc(e.target.value);
                                }}
                            />
                            <Button className = "w-5 mt-1" type="submit" onClick={addcategory}>Add Category</Button>

                            {/* {JSON.stringify(allcategories.map((item)=>item.description))} */}
                        
                    </div>
                    <br/>
                    <div>
                        <label><b>Price: </b></label>
                        <input id="price" type="number" value = {props.item.price}
                        onChange={(e)=>{
                            setPrice(e.target.value);
                        }}
                        
                        />
                    </div>

                    <br/>

                    <div>
                        <label><b>Quantity Available: </b></label>
                        <input id="quantityavailable" type="number" value = {props.item.quantity}
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