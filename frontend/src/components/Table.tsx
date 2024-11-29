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
import { makeStyles } from "@mui/styles";

interface Rows {
    row: any[];
    feature: string;
    title: string;
}

const useStyles = makeStyles({
    title: {
        background: 'rgba(36, 36, 36, 1)',
        color: 'rgba(255, 255, 255, 0.87)',
        fontWeight: 'bold' 
    },
    column: {
        color: 'rgba(255, 255, 255, 0.87)',
        background: 'rgb(26, 26, 26)',
        fontWeight: 'bold' 
    },
    rows: {
        color: 'rgba(255, 255, 255, 0.87)',
        background: 'rgb(26, 26, 26,0.9)',
    },
    rows2: {
       color: 'rgba(255, 255, 255,1)',
       background: 'rgb(26, 26, 26,0.9)',
       fontWeight: 'bold'
    },
    nestedTable: {
        marginTop: '8px',
        marginBottom: '8px',
        
    },
    nestedCell: {
        border: '1px solid #404040',
        color: 'rgba(255, 255, 255, 0.87)',
        padding: '8px',
        borderCollapse: 'collapse',
        textAlign: 'center'
    }
});

// Função auxiliar para renderizar tabelas aninhadas
const renderNestedTable = (value: any, classes:any) => (
    <Table className={classes.nestedTable} size="small">
        <TableBody>
            {Array.isArray(value) ? value.map((subArray, subIndex) => (
                <TableRow key={subIndex}>
                    {Array.isArray(subArray) ? subArray.map((subValue, subCellIndex) => (
                        <TableCell key={subCellIndex} className={classes.nestedCell}>{subValue}</TableCell>
                    )) : (
                        <TableCell className={classes.nestedCell}>{subArray}</TableCell>
                    )}
                </TableRow>
            )) : Object.entries(value).map(([attrKey, attrValue]: any, attrIndex) => (
                <TableRow key={attrIndex}>
                    <TableCell className={classes.nestedCell} style={{ fontWeight: 'bold' }}>{attrKey}</TableCell>
                    <TableCell className={classes.nestedCell}>{attrValue}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

const TableData = ({ row, feature, title }: Rows) => {
    const classes = useStyles();
    console.log("!!",row," ", feature, " ", title)
    const hasFeature = row?.some(obj => feature in obj);
    const hasPrediction = row?.some(obj => 'Prediction' in obj);

    return (
        <TableContainer component={Paper} style={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="caption table">
                <TableHead>
                    <TableRow>
                        <TableCell size='small' align="center" className={classes.title} colSpan={Object.keys(row[0]).length + 1}>
                            <Typography variant="h6">{title}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {hasFeature && <TableCell size='small' className={classes.column} key={feature}>{feature}</TableCell>}
                        {Object.keys(row[0]).map((column, index) => (
                            column !== feature && column !== 'Prediction' && (
                                <TableCell className={classes.column} key={index}>{column}</TableCell>
                            )
                        ))}
                        {hasPrediction && <TableCell size='small' className={classes.column} key="Prediction">Prediction</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row.map((cell, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {hasFeature && <TableCell size='small' key={`feature-${rowIndex}`} className={classes.rows2}>{cell[feature]}</TableCell>}
                            {Object.entries(cell).map(([key, value]: any, cellIndex) => (
                                key !== feature && key !== 'Prediction' && (
                                    <TableCell size='small' key={cellIndex} className={classes.rows}>
                                        {Array.isArray(value) || typeof value === 'object' ? (
                                            renderNestedTable(value, classes)
                                        ) : (
                                            value
                                        )}
                                    </TableCell>
                                )
                            ))}
                            {hasPrediction && <TableCell size='small' key={`Prediction-${rowIndex}`} className={classes.rows2}>{cell.Prediction}</TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableData;
