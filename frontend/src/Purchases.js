import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button, Dropdown} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import Orders from './Orders';
import ReactPaginate from "react-paginate";
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
    const[change, setChange] = useState(false)
    const[pageSize, setPageSize] = useState(5)
    const[pageNumber, setPageNumber] = useState(0);
    const ordersPerPage = pageSize;
    const pagesVisited = parseInt(pageNumber) * parseInt(ordersPerPage);
    const pageCount = Math.ceil(orders.length / ordersPerPage)

    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.get(url.url+'/purchase')
            .then((response)=>{
                console.log("RESPONSE FROM PURCHASES IS:",response.data);
                setOrders(response.data);
            })
    }, [change, pageNumber]);

    const displayOrders = orders.slice(pagesVisited, pagesVisited+ordersPerPage).map((item)=>{
        
        return(
            <Row>
                {/* {JSON.stringify(orders)}
                {JSON.stringify(pagesVisited)}
                {JSON.stringify(pagesVisited+ordersPerPage)} */}
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

    const changePage = async (selected) => {
        console.log("SSSSS", selected.selected, pageNumber, pagesVisited, ordersPerPage)
        setChange(true)
        await setPageNumber(selected.selected)
        console.log("PAGE NUMBER IS", pageNumber)
    };


    return(
        <div>
            {orders.length!==0 ? (
                // <div>
                //     {orders.map((item)=>{
                //         return(
                //             <Row>
                //                 <Col>
                //                     <Link to={`/orders/${item.purchaseid}`}>Order ID: {item.purchaseid}</Link>
                //                 </Col>
                //                 <Col styles={{width:"200px"}}>
                //                     Total items ordered : {item.itemstotal}
                //                 </Col>
                //                 <Col style={{width:"1000px"}}>
                //                     Date Of Purchase : {item.purchasedate}
                //                 </Col>
            
                //             </Row>
                            
                //             );
                            
                //         }) 
                //     }
                // </div>
                <div>
                    {displayOrders} 
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                    />

                    {/* <Dropdown>      
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Page Size 
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item>2</Dropdown.Item>
                            <Dropdown.Item>5</Dropdown.Item>
                            <Dropdown.Item>10</Dropdown.Item>
                            {/* <Dropdown.Item onClick = {priceh2l}>Price High to Low</Dropdown.Item>
                            <Dropdown.Item onClick = {pricel2h}>Price Low to High</Dropdown.Item>
                            <Dropdown.Item onClick = {quantityl2h}>Quantity Low to High</Dropdown.Item>
                            <Dropdown.Item onClick = {quantityh2l}>Quantity High to Low</Dropdown.Item>
                            <Dropdown.Item onClick = {salesl2h}>Sales Count Low to High</Dropdown.Item>
                            <Dropdown.Item onClick = {salesh2l}>Sales Count High to Low</Dropdown.Item> */}
                        {/* </Dropdown.Menu>
                    </Dropdown> */}

                        <label for="cars">Select a page Size:</label>

                        <select name="pagesize" id="size" onChange={async (e)=>await setPageSize(e.target.value)}>
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        
                        </select>



                    
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