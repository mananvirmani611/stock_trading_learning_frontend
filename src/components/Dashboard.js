import { useEffect, useState } from "react";
import { Get, Patch } from "../services/ThirdPartyUtilityService";
import constants from "../constants";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import Pagination from '@mui/material/Pagination';
import Modal from "./Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const columns = [ 
    { field: 'stock', headerName: 'Stock', width: '500' },
    { field: 'price', headerName: 'Price', width: '400' },
    { field: '', headerName: 'Buy', width: '400' },
];

const Dashboard = function(){
    const navigate = useNavigate();
    const [email, setEmail ] = useState(null);
    const [stockData, setStockData] = useState(null);
    const [pageNo, setPageNo] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStockData, setSelectedStockData] = useState({stock : "", price : ""});
    const [balance, setBalance] = useState(null);
    
    const handlePageChange = function(event, value){
        setPageNo(value);
    }
    async function openModal(stockName, stockPrice){
        await Get(constants.BASE_API_URL + constants.APIS.CURRENT_BALANCE + `?email=${email}`)
        .then((res) => {
            if(stockPrice > res.data.balance){
                toast.error("Insufficient Balance", {autoClose : 500});
                return;
            }
            setBalance(res.data.balance);
            setModalOpen(true);
            setSelectedStockData({stock : stockName, price: stockPrice})
        }) 
        .catch((err) => {
            console.log(err);
        })
    }
    const buyStock = async function(stockData, quantity, totalPrice){
        const reqBody = {
          stockName : stockData.stock,
          quantity : quantity,
          purchaseQuantity : quantity,
          stockPurchasePrice : stockData.price,
          totalPurchaseValue : totalPrice,
          email : email,
        }
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('login-token')}`,
            Accept: 'application/json'
        }
        Patch(constants.BASE_API_URL + constants.APIS.BUY_STOCK, reqBody, headers)
        .then((res) => {
          console.log(res);
          toast.success("Purchase Successful", {autoClose : 500});
          setModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
        })
    }

    useEffect(() => { 
        if(!localStorage.getItem('login-token')){
            navigate("/login");
        }
        console.log(`Bearer ${localStorage.getItem('login-token')}`);
        Get(constants.BASE_API_URL + constants.APIS.VERIFY_TOKEN, {
            Authorization: `Bearer ${localStorage.getItem('login-token')}`,
            Accept: 'application/json'
        })
        .then((res) => {
            console.log(res);
            setEmail(res.data.username);
            Get(constants.BASE_API_URL + constants.APIS.CURRENT_BALANCE + `?email=${res.data.username}`)
            .then((res) => {
                console.log("resdataaaaaaaaaaaa ", res.data.balance);
                setBalance(res.data.balance);
            }) 
            .catch((err) => {
                console.log(err);
            })
        })
        .catch((err) => {
            navigate("/login")
        })

        Get(constants.BASE_API_URL + constants.APIS.ALL_STOCKS_DATA + `?page_no=${pageNo}`, {
            Authorization: `Bearer ${localStorage.getItem('login-token')}`,
            Accept: 'application/json'
        })
        .then((res) => {    
            console.log(res.data.data);
            setStockData(res.data.data);
        })
    }, [pageNo])
    return <div>{email && balance && <div style={{'padding' : '1% 2%'}}>
        {email && <Navbar email={email} leftText="Dashboard" rightText={`Credits Left: `} showBalance={true} iconType='Profile'/>}
        {stockData &&
            <div style={{ 'padding': '2%', 'backgroundColor' : '#F5efea', 'margin' : '1% 0', 'borderRadius' : '10px', 'boxShadow' : '3px 3px lightgray'}}>
                <Table sx={{
                    '& tr td:last-child': {
                        textAlign: 'center',
                    },
                    '& tr th:last-child': {
                        textAlign: 'center',
                    },
                    '& th': {
                        backgroundColor: 'lightgray', // Set background color to red for all th elements
                    },
                    '& tr:nth-of-type(even)': {
                        backgroundColor: 'white', // Change the background color for odd rows (stripes)
                    },
                }} stripe='odd' borderAxis="both" borderRadius='1' style={{'boxShadow' : '2px 2px lightgray'}} >
                    <thead>
                        <tr style={{'backgroundColor' : 'lightgray!important'}}>
                            <th style={{ width: '40%' }}>Stock Name</th>
                            <th style={{ width: '40%' }}>Stock Price</th>
                            <th>Buy Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockData.map((row) => (
                            <tr key={row.stock}>
                                <td>{row.stock}</td>
                                <td>{row.price}</td>
                                <td><Button variant="outlined" onClick={() => openModal(row.stock, row.price)}>Buy </Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination count={5} onChange={handlePageChange} style={{'margin' : '1% 0'}} variant="outlined"/>
            </div>
        }

        {modalOpen && <Modal type={"Buy"} setModalOpen={setModalOpen} stockData={selectedStockData} balance={balance} email={email} buyStockFunction={buyStock}/>}
    </div>}
    </div>
}

export default Dashboard;