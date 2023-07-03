import { Avatar, Box, Typography, styled } from '@mui/material';
import React, { useEffect } from 'react';
import { GiCrown } from 'react-icons/gi';


const BoxWrapper = styled(Box)({
    backgroundImage: 'linear-gradient(360deg, #000000 76%, rgba(217, 217, 217, 0) 122%)',
    height: '100vh',
    '.parent-header': {
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    '.main-title': {
        height: '65vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',

    },
    '.title': {
        fontSize: '35px',
        color: '#fff',
        fontSize: '35px',
        fontFamily: 'Sigmar',
        latterSpacing: '0.8em',
        display: 'flex',
        alignItems: 'center',
    },
    '.avatar': {
        width: '130px',
        marginTop: '38px',
        height: '130px'
    },
    '.footer-title': {
        color: '#fff',
        position: 'fixed',
        bottom: '32px',
        fontSize: '18px',
        textAlign: 'center',
        width: '100%'
    },
})

const Warrior = (character,imageurl) => {
   
 
    return (
        <React.Fragment>
            <BoxWrapper>
                <Box className='parent-header'>
                    <Typography sx={{ fontSize: '48px', fontWeight: 700, color: '#7DF9FF' }}>
                        Warrior Title
                    </Typography>
                </Box>
                <Box className='main-title'>
                    <Typography className='title'>
                        Your Warrior looks like {character.character} <GiCrown style={{ fontSize: '40px', paddingLeft: '12px' }} />
                    </Typography>
                    <Box>
                        <img
                        
                            className='avatar'
                            alt="Remy Sharp"
                            src={character.imageurl}
                        />
                    </Box>
                </Box>
                <Typography className='footer-title'>
                    Powered By Generative AI  🤖 & Edge Compute
                </Typography>

            </BoxWrapper>
        </React.Fragment>
    )
}

export default Warrior;