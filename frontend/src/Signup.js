import React, {useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios';
import App from './App';
import {useHistory} from 'react-router-dom';
import url from './config.json';

 function Signup() {
        const [emailReg, setEmailReg] = useState('');
        const [userNameReg, setUserNameReg] = useState('');
        const [passwordReg, setPasswordReg] = useState('');
        let history = useHistory();

        const register = (e) => {
            e.preventDefault();
            axios.post(url.url+'/signup', {username: userNameReg , email:emailReg, password:passwordReg, image:'https://t4america.org/wp-content/uploads/2016/10/Blank-User.jpg'})
                .then((response)=>{
                    console.log("Response from user table is ",response);
                    if(response.status===200){
                        history.push('/login')
                    }
                })
        }
        return (
            <React.Fragment>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Sign Up</h2>
                        <form>
                            <Form.Group id="email" className = "w-100 mb-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" onChange={(e)=>{setEmailReg(e.target.value)}} required />
                            </Form.Group>
                            <Form.Group id="firstName" className = "w-100 mb-2">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" onChange={(e)=>{setUserNameReg(e.target.value)}} required />
                            </Form.Group>
                            <Form.Group id="password" className = "w-100 mb-2">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" onChange={(e)=>{setPasswordReg(e.target.value)}} required />
                            </Form.Group>
                            <Button className = "w-100 mt-1" type="submit" onClick={register}>Sign Up</Button>
                        </form>
                    </Card.Body>
                </Card>

                <div className="w-100 text-center mt-2">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
               
            </React.Fragment>
        );
    }

export default Signup;