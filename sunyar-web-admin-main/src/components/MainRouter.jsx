import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import ContextComponent from './context/ContextComponent';
import MainDashboard from './dashboard/MainDashboard';
import Login from './signin/Login';

const MainRouter = () => {

    const history = useHistory()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            history.replace("/login");
        }
    });
    
    return (
        <ContextComponent>
            <Switch>
                <Route path='/login' render={() => <Login />} />
                <Route path='/' render={() => <MainDashboard />} />
            </Switch>
        </ContextComponent>);
}

export default MainRouter;