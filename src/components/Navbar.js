import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { googleLogout } from '@react-oauth/google';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { Get } from '../services/ThirdPartyUtilityService';
import constants from '../constants';



const Navbar = function ({email}) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState("");
  const style = `
        .menu-item{
            background-color:#F5efea;
        }
        .menu-cover{
            background-color:#F5efea;
            max-width:100px;
            text-align:left;  
        }
        .main-grid{
          background-color:#F5efea;
          padding: 1.3%;
          font-family: 'Concert One';
          border-radius:12px;
        }
        .left-div{
          font-size:32px;
          color:gray;
          width:84%;
        }
        .right-div{
          text-align:right;
          font-size:20px;
          margin-top:5%;
          margin-right:3%;
          height:100%;  
        }
        .top-buttons{
          margin:0.5%;
        }
        
    `
  useEffect(() => {
      console.log(constants.BASE_API_URL + constants.APIS.CURRENT_BALANCE + `?email=${email}`);
      Get(constants.BASE_API_URL + constants.APIS.CURRENT_BALANCE + `?email=${email}`)
      .then((res) => {
        setBalance(res.data.balance);
      }) 
      .catch((err) => {
        console.log(err);
      })
  })

  const logOut = function(){
      googleLogout();
      localStorage.clear();
      navigate("/login");
  }

  const intitalButtonStyle = { 'backgroundColor': '#F5efea', 'border': '0px' };

  const [styleButton, setStyleButton] = useState(intitalButtonStyle);

  return <>
    <Grid container className='main-grid' variant='circular'>
      <Grid item xs={9}>
        <div className='left-div'>Dashboard</div>
      </Grid>
      <Grid item xs={2} >
        <div className='right-div'>Credits Left: {balance}₹</div>
      </Grid>
      <Grid item xs={1}>
        <button onClick={() => navigate('/profile')} style={styleButton} onMouseOver={() => setStyleButton({ ...styleButton, 'cursor': 'pointer' })}>
          <Tooltip title="Profile" placement="top-end">
            <AccountCircleIcon fontSize='large' className='top-buttons' />
          </Tooltip>
        </button>

        <button onClick={logOut} style={styleButton} onMouseOver={() => setStyleButton({ ...styleButton, 'cursor': 'pointer' })}>
          <Tooltip title="Logout" placement="top-end">
            <LogoutIcon fontSize='large' className='top-buttons' />
          </Tooltip>
        </button>
      </Grid>

    </Grid>
    <style>
      {style}
    </style>
  </>
}

export default Navbar;