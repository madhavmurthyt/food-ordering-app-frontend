import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import brand from "../../theme/brand";

export default function Footer() {
    const navigate = useNavigate();
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#1A1A2E",
                color: "rgba(255,255,255,0.7)",
                py: 3,
                px: 2,
                textAlign: "center",
                mt: "auto",
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#fff" }}>
                {brand.appName}
            </Typography>
            <Typography variant="caption" sx={{ mt: 0.5, display: "block" }}>
                Made with care for food lovers everywhere
            </Typography>
            <Typography
                variant="caption"
                onClick={() => navigate("/for-restaurants")}
                sx={{
                    mt: 1, display: "inline-block", cursor: "pointer",
                    color: "#FF9800", "&:hover": { textDecoration: "underline" },
                }}
            >
                Partner with us
            </Typography>
        </Box>
    );
}
