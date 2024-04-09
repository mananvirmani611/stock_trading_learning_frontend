import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { googleLogout } from '@react-oauth/google';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';



const Navbar = function () {
  const navigate = useNavigate();
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
        }
        .top-buttons{
          margin:0.5%;
        }
        
    `

  const logOut = function(){
      googleLogout();
      localStorage.clear();
      navigate("/");
  }

  const intitalButtonStyle = { 'backgroundColor': '#F5efea', 'border': '0px' };

  const [styleButton, setStyleButton] = useState(intitalButtonStyle);

  return <>
    <Grid container className='main-grid' variant='circular'>
      <Grid item xs={11}>
        <div className='left-div'>Dashboard</div>
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