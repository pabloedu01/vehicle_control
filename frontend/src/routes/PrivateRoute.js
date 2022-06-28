import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {APICore} from "../helpers/api/apiCore";

const apiCore = new APICore();
 
const PrivateRoute = ({ component: RouteComponent, roles, ...rest } ) => {
    const history = useNavigate();

    const checkLogin = () => {
        if (apiCore.getLoggedInUser()) {
            apiCore.post('/auth/check-token').then(() => {

            }, (error) => {
                history('/login');
            });
        } else {
            history('/login');
        }
    };

    useEffect(() => {
         checkLogin();
    }, []);

    return <RouteComponent   {...rest}/>;
};

export default PrivateRoute;
