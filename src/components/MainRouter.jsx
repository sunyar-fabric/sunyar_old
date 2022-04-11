import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import Home from './common/Home';
import Header from './common/Header';
import Help from './common/Help';
import ContextComponent from './context/ContextComponent';
import Login from './signup/Login';
import Register from './signup/Register';
import SignupRouter from './signup/SignupRouter';


const MainRouter = () => {

    return (
        <ContextComponent>
            <Switch>
                <Route path="/signup" render={() => <SignupRouter />} />
                <Route path="/help" render={() => <Help />} />
                <Route path='/' exact render={() => <Home />} />
            </Switch>
        </ContextComponent>
    );
}

export default MainRouter;