import { createTheme } from "@mui/material/styles";
import brand from "./brand";

const theme = createTheme({
    palette: {
        primary: {
            main: brand.colors.primary,
            light: brand.colors.primaryLight,
            dark: brand.colors.primaryDark,
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: brand.colors.secondary,
            light: brand.colors.secondaryLight,
            dark: brand.colors.secondaryDark,
        },
        background: {
            default: "#F5F5F5",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#1A1A2E",
            secondary: "#6B7280",
        },
        success: {
            main: "#4CAF50",
        },
        error: {
            main: "#E23744",
        },
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
        button: { fontWeight: 600, textTransform: "none" },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "8px 24px",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#FFFFFF",
                    color: "#1A1A2E",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                },
            },
        },
    },
});

export default theme;
