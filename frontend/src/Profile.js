import {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import "./Styles/Styles.css";
import Favourites from './Favourites';
import { uploadFile } from 'react-s3';
import React from 'react';
import url from './config.json';
window.Buffer = window.Buffer || require("buffer").Buffer;


const config = {
    bucketName: 'reactetsybucket',
    // albumName: 'photos',
    region: 'us-east-2',
    accessKeyId: 'AKIAXBQK7SIGTUFF2MQ6',
    secretAccessKey: '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',
    // s3url: 'https://etsy-ecommerce.s3.us-west-2.amazonaws.com/'
}

function Profile(){
    const token = JSON.parse(localStorage.getItem('token'));
    let history = useHistory();
    console.log("Token from Profile page is ",token)
    if(!token){
        history.push("/login")
    }


    const [emailPro, setEmailPro] = useState('')
    const [userNamePro, setUserNamePro] = useState('')
    const [genderPro, setGenderPro] = useState('Rather Not Say')
    const [cityPro, setCityPro] = useState('')
    const [birthMonthPro, setBirthMonthPro] = useState('')
    const [aboutPro, setAboutPro] = useState('')
    const[profileimg, setprofileimg] = useState('https://t4america.org/wp-content/uploads/2016/10/Blank-User.jpg');


    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.get(url.url+'/editprofile')
            .then((response)=>{
                console.log(response.data);
                setEmailPro(response.data.email)
                setUserNamePro(response.data.username)
                setGenderPro(response.data.gender)
                setCityPro(response.data.city)
                setAboutPro(response.data.about)
                setprofileimg(response.data.image)
                console.log("FETCH FROM DATABASE IN PROFILE PAGE is ", emailPro,userNamePro,genderPro,cityPro,aboutPro,profileimg)
            })
    });

    const imageupload = (e)=>{
        // console.log("Target image upload file is",e.target.files[0])
        uploadFile(e.target.files[0], config)
            .then((data)=>{
                console.log("Response from react S3 is", data.location);
                axios.defaults.headers.common["x-auth-token"] = token;
                axios.post(url.url+'/profilepic', {image: data.location})
                    .then((response)=>{
                        console.log(response.data);
                    })
                setprofileimg(data.location)
                })
                
            .catch((err)=>{
                console.log("Error from react S3 is ",err);
            })
    }

    const propic = (e)=>{
        e.preventDefault();
        
    }

    return (
        <React.Fragment>
            <div style={{display: "flex", marginTop: "100px"}}>
                {/* <Row>
                    <Col> */}
                        <div style={{width:"180px", height:"180px"}}>
                            <img src={profileimg} alt="" id="img" className = "profilepic"/>
                        </div>
                        <div style={{marginTop: "190px", marginLeft: "-7.5%", marginTop:"180px"}}>
                            <label for="profimg"><i class="fa fa-camera" aria-hidden="true"></i></label>
                            <input id = "profimg"type = "file" style={{display:"none", visibility:"none"}} onClick = {imageupload}></input>
                        </div>
                    {/* </Col> */}
                    {/* <Col style={{marginLeft: "100px"}}> */}
                    <div style = {{marginTop:"100p", marginLeft: "50px"}}>
                        {userNamePro}  <i class="fa fa-pencil-square-o" aria-hidden="true" onClick={()=>{history.push("/editprofile")}}></i>
                    </div>
                    {/* </Col>
                </Row> */}
            </div>

            <div style={{display:"flex"}}>

                <div>
                    <Favourites/>
                </div>

            </div>

                {/* <Row>
                    <Col>
                        User Name: {userNamePro}  <i class="fa fa-pencil-square-o" aria-hidden="true" onClick={()=>{history.push("/editprofile")}}></i>
                    </Col>
                </Row>
                
                <Row>
                    <Col>
                    Email: {emailPro}
                    </Col>
                </Row>   
                <Row>
                    <Col>
                    Gender: {genderPro}
                    </Col>
                </Row>
                <Row>
                    <Col>
                    City: {cityPro} 
                    </Col>
                </Row> 
                <Row>
                    <Col>
                    About: {aboutPro}
                    </Col>
                </Row>                        */}

            {/* <h2 styles={{marginTop:"200px"}}>Favourite Items </h2> */}

        </React.Fragment>
    );
}

export default Profile