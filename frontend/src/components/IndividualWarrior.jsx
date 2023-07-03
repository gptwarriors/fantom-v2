import React,{useState} from 'react';
import { Box, styled } from '@mui/material';
import { useNavigate } from "react-router-dom";

import ReactPlayer from 'react-player'

const IndividualWarrior = ({ m3u8Link, text }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const BoxWrapper = styled(Box)({
        '.parent-main-card': {
            width: '13rem',
            position: 'relative',
            margin: '10px'
        },
        '.card-image': {
            // backgroundIge: url("./assets/images/human.jpeg");
       
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '300px',
            borderRadius: '8px',
            height: '300px',
            position: 'relative',
        }
    })

    const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };

    return (
        <React.Fragment>
            <BoxWrapper>
                <div className='parent-main-card' onClick={() => {
                    navigate("/nft/"+text)
                }}>
                    <div className='perent-div'>
                        <div
                            className="card"
                           
                        >
                            {/* Render the card content here */}
                            {/* For example, you can have an image, title, description, etc. */}

                            {/* Render the video player when hovered */}
                           {m3u8Link &&
                           <img
                           src={m3u8Link}
                           border="0"
                           width="100%"
                           height="100%"
                        
                         />
                           }
                        </div>
                        <div className='test'>
                    {text}

                </div>
                    </div>
                </div>
               
            </BoxWrapper>
        </React.Fragment >
    )
}

export default IndividualWarrior;