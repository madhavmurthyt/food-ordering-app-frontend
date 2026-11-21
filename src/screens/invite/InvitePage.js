import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Config from "../../common/utils/Config";
import { isLoggedIn, getAccessToken } from "../../common/utils/AuthGuard";
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";

export default function InvitePage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [invite, setInvite] = useState(null);
    const [error, setError] = useState("");
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    useEffect(() => {
        const uri = Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Validate Invite").uri +
            "/" + token;
        fetch(uri, { headers: { Accept: "application/json" } })
            .then((r) => r.json())
            .then((data) => {
                if (data.status === "valid") {
                    setInvite(data);
                } else {
                    setError(data.message || "This invite link is no longer valid.");
                }
                setLoading(false);
            })
            .catch(() => { setError("Failed to validate invite link."); setLoading(false); });
    }, [token]);

    const handleClaim = () => {
        if (!isLoggedIn()) {
            sessionStorage.setItem("invite-redirect", token);
            navigate("/login");
            return;
        }
        setClaiming(true);
        const uri = Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Claim Invite").uri +
            "/" + token + "/claim";
        fetch(uri, {
            method: "POST",
            headers: {
                Accept: "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
        })
            .then((r) => {
                if (!r.ok) throw r;
                return r.json();
            })
            .then((data) => {
                setClaiming(false);
                setClaimed(true);
                if (data.role) sessionStorage.setItem("role", data.role);
            })
            .catch((err) => {
                setClaiming(false);
                if (err.text) {
                    err.text().then((msg) => {
                        try { setError(JSON.parse(msg).message); } catch { setError("Failed to claim invite."); }
                    });
                } else {
                    setError("Failed to claim invite.");
                }
            });
    };

    useEffect(() => {
        if (isLoggedIn() && invite && !claimed) {
            const pending = sessionStorage.getItem("invite-redirect");
            if (pending === token) {
                sessionStorage.removeItem("invite-redirect");
                handleClaim();
            }
        }
    });

    if (loading) {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
                <Header showSearch={false} />
                <Box sx={{ display: "flex", justifyContent: "center", py: 16 }}>
                    <CircularProgress />
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            <Header showSearch={false} />
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8, px: 2 }}>
                <Paper sx={{ maxWidth: 480, width: "100%", p: 4, textAlign: "center" }}>
                    <RestaurantIcon sx={{ fontSize: 56, color: "primary.main", mb: 2 }} />

                    {error ? (
                        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                    ) : claimed ? (
                        <>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                You're all set!
                            </Typography>
                            <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                                You are now the owner of <strong>{invite.restaurant_name}</strong>.
                            </Typography>
                            <Button variant="contained" onClick={() => navigate("/")}>
                                Go to Home
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                {invite.restaurant_name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                                Create your account to manage this restaurant.
                            </Typography>
                            {isLoggedIn() ? (
                                <Button variant="contained" onClick={handleClaim} disabled={claiming}>
                                    {claiming ? "Claiming..." : "Claim Restaurant"}
                                </Button>
                            ) : (
                                <Button variant="contained" onClick={() => {
                                    sessionStorage.setItem("invite-redirect", token);
                                    navigate("/login");
                                }}>
                                    Login / Sign Up to Claim
                                </Button>
                            )}
                        </>
                    )}
                </Paper>
            </Box>
            <Footer />
        </Box>
    );
}
