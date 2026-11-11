import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AddIcon from "@mui/icons-material/Add";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function PopularItems({ items, onAddItem }) {
    if (!items || items.length === 0) return null;

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <WhatshotIcon sx={{ color: "secondary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Most Popular
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    pb: 1,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }}
            >
                {items.map((item) => (
                    <Card
                        key={item.id}
                        sx={{
                            minWidth: 180,
                            flexShrink: 0,
                            transition: "transform 0.2s",
                            "&:hover": { transform: "translateY(-2px)" },
                        }}
                    >
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 1,
                                }}
                            >
                                <FiberManualRecordIcon
                                    sx={{
                                        fontSize: 12,
                                        color:
                                            item.item_type === "VEG" ||
                                            item.item_type === "0"
                                                ? "success.main"
                                                : "error.main",
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 500,
                                        textTransform: "capitalize",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: 130,
                                    }}
                                >
                                    {item.item_name}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "text.secondary",
                                    }}
                                >
                                    <CurrencyRupeeIcon sx={{ fontSize: 14 }} />
                                    <Typography variant="body2">
                                        {item.price}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => onAddItem(item)}
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "primary.main",
                                        width: 28,
                                        height: 28,
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
