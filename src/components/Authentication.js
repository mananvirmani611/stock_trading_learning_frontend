import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { get, post } from "../services/ThirdPartyUtilityService";
import constants from '../constants';
function Authentication() {

    const [email, setEmail] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = useGoogleLogin({
        onSuccess : (codeResponse) =>  setUser(codeResponse),
        onError : (error) => console.log(error)
    });

    useEffect(() => {
        if(user){
            const response = get(constants.GOOGLE_USER_INFO_BASE_URL + user.access_token, {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json'
            });

            setEmail(response.data.email);

            post(constants.APIS.AUTHENTICATE, response.data).then((tokenResponse) => {
                setToken(tokenResponse.data.token);
                localStorage.setItem('login-token', tokenResponse.data.token);
            })
            .catch((err) => {
                console.log(err);
            })
            

        }
    }, [user, token])

    return <div>
        <h2>Login using Google</h2>
        {
            email ? 
            <>

            </> : 
            <>
                <button onClick={login}>Login using Google</button>
            </>
        }
    </div>
}

export default Authentication;