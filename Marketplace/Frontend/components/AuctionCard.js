import { Paper } from "@mui/material";
import { Box, width } from "@mui/system";
import { Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { LinearProgress } from "@mui/material";
const AuctionCard = () => {
    
    return(
    <Paper  elevation={3} sx={{
        width: 320,
    }}>
        <Stack spacing={2} alignItems="center" margin={2} sx={{
            border:1,
            color: 'green'
        }}>
            <Box component="img" sx={{
                height: 334.4,
                width: 256,                
            }}
            src="https://raw.githubusercontent.com/SamiKammoun/robinmania/main/Bow.png"
            />
            <Box sx={{
                position : 'relative',
                bottom : 85,
                opacity : 0.5,
                width:'65%',
                paddingLeft:1
            }}>
                <Paper sx={{
                    width:'100%',
                    height: 50,
                    backgroundColor : 'black'
                }}>
                    <Stack alignItems="center">
                        <Typography color={'white'} fontSize={15}>15Hrs:20Mins:22Sec</Typography>
                        <Box sx={{width: '90%' , paddingTop:1}}>
                            <LinearProgress variant="determinate" value={50} />
                        </Box>
                    </Stack>
                </Paper>
                <Stack sx={{
                    position:'absolute',
                    top: 85
                }}>
                    <Stack direction="row" spacing={6}>
                        <Typography >Bow</Typography>
                        <Typography >Robin Mania</Typography>
                        
                    </Stack>
                    
                    
                </Stack>
            </Box>
            

        </Stack>
        
    </Paper>
    )
}
export default AuctionCard