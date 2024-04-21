import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Card from "./Card";
import { Grid } from "@mui/material";
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import { useNavigate } from "react-router-dom";
import { Get } from "../services/ThirdPartyUtilityService";
import constants from "../constants";
import Modal from "./Modal";

const style = `
    .display-card{
        padding:3%;
    }
`

const headingsForCard = [
    'Total Credits Left:',
    'Total Invested Amt:',
    'Current Value:' 
]
const colors = [
    '#e5d9cf',
    '#e5d9cf',
    '#e5d9cf'
]
const Profile = function () {
    const navigate = useNavigate();
    const [tabledata, setTableData] = useState(null);
    const [email, setEmail] = useState(null);
    const [values, setValues] = useState([Number(0), Number(0), Number(0)]);
    const [stockPricesMap, setStockPricesMap] = useState(new Map([]));
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStockData, setSelectedStockData] = useState(null);
    const [maxAllowedQuantity, setMaximumAllowedQuantity] = useState(null);

    const sellStock = async function(){

    }

    const openModal = function(stockName, stockPrice, qty){
        setSelectedStockData({stock : stockName, price : stockPrice})
        setMaximumAllowedQuantity(qty)
        setModalOpen(true);
    }
    async function useEffectF(){
        if(!localStorage.getItem('login-token')){
            navigate("/login");
        }
        console.log(`Bearer ${localStorage.getItem('login-token')}`);
        const response1 = await Get(constants.BASE_API_URL + constants.APIS.VERIFY_TOKEN, {
            Authorization: `Bearer ${localStorage.getItem('login-token')}`,
            Accept: 'application/json'
        })
        setEmail(response1.data.username);

        const response2 = await Get(constants.BASE_API_URL + constants.APIS.USER_DATA + `?email=${response1.data.username}`, {
            Authorization: `Bearer ${localStorage.getItem('login-token')}`,
            Accept: 'application/json'
        })
        setTableData(response2.data);

        let stockPricesMaptemp = new Map([]);
        for(let i = 0; i<response2.data.length; i++){
            const stockName = response2.data[i].stockName;
            if(stockPricesMaptemp.has(stockName))continue;
            const stockPriceData = await Get(constants.BASE_API_URL + constants.APIS.ALL_STOCKS_DATA + `?stock_name=${stockName}`)
            stockPricesMaptemp.set(stockName, stockPriceData.data.data.price);
        }
        setStockPricesMap(stockPricesMaptemp);

        const userStockData = response2.data;
        const balanceResponse = await Get(constants.BASE_API_URL + constants.APIS.CURRENT_BALANCE + `?email=${response1.data.username}`)
        values[0] = balanceResponse.data.balance;
        userStockData.forEach((item) => {
            values[1] += Number(item.quantity * item.stockPrice);
            values[2] += Number(item.quantity * stockPricesMaptemp.get(item.stockName));
        })
        setValues(values);
    }


    useEffect(() => {
        //if(email is already coming)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffectF();
    }, [] )
  return (
    <div style={{ padding: "1% 2%" }}>
      <Navbar leftText={"Personal Dashboard"} showBalance={false} iconType='Home'/>
      <div style={{ padding: "2%", backgroundColor: "#F5efea", margin: "1% 0", borderRadius: "10px", boxShadow: "3px 3px lightgray", }}>
        <Grid container className="main-grid" variant="circular">
            {values && headingsForCard.map((item, index) => {
                return <Grid item xs={4}>
                <div className="display-card">
                    <Card bgcolor={colors[index]} heading={item} value={values[index].toFixed(2) + `₹`}/>
                </div>
              </Grid>
            })}
        </Grid>

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
                            <th style={{ width: '20%' }}>Stock Name</th>
                            <th>Purchase Price</th>
                            <th>Current Price</th>
                            <th>Stocks Available</th>
                            <th>Total Invested Value</th>
                            <th>Total Current Value</th>    
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tabledata &&
                        tabledata.map((item) => {
                            return <tr>
                                <td>{item.stockName}</td>
                                <td>{item.stockPrice}</td>
                                <td>{stockPricesMap.get(item.stockName)}</td>
                                <td>{item.quantity}</td>
                                <td>{item.totalValue}</td>
                                <td>{stockPricesMap.get(item.stockName) * item.quantity}</td>
                                <td><Button onClick={() => openModal(item.stockName, item.stockPrice, item.quantity)} variant="outlined">Sell</Button></td>
                            </tr>
                        })
                    }  
                    </tbody>
                </Table>
      </div>
      {modalOpen && <Modal setModalOpen={setModalOpen} stockData={selectedStockData} balance={values[0]} email={email} buyStockFunction={sellStock} maxAllowedQuantity={maxAllowedQuantity}/>}
      <style>{style}</style>
    </div>
  );
};

export default Profile;