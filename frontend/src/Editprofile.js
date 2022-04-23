import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useHistory,Link} from 'react-router-dom';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Navigatorbar from './Navigatorbar';
import { uploadFile } from 'react-s3';
import {countries} from './common/countrieslist';
import url from './config.json';

window.Buffer = window.Buffer || require("buffer").Buffer;

function Editprofile(){

    let history = useHistory();
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token from Edit Profile page is ",token)
    if(!token){
        history.push("/login")
    }

    const config = {
        bucketName: 'upload-s3-bucket-1',
        // albumName: 'photos',
        region: 'us-west-2',
        accessKeyId: 'AKIAXBQK7SIGXJ7MIUUH',
        secretAccessKey: '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',
        // s3url: 'https://reactetsybucket.s3.us-east-2.amazonaws.com/',
        
    }

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

    const [usernameEdit, setUsernameEdit] = useState('')
    const [genderEdit, setGenderEdit] = useState('Rather Not Say')
    const [cityEdit, setCityEdit] = useState('')
    const [birthMonthEdit, setBirthMonthEdit] = useState('')
    const [aboutEdit, setAboutEdit] = useState('')
    const[email,setEmail]= useState('')
    const[phoneEdit,setphoneEdit] = useState()
    const[image,setImage]= useState('https://t4america.org/wp-content/uploads/2016/10/Blank-User.jpg')
    const[country,setCountry] = useState([]);
    const[address,setAddress] = useState()


    useEffect((e) => {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios.get(url.url+'/editprofile')
            .then((response)=>{
                console.log(response.data);
                setImage(response.data.image)
                setUsernameEdit(response.data.username)
                setGenderEdit(response.data.gender)
                setCityEdit(response.data.city)
                setAboutEdit(response.data.about)
                setBirthMonthEdit(response.data.birthmonth)
                setEmail(response.data.email)
                setphoneEdit(response.data.phone)
                setCountry(response.data.country)
                setAddress(response.data.address)

                console.log("Fetch from database in Edit Profile page is ",usernameEdit,genderEdit,cityEdit,birthMonthEdit,aboutEdit)
            })
    }, []);

    const editProfile = (e)=>{
        e.preventDefault();
        axios.defaults.headers.common["x-auth-token"] = token;
        console.log("PHONE IS", phoneEdit, birthMonthEdit)
        axios.post(url.url+'/editprofile', {username: usernameEdit, gender: genderEdit, city: cityEdit, about: aboutEdit, image: image, dob: birthMonthEdit,  email: email, phone: phoneEdit, country: country, address:address})
            .then((response)=>{
                console.log(response.status);
                if(response.status===200){
                    console.log("Inside 200")
                    history.push('/profile')
                }
            }
        )
    }

    return (
        <React.Fragment>
                <div>
                    <div>
                        <Row>
                            <div>

                                <label>Upload Image of the Item</label>
                                <input type="file" onChange = {imageupload} required/>

                            </div>
                        </Row>
                        <Row>
                            <Col>
                            <b>Your Name: </b>{usernameEdit} <Link to="/changeusername">Change or remove</Link>
                            </Col>
                        </Row> 
                    </div>
                    <div>
                        <form>
                            <div>
                                
                                <label><b>Gender:</b></label>
                                
                                <input type="radio" 
                                    checked = {genderEdit==='female'} 
                                    value = {'female'}
                                    onChange={(e)=>{
                                    setGenderEdit(e.target.value);
                                    }}
                                />
                                <label> Female </label>
                                

                                <input type="radio" 
                                    checked = {genderEdit==='male'} 
                                    value = 'male'
                                    onChange={(e)=>{
                                    setGenderEdit(e.target.value);
                                    }}
                                />
                                <label> Male </label>
                                
                                
                                <input type="radio" 
                                    checked = {genderEdit==='rather not say'} 
                                    value = 'rather not say'
                                    onChange={(e)=>{
                                    setGenderEdit(e.target.value);
                                    }}
                                />
                                <label> Rather not say </label>
                                

                                <input type="radio" 
                                    checked = {genderEdit==='custom'} 
                                    value = 'custom'
                                    onChange={(e)=>{
                                    setGenderEdit(e.target.value);
                                    }}
                                />
                                <label> Custom </label>
                                </div>

                                <div>
                                    <label><b>City: </b></label>
                                    <input id="city" type="text" value = {cityEdit}
                                    onChange={(e)=>{
                                        setCityEdit(e.target.value);
                                    }}
                                    />
                                </div>
                                
                                <div>
                                    <label><b>About:</b></label>
                                    <input id="about" type="text" value={aboutEdit}
                                    onChange={(e)=>{
                                        setAboutEdit(e.target.value);
                                    }}
                                    />
                                </div>

                                <div>
                                    <label for="birthday">Date of Birth: </label>
                                    <input type="date" id="birthday" name="birthday" value={birthMonthEdit} onChange = {(e)=>{setBirthMonthEdit(e.target.value)}}/>
                                </div>
                                    
                                <div>
                                    <label for="email">Email:</label>
                                    <input type="email" id="email" name="email" value={email} onChange = {(e)=>{setEmail(e.target.value)}}/>        
                                </div>
                                <div>
                                    <label for="phone">Phone:</label>
                                    <input type="tel" id="phone" name="phone" value={phoneEdit} onChange = {(e)=>{setphoneEdit(e.target.value)}}/>
                                </div>

                                <div>
                
                                    <label><b>Country: </b></label>
                                    <select
                                    value={country}
                                    onChange={(e)=>{setCountry(e.target.value)}}
                                    >
                                    {countries.map((index) => <option>{index}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label><b>Address:</b></label>
                                    <input id="address" type="text" value={address}
                                    onChange={(e)=>{
                                        setAddress(e.target.value);
                                    }}
                                    />
                                </div>

                            <Button className = "w-5 mt-1" type="submit" onClick={editProfile}>Save Changes</Button>

                        </form>
                    </div>

                </div>
                

        </React.Fragment>
    );

}

export default Editprofile;