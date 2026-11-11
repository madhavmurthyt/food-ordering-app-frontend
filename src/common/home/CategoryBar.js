import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

export default function CategoryBar({ categories, activeCategory, onCategoryClick }) {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1.5,
                overflowX: "auto",
                py: 2,
                px: { xs: 2, md: 4 },
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
            }}
        >
            <Chip
                label="All"
                onClick={() => onCategoryClick(null)}
                variant={activeCategory === null ? "filled" : "outlined"}
                color={activeCategory === null ? "primary" : "default"}
                sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    px: 1,
                    cursor: "pointer",
                }}
            />
            {categories.map((cat) => (
                <Chip
                    key={cat.id}
                    label={cat.category_name}
                    onClick={() => onCategoryClick(cat)}
                    variant={
                        activeCategory && activeCategory.id === cat.id
                            ? "filled"
                            : "outlined"
                    }
                    color={
                        activeCategory && activeCategory.id === cat.id
                            ? "primary"
                            : "default"
                    }
                    sx={{
                        fontWeight: 500,
                        fontSize: "0.85rem",
                        px: 1,
                        cursor: "pointer",
                        flexShrink: 0,
                    }}
                />
            ))}
        </Box>
    );
}
