import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';

const PopupContainer = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleTopup = () => {
    // Handle topup logic here
    // You can access the selected amount using the 'amount' state variable
    console.log('Topup amount:', amount);
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Topup
      </Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Token Topup</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount of Tokens"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTopup} color="primary">
            Topup
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PopupContainer;
