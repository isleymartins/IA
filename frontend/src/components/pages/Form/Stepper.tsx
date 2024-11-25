import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';



export default function Stepper({ item }: any) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = item?.map((blob:any, imgIndex:number) => {
        const url = URL.createObjectURL(blob);
        return {
            label: imgIndex+1,
            description: <img key={imgIndex} src={url} alt="Plot Image" style={{width: '28vw' }} />
        }
    })
    const maxSteps = steps?.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
   
    return (
        <Box sx={{  flexGrow: 1 }}>
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 50,
                    pl: 2,
                    bgcolor: 'background.paper',
                    backgroundColor:'background.paper'
                }}
            >
                {/*<Typography>{steps[activeStep]?.label}</Typography>*/}
            </Paper>
            <Box sx={{/* height: 255, maxWidth: 400, width: '100%',*/ p: 2 }}>
                {steps[activeStep]?.description}
            </Box>
            <MobileStepper 
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                color='primary'
                nextButton={   
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Proximo
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Voltar
                    </Button>
                }
            />
        </Box>
    );
}