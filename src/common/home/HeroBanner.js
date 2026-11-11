import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import brand from "../../theme/brand";

export default function HeroBanner({ searchHandler }) {
    return (
        <Box
            sx={{
                background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.primaryLight} 100%)`,
                py: { xs: 6, md: 8 },
                px: 2,
                textAlign: "center",
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
            >
                {brand.tagline}
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{ color: "rgba(255,255,255,0.85)", mb: 4 }}
            >
                Order from your favourite restaurants near you
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: 520,
                    mx: "auto",
                    borderRadius: "28px",
                    px: 2.5,
                    py: 1,
                    bgcolor: "#fff",
                }}
            >
                <SearchIcon sx={{ color: "text.secondary", mr: 1.5 }} />
                <input
                    type="text"
                    placeholder="Search by Restaurant Name"
                    onChange={searchHandler}
                    style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        width: "100%",
                        fontSize: "16px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#1A1A2E",
                    }}
                />
            </Paper>
        </Box>
    );
}
