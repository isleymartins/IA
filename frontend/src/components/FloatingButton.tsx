import { useEffect, useState } from 'react'
import {
    Fab
} from '@mui/material'
import {Add} from '@mui/icons-material'
const FloatingButton = () => {
    return <>
        <Fab color="primary" aria-label="add">
            <Add />
        </Fab>
    </>

}
export default FloatingButton