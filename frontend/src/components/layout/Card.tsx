import React, { ReactNode, FormEvent } from 'react';
import { Card, CardContent, CardActions, Button, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Form } from "../../model/model";

interface CardComponentProps {
    formData: Form;
    children: ReactNode;
    loading: boolean

    handleClose: () => void;
    handleFormChange: (formData: Form) => void;
    setLoading: (loading: boolean) => void
}

const CardComponent: React.FC<CardComponentProps> = ({ handleClose, handleFormChange, formData, children, setLoading, loading }) => {

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
    };

    return (
        <Card sx={{ maxWidth: 400, padding: "20px", position: 'relative' }}>
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
                <CardContent sx={{ margin: '10px 0px 0px 0px', position: 'relative' }}>
                    {children}
                </CardContent>
                <CardActions>
                    <Button
                        type="submit"
                        color="primary"
                        fullWidth={true}
                        startIcon={loading ? <CircularProgress size="1rem" /> : undefined}
                        variant="contained"
                        disabled={loading}>
                        Submeter
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
};

export { CardComponent };
