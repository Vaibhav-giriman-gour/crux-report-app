import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Skeleton,
    Box,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import React, { useState } from "react";

const OutputData = ({ data, sort, loading, sortField, onSort, impMetrics }) => {
    const [nameFilter, setNameFilter] = useState("");
    const [valueFilter, setValueFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("Percentile");

    const filteredData = data.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(nameFilter.toLowerCase());
        const valueMatch = valueFilter === "" || (!isNaN(item.value) && item.value >= parseFloat(valueFilter));
        const typeMatch = item.type === typeFilter;
        return nameMatch && valueMatch && typeMatch;
    });

    const impData = filteredData.filter((item) =>
        impMetrics.some(metric => item.name?.startsWith(metric))
    );

    let totalPaint = 0, countPaint = 0;
    let totalShift = 0, countShift = 0;

    impData.forEach((item) => {
        const name = item.name?.split(' - ')[0];
        if (["first_contentful_paint", "largest_contentful_paint", "interaction_to_next_paint"].includes(name)) {
            totalPaint += item.value || 0;
            countPaint++;
        }
        if (name === "cumulative_layout_shift") {
            totalShift += item.value || 0;
            countShift++;
        }
    });

    const avgPaint = countPaint ? (totalPaint / countPaint) : 0;
    const avgShift = countShift ? (totalShift / countShift) : 0;

    if (!data.length && !loading) return null;

    return (
        <TableContainer component={Paper} sx={{ maxWidth: "90%", margin: "0 auto", overflowX: "auto" }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", p: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="type-select-label">Data Type</InputLabel>
                    <Select
                        labelId="type-select-label"
                        value={typeFilter}
                        label="Data Type"
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <MenuItem value="Percentile">Percentile</MenuItem>
                        <MenuItem value="Histogram">Histogram</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Filter By Name"
                    variant="outlined"
                    size="small"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <TextField
                    label="Filter By Min Value"
                    variant="outlined"
                    size="small"
                    value={valueFilter}
                    onChange={(e) => setValueFilter(e.target.value)}
                />
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        {["url", "name", "value"].map((field) => (
                            <TableCell key={field}>
                                <TableSortLabel
                                    active={sortField === field}
                                    direction={sort}
                                    onClick={() => onSort(field)}
                                >
                                    <b>{field.toUpperCase()}</b>
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <TableCell key={j}>
                                        <Skeleton variant="rectangular" width="100%" height={30} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                        : filteredData.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{item.url}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    {typeof item.value === "object" ? JSON.stringify(item.value) : item.value}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="h6">Important Metrics Stats</Typography>
                <Typography variant="body1">
                    Total Paint (ms): {Number.isFinite(totalPaint) ? totalPaint.toFixed(2):'N/A' }
                </Typography>
                <Typography variant="body1">
                    Average Paint (ms): {Number.isFinite(avgPaint) ? avgPaint.toFixed(2) :'N/A' }
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Total Layout Shift: {Number.isFinite(totalShift)? totalShift.toFixed(5): 'N/A' }
                </Typography>
                <Typography variant="body1">
                    Average Layout Shift: {Number.isFinite(avgShift)?  avgShift.toFixed(5): 'N/A'}
                </Typography>
            </Box>
        </TableContainer>
    );
};

export default OutputData;
