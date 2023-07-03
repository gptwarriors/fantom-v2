import React, { useState } from 'react';
import { Button } from '@mui/material';
import Mainimage from './main.jpg'
import { tokenabi } from "./tokenabi"
import Web3 from 'web3'
import { Link } from 'react-router-dom'
import { CircularProgress } from "@mui/material";

const MyPage = () => {
    const coinaddress = "0xb1E60480679488C2F4Cdd4386a1b32CF3022fC4a"
    const [isloading, setisloading] = useState(false)
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
                return accounts[0]
            } else {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [desiredNetwork],
                    });
                    console.log('Network added successfully!');
                    return accounts[0]
                } catch (error) {
                    console.error(error);
                }
            }



        } catch (err) {
            console.log(err)
        }
    }



    const onFaucet = async () => {
        const { ethereum } = window
        setisloading(true)
        if (window.ethereum) {
            try {
                let web3 = new Web3(window.ethereum)
                let contract = new web3.eth.Contract(tokenabi, coinaddress)
                let addr = await connectWalletHandler()
                let ans = await contract.methods.faucet().send({ from: addr });
                setisloading(false)
            }
            catch (e) {
                console.log(e);
                setisloading(false)

            }

        }


    }
    const buttonStyle2 = {
        backgroundColor: 'white',
        color: 'black', // Text color
        margin: "20px",
        borderRadius: "5px",
        fontWeight: "bold",
        fontSize: "20px"

    };
    return (
        <div
            style={{
                backgroundImage: 'url(./main.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}


        >


            <div style={{ textAlign: 'center', marginRight: "11%" }}>
                <Link to='https://game.gptwarriors.live/'>
                    <Button variant="contained" color="primary" style={buttonStyle2}>
                        Play Now
                    </Button>
                </Link>

                <Button variant="contained" color="primary" style={buttonStyle2} onClick={onFaucet}>
                    {!isloading && (
                        <p>Faucet</p>
                    )
                    }
                    {
                        isloading && (
                            <CircularProgress></CircularProgress>
                        )
                    }
                </Button>
                <Link to='/dashboard'>
                    <Button variant="contained" color="primary" style={buttonStyle2}>
                        NFT Marketplace
                    </Button>
                </Link>
                <Link to="/">
                    <Button variant="contained" color="primary" style={buttonStyle2}>
                        Live Stream
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default MyPage;
