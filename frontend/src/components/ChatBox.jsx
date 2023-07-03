import React, { useEffect, useState } from 'react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, InfoButton } from '@chatscope/chat-ui-kit-react';
import { Button, Select, MenuItem, InputLabel, createTheme, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Chatbox.css';
import Web3 from 'web3'
import useWebSocket from 'react-use-websocket';
import TextField from '@material-ui/core/TextField';
import PopupContainer from './Popupc';
import { tokenabi } from "./tokenabi"
const buttonStyle = {
    backgroundColor: "white",
    color: 'black', // Text color
    borderRadius: "50px",
    width: "30%"
};
const buttonStyle2 = {
    backgroundColor: 'white',
    color: 'black', // Text color
    marginTop: "10px",
    borderRadius: "5px",

};

const buttonStyle3 = {
    backgroundColor: 'white',
    color: 'black', // Text color
    marginTop: "0px",
    borderRadius: "50px",


};


const textStyle = {
    color: "white"
}


const useStyles = makeStyles({
    select: {
        '& .MuiSelect-icon': {
            color: 'black',
            backgroundColor: "white"
        },
    },
});

const Chatt = () => {
    const classes = useStyles();
    const [age, setAge] = useState('');
    const [options, setOptions] = useState(['James', "Dwij Ameer", "Bhanushali"]);
    const [isLoading, setisLoading] = useState(false);
    const [isloggedin, setisloggedin] = useState(false);
    const [isConnected, setIcConnected] = useState("");
    const [address, setAddress] = useState("")
    const [inputValue, setinputValue] = useState("")
    const [selectedplayer, setselectedplayer] = useState("")
    const [messages, setMessages] = useState([]);
    const [playerlist, setplayerlist] = useState([])
    const [addresslist, setaddresslist] = useState([])
    const [balance, setBalance] = useState("");
    const [approved, setApproved] = useState("");
    const [room, setroom] = useState("starter");
    const [istopup, settopup] = useState(false);
    const [playermap, setplayermap] = useState({})
    const serveraddress = "0x2E833968E5bB786Ae419c4d13189fB081Cc43bab"
    const coinaddress = "0x9009DA1361e3C98D6f57d0667Fcf0B098C3Ed9F4"
    let web3;
    let contract;

    const handleChange = (event) => {
        setAge(event.target.value);
        console.log("the key is" + event.target.key)
        console.log(event.target.key)
        setselectedplayer(event.target.key)

    };


    const handleInputVal = (e) => {
        setinputValue(e.target.value)
    }

    const connectWalletHandler = async () => {

        const { ethereum } = window
        if (!ethereum) {
            alert("please install metamask")
        }
        try {

            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            const desiredNetwork = {
                chainId: '0xFA2', // 365 in hexadecimal
                chainName: 'Fantom testnet',
                nativeCurrency: {
                    name: 'FTM',
                    symbol: 'FTM',
                    decimals: 18,
                },
                rpcUrls: ['https://rpc.testnet.fantom.network/'],
                
            };
            const networkId = await ethereum.request({ method: 'net_version' });

            if (networkId === desiredNetwork.chainId) {
                console.log('Connected to the correct network!');
                setAddress(accounts[0])
                setIcConnected(true)

                return accounts[0]
            } else {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [desiredNetwork],
                    });
                    console.log('Network added successfully!');
                    setAddress(accounts[0])
                    setIcConnected(true)

                    return accounts[0]
                } catch (error) {
                    console.error(error);
                }
            }



        } catch (err) {
            console.log(err)
        }
    }

    const init = async () => {
        const { ethereum } = window
        web3 = new Web3(window.ethereum)
        contract = new web3.eth.Contract(tokenabi, coinaddress)

    }

    const Lastfinalize = async (address) => {
        await init()
        setInterval(async () => {

            let tempb = await contract.methods.balanceOf(address).call()
            setBalance(tempb)
            let tempa = await contract.methods.allowance(address, serveraddress).call()
            setApproved(tempa)

        }, 2000);
    }



    const sendMsg = async (message) => {
        let tryMsg = {
            "type": "msg",
            "room": room,
            "address": address,
            "msg": message,
            "nick": inputValue
        }
        await sendMessage(JSON.stringify(tryMsg))
        console.log('Sending message:', message);
    };


    const sendDrop = async (dropid) => {
        console.log(playermap)
        let bs;
        for (let i = 0; i < playerlist.length; i++) {
            console.log(age, playerlist[i].nickname)
            if (playerlist[i].nickname == age) {
                bs = playerlist[i].address
            }
          

        }
        if(!bs){
            console.log("player not found")
            return
        }
        let tryMsg = {
            "type": "special",
            "dropid": dropid,
            "player": selectedplayer,
            "nick": inputValue,
            "address": address,
            "room": room
        }
        let ans = await fetch("https://api.gptwarriors.live/game-server/drop", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                "dropType": dropid,
                "player": bs,
                "pnick": age,
                "requester": address,
                "nick": inputValue,

            })
        })
        if (ans.json()['sucess'] == false) {
            alert("Balance not sufficient")
            return
        }
        console.log('Sending Message: ', tryMsg)
    }

    const { sendMessage, lastMessage } = useWebSocket("wss://api.gptwarriors.live/join", {
        onOpen: () => {


        },
        onMessage: async (data) => {
            console.log(data.data)
            data = await JSON.parse(data.data)
            let newmsg = {
                message: data["msg"],
                sender: data["nick"],
                direction: "incoming"
            }
            console.log(newmsg)
            if (data["type"] == "msg") {
                if (data["address"] == address) {

                    newmsg['direction'] = "outgoing"
                }

                console.log(newmsg)
                setMessages([...messages, newmsg])

            }

            if (data["type"] == "update") {
                console.log(data["players"])
                let playerss = Object.values(data["players"])
                setaddresslist(Object.keys(data["players"]))
                setplayerlist(playerss)




            }
        }
    });

    const handletopup = async () => {
        settopup(true)
        await init()
        let amount = prompt("Enter Amount", "1");
        console.log("the address is " + address)
        let ans = await contract.methods.approve(serveraddress, (parseInt(amount) * 10 ** 18).toString()).send({ from: address })
        settopup(false)
    }

    const connectChat = async () => {

        let addr = await connectWalletHandler()
        if (addr) {
            await Lastfinalize(addr)
            sendMessage(JSON.stringify({
                "type": "join",
                "room": room,
                "nick": inputValue,
                "address": addr
            }))
            setisloggedin(true)
        }



    }

    return (

        < div className="chat-page-container" >


            {isloggedin && (
                <div>
                    <h2 style={{ "color": "white", "textAlign": "center" }}>Live Chat</h2>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", marginTop: "-5%" }}>
                        <h5 style={{ "color": "white", "textAlign": "center" }}>Balance : {parseFloat(balance / 10 ** 18).toFixed(2).toString()}</h5>
                        <h5 style={{ "color": "white", "textAlign": "center" }}>Approved : {parseFloat(approved / 10 ** 18, 3).toFixed(2).toString()}</h5>
                    </div>
                    <MainContainer className="main-container">
                        <ChatContainer className="chat-container">
                            <MessageList className="message-list">
                                {messages.map((message, index) => (
                                    <div>
                                        <Message
                                            key={index}
                                            model={{
                                                message: message.message,
                                                direction: message.direction,
                                                sender: message.sender
                                            }}
                                        >

                                        </Message>
                                        {(message.direction == "outgoing") && (
                                            <h6 style={{ textAlign: "end", marginTop: "5px" }}>{message.sender}</h6>

                                        )}
                                        {(message.direction == "incoming") && (
                                            <h6 style={{ textAlign: "start", marginTop: "5px" }}>{message.sender}</h6>

                                        )}
                                    </div>
                                ))}
                            </MessageList>
                            <MessageInput
                                attachButton={false}
                                placeholder="Type message here"
                                className="message-input"
                                onSend={sendMsg}
                                rightButtons={
                                    <Button variant="contained" color="primary">
                                        Send
                                    </Button>
                                }
                            />
                        </ChatContainer>
                    </MainContainer>
                    <div className='selector' style={{ "backgroundColor": "#23cbb4" }}>
                        <InputLabel id="demo-simple-select-label" style={textStyle}>Player  :</InputLabel>

                        <Select
                            label="Select Player"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}

                            style={textStyle}
                            className={classes.select}

                            onChange={handleChange}
                        >
                            {playerlist.map((option) => (
                                <MenuItem key={option.address} value={option.nickname}>
                                    {option.nickname}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button variant="contained" style={buttonStyle3} onClick={handletopup}>
                            {istopup ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Topup'
                            )}
                        </Button>

                    </div>
                    <div className="button-container">

                        <Button variant="contained" style={buttonStyle} onClick={() => {
                            sendDrop(0)
                        }}>
                            Bomb
                        </Button>
                        <Button variant="contained" style={buttonStyle} onClick={() => {
                            sendDrop(2)
                        }}>
                            Smoke
                        </Button>
                        <Button variant="contained" style={buttonStyle} onClick={() => {
                            sendDrop(1)
                        }}>
                            Health
                        </Button>
                    </div>

                </div>
            )
            }
            {!isloggedin && (
                <div className='buttonlog'>
                    <TextField
                        label="Username"
                        value={inputValue}
                        onChange={handleInputVal}
                    />

                    <Button style={buttonStyle2} onClick={() => {
                        connectChat()
                    }}>

                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Login Now'
                        )}
                    </Button>

                </div>
            )}
        </div >
    )
}

export default Chatt;