import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MenuIcon from "@mui/icons-material/Menu";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DashboardTab from "./DashboardTab";
import RestaurantsTab from "./RestaurantsTab";
import UsersTab from "./UsersTab";
import OrdersTab from "./OrdersTab";
import { isLoggedIn, getRole } from "../../common/utils/AuthGuard";
import brand from "../../theme/brand";

const DRAWER_WIDTH = 240;

const navItems = [
    { label: "Dashboard", icon: DashboardIcon },
    { label: "Restaurants", icon: RestaurantIcon },
    { label: "Users", icon: PeopleIcon },
    { label: "Orders", icon: ReceiptLongIcon },
];

export default function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authorized, setAuthorized] = useState(null);
    const isSmall = useMediaQuery("(max-width:900px)");

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }
        if (getRole() !== "ADMIN") {
            setAuthorized(false);
            return;
        }
        setAuthorized(true);
    }, [navigate]);

    if (authorized === null) return null;

    if (authorized === false) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.default",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h3" sx={{ color: "error.main", mb: 1 }}>
                        403
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.secondary", mb: 3 }}>
                        You are not authorized to access this page.
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </Typography>
                </Box>
            </Box>
        );
    }

    const drawerContent = (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 2.5,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <FastfoodIcon sx={{ color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
                    {brand.appName}
                </Typography>
            </Box>
            <Typography
                variant="caption"
                sx={{ px: 2, pt: 2, pb: 1, color: "text.secondary", fontWeight: 600, letterSpacing: 1 }}
            >
                ADMIN
            </Typography>
            <List sx={{ px: 1 }}>
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const selected = activeTab === index;
                    return (
                        <ListItemButton
                            key={item.label}
                            selected={selected}
                            onClick={() => {
                                setActiveTab(index);
                                if (isSmall) setMobileOpen(false);
                            }}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                "&.Mui-selected": {
                                    bgcolor: "primary.main",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "primary.dark" },
                                    "& .MuiListItemIcon-root": { color: "#fff" },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Icon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );

    const renderTab = () => {
        switch (activeTab) {
            case 0:
                return <DashboardTab />;
            case 1:
                return <RestaurantsTab />;
            case 2:
                return <UsersTab />;
            case 3:
                return <OrdersTab />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            {isSmall ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: DRAWER_WIDTH,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: DRAWER_WIDTH,
                            boxSizing: "border-box",
                            borderRight: 1,
                            borderColor: "divider",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 3,
                        py: 2,
                        bgcolor: "background.paper",
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    {isSmall && (
                        <IconButton onClick={() => setMobileOpen(true)} edge="start">
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {navItems[activeTab].label}
                    </Typography>
                </Box>

                <Box sx={{ p: 3, flex: 1 }}>{renderTab()}</Box>
            </Box>
        </Box>
    );
}
