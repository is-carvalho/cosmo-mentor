import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./Auth";

export const PrivateRoute = ({ component: Component, ...rest}) =>(

    <Route {...rest} render= {props =>(
        <React.Fragment>
        {isAuthenticated().status && (rest.type === undefined || 
        rest.type.split(',').indexOf(isAuthenticated().tipo) > -1) 
        ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/', state: { from: props.location}}} />
        )}
        </React.Fragment>
    )}/>
    
)