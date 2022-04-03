import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button, Dropdown} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import ItemCard from './ItemCard';
import url from './config.json';
// import S3 from 'react-aws-s3'; 
import { uploadFile } from 'react-s3';
window.Buffer = window.Buffer || require("buffer").Buffer;


const config = {
    bucketName: 'reactetsybucket',
    // albumName: 'photos',
    region: 'us-east-2',
    accessKeyId: 'AKIAXBQK7SIGTUFF2MQ6',
    secretAccessKey: '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',
    // s3url: 'https://etsy-ecommerce.s3.us-west-2.amazonaws.com/'
}

// const ReactS3Client = new S3(config);

function Dashboard(props){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Dashboard page is ",token)
    if(!token){
        history.push("/login")
    }
    const[items,setItems] = useState([]);
    const[likeditems, setLikedItems] = useState([]);
    const[sortflag, setsortflag] = useState(false);
    const[sorted, setSorted] = useState([]);
    const[instockitems,setinStock] = useState(false);
    const[checked,setChecked] = useState(false);
    const[pricerange, setPricerange]= useState(false);
    const[pricerangeitems, setPricerangeitems]= useState([]);

    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.get(url.url+'/listofitems')
            .then(async response =>{
                console.log("Response in items ",response.data)
                console.log("Display filter search is", props.filterSearch);
                await setItems([...response.data])
            })
        // axios.get(url.url+'/likeditems')
        //     .then(async response =>{
        //         console.log("Response from liked items dashboard is ********************",response)
        //         await setLikedItems([...response.data])
        //     })
        
    },[instockitems, sorted, pricerangeitems]);

    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.get(url.url+'/likeditems')
            .then(async response =>{
                console.log("Response from liked items dashboard is ********************",response.data)
                await setLikedItems([...response.data])
            })
    },[]);



    console.log("LIKED ITEMS IS", likeditems)

    let filteredItems = items.filter((item)=>{
            const lowercase = props.filterSearch.toLowerCase();
            console.log('Return statement in filter', item.iname.toLowerCase().includes(lowercase))
            if(!instockitems){
                return (
                    item.iname.toLowerCase().includes(lowercase)
                );
            }
            else{
                return(
                    item.quantity>0
                );
            }
            
    })


    const imageupload = (e)=>{
        // console.log("Target image upload file is",e.target.files[0])
        uploadFile(e.target.files[0], config)
            .then((data)=>{
                console.log("Response from react S3 is", data);
            })
            .catch((err)=>{
                console.log("Error from react S3 is ",err);
            })
    }

    const priceh2l = ()=> {

        console.log("Inside price h2l");
        const filter = filteredItems.sort((a,b)=>{
            if(a.price<b.price){
                return 1;
            }
            else if(a.price>b.price){
                return -1;
            }
            else{
                return 0;
            }
        });
        console.log("Sorted is", sorted,"Filter is",filter);
        setSorted(filter)
        setsortflag(true)
    }

    const pricel2h = ()=> {

        console.log("Inside price l2h");
        const filter = filteredItems.sort((a,b)=>{
            if(a.price>b.price){
                return 1;
            }
            else if(a.price<b.price){
                return -1;
            }
            else{
                return 0;
            }
        });
        console.log("Sorted is", sorted,"Filter is",filter);
        setSorted(filter)
        setsortflag(true)
    }

    const none = ()=> {

        console.log("Inside none");
        
        setSorted([]);
        setsortflag(false);
    }

    const quantityl2h = ()=> {

        console.log("Inside quantity l2h");
        const filter = filteredItems.sort((a,b)=>{
            if(a.quantity>b.quantity){
                return 1;
            }
            else if(a.quantity<b.quantity){
                return -1;
            }
            else{
                return 0;
            }
        });
        console.log("Sorted is", sorted,"Filter is",filter);
        setSorted(filter)
        setsortflag(true)
    }

    const quantityh2l = ()=> {

        console.log("Inside quantity h2l");
        const filter = filteredItems.sort((a,b)=>{
            if(a.quantity<b.quantity){
                return 1;
            }
            else if(a.quantity>b.quantity){
                return -1;
            }
            else{
                return 0;
            }
        });
        console.log("Sorted is", sorted,"Filter is",filter);
        setSorted(filter)
        setsortflag(true)
    }

    const salesl2h = ()=> {

        console.log("Inside sales l2h");
        const filter = filteredItems.sort((a,b)=>{
            if(a.salescount>b.salescount){
                return 1;
            }
            else if(a.salescount<b.salescount){
                return -1;
            }
            else{
                return 0;
            }
        });
        console.log("Sorted is", sorted,"Filter is",filter);
        setSorted(filter)
        setsortflag(true)
    }

    const salesh2l = ()=> {

        console.log("Inside sales h2l");
        const filter = filteredItems.sort((a,b)=>{
            if(a.salescount<b.salescount){
                return 1;
            }
            else if(a.salescount>b.salescount){
                return -1;
            }
            else{
                return 0;
            }
        });
        console.log("Sorted is", sorted,"Filter is",filter);
        setSorted(filter)
        setsortflag(true)
    }

    const instock = (e)=>{

        console.log("INSIDE INSTOCK")
        e.preventDefault();
        console.log(instockitems)
        if(instockitems == true){
            setinStock(false);
        }
        else{
            setinStock(true);
        }
        console.log(instockitems)
        
    }

    const zToh = (e) =>{
        e.preventDefault();
        axios.defaults.headers.common["x-auth-token"] = token;
        setPricerangeitems([])
        axios.post(url.url+'/pricerange', {min:0, max:99})
            .then(async response =>{
                console.log("Response in price range ",response.data)
                setPricerangeitems(response.data)
            })
        setPricerange(true)
    }

    const hToF = (e) =>{
        e.preventDefault();
        setPricerangeitems([])
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/pricerange', {min:100, max:499})
            .then(async response =>{
                console.log("Response in price range ",response.data)
                setPricerangeitems(response.data)
            })
        setPricerange(true)
    }

    const FToT = (e) =>{
        e.preventDefault();
        setPricerangeitems([])
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/pricerange', {min:500, max:999})
            .then(async response =>{
                console.log("Response in price range ",response.data)
                setPricerangeitems(response.data)
            })
        setPricerange(true)
    }

    const Tplus = (e) =>{
        e.preventDefault();
        setPricerangeitems([])
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.post(url.url+'/pricerange', {min:1000, max:1000000000000000})
            .then(async response =>{
                console.log("Response in price range ",response.data)
                setPricerangeitems(response.data)
            })
        setPricerange(true)
    }

    const noneofthem = (e) =>{
        e.preventDefault();
        setPricerange(false)
    }


    return(
        <React.Fragment>
            <div  style = {{marginTop:"90px"}}>
                <div style={{display:"flex"}}>
                    <Row>
                    {/* <i class="fa fa-sort" aria-hidden="true"></i> */}
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Sort <i class="fa fa-sliders" aria-hidden="true"></i> 
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick = {none}>None</Dropdown.Item>
                                <Dropdown.Item onClick = {priceh2l}>Price High to Low</Dropdown.Item>
                                <Dropdown.Item onClick = {pricel2h}>Price Low to High</Dropdown.Item>
                                <Dropdown.Item onClick = {quantityl2h}>Quantity Low to High</Dropdown.Item>
                                <Dropdown.Item onClick = {quantityh2l}>Quantity High to Low</Dropdown.Item>
                                <Dropdown.Item onClick = {salesl2h}>Sales Count Low to High</Dropdown.Item>
                                <Dropdown.Item onClick = {salesh2l}>Sales Count High to Low</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <label for="outofstock">Only instock items</label>
                        <input type="checkbox" id="outofstock" name="outofstock" value="outofstock" checked = {instockitems} onChange={instock} />
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Price Range <i class="fa fa-sliders" aria-hidden="true"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick = {noneofthem}>None</Dropdown.Item>
                                <Dropdown.Item onClick = {zToh}>0-100</Dropdown.Item>
                                <Dropdown.Item onClick = {hToF}>100-500</Dropdown.Item>
                                <Dropdown.Item onClick = {FToT}>500-1000</Dropdown.Item>
                                <Dropdown.Item onClick = {Tplus}>1000+</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>



                    </Row>
                </div>

            <div>
                <Row>
                    {/* {JSON.stringify(filteredItems)} */}
                    {!pricerange && !sortflag && filteredItems.map((item)=>{

                        console.log("PRICE RANGE INSIDE FILTERED IS", pricerange)
                        console.log("ITEM IN DASHBOARD IS", item.id)
                        const likeditem = likeditems.filter(likeitem=>{
                            console.log("ITEM ID INSIDE FILTER IS", parseInt(likeitem.itemid), item.id, item.iname)
                            if(parseInt(likeitem.itemid)===item.id){
                                console.log("Inside equals likeditem");
                                return(
                                    likeitem
                                );
                            }   
                            
                        })
                        console.log("LIKED ITEM IS", likeditem)
                        return (
                            <Col>
                                {/* {JSON.stringify(likeditem)} */}
                                <ItemCard item= {item} likeditem={likeditem}/>
                            </Col>
                        );
                    }
                    )}
                    
                </Row>
                <Row>
                    {/* {JSON.stringify(sorted)} */}
                    {!pricerange && sortflag && sorted.map((item)=>{
                        // console.log("ITEM IN DASHBOARD IS", item.id)
                        console.log("PRICE RANGE INSIDE SORTED IS", pricerange)
                        let likeditem = likeditems.filter(likeitem=>{
                            // console.log("ITEM ID INSIDE FILTER IS", parseInt(likeitem.itemid), item.id)
                            if(parseInt(likeitem.itemid)===item.id){
                                console.log("INSIDE EQUALS");
                                return(
                                    likeitem
                                );
                            }
                            
                        })

                        console.log("LIKED ITEM IN DASHBOARD IS", likeditem)
                        return (
                            <Col>
                                <ItemCard item= {item} likeditem = {likeditem}/>
                                {/* <img src="https://etsy-ecommerce.s3.amazonaws.com/WhatsApp Image 2021-10-18 at 5.28.45 PM.jpeg" width="300px"></img> */}
                            </Col>
                        );
                    }
                    )}
                    
                </Row>

                <Row>
                    {/* {JSON.stringify(pricerangeitems)} */}
                    {!sortflag && pricerange && pricerangeitems.map((item)=>{
                        console.log("ITEM IN DASHBOARD IS", item.id)
                        const likeditem = likeditems.filter(likeitem=>{
                            // console.log("ITEM ID INSIDE FILTER IS", parseInt(likeitem.itemid), item.id)
                            if(parseInt(likeitem.itemid)===item.id){
                                console.log("INSIDE EQUALS");
                                return(
                                    likeitem
                                );
                            }   
                            
                        })
                        console.log("LIKED ITEM IN DASHBOARD IS", likeditem)
                        return (
                            <Col>
                                <ItemCard item= {item} likeditem = {likeditem}/>
                                {/* <img src="https://etsy-ecommerce.s3.amazonaws.com/WhatsApp Image 2021-10-18 at 5.28.45 PM.jpeg" width="300px"></img> */}
                            </Col>
                        );
                    }
                    )}
                </Row>


                

            </div>
        </div>

        </React.Fragment>
        
    );

}

export default Dashboard;