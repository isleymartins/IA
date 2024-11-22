import React, { ReactNode, FormEvent } from 'react';
import { Card, CardContent, CardActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Form } from "../../model/model"; 

interface CardComponentProps {
    handleClose: () => void;
    handleFormChange: (formData: Form) => void;
    handleFormSubmit: () => void;
    formData: Form;
    children: ReactNode;
}

const CardComponent: React.FC<CardComponentProps> = ({ handleClose, handleFormChange, handleFormSubmit, formData, children }) => {

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleFormSubmit();
        handleClose();
    };

    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', padding:"20px" , position: 'relative' }}>
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
                <CardContent sx={{margin: '40px 0px 0px 0px', position: 'relative' }}>
                    {children}
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

export { CardComponent };
