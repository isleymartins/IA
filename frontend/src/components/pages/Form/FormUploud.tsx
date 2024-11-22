import React, { ChangeEvent } from 'react';
import { TextField, Button, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Form } from "../../../model/model";
import { Check } from '@mui/icons-material';
import theme from '../../../theme';

interface FormUploadFileProps {
    handleFormChange: (formData: Form) => void;
    formData: Form;
}

const FormUploadFile: React.FC<FormUploadFileProps> = ({ handleFormChange, formData }) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = event.target;
        handleFormChange({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    return (
        <Box>
            <TextField
                label="Porcentagem de teste"
                margin='dense'  
                type="number"
                sx={{color: `${theme.palette.getContrastText}`}}
                slotProps={{
                    input: {
                      inputProps: { min: 0 }
                    },
                  }}
              
                id="testSize"
                size='small'
                name="testCase"
                value={formData.testCase || ''}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Feature"
                type="text"
                margin='none' 
                sx={{color: `${theme.palette.getContrastText}`}}
                id="feature"
                size='small'
                name="feature"
                value={formData.feature || ''}
                onChange={handleChange}
                fullWidth
                required
            />
            <Button
                variant="outlined"
                component="label"
                sx={{marginTop:"2%"}}
                fullWidth={true}
                startIcon={formData.file?.name?<Check />:<CloudUploadIcon />}
            >
                
                {formData.file?.name || "Upload"}
                <input
                    type="file"
                    id="fileInput"
                    name="file"
                    onChange={handleChange}
                    hidden
                />
            </Button> 
             
            </Box>
    );
}

export { FormUploadFile };
