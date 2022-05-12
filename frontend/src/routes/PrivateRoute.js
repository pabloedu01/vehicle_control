import React, { useState, useEffect } from 'react';
import { Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import UseApi from '../services/api';
 
 
const PrivateRoute = ({ component: RouteComponent, roles, ...rest } ) => {
    let location = useLocation();
    const api = UseApi();
    const history = useNavigate();
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedinuser] = useState('');

    // const checkLogin = async () => {
    //     if (api.getToken()) {
    //         const result = await api.validateToken();
    //         if (result.msg === "¡Success!") {
    //             setLoading(false);
    //             setLoggedinuser(true);
    //         } else {
    //             alert(result.msg);
    //             history('/login');
    //         }
    //     } else {
    //         history('/login');
    //     }
    // };

    useEffect(() => {
        // checkLogin();
    }, []);

    return <RouteComponent   {...rest}/>;
};

export default PrivateRoute;
