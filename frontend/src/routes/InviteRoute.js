import React from 'react';
 
const InviteRoute = ({ component: RouteComponent, roles, ...rest } ) => {
    return <RouteComponent   {...rest}/>;
};

export default InviteRoute;
