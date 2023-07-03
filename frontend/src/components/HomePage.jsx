import React, { useEffect, useState } from 'react';
import User from './../assets/images/test2.png';
import { RiSwordLine } from 'react-icons/ri'
import { Box, Button, Typography, styled } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import { Link } from 'react-router-dom';

const BoxWrapper = styled(Box)({
    '.description': {
        border: '1px solid #7DF9FF', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px 35px', color: 'white', position: 'absolute', borderRadius: '16px', top: '57%'
    },
    '.text-area': {
        background: '#000',
        color: '#fff',
        width: '400px',
        border: 'none',
        outline: 'none', padding: '50px 40px'
    },
    '.footer-title': {
        color: '#fff',
        position: 'fixed',
        bottom: '32px',
        fontSize: '18px',
    },
    '.next-btn': {
        background: '#fff',
        color: '#00A9B1',
        fontSize: '14px', fontWeight: 700,
        textTransform: 'none',
        borderRadius: '30px',
        padding: '5px 35px'
    },
    '.next-btn:hover': {
        background: '#fff',
    },
    '.parent-next': {
        display: 'flex',
        justifyContent: 'center'
    }
})

const HomePage = () => {
    const [show, setShow] = useState(false);

    return (
        <React.Fragment>
            <BoxWrapper>
                <div class="wrapper" >
                    <button class="parent-one box" onFocus={() => setShow(true)} >
                        <div className='typewriter'> Describe your warrior
                            <RiSwordLine />
                        </div>
                    </button>
                    {show &&
                        <Box className='description'>
                            <textarea minRows={7}
                                className='text-area' placeholder='Describe your warriror' />
                            <Box className='parent-next'>
                                <Link to='/warrior'>
                                    <Button className='next-btn' variant="contained"> Next </Button>
                                </Link>
                            </Box>
                        </Box>
                    }
                    <Typography className='footer-title'>
                        Powered By Generative AI  🤖 & Edge Compute
                    </Typography>
                </div>

            </BoxWrapper>
        </React.Fragment>
    )
}

export default HomePage;