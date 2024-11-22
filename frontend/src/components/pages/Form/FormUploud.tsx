import React, { ChangeEvent } from 'react';
import { TextField, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Form } from "../../../model/model";

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
        <>
            <TextField
                label="Porcentagem de teste"
                type="number"
                id="testSize"
                name="testCase"
                value={formData.testCase || ''}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Feature"
                type="text"
                id="feature"
                name="feature"
                value={formData.feature || ''}
                onChange={handleChange}
                fullWidth
                required
            />
            <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
            >
                Upload
                <input
                    type="file"
                    id="fileInput"
                    name="file"
                    onChange={handleChange}
                    hidden
                />
            </Button>
        </>
    );
}

export { FormUploadFile };
