import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function DetailsMenuCard({ category, handleAddMenuItem }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 600, fontSize: "0.85rem", letterSpacing: 1 }}
            >
                {category.category_name}
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            {category.item_list.map((item) => (
                <Box
                    key={item.id}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1.5,
                        px: 1,
                        borderRadius: 1,
                        transition: "background 0.15s",
                        "&:hover": { bgcolor: "#FFF5F5" },
                    }}
                >
                    <FiberManualRecordIcon
                        sx={{
                            fontSize: 12,
                            mr: 1.5,
                            color:
                                item.item_type === "VEG" || item.item_type === "0"
                                    ? "success.main"
                                    : "error.main",
                        }}
                    />
                    <Typography
                        variant="body1"
                        sx={{
                            flex: 1,
                            textTransform: "capitalize",
                            fontWeight: 500,
                        }}
                    >
                        {item.item_name}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.secondary",
                            mr: 2,
                        }}
                    >
                        <CurrencyRupeeIcon sx={{ fontSize: 14 }} />
                        <Typography variant="body2">
                            {item.price.toFixed(2)}
                        </Typography>
                    </Box>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleAddMenuItem(item)}
                        sx={{
                            border: "1px solid",
                            borderColor: "primary.main",
                            width: 30,
                            height: 30,
                        }}
                    >
                        <AddIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
}
