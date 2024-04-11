import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const style = `.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black overlay */
    z-index: 1000; /* Ensure the modal is above everything else */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    width:400px;
    height:300px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add a box shadow for a raised effect */
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .modal-content {
    margin-bottom: 20px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .close-button {
    background: none;
    border: none;
    cursor: pointer;
  }`;
const Modal = function ({ setModalOpen, stockData }) {
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = function(value, type){
    if(type === "de" && value === 0)return;
    setQuantity(value);
  }

  if (!isOpen) return null;

  return <>
    {isOpen && <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{stockData.stock}</h2>
          <button className="close-button" onClick={() => {
            setIsOpen(false)
            setModalOpen(false);
          }}><CloseIcon /></button>
        </div>
        <div className="modal-content">
          <p>{stockData.price}</p>
          <div>
          <button onClick={() => handleQuantityChange(quantity-1, "de")}> <RemoveIcon /></button>
              {quantity}
            <button onClick={() => handleQuantityChange(quantity+1, "in")}> <AddIcon /></button>
          </div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button onClick={() => console.log('Submit clicked')}>Submit</button>
        </div>
      </div>
    </div>}
    <style>{style}</style>
  </>
}

export default Modal;