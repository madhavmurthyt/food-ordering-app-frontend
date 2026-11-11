import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from "react-router-dom";
import theme from "./theme/theme";
import FoodOrderingApp from "./FoodOrderingApp";

const root = createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
            <FoodOrderingApp />
        </Router>
    </ThemeProvider>
);
