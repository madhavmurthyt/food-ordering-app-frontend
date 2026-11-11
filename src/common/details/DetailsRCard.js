import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function DetailsRCard({ restaurant }) {
    return (
        <Box
            sx={{
                position: "relative",
                height: { xs: 200, md: 280 },
                overflow: "hidden",
            }}
        >
            <Box
                component="img"
                src={restaurant.photo_URL}
                alt={restaurant.restaurant_name}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                    p: { xs: 2, md: 3 },
                    color: "#fff",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                >
                    {restaurant.restaurant_name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, textTransform: "uppercase", mb: 1 }}
                >
                    {restaurant.address && restaurant.address.locality}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1.5 }}>
                    {restaurant.categories &&
                        restaurant.categories
                            .map((c) => c.category_name)
                            .join(", ")}
                </Typography>
                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            bgcolor: "success.main",
                            borderRadius: "4px",
                            px: 1.5,
                            py: 0.25,
                        }}
                    >
                        <StarRoundedIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {restaurant.customer_rating}
                        </Typography>
                        <Typography variant="caption">
                            ({restaurant.number_customers_rated})
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.25,
                        }}
                    >
                        <CurrencyRupeeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                            {restaurant.average_price} for two
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
