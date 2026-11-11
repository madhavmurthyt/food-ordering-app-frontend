import React, { Component } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "../../common/header/Header";
import DetailsRCard from "../../common/details/DetailsRCard";
import DetailsMenuCard from "../../common/details/DetailsMenuCard";
import DetailsCartCard from "../../common/details/DetailsCartCard";
import PopularItems from "../../common/details/PopularItems";
import Notification from "../../common/notification/Notification";
import withRouter from "../../common/utils/withRouter";
import Footer from "../../common/footer/Footer";

class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurant: null,
            popularItems: [],
            cartItems: [],
            totalAmount: 0,
            totalItems: 0,
            notificationOpen: false,
            loading: false,
        };
        this.msgItemAdded = "Item added to cart!";
        this.msgItemRemoved = "Item removed from cart!";
        this.msgItemIncreased = "Item quantity increased by 1!";
        this.msgItemDecreased = "Item quantity decreased by 1!";
        this.msgLoginNotOk = "Please login first!";
        this.msgEmptyCart = "Please add an item to your cart!";
    }

    componentDidMount() {
        this.getRestaurant();
        this.getPopularItems();
    }

    render() {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
                <Header showSearch={false} />

                {this.state.loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress color="primary" />
                    </Box>
                )}

                {this.state.restaurant !== null && (
                    <>
                        <DetailsRCard restaurant={this.state.restaurant} />

                        <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                            <Grid container spacing={3}>
                                {/* Menu Section */}
                                <Grid item xs={12} md={7}>
                                    <PopularItems
                                        items={this.state.popularItems}
                                        onAddItem={this.addToCartHandler}
                                    />
                                    {this.state.restaurant.categories.map(
                                        (category) => (
                                            <DetailsMenuCard
                                                key={category.id}
                                                category={category}
                                                handleAddMenuItem={
                                                    this.addToCartHandler
                                                }
                                            />
                                        )
                                    )}
                                </Grid>

                                {/* Cart Sidebar */}
                                <Grid item xs={12} md={5}>
                                    <DetailsCartCard
                                        cartItems={this.state.cartItems}
                                        totalAmount={this.state.totalAmount}
                                        totalItems={this.state.totalItems}
                                        handleAddCartItem={
                                            this.increaseCartItemHandler
                                        }
                                        handleRemoveCartItem={
                                            this.decreaseCartItemHandler
                                        }
                                        handleCheckoutClick={this.checkout}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {this.state.notificationOpen && (
                            <Notification
                                messageText={this.state.messageText}
                                open={this.state.notificationOpen}
                                onClose={this.closeNotification}
                            />
                        )}
                    </>
                )}
                <Footer />
            </Box>
        );
    }

    getRestaurant() {
        const headers = { Accept: "application/json" };
        let url =
            this.props.baseUrl + "restaurant/" + this.props.params.restaurantId;
        this.setState({ loading: true });
        return fetch(url, { method: "GET", headers })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({
                    restaurant: jsonResponse,
                    loading: false,
                });
            })
            .catch((error) => {
                console.log("error fetching restaurant", error);
                this.setState({ loading: false });
            });
    }

    getPopularItems() {
        const headers = { Accept: "application/json" };
        let url =
            this.props.baseUrl +
            "item/restaurant/" +
            this.props.params.restaurantId;
        fetch(url, { method: "GET", headers })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({ popularItems: jsonResponse || [] });
            })
            .catch((error) => {
                console.log("error fetching popular items", error);
            });
    }

    showNotification = (message) =>
        this.setState({ messageText: message, notificationOpen: true });
    closeNotification = () =>
        this.setState({ messageText: null, notificationOpen: false });

    addToCartHandler = (item) => {
        const existingIndex = this.state.cartItems.findIndex(
            (cItem) => cItem.id === item.id
        );
        let updatedCartItems;

        if (existingIndex !== -1) {
            updatedCartItems = this.state.cartItems.map((cItem, i) => {
                if (i === existingIndex) {
                    return {
                        ...cItem,
                        quantity: cItem.quantity + 1,
                        price: cItem.price + item.price,
                    };
                }
                return cItem;
            });
        } else {
            const newItem = {
                id: item.id,
                name: item.item_name,
                type: item.item_type,
                quantity: 1,
                price: item.price,
                itemPrice: item.price,
            };
            updatedCartItems = [...this.state.cartItems, newItem];
        }

        this.setState({
            cartItems: updatedCartItems,
            totalAmount: this.state.totalAmount + item.price,
            totalItems: this.state.totalItems + 1,
        });
        this.showNotification(this.msgItemAdded);
    };

    increaseCartItemHandler = (item) => {
        const updatedCartItems = this.state.cartItems.map((cItem) => {
            if (cItem.id === item.id) {
                return {
                    ...cItem,
                    quantity: cItem.quantity + 1,
                    price: cItem.price + item.itemPrice,
                };
            }
            return cItem;
        });
        this.setState({
            cartItems: updatedCartItems,
            totalAmount: this.state.totalAmount + item.itemPrice,
            totalItems: this.state.totalItems + 1,
        });
        this.showNotification(this.msgItemIncreased);
    };

    decreaseCartItemHandler = (item) => {
        const index = this.state.cartItems.findIndex(
            (cItem) => cItem.id === item.id
        );
        const existing = this.state.cartItems[index];
        let updatedCartItems;
        let message;

        if (existing.quantity === 1) {
            updatedCartItems = this.state.cartItems.filter(
                (_, i) => i !== index
            );
            message = this.msgItemRemoved;
        } else {
            updatedCartItems = this.state.cartItems.map((cItem, i) => {
                if (i === index) {
                    return {
                        ...cItem,
                        quantity: cItem.quantity - 1,
                        price: cItem.price - item.itemPrice,
                    };
                }
                return cItem;
            });
            message = this.msgItemDecreased;
        }

        this.setState({
            cartItems: updatedCartItems,
            totalAmount: this.state.totalAmount - item.itemPrice,
            totalItems: this.state.totalItems - 1,
        });
        this.showNotification(message);
    };

    checkout = () => {
        if (this.state.cartItems.length === 0) {
            this.showNotification(this.msgEmptyCart);
        } else if (
            this.state.cartItems.length > 0 &&
            sessionStorage.getItem("access-token") == null
        ) {
            this.showNotification(this.msgLoginNotOk);
        } else {
            this.props.navigate("/checkout/", {
                state: {
                    orderItems: this.state.cartItems,
                    totalAmount: this.state.totalAmount,
                    restaurant: this.state.restaurant,
                },
            });
        }
    };
}

export default withRouter(Details);
