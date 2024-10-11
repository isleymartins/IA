import * as React from 'react';
import {
    Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody
} from '@mui/material';
import { makeStyles } from '@mui/styles';

interface Rows {
    row: any[]
    feature: string
    title: string
}

const useStyles = makeStyles({
    title: {
        background: 'rgba(36, 36, 36, 1)',
        color: 'rgba(255, 255, 255, 0.87)',
        fontWeight: 'bold' 
    },
    column:{
        color: 'rgba(255, 255, 255, 0.87)',
        background: 'rgb(26, 26, 26)',
        fontWeight: 'bold' 
    },
    rows:{
        color: 'rgba(255, 255, 255, 0.87)',
        background: 'rgb(26, 26, 26,0.9)',
    },
    rows2:{
       color: 'rgba(255, 255, 255,1)',
       background: 'rgb(26, 26, 26,0.9)',
       fontWeight: 'bold'
    }
});

const TableData = ({ row, feature, title }: Rows) => {
    const classes = useStyles()

    const hasFeature = row.some(obj => feature in obj);
    const hasPrediction = row.some(obj => 'Prediction' in obj);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100 }} aria-label="caption table">
                <TableHead>
                    <TableRow >
                        <TableCell align="center" className={classes.title} colSpan={Object.keys(row[0]).length}>
                            <Typography variant="h6">{title}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {Object.keys(row[0]).map((column, index) => (
                            column !== feature && column !== 'Prediction' && (
                                <TableCell className={classes.column} key={index}>{column}</TableCell>
                            )
                        ))}
                        {hasFeature && <TableCell className={classes.column} key={feature}>{feature}</TableCell>}
                        {hasPrediction && <TableCell className={classes.column} key="Prediction">Prediction</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody >
                    {row.map((cell, rowIndex) => (
                        <TableRow  key={rowIndex}>
                            {Object.entries(cell).map(([key, value]:any, cellIndex) => (
                                key !== feature && key !== 'Prediction' && (
                                    <TableCell key={cellIndex} className={classes.rows}>{value}</TableCell>
                                )
                            ))}
                            {hasFeature && <TableCell key={`feature-${rowIndex}`} className={classes.rows2} >{cell[feature]}</TableCell>}
                            {hasPrediction && <TableCell key={`Prediction-${rowIndex}`}  className={classes.rows2}>{cell.Prediction}</TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableData;
