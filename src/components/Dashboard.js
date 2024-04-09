import { useEffect, useState } from "react";
import { Get } from "../services/ThirdPartyUtilityService";
import constants from "../constants";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
const Dashboard = function(){
    const navigate = useNavigate();
    const [email, setEmail ]= useState(null);
    useEffect(() => { 
        if(!localStorage.getItem('login-token')){
            navigate("/login");
        }
        console.log(`Bearer ${localStorage.getItem('login-token')}`);
        Get(constants.APIS.VERIFY_TOKEN, {
            Authorization: `Bearer ${localStorage.getItem('login-token')}`,
            Accept: 'application/json'
        })
        .then((res) => {
            console.log(res);
            setEmail(res.data.username);
        })
        .catch((err) => {
            navigate("/login")
        })
    })
    return <div>
        < Navbar />
            </div>
}

export default Dashboard;