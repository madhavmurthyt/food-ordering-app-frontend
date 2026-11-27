import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

const CSV_COLUMNS = [
    "name", "photo_url", "avg_price", "flat_buil_number",
    "locality", "city", "pincode", "state", "category", "status",
];

function parseCsvPreview(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1, 6).map((line) => line.split(",").map((c) => c.trim()));
    return { headers, rows, totalRows: lines.length - 1 };
}

export default function CsvImportDialog({ open, onClose, onImported }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const fileRef = useRef(null);

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        if (!selected.name.endsWith(".csv")) {
            setError("Please select a .csv file.");
            return;
        }
        setError("");
        setFile(selected);
        setResult(null);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setPreview(parseCsvPreview(ev.target.result));
        };
        reader.readAsText(selected);
    };

    const handleImport = () => {
        if (!file) return;
        setImporting(true);
        setError("");
        const formData = new FormData();
        formData.append("file", file);
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Import Restaurants").uri;
        fetch(uri, {
            method: "POST",
            headers: {
                authorization: "Bearer " + getAccessToken(),
            },
            body: formData,
        })
            .then((r) => {
                if (!r.ok) throw r;
                return r.json();
            })
            .then((data) => {
                setResult(data);
                setImporting(false);
                if (data.imported_count > 0 && onImported) onImported();
            })
            .catch((err) => {
                setImporting(false);
                if (err.text) {
                    err.text().then((msg) => {
                        try {
                            setError(JSON.parse(msg).message || "Import failed.");
                        } catch {
                            setError("Import failed.");
                        }
                    });
                } else {
                    setError("Import failed. Check the file format and try again.");
                }
            });
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError("");
        setImporting(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>Import Restaurants from CSV</DialogTitle>
            <DialogContent>
                {!result ? (
                    <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                            Upload a CSV file with columns: {CSV_COLUMNS.join(", ")}.
                            Categories should be pipe-separated (e.g. Italian|Mexican).
                        </Typography>

                        <input
                            ref={fileRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                            onClick={() => fileRef.current.click()}
                            sx={{ mb: 2 }}
                        >
                            {file ? file.name : "Choose CSV File"}
                        </Button>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                        )}

                        {preview && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Preview ({preview.totalRows} row{preview.totalRows !== 1 ? "s" : ""} total, showing first {Math.min(preview.rows.length, 5)})
                                </Typography>
                                <TableContainer sx={{ maxHeight: 260, mb: 2 }}>
                                    <Table size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {preview.headers.map((h, i) => (
                                                    <TableCell key={i} sx={{ fontWeight: 600, fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                                                        {h}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {preview.rows.map((row, ri) => (
                                                <TableRow key={ri}>
                                                    {row.map((cell, ci) => (
                                                        <TableCell key={ci} sx={{ fontSize: "0.75rem", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {cell}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                            <Chip
                                icon={<CheckCircleIcon />}
                                label={`${result.imported_count} imported`}
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                            {result.error_count > 0 && (
                                <Chip
                                    icon={<ErrorIcon />}
                                    label={`${result.error_count} error${result.error_count !== 1 ? "s" : ""}`}
                                    color="error"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                        </Box>

                        {result.imported && result.imported.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#4CAF50" }}>
                                    Successfully Imported
                                </Typography>
                                <Box sx={{ maxHeight: 160, overflow: "auto" }}>
                                    {result.imported.map((r, i) => (
                                        <Typography key={i} variant="body2" sx={{ py: 0.25 }}>
                                            {r.restaurant_name || r.name || `Restaurant ${i + 1}`}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {result.errors && result.errors.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#E23744" }}>
                                    Errors
                                </Typography>
                                <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                                    {result.errors.map((err, i) => (
                                        <Alert key={i} severity="error" sx={{ mb: 0.5, py: 0 }}>
                                            <Typography variant="body2">
                                                {err.line != null ? `Line ${err.line}: ` : ""}
                                                {err.message || err.error || JSON.stringify(err)}
                                            </Typography>
                                        </Alert>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose}>{result ? "Close" : "Cancel"}</Button>
                {!result && (
                    <Button
                        variant="contained"
                        onClick={handleImport}
                        disabled={!file || importing}
                        startIcon={importing ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {importing ? "Importing..." : "Import"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
