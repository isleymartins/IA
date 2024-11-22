// CardComponent.tsx
import React, { ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, TextField, CardActions, Button, Typography, Grid, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import {Form} from "../../model/model";

interface CardComponentProps {
    handleClose: () => void;
    handleFormChange: (formData: Form) => void;
    handleFormSubmit: () => void;
    formData: Form;
}

const CardComponent: React.FC<CardComponentProps> = ({ handleClose, handleFormChange, handleFormSubmit, formData }) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = event.target;
        const updatedData = {
            ...formData,
            [name]: files ? files[0] : value,
        };
        handleFormChange(updatedData);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleFormSubmit();
        handleClose();
    };

    return (
        <Card sx={{ maxWidth: 400, margin: '20px auto', position: 'relative' }}>
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <form id="uploadForm" onSubmit={handleSubmit}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Enviar Arquivo
                    </Typography>
                    <TextField
                        label="Porcentagem de teste"
                        type="number"
                        id="testSize"
                        name="testCase"
                        value={formData.testCase}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Feature"
                        type="text"
                        id="feature"
                        name="feature"
                        value={formData.feature}
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
                </CardContent>
                <CardActions>
                    <Button type="submit" color="primary" variant="contained">
                        Submeter
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
};

export default CardComponent;
