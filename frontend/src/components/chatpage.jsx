import React, { useEffect, useState } from 'react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, InfoButton } from '@chatscope/chat-ui-kit-react';
import { Button, Select, MenuItem, InputLabel, createTheme, makeStyles } from '@material-ui/core';
import ReactHlsPlayer from 'react-hls-player';
import './Chatbox.css';
import Chatt from './ChatBox';
import PopupContainer from './Popupc';


const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });





const buttonStyle = {
    backgroundColor: '#23cbb4',
    color: '#ffffff', // Text color
    height: "10%"
};

const ChatPage = () => {

    const [url, seturl] = useState(null);



   

    useEffect(() => {
        console.log("am i called")
        const getPlayback = async () => {

            let res = await fetch("https://api.gptwarriors.live/stream")
            res = await res.json()
            if (res["success"] == true) {
                console.log(res["playback"])
                seturl(res["playback"])
            }
        }
        getPlayback()
    }
        , [])
    return (
        <div className='live'>
    
            {url && (


                <ReactHlsPlayer
                    src={url}
                    autoPlay={true}
                    controls={true}
                    width="100%"
                    height="100%"
                />

            )
            }
            


            <Chatt></Chatt>





        </div >

    );
};

export default ChatPage;
