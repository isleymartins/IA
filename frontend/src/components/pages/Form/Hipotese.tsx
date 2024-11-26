import React, { useContext, useEffect, useState } from 'react';
import TableData from "../../Table";
import { fetchQualityMetrics } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { QualityMetrics } from "../../../model/model";
import { Button, MenuItem, TextField, Typography } from '@mui/material';

const HipoteseComponent: React.FC = () => {
    const authContext = useContext(AuthContext)
    const [metrics, setMetrics] = useState<QualityMetrics>();

    const { formData } = authContext;

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ];
    const [selectedOption, setSelectedOption] = React.useState(''); 
    const handleChange = (event:any) => { setSelectedOption(event.target.value); };

    return (
        <>
            <TextField
                select={true}
                value={selectedOption}
                onChange={handleChange}
                variant="outlined"
                fullWidth={true}
            >
                {
                    options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>))
                }
            </TextField>
            <Button variant="contained" onClick={()=>{}}>Calcular</Button>
            {metrics && <TableData row={metrics.metrics} feature={formData.feature} title="Modelo" />}
            <Typography>
                {/*metrics?.hipotese
                    ? typeof metrics.hipotese === 'object'
                        ? JSON.stringify(metrics.hipotese) // Converte para string se for objeto
                        : metrics.hipotese // Exibe diretamente se for texto ou número
                    : "Hipótese não disponível"*/}
            </Typography>
        </>
    );
};

export default HipoteseComponent;
