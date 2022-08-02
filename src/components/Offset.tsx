import React, { useEffect, useState } from "react";

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

import {loadConfig} from '../config'
import {upsertOffset} from '../storage'

type Props = {
    onRefresh: () => void;
}
export const Offset: React.FC<Props> = ({onRefresh}) => {
    const [currentOffset, setCurrentOffset] = useState<number | string>(0)
    const [offset, setOffset] = useState<number | string>(0)

    useEffect(() => {
        (async () => {
            const config = await loadConfig()
            const offset = config.offset / 1000 / 60
            setOffset(offset)
            setCurrentOffset(offset)
        })()
    }, [])

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        setOffset(Array.isArray(newValue) ? newValue[0] : newValue)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOffset(event.target.value === '' ? '' : Number(event.target.value))
    }

    const handleInputBlur = () => {
        if (offset < 0) {
            setOffset(0);
        } else if (offset > 60) {
            setOffset(60);
        }
    }

    const handleSubmit = async () => {
        if (typeof offset !== 'number') {
            return;
        }

        await upsertOffset(offset)
        setCurrentOffset(offset)
        onRefresh();
    }

    return (
        <Stack sx={{pt: 2, px: 1.5}} gap={1}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Typography variant="body2">Offset(min)</Typography>
                </Grid>
                <Grid item xs>
                    <Slider
                        value={typeof offset === 'number' ? offset : 0}
                        min={0}
                        max={60}
                        step={1}
                        aria-labelledby="offset-slider"
                        onChange={handleSliderChange}
                    />
                </Grid>
                <Grid item>
                    <Input
                        size="small"
                        value={offset}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 60,
                            type: "number",
                            'aria-labelledby': 'offset-slider'
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >Apply</Button>
                </Grid>
            </Grid>

            <Alert severity="info">Open meeting before {currentOffset} min(s).</Alert>
        </Stack>
    )
}
