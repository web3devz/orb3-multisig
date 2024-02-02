import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import { Box, ThemeProvider } from "@mui/material";
import { Paper, createTheme } from "@material-ui/core";
import { BigNumber } from "ethers";

const useStyles = makeStyles((theme) => ({
  // root: {
  //   "& .MuiTextField-root": {
  //     margin: theme.spacing(1),
  //   },
  // },
  button: {
    margin: theme.spacing(1),
  },
}));

function DeployMulitsig({ createNewMultiSig }) {
  const classes = useStyles();
  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), address: "" },
  ]);

  const [required, setRequired] = useState(0);
  const [timelock, setTimelock] = useState(0);
  const addresses = [];

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let i = 0; i < inputFields.length; i++) {
      const element = inputFields[i].address;
      addresses.push(element);
    }
    createNewMultiSig(
      addresses,
      BigNumber.from(required).toNumber(),
      BigNumber.from(timelock).toNumber()
    );
    console.log(addresses, required, timelock);
    console.log(BigNumber.from(required).toNumber());
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setInputFields(newInputFields);
  };

  const onChange = (e) => {
    setRequired(e.target.value);
  };

  const onTimelockChange = (e) => {
    setTimelock(e.target.value);
  };

  const handleAddFields = () => {
    setInputFields([...inputFields, { id: uuidv4(), address: "" }]);
  };

  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  return (
    <Container>
      <h1>Create New MultiSig Wallet</h1>
      <Box width={500}>
        <form className={classes.root}>
          {inputFields.map((inputField) => (
            <div key={inputField.id}>
              <Box sx={{ width: "auto", display: "flex", m: 1, mb: 2 }}>
                <TextField
                  name="address"
                  label="Address"
                  variant="outlined"
                  value={inputField.address}
                  onChange={(event) => handleChangeInput(inputField.id, event)}
                  fullWidth
                />
                <IconButton
                  disabled={inputFields.length === 1}
                  onClick={() => handleRemoveFields(inputField.id)}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton onClick={handleAddFields}>
                  <AddIcon />
                </IconButton>
              </Box>
            </div>
          ))}
          <Box sx={{ width: 500, m: 1, mb: 2 }}>
            <TextField
              name="required"
              label="Minimum Number of Confirmations Required"
              variant="outlined"
              type="number"
              value={required}
              onChange={onChange}
              fullWidth
            />
          </Box>

          <Box sx={{ width: 500, m: 1, mb: 2 }}>
            <TextField
              name="timelock"
              label="Timelock (in seconds)"
              variant="outlined"
              type="number"
              value={timelock}
              onChange={onTimelockChange}
              fullWidth
            />
          </Box>
          <Box sx={{ width: 500, m: 1, mb: 2 }}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
              size="medium"
              fullWidth
            >
              Deploy MultiSig Wallet
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default DeployMulitsig;
