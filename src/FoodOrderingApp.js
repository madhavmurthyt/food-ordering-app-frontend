import React, { useEffect } from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import Home from "./screens/home/Home";
import Details from "./screens/details/Details";
import Checkout from "./screens/checkout/Checkout";
import Profile from "./screens/profile/Profile"
import Login from "./screens/login/Login"
import Admin from "./screens/admin/Admin"
import InvitePage from "./screens/invite/InvitePage"
import MyRestaurants from "./screens/owner/MyRestaurants"
import ForRestaurants from "./screens/marketing/ForRestaurants"
import OrderTracking from "./screens/order/OrderTracking"
import Config from "./common/utils/Config";

const baseUrl = Config.endpointPrefix + "/api/";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

export default function FoodOrderingApp() {
    return (
        <>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<Home baseUrl={baseUrl}/>}/>
            <Route path="/restaurant/:restaurantId" element={<Details baseUrl={baseUrl}/>}/>
            <Route path="/checkout" element={<Checkout baseUrl={baseUrl}/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/invite/:token" element={<InvitePage/>}/>
            <Route path="/my-restaurant" element={<MyRestaurants/>}/>
            <Route path="/for-restaurants" element={<ForRestaurants/>}/>
            <Route path="/order/:orderId/track" element={<OrderTracking/>}/>
        </Routes>
        </>
    );
}
