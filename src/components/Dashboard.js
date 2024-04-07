import { useEffect, useState } from "react";
import { Get } from "../services/ThirdPartyUtilityService";
import constants from "../constants";
const Dashboard = function(){
    const [email, setEmail ]= useState(null);
    useEffect(() => { 
        console.log(`Bearer ${localStorage.getItem('login-token')}`);
        Get(constants.APIS.VERIFY_TOKEN, {
            Authorization: `Bearer ${localStorage.getItem('login-token')}`,
            Accept: 'application/json'
        })
        .then((res) => {
            console.log(res);
            setEmail(res.data.username);
        })
    })
    return <>
        {email && <>{email}</>}
        Dashboard route
    </>
}

export default Dashboard;