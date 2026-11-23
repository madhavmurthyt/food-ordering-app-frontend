import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import Notification from "../notification/Notification";
import Config from "../utils/Config";
import brand from "../../theme/brand";

const withMediaQuery = () => (Component) => (props) => {
    const isSmallScreen = useMediaQuery("(max-width:650px)");
    return <Component isSmallScreen={isSmallScreen} {...props} />;
};

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") != null,
            messageText: null,
            notificationOpen: false,
            anchorEl: null,
        };
    }

    goHomeHandler = () => {
        window.location.href = "/";
    };

    openMenuHandler = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    logout = () => {
        const accessToken = sessionStorage.getItem("access-token");
        if (accessToken) {
            const headers = {
                Accept: "application/json",
                authorization: "Bearer " + accessToken,
            };
            fetch(Config.endpointPrefix + "/api/customer/logout", {
                method: "POST",
                headers,
            }).catch(() => {});
        }
        sessionStorage.removeItem("access-token");
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("first-name");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("invite-redirect");
        this.setState({ loggedIn: false });
        this.handleMenuClose();
    };

    showNotification = (message) =>
        this.setState({ messageText: message, notificationOpen: true });
    closeNotification = () =>
        this.setState({ messageText: null, notificationOpen: false });

    render() {
        const firstName = sessionStorage.getItem("first-name") || "";
        const initial = firstName.charAt(0).toUpperCase();

        return (
            <Box>
                <AppBar position="sticky" elevation={0}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            flexDirection: this.props.isSmallScreen
                                ? "column"
                                : "row",
                            alignItems: this.props.isSmallScreen
                                ? "flex-start"
                                : "center",
                            justifyContent: "space-between",
                            gap: 1,
                            py: 1,
                        }}
                    >
                        {/* Logo + Brand */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            onClick={this.goHomeHandler}
                        >
                            <IconButton edge="start" color="primary" size="large">
                                <FastfoodIcon fontSize="large" />
                            </IconButton>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "primary.main",
                                    ml: -0.5,
                                }}
                            >
                                {brand.appName}
                            </Typography>
                        </Box>

                        {/* Search Bar */}
                        {this.props.showSearch === true && (
                            <Paper
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "24px",
                                    bgcolor: "#F0F0F0",
                                    px: 2,
                                    py: 0.5,
                                    width: this.props.isSmallScreen
                                        ? "100%"
                                        : 400,
                                    transition: "width 0.3s",
                                }}
                            >
                                <SearchIcon
                                    sx={{ color: "text.secondary", mr: 1 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search by Restaurant Name"
                                    onChange={this.props.searchHandler}
                                    style={{
                                        border: "none",
                                        outline: "none",
                                        background: "transparent",
                                        width: "100%",
                                        fontSize: "14px",
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#1A1A2E",
                                    }}
                                />
                            </Paper>
                        )}

                        {/* Auth Section */}
                        {this.state.loggedIn === false ? (
                            <Button
                                component={Link}
                                to="/login"
                                variant="contained"
                                color="primary"
                                sx={{
                                    borderRadius: "24px",
                                    px: 3,
                                    textTransform: "none",
                                }}
                            >
                                Login
                            </Button>
                        ) : (
                            <Box>
                                <Button
                                    onClick={this.openMenuHandler}
                                    sx={{
                                        textTransform: "none",
                                        color: "text.primary",
                                        gap: 1,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: "primary.main",
                                            width: 36,
                                            height: 36,
                                            fontSize: 16,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {initial}
                                    </Avatar>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {firstName}
                                    </Typography>
                                </Button>
                                <Menu
                                    anchorEl={this.state.anchorEl}
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={this.handleMenuClose}
                                    transformOrigin={{
                                        horizontal: "right",
                                        vertical: "top",
                                    }}
                                    anchorOrigin={{
                                        horizontal: "right",
                                        vertical: "bottom",
                                    }}
                                    slotProps={{
                                        paper: {
                                            sx: {
                                                borderRadius: 2,
                                                mt: 1,
                                                minWidth: 160,
                                                boxShadow:
                                                    "0 4px 20px rgba(0,0,0,0.1)",
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem
                                        component={Link}
                                        to="/profile"
                                        onClick={this.handleMenuClose}
                                        sx={{ py: 1.5 }}
                                    >
                                        My Profile
                                    </MenuItem>
                                    {sessionStorage.getItem("role") === "RESTAURANT_OWNER" && (
                                        <MenuItem
                                            component={Link}
                                            to="/my-restaurant"
                                            onClick={this.handleMenuClose}
                                            sx={{ py: 1.5 }}
                                        >
                                            My Restaurant
                                        </MenuItem>
                                    )}
                                    {sessionStorage.getItem("role") === "ADMIN" && (
                                        <MenuItem
                                            component={Link}
                                            to="/admin"
                                            onClick={this.handleMenuClose}
                                            sx={{ py: 1.5 }}
                                        >
                                            Admin Dashboard
                                        </MenuItem>
                                    )}
                                    <MenuItem
                                        onClick={this.logout}
                                        sx={{ py: 1.5 }}
                                    >
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Toolbar>
                </AppBar>

                <Notification
                    messageText={this.state.messageText}
                    open={this.state.notificationOpen}
                    onClose={this.closeNotification}
                />
            </Box>
        );
    }
}

export default withMediaQuery()(Header);
