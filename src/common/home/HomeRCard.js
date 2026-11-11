import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function HomeRCard({ restaurant, handleRestaurantNavigation }) {
    return (
        <Card
            sx={{
                maxWidth: 320,
                mx: "auto",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
            }}
            onClick={() => handleRestaurantNavigation(restaurant.id)}
        >
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt={restaurant.restaurant_name}
                    height="200"
                    image={restaurant.photo_URL}
                    sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ pb: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {restaurant.restaurant_name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {restaurant.categories}
                    </Typography>
                </CardContent>
                <CardContent sx={{ pt: 0, pb: "12px !important" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                bgcolor: "success.main",
                                color: "#fff",
                                borderRadius: "4px",
                                px: 1,
                                py: 0.25,
                                gap: 0.5,
                            }}
                        >
                            <StarRoundedIcon sx={{ fontSize: 16 }} />
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                            >
                                {restaurant.customer_rating}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ opacity: 0.9 }}
                            >
                                ({restaurant.number_customers_rated})
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "text.secondary",
                            }}
                        >
                            <CurrencyRupeeIcon sx={{ fontSize: 14 }} />
                            <Typography variant="body2">
                                {restaurant.average_price} for two
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
