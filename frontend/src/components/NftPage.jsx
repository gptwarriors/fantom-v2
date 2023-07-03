import React, { useEffect, useState,video } from 'react';
import { useParams } from 'react-router-dom';
import './video.css'; // Import the CSS file for styling
import Web3 from 'web3';
import { abi } from './abi'
import Popup from './popup'
import Loader from './Loader';
import ReactHlsPlayer from 'react-hls-player';

const VideoPage = () => {
    const { id } = useParams();
    const characterreversemap = {
        0: "Ninja",
        1: "Robinhood",
        2: "Archer",
        3: "Cop",
        4: "Princess"
    }

    let web3;
    let contract;
    let [videoid, setVideoid] = useState("")
    let [characterid, setcharacterid] = useState("")
    let [descrip,setdescrip] = useState("")
    let [encoding, setencoding] = useState(true)
    let [playbackurl, setplaybackurl] = useState("")
    let [owner, setowner] = useState("")
    useEffect(() => {
        web3 = new Web3("https://rpc.testnet.fantom.network/")
        contract = new web3.eth.Contract(abi, "0x2fDd2404E077F856E6d257D71283b20580009406")
        getvideo()

    }, [])
    const getvideo = async () => {
        let videoid = await contract.methods.getUrl(id).call();
        let characterid = await contract.methods.getStats(id).call();
        let owners = await contract.methods.ownerOf(id).call();
        setowner(owners)
        setcharacterid(characterreversemap[characterid[0]])
        let uri = "https://" + videoid + ".ipfs.dweb.link/videoId.json"
        let res = await fetch(uri);
        let ans = await res.json()
        let encoded = ans.video
        setdescrip(ans.description)
        console.log(ans.description)

        if (!encoded) {
            setencoding(true)

        }
        else {
            setencoding(false)
            setplaybackurl(encoded)
            console.log(encoded)
        }
        setVideoid(ans.video)


    }
    return (


        <div style={{ overflowY: "hidden" }}>

            {!encoding && (

                <video width="100%" height="100%" controls autoPlay={true} muted loop>
                    <source src={playbackurl} type="video/mp4" />
                </video>
            )
            }

            <div class="text-box">
                <h1>{characterid + " #" + id}</h1>
                <h2>Owned By <br /></h2>
                <p>{owner}</p>
                <p>{descrip}</p>
            </div>

        </div>


    )


};

export default VideoPage;