import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Tabs from '@mui/base/Tabs';
import TabsList from '@mui/base/TabsList';
import TabPanel from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import Tab, { tabClasses } from '@mui/base/Tab';
import { Link } from 'react-router-dom';
import IndividualWarrior from './IndividualWarrior';
import { abi } from './abi'
import Web3 from 'web3'
import Loader from './Loader';

const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};

const StyledTab = styled(Tab)`
    font-family: IBM Plex Sans, sans-serif;
    color: #fff;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: transparent;
    width: 100%;
    padding: 10px 12px;
    margin: 6px 6px;
    border: none;
    border-radius: 30px;
    display: flex;
    justify-content: center;
  
    &:hover {
      background-color: #fff;
      color:#00A9B1;
    }
  
    &:focus {
      color: #00A9B1;
      outline: 3px solid #;
    }
  
    &.${tabClasses.selected} {
      background-color: #fff;
      color:#00A9B1;
    }
  
    &.${buttonClasses.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

const StyledTabPanel = styled(TabPanel)(
    ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    // padding: 25px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    // border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    // border-radius: 12px;
    `,
);

const StyledTabsList = styled(TabsList)(
    ({ theme }) => `
    min-width: 400px;
    background-color: #0C0F1A ;
    border-radius: 12px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    box-shadow: 0px 1px 12px ${theme.palette.mode === 'dark' ? grey[100] : grey[200]};
    `,
);

const BoxWrapper = styled(Box)({
    backgroundImage: 'linear-gradient(360deg, #000000 76%, rgba(217, 217, 217, 0) 122%)',

    height: '100vh',
    '.parent-header': {
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    '.mint-btn': {
        background: '#fff',
        color: '#00A9B1',
        fontSize: '20px', fontWeight: 700,
        textTransform: 'none',
        borderRadius: '30px',
        margin: "10px"
    },
    '.mint-btn:hover': {
        background: '#fff',
    },
    '.parent-tabs': {
        width: '400px',
        margin: '0px 30px'
    }
})

const Dashboard = () => {
    let web3;
    let contract;
    const [address, setAddress] = useState(null)
    const [connected, isConnected] = useState(null)
    const [isLoading, setisLoading] = useState(true);
    const [nfts, setnfts] = useState([])
    const [userData, setUserData] = useState([])
    useEffect(() => {
        async function setData() {

        }
    }, [])

    const connectWalletHandler = async () => {
        console.log("shfdlsdjf")
        const { ethereum } = window

        if (!ethereum) {
            alert("Please install Metamask")
        }
        try {
            web3 = new Web3(ethereum)

            contract = new web3.eth.Contract(abi, "0x2fDd2404E077F856E6d257D71283b20580009406")

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
                await setAddress(accounts[0])
                isConnected(true)
                return accounts[0]
            } else {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [desiredNetwork],
                    });
                    await setAddress(accounts[0])
                    isConnected(true)
                    return accounts[0]
                } catch (error) {
                    console.error(error);
                }
            }




        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (window.ethereum) {
            web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.testnet.fantom.network/"))

            contract = new web3.eth.Contract(abi, "0x2fDd2404E077F856E6d257D71283b20580009406")
            getData()
        }
        else {
            web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.testnet.fantom.network/"))

            contract = new web3.eth.Contract(abi, "0x2fDd2404E077F856E6d257D71283b20580009406")
            getData()
        }
    }, [])

    const getData = async function () {

        let num = await contract.methods.totalSupply().call()
        console.log(num)
        let nfts = []
        for (let i = 1; i <= num; i++) {
            let stats = await contract.methods.getStats(i).call();
            console.log(stats)
            let uri = await contract.methods.getUrl(i).call();
            uri = "https://" + uri + ".ipfs.dweb.link/videoId.json"
            try {
                let res = await fetch(uri);
                let ans = await res.json()
                let jawab = {
                    stat: stats,
                    url: ans.skybox,
                    id: i
                }
                nfts.push(jawab)
            } catch (err) {
                console.log(err)
            }

        }
        setisLoading(false)
        setnfts(nfts);
        console.log(nfts);
    }

    const getMyNfts = async () => {
        setisLoading(true)
        web3 = new Web3(window.ethereum)

        contract = new web3.eth.Contract(abi, "0x2fDd2404E077F856E6d257D71283b20580009406")


        console.log("here")
        let addr = await connectWalletHandler()
        if (!addr) {
            setisLoading(false)
            return
        }
        let anss = await contract.methods.getNft(addr).call();
        if (anss.length > 0) {
            try {
                let stats = await contract.methods.getStats(anss[0]).call();
                console.log(stats)
                let uri = await contract.methods.getUrl(anss[0]).call();
                uri = "https://" + uri + ".ipfs.dweb.link/videoId.json"
                let res = await fetch(uri);
                let ans = await res.json()
                console.log(anss[0])

                let jawab = {
                    stat: stats,
                    url: ans.skybox,
                    id: anss[0]
                }


                setUserData([jawab])
            } catch (e) {
                console.log(e)

            }

        }
        setisLoading(false)


    }

    return (
        <React.Fragment>
            <BoxWrapper>
                <Box className='parent-header'>
                    <Typography sx={{ fontSize: '48px', fontWeight: 700, color: '#7DF9FF' }}>
                        NFT MARKETPLACE
                    </Typography>
                    <div class="buttons" style={{ display: "flex" }}>
                        <Typography>
                            <Link to='/mint'>
                                <Button className='mint-btn' variant="contained"> Mint Warrior </Button>
                            </Link>
                        </Typography>
                        {
                            connected && <h2 style={{ color: "white" }}>{address.substring(0, 15)}</h2>
                        }{
                            !connected &&
                            <Typography><Button className='mint-btn' variant="contained" onClick={() => { connectWalletHandler() }}> Connect Wallet </Button>  </Typography>
                        }
                    </div>


                </Box>
                <Box>
                    <Tabs defaultValue={0}>
                        <Box className='parent-tabs'>
                            <StyledTabsList onClick={() => {
                                if (document.getElementsByClassName("mycollection")[0].classList.contains(["MuiTabPanel-hidden"])) {
                                    getMyNfts();
                                }



                            }}>
                                <StyledTab value={0}>Collection </StyledTab>
                                <StyledTab value={1} > My Collection </StyledTab>
                            </StyledTabsList>
                        </Box>
                        <StyledTabPanel value={0} className="collection">
                            <Box sx={{ background: '#000', padding: '30px' }}>
                                <Grid container spacing={2}>
                                    {
                                        nfts.map((data) => {
                                            return (
                                                <Grid item xs={12} lg={3} md={3}>
                                                    <IndividualWarrior m3u8Link={data.url} text={data.id} />
                                                </Grid>
                                            )
                                        })
                                    }

                                </Grid>
                            </Box>

                        </StyledTabPanel>
                        <StyledTabPanel value={1} className="mycollection">
                            <Box sx={{ background: '#000', padding: '30px' }}>
                                <Grid container spacing={0} >

                                    {
                                        userData.map((data) => {
                                            return (
                                                <Grid item xs={12} lg={4} md={4}>
                                                    <IndividualWarrior text={data.id} m3u8Link={data.url} />
                                                </Grid>
                                            )
                                        })
                                    }

                                </Grid>
                            </Box>
                        </StyledTabPanel>
                    </Tabs>
                </Box>
            </BoxWrapper>
            {isLoading &&
                <div style={{ position: "absolute", top: "0%", left: "0%", right: 0, bottom: 0, zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Loader></Loader>


                </div>
            }

        </React.Fragment >
    )
}

export default Dashboard;