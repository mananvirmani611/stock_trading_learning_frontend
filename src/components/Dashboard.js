import { useEffect, useState } from "react";
import { Get } from "../services/ThirdPartyUtilityService";
import constants from "../constants";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { DataGrid } from '@mui/x-data-grid';

const columns = [ 
    { field: 'stock', headerName: 'Stock', width: 330 },
    { field: 'price', headerName: 'Price', width: 700 },
    { field: '', headerName: 'Buy', width: 130 },
];
  
const Dashboard = function(){
    const navigate = useNavigate();
    const [email, setEmail ]= useState(null);
    const [stockData, setStockData] = useState(null);
    const [pageNo, setPageNo] = useState(1);
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

        console.log(constants.APIS.ALL_STOCKS_DATA + `?page_no=${pageNo}`);
        Get(constants.APIS.ALL_STOCKS_DATA + `?page_no=${pageNo}`, {
            Authorization: `Bearer ${localStorage.getItem('login-token')}`,
            Accept: 'application/json'
        })
        .then((res) => {    
            console.log(res.data.data);
            setStockData(res.data.data);
        })
    }, [])
    return <div style={{'padding' : '1% 2%'}}>
        < Navbar />
        {stockData != null && <DataGrid
            getRowId={(row) => row.stock}
            rows={stockData}
            columns={columns}
        />}
            </div>
}

export default Dashboard;