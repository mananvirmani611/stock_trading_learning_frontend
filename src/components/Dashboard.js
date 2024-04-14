import { useEffect, useState } from "react";
import { Get } from "../services/ThirdPartyUtilityService";
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
    
    function openModal(stockName, stockPrice){
        if(stockPrice > balance){
            toast.error("Insufficient Balance");
            return;
        }
        setModalOpen(true);
        setSelectedStockData({stock : stockName, price: stockPrice})
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
    }, [])
    return <div>{email && balance && <div style={{'padding' : '1% 2%'}}>
        < Navbar email={email}/>
        {stockData &&
            <div style={{ 'padding': '2%', 'backgroundColor' : '#F5efea', 'margin' : '1% 0', 'borderRadius' : '10px'}}>
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
                }} stripe='odd' borderAxis="both" style={{ 'borderRadius': '20px' }}>
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
                <Pagination count={5} />
            </div>
        }

        {modalOpen && <Modal setModalOpen={setModalOpen} stockData={selectedStockData} balance={balance}/>}
    </div>}
    </div>
}

export default Dashboard;