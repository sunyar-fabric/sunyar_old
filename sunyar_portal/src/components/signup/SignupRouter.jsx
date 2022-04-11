
import React from "react";
import { Route, Switch } from "react-router";
import Login from "./Login";
import Register from "./Register";

const SignupRouter = () => {

    return (
        <Switch>
            <Route path="/signup/register" render={() => <Register />} />
            <Route path="/signup/login/:locationLogin" render={(props) => <Login url={props.match.params.locationLogin}  />} />
        </Switch>
    );
}

export default SignupRouter;
