import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import Modal from 'react-modal';
import EditItem from './EditItem';
import ShopItemCard from './ShopItemCard';
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

function ShopDetails(props){
    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Shop details page is ",token)
    if(!token){
        history.push("/login")
    }

    console.log("PROPS MATCH ID IS",props.match.params.id)


    const[useremail,setUseremail] = useState('')
    const[totalsalescount, settotalsalescount]= useState()
    const [shopName, setShopname] = useState('')
    const [shopOwner, setShopOwner] = useState('')
    const[shopemail, setShopemail] = useState('')
    const[isOwner, setisOwner] = useState(false)
    const [show, setShow] = useState(false)
    const [iname, setIname] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [quantityAvailable, setQuantityAvailable] = useState(0)
    const[message , setMessage] = useState('')
    const[items,setItems] = useState([]);
    const[image, setImage] = useState('https://upload.wikimedia.org/wikipedia/commons/6/6a/A_blank_flag.png');
    const[shopimage, setshopimage] = useState()
    const[shpimg, setshpimg] = useState('')

    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/shopdetails', {id: props.match.params.id})
            .then(async(response)=>{
                console.log("RESPONSE LIST OF SHOP ITEMS IS ",response.data.result[0].email, response.data.email);
                await setItems(response.data.result);
                await setShopname(response.data.result[0].shopname)
                await setShopOwner(response.data.result[0].owner)
                await setShopemail(response.data.result[0].email)
                await setUseremail(response.data.email)
                await settotalsalescount(response.data.salescount)
                await setshpimg(response.data.shopimage[0].shopimage)

                if(response.data.result[0].email == response.data.email){
                    console.log("SETTING IS OWNER TRUe");
                    setisOwner(true)
                }
                else{
                    console.log("SETTING IS OWNER FALSE");
                    setisOwner(false)
                }
            });

            console.log("SHOP EMAIL IS", shopemail, useremail)

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

    const uploadshopimage = (e)=>{
        // console.log("Target image upload file is",e.target.files[0])
        uploadFile(e.target.files[0], config)
            .then((data)=>{
                console.log("Response from react S3 is", data.location);
                setshopimage(data.location)
            })
            .catch((err)=>{
                console.log("Error from react S3 is ",err);
            })
    }

    const saveimage = (e)=>{
        e.preventDefault();
        console.log("INSIDE SAVE IMAGE")
        axios.defaults.headers.common["x-auth-token"] = token;
            axios.post(url.url+'/updateshopimage', {shopimage:shopimage})
            .then(async(response)=>{
                console.log("RESPONSE FROM SAVE IMAGE IS",response);
            history.push("/shopdetails/0")
        });
    }

    const onsave = (e)=>{
        e.preventDefault();
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/additem',{itemname: iname, quantity: quantityAvailable, price: price, price_currency: '$', owner: shopOwner, itemimage: image, description: description, category: category})
            .then((response)=>{
                console.log("RESPONSE FROM ON SAVE IS", response);
                if(response.status===200){
                    setMessage('');
                    setShow(false);
                    window.location.reload();
                } 
            })
            .catch(error => {
                console.log("Error Occurred")
                setMessage('Item name already exists')
                console.log("Error message in add item name is ",message)
            });
    }



    return(
        <div style={{marginTop:"150px"}}>
            {shopemail === useremail && isOwner == false ? setisOwner(true): null}
            <div>
                {isOwner && 
                    <Button style={{marginLeft:"1000px"}} className = "w-5 mt-1" type="submit" onClick = {()=>setShow(true)}>Add an Item</Button>
                }
                <br/>
                <b>Shop Owner:</b> {shopOwner}
                <br/>
                <b>Total Sales Count is </b> {totalsalescount}
                <br/>
                <b>List of items:</b> 
                <Row>
                    
                    {items.map((item)=>{
                        return (
                        <Col>
                            <ShopItemCard item = {item} msg={isOwner}/>
                        </Col>
                        );
                    })}
                </Row>
            </div>
            <div>

            {isOwner && 
                <div style={{display: "flex"}}>
                    <div>
                       
                        <img style={{width: "200px"}} src={shpimg}/>
                       
                    
                    <input type="file" onChange = {uploadshopimage} required/>
                    </div>
                    <Button style={{marginLeft:"-100px"}} className = "w-5 mt-1" type="submit" onClick = {saveimage}>Upload</Button>
                </div>
            }


                <Modal isOpen={show}>
                    {message && <div>{message}</div>}
                    <div>
                        Add an Item
                    </div>
                    <br/>
                    <div>
                        <label><b>Item Name: </b></label>
                        <input id="iname" type="text"
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
                        />
                    </div>


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
                        <input id="price" type="number"
                        onChange={(e)=>{
                            setPrice(e.target.value);
                        }}
                        />
                    </div>

                    <br/>

                    <div>
                        <label><b>Quantity Available: </b></label>
                        <input id="quantityavailable" type="number"
                        onChange={(e)=>{
                            setQuantityAvailable(e.target.value);
                        }}
                        />

                    </div>

                    <br/>

                    <div>
                    
                        <div>
                            <label>Upload Image of the Item</label>
                            <input type="file" onChange = {imageupload} required/>
                        </div>

                    </div>

                    <Button className = "w-5 mt-1" type="submit" onClick={onsave}>Save</Button>

                </Modal>

            </div>

        </div>
    );
}

export default ShopDetails;