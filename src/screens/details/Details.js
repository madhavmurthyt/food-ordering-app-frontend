import React, {Component} from "react";
import Header from "../../common/header/Header";
import Typography from "@material-ui/core/Typography";
import './Details.css';
import DetailsRCard from "../../common/details/DetailsRCard";
import DetailsMenuCard from "../../common/details/DetailsMenuCard";
import DetailsCartCard from "../../common/details/DetailsCartCard";
import Notification from "../../common/notification/Notification";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CircularProgress from "@material-ui/core/CircularProgress";

// Constants for varying screen size
const withMediaQuery = () => Component => props => {
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const isMediumScreen = useMediaQuery('(max-width:1000px)');
    return <Component isSmallScreen={isSmallScreen} isMediumScreen={isMediumScreen} {...props} />;
};

// Details page rendering
class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurant: null,
            cartItem: {id:null, name:null, type:null, quantity:0, price:0, itemPrice:0},
            cartItems: [],
            totalAmount: 0,
            totalItems: 0,
            notificationOpen: false,
            loggedIn: sessionStorage.getItem("access-token") !== null,
        }
        this.handleAddMenuItem = this.handleAddMenuItem.bind(this);
        this.handleAddCartItem = this.handleAddCartItem.bind(this);
        this.handleRemoveCartItem = this.handleRemoveCartItem.bind(this);
        this.handleCheckoutClick = this.handleCheckoutClick.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
        this.msgItemAdded = "Item added to cart!";
        this.msgItemRemoved = "item removed from cart!"
        this.msgItemIncreased = "Item quantity increased by 1!";
        this.msgItemDecreased = "Item quantity decreased by 1!";
        this.msgLoginNotOk = "Please login first!";
        this.msgEmptyCart = "Please add an item to your cart!";
    }

    handleAddMenuItem = (item) => this.addToCartHandler(item);
    handleAddCartItem = (item) => this.increaseCartItemHandler(item);
    handleRemoveCartItem = (item) => this.decreaseCartItemHandler(item);
    handleCheckoutClick = () => this.checkout();

    componentDidMount() {
        this.getRestaurant();
    }

    render() {
        return (
            <div>
                {this.state.loading === true ?
                    <Typography className="loading-spinner" variant="h4"
                                color="textSecondary">
                        <CircularProgress disableShrink />

                    </Typography>
                    : ""
                }
                {this.state.restaurant !== null ?
                    <div>
                        {/*Header section*/}
                        <Header searchHandler={this.searchHandler}/>

                        {/*Restaurant Details section*/}
                        <div className="restaurant-section">
                            <DetailsRCard restaurant={this.state.restaurant} isSmallScreen={this.props.isSmallScreen}/>
                        </div>
                        <div className={this.props.isSmallScreen ? "section2SM" : "section2" }>

                            {/*Restaurant Menu section*/}
                            <div className={this.props.isSmallScreen ? "item-sectionSM" : "item-section"}>
                                {this.state.restaurant.categories.map((category, index) => (
                                    <span key={category.id + "category"}>
                                        <DetailsMenuCard category={category}
                                                         handleAddMenuItem={this.handleAddMenuItem}
                                                         isSmallScreen={this.props.isSmallScreen}
                                                         isMediumScreen={this.props.isMediumScreen}/>
                                    </span>
                                ))
                                }
                            </div>

                            {/*Checkout Cart section*/}
                            <div className={this.props.isSmallScreen ? "cart-sectionSM" : (this.props.isMediumScreen ? "cart-sectionM" : "cart-section") }>
                                <DetailsCartCard cartItems={this.state.cartItems}
                                                 totalAmount={this.state.totalAmount}
                                                 totalItems={this.state.totalItems}
                                                 handleAddCartItem={this.handleAddCartItem}
                                                 handleRemoveCartItem={this.handleRemoveCartItem}
                                                 handleCheckoutClick={this.handleCheckoutClick}
                                                 isSmallScreen={this.props.isSmallScreen}
                                                 isMediumScreen={this.props.isMediumScreen}/>
                            </div>
                        </div>
                        {this.state.notificationOpen === true ?
                            <Notification messageText={this.state.messageText} open={this.state.notificationOpen}
                                          onClose={this.closeNotification}/>
                            : ""
                        }
                    </div>
                    : ""}
            </div>
        )
    }

    // Fetches the restaurant from backend
    getRestaurant() {
        const headers = {'Accept': 'application/json'};
        let that = this;
        let url = this.props.baseUrl + '/restaurant/' + this.props.match.params.restaurantId;
        that.setState({loading: true})
        return fetch(url,
            {method: 'GET', headers}
        ).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            this.setState({
                restaurant: jsonResponse,
                address: jsonResponse.address,
                categories: jsonResponse.categories,
                loading: false,
            })
        }).catch((error) => {
            console.log('error user data', error);
        });
    }

    // show notification on Snackerbar
    showNotification = (message) => this.setState({messageText: message, notificationOpen: true});
    // close Snackerbar notification
    closeNotification = () => this.setState({messageText: null, notificationOpen: false});

    addToCartHandler = (item) => {
        const existingIndex = this.state.cartItems.findIndex(cItem => cItem.id === item.id);
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
    }

    increaseCartItemHandler = (item) => {
        const updatedCartItems = this.state.cartItems.map(cItem => {
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
    }

    decreaseCartItemHandler = (item) => {
        const index = this.state.cartItems.findIndex(cItem => cItem.id === item.id);
        const existing = this.state.cartItems[index];
        let updatedCartItems;
        let message;

        if (existing.quantity === 1) {
            updatedCartItems = this.state.cartItems.filter((_, i) => i !== index);
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
    }

    // function to navigate to checkout page
    checkout = () => {
        if(this.state.cartItems.length === 0){
            this.showNotification(this.msgEmptyCart);
        }
        else if(this.state.cartItems.length > 0 && sessionStorage.getItem("access-token") == null){
            this.showNotification(this.msgLoginNotOk);
        }
        else {
            this.props.history.push({
                pathname: '/checkout/',
                state: {
                    orderItems: this.state.cartItems,
                    totalAmount: this.state.totalAmount, restaurant: this.state.restaurant
                }
            });
        }
    }
}

export default (withMediaQuery() (Details));