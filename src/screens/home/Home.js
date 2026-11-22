import React, { Component } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import Header from "../../common/header/Header";
import HeroBanner from "../../common/home/HeroBanner";
import CategoryBar from "../../common/home/CategoryBar";
import HomeRCard from "../../common/home/HomeRCard";
import withRouter from "../../common/utils/withRouter";
import Footer from "../../common/footer/Footer";
import Config from "../../common/utils/Config";

class Home extends Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            categories: [],
            activeCategory: null,
            loading: false,
            favoriteIds: new Set(),
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.getRestaurants();
        this.getCategories();
        this.fetchFavorites();
    }

    handleRestaurantNavigation = (restaurantId) => {
        this.props.navigate("/restaurant/" + restaurantId);
    };

    render() {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
                <Header searchHandler={this.searchHandler} showSearch={false} />
                <HeroBanner searchHandler={this.searchHandler} />

                {this.state.categories.length > 0 && (
                    <CategoryBar
                        categories={this.state.categories}
                        activeCategory={this.state.activeCategory}
                        onCategoryClick={this.onCategoryClick}
                    />
                )}

                <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                    {this.state.loading ? (
                        <Grid container spacing={3}>
                            {[1, 2, 3, 4].map((i) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                    <Card sx={{ maxWidth: 320, mx: "auto" }}>
                                        <Skeleton
                                            variant="rectangular"
                                            height={200}
                                        />
                                        <Box sx={{ p: 2 }}>
                                            <Skeleton width="80%" />
                                            <Skeleton width="60%" />
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : this.state.restaurants.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                            >
                                No restaurant with the given name.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {this.state.restaurants.map((restaurant) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    key={restaurant.id}
                                >
                                    <HomeRCard
                                        restaurant={restaurant}
                                        handleRestaurantNavigation={
                                            this.handleRestaurantNavigation
                                        }
                                        showFavorite={this.isLoggedIn()}
                                        isFavorite={this.state.favoriteIds.has(restaurant.id)}
                                        onToggleFavorite={this.toggleFavorite}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
                <Footer />
            </Box>
        );
    }

    getRestaurants = () => {
        const headers = { Accept: "application/json" };
        let url = this.props.baseUrl + "restaurant";
        this.setState({ loading: true });
        return fetch(url, { method: "GET", headers })
            .then((response) => {
                if (!response.ok) throw response;
                return response.json();
            })
            .then((jsonResponse) => {
                this.setState({
                    restaurants: jsonResponse.restaurants || [],
                    loading: false,
                });
            })
            .catch((error) => {
                console.log("error fetching restaurants", error);
                this.setState({ restaurants: [], loading: false });
            });
    };

    getCategories = () => {
        const headers = { Accept: "application/json" };
        let url = this.props.baseUrl + "category";
        return fetch(url, { method: "GET", headers })
            .then((response) => {
                if (!response.ok) throw response;
                return response.json();
            })
            .then((jsonResponse) => {
                this.setState({ categories: jsonResponse.categories || [] });
            })
            .catch((error) => {
                console.log("error fetching categories", error);
            });
    };

    onCategoryClick = (category) => {
        this.setState({ activeCategory: category });
        if (category === null) {
            this.getRestaurants();
        } else {
            const headers = { Accept: "application/json" };
            let url =
                this.props.baseUrl + "restaurant/category/" + category.id;
            this.setState({ loading: true });
            fetch(url, { method: "GET", headers })
                .then((response) => {
                    if (!response.ok) throw response;
                    return response.json();
                })
                .then((jsonResponse) => {
                    this.setState({
                        restaurants: jsonResponse.restaurants || [],
                        loading: false,
                    });
                })
                .catch((error) => {
                    console.log("error fetching by category", error);
                    this.setState({ restaurants: [], loading: false });
                });
        }
    };

    isLoggedIn = () => sessionStorage.getItem("access-token") != null;

    fetchFavorites = () => {
        if (!this.isLoggedIn()) return;
        const uri = Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Customer Favorites").uri;
        fetch(uri, {
            headers: {
                Accept: "application/json",
                authorization: "Bearer " + sessionStorage.getItem("access-token"),
            },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then((data) => {
                const ids = new Set((data.restaurants || []).map((r) => r.id));
                this.setState({ favoriteIds: ids });
            })
            .catch(() => {});
    };

    toggleFavorite = (restaurantId) => {
        if (!this.isLoggedIn()) return;
        const isFav = this.state.favoriteIds.has(restaurantId);
        const uri = Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Customer Favorites").uri +
            "/" + restaurantId;
        fetch(uri, {
            method: isFav ? "DELETE" : "POST",
            headers: {
                Accept: "application/json",
                authorization: "Bearer " + sessionStorage.getItem("access-token"),
            },
        })
            .then((r) => { if (!r.ok) throw r; })
            .then(() => {
                const updated = new Set(this.state.favoriteIds);
                if (isFav) updated.delete(restaurantId);
                else updated.add(restaurantId);
                this.setState({ favoriteIds: updated });
            })
            .catch(() => {});
    };

    searchHandler = (event) => {
        const headers = { Accept: "application/json" };
        let url =
            this.props.baseUrl + "restaurant/name/" + event.target.value;
        this.setState({ loading: true, activeCategory: null });
        if (event.target.value === "") {
            this.getRestaurants();
        } else {
            return fetch(url, { method: "GET", headers })
                .then((response) => {
                    if (!response.ok) throw response;
                    return response.json();
                })
                .then((jsonResponse) => {
                    this.setState({
                        restaurants: jsonResponse.restaurants || [],
                        loading: false,
                    });
                })
                .catch((error) => {
                    console.log("error searching restaurants", error);
                    this.setState({ restaurants: [], loading: false });
                });
        }
    };
}

export default withRouter(Home);
