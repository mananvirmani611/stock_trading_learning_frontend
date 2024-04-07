import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { Get, Post } from "../services/ThirdPartyUtilityService";
import constants from '../constants';
import { useNavigate } from 'react-router-dom';
function Authentication() {
    const navigate = useNavigate();

    const [email, setEmail] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = useGoogleLogin({
        onSuccess : (codeResponse) =>  setUser(codeResponse),
        onError : (error) => console.log(error)
    });

    useEffect(() => {
        if(localStorage.getItem('login-token')){
            const currToken = localStorage.getItem('login-token');
            setToken(currToken);
            Get(constants.APIS.VERIFY_TOKEN, {
                Authorization: `Bearer ${currToken}`,
                Accept: 'application/json'
            })
            .then((res) => {
                console.log(res);
                setEmail(res.data.username);
                navigate('/dashboard');
            })
            .catch((err) => {
                alert("error");
            })
        }
        else if(user){
            Get(constants.GOOGLE_USER_INFO_BASE_URL + user.access_token, {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json'
            })
            .then((res) => {
                setEmail(res.data.email);
                Post(constants.APIS.AUTHENTICATE, res.data).then((tokenResponse) => {
                    setToken(tokenResponse.data.token);
                    localStorage.setItem('login-token', tokenResponse.data.token);
                    navigate('/dashboard');
                })
                .catch((err) => {
                    console.log(err);
                })
            })
        }
    }, [user, token])

    return <div>
        <h2>Login using Google</h2>
        {
            email ? 
            <>
                EMAIL IS : {email}
            </> : 
            <>
                <button onClick={login}>Login using Google</button>
            </>
        }
    </div>
}

export default Authentication;