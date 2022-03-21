import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom';

function Login() {
    localStorage.setItem('token', JSON.stringify(''));
    const [emailReg, setEmailReg] = useState('')
    const [passwordReg, setPasswordReg] = useState('')
    const [message, setMessage] = useState('');
    
    const login = (e)=>{
        e.preventDefault();
        axios.post('http://localhost:4000/login', {email: emailReg, password: passwordReg})
            .then((response)=>{
                console.log(response.data.accessToken);
                localStorage.setItem('token', JSON.stringify(response.data.accessToken));
                if(response.data.accessToken){
                    history.push("/dashboard")
                }
                else{
                    history.push("/login")
                }
            })
            .catch(error => {
                console.log("Invalid Creds")
                setMessage('Invalid Credentials');
                console.log("Error message in login is ",message)
            });
    }
    let history = useHistory();

    return (
        <>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Sign In</h2>
                <form>
                    {message && <div>{message}</div>}
                    <Form.Group id="email" className = "w-100 mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" onChange={(e)=>{
                            setEmailReg(e.target.value);
                        }} required />
                    </Form.Group>
                    <Form.Group id="password" className = "w-100 mb-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onChange={(e)=>{
                            setPasswordReg(e.target.value);
                        }} required />
                    </Form.Group>
                    <Button className = "w-100 mt-1" type="submit" onClick={login}>Sign In</Button>
                </form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
        </div>
    </>
    );
  }

export default Login