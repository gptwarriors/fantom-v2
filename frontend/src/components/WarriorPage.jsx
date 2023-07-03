import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import styled from "styled-components";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import Warrior from "./Warrior";
import ModelViewer from "./ThreeCharacter"
import Loader from "./Loader";
import useWebSocket from 'react-use-websocket';
import { abi } from './abi'
import Web3 from 'web3'
import { Web3Storage } from 'web3.storage'
import Popup from "./popup";
import { useNavigate } from "react-router-dom";

const BoxWrapper = styled(Box)({
    background: '#000',
    height: '100vh',
    '.titleMessage': {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '95vh',
    },
    '.title': {
        fontSize: '50px',
        fontFamily: 'Sigmar',
        color: '#fff', textAlign: 'center'
    },
    '.description': {
        border: '2px solid #7DF9FF', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px 35px', color: 'white', width: '500px', borderRadius: '35px', marginTop: '45px'
    },
    '.text-area': {
        background: '#000',
        color: '#fff',
        width: '400px',
        border: 'none',
        outline: 'none', padding: '55px 40px'
    },
    '.next-btn': {
        background: '#fff',
        color: '#00A9B1',
        fontSize: '14px', fontWeight: 700,
        textTransform: 'none',
        borderRadius: '30px',
        padding: '5px 35px',
        margin: '10px 0px'
    },
    '.next-btn:hover': {
        background: '#fff',
    },
    '.parent-next': {
        display: 'flex',
        justifyContent: 'center'
    },
    '.footer-title': {
        color: '#fff',
        position: 'fixed',
        bottom: '32px',
        fontSize: '18px',
    },
})


const WarriorPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "scroll");
    });
    const [skyboxuri, setskybox] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [gptresponse, setGPTresponse] = useState(false);
    const [gptans, setgptans] = useState("")
    const [input, setInput] = useState("")
    const [mintload, setmintloading] = useState(false);
    const [address, setAddress] = useState();
    const [connected, isConnected] = useState(false);
    const [gltfurl, setgltfurl] = useState(null);
    const [isMintLoading, setIsMintLoading] = useState(false);
    const [isScreenshot, setisScreenshot] = useState(false);
    const [screenshoturl, setscreenshoturl] = useState("");
    const [cid, setcid] = useState(null)
    const [success, onsuccess] = useState(false)
    const [descrip,setdescrip] = useState("")
    let contract;
    const charactermap = {
        "ninja": 0,
        "robinhood": 1,
        "archer": 2,
        "cop": 3,
        "princess": 4
    }
    const characterreversemap = {
        0: "ninja",
        1: "robinhood",
        2: "archer",
        3: "cop",
        4: "princess"
    }

    const glbmap = {
        0: "./ninja.glb",
        1: "./kid.glb",
        2: "./skye.glb",
        3: "./sherif.glb",
        4: "./princess.glb"
    }

    const imagemap = {
        0: "./ninja.png",
        1: "./kid.png",
        2: "./skye.png",
        3: "./sherif.png",
        4: "./princess.png"
    }
    const handleClick = () => {
        setIsLoading(true);
        sendMsg()
    }

    const handleMintClick = () => {
        setIsMintLoading(true);
        mintNFT()

    }
    const onScreenshot = (data) => {
        console.log("screenshot captured")
        setscreenshoturl(data);
        console.log(data)

    }


    const handleUpload = async (videoId, imageFile) => {
        const storage = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM4MmM1N2I1M0VEOGY2MEMxMmQxOTE3MzZjMUQ5NWY1MUViZWZiMDMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mzc2MTY5MzMxNDIsIm5hbWUiOiJUaGV0YSJ9.8DpgeRXRcTyDAn-5IQYS6A0jA5oNQ--pC2ns0eDT7z8' });
        let ans = {
            video: videoId,
            skybox: skyboxuri,
            description: descrip
        }
        // Create array of files to upload
        const files = [
            new File([JSON.stringify(ans)], 'videoId.json', { type: 'application/json' })];

        const cids = await storage.put(files);
        setcid(cids);
        console.log(cids)
        return cids;

    }
    const connectWalletHandler = async () => {

        const { ethereum } = window
        if (!ethereum) {
            alert("Please install Metamask")
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
                await setAddress(accounts[0])
                isConnected(true)
                return accounts[0]
            } else {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [desiredNetwork],
                    });
                    console.log('Network added successfully!');
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


    const onViewNFT = async () => {
        let web3 = new Web3(window.ethereum)
        contract = new web3.eth.Contract(abi, "0x2fDd2404E077F856E6d257D71283b20580009406")

        let anss = await contract.methods.getNft(address).call();
        navigate("/nft/" + anss[0])

    }
    const mintNFT = async () => {
        let ans = await connectWalletHandler()
        let web3 = new Web3(window.ethereum)

        let cids = await handleUpload(phantomurl, screenshoturl)
        contract = new web3.eth.Contract(abi, "0x2fDd2404E077F856E6d257D71283b20580009406")
        try {

            await contract.methods.mintBuy(charactermap[gptans.toLowerCase()], cids).send({ value: "50000000000000000", from: ans });
            onsuccess(true)


        }
        catch (e) {
            alert("error occured")
            setIsMintLoading("false")

        }

    }
    const [isphantomurl, setisphantomurl] = useState(false);
    const [phantomurl, setphantomurl] = useState(null);
    const { sendMessage, lastMessage } = useWebSocket("wss://gpu.gptwarriors.live", {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: async (data) => {
            console.log(data)
            data = await JSON.parse(data.data)
            if (data["type"] == "gpt-response") {
                setGPTresponse(true);
                setIsLoading(false);
                console.log(data['data'])
                setgptans(data['data'])
                setTimeout(() => {
                    setGPTresponse(false);
                    setShow(true)
                }, 5000);
                setgltfurl(glbmap[charactermap[data['data'].toLowerCase()]])
                setboldtext("Generating Skybox using AI")
            }
            else if (data["type"] == "skybox-response") {
                console.log("i set the skybox")
                setskybox(data["data"])
                setboldtext("Generating your Personal Video")
            }
            else if (data["type"] == "ai-response") {
                setTimeout(() => {
                    setisphantomurl(true)
                    setphantomurl(data["data"])
                    setboldtext("Mint your AI Generated NFT")
    
                    
                },10000)


            }

            else if (data["type"] == 'description-text'){
                setdescrip(data['data'])
            }
        }
    });


    async function sendMsg() {
        console.log(input)
        sendMessage(JSON.stringify({ type: "create", character: input }))
    }

    const [boldtext, setboldtext] = useState("loading")
    const [show, setShow] = useState(false);



    return (
        <div>
            {
                !show && !gptresponse &&
                <BoxWrapper>
                    <div className="titleMessage">
                        <div className="heading">
                            <div className="title">
                                <Typewriter
                                    options={{
                                        // strings: ["Web Developer", "Tech Enthusiast", "Nature Lover"],
                                        strings: ["Describe your warrior",],
                                        cursor: '💗',
                                        // cursor: '🤙',
                                        cursor: '⚔️',
                                        autoStart: true,
                                        loop: true,
                                        delay: 100,
                                    }}
                                />
                            </div>
                        </div>
                        <Box className='description'>
                            <textarea minRows={7}
                                className='text-area' placeholder='Describe your warriror' onChange={(data) => {
                                    setInput(data.target.value + ".")
                                }} />
                            <Box className='parent-next'>
                                {/* <Link to='/warrior'> */}
                                <Button
                                    className='next-btn'
                                    onClick={handleClick}
                                    variant="contained"
                                    disabled={isLoading} // Disable the button while loading
                                >
                                    {isLoading ? <CircularProgress size={30} color="primary" /> : 'Next'}
                                </Button>
                            </Box>
                        </Box>
                        <Typography className='footer-title'>
                            Powered By Generative AI  🤖 & Fantom Network
                        </Typography>
                    </div>
                </BoxWrapper>

            }
            {
                show && !gptresponse && (

                    <div style={{ position: "relative" }}>
                        <ModelViewer gltfUrl={gltfurl} skyboxUrl={skyboxuri} onScreenshot={onScreenshot} takesc={isScreenshot} />
                        {!phantomurl &&
                            <div style={{ position: "absolute", top: "-40%", left: "50%", right: 0, bottom: 0, zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Loader></Loader>

                            
                            </div>
                        }
                        <div style={{ position: "absolute", top: "-0%", left: "50%", right: 0, bottom: 0, zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center",flexDirection:"column" }}>
                            <h3 className="text-bold">{boldtext}</h3>
                            <h5 className="text-bold2">{descrip}</h5>              

                            {isphantomurl &&
                                <div style={{ position: "absolute", top: "30%", left: "0%", right: 0, bottom: 0, zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>

                                    <Button
                                        className='next-btn'
                                        onClick={handleMintClick}
                                        variant="contained"
                                        disabled={isMintLoading} // Disable the button while loading
                                    >
                                        {isMintLoading ? <CircularProgress size={30} color="primary" /> : 'Mint Now'}
                                    </Button>

                                </div>}
                            {success &&
                                <Popup onViewNFT={onViewNFT} />
                            }

                        </div>
                    </div>
                )
            }
            {
                gptresponse &&
                <Warrior character={gptans} imageurl={imagemap[charactermap[gptans.toLowerCase()]]} />
            }
        </div>

    );
}


export default WarriorPage;
