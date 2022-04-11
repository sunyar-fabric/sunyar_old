import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Menu from './Menu';
import { Route, Switch } from 'react-router';
import EditNeedy from './EditNeedy';
import Personal from './Personal';
import CommonBaseType from './CommonBaseType';
import CharityAccount from './CharityAccount';
import NeedyDefine from './NeedyDefine';
import Plan from './Plan';
import Settelment from './Settelment';
import Roles from './Roles';
import Users from './Users';


const MainDashboard = () => {


    return (

        <div className=''>
            <Header />
            <div className='d-flex h-100'>
                <Menu />
                <div className='w-100 admin-card'>
                    <Switch>

                        <Route path='/baseInfo/commonBaseType' render={(props) => <CommonBaseType />} />

                        <Route path='/baseInfo/charityAccount' render={(props) => <CharityAccount />} />

                        <Route path='/userManagement/personal' render={(props) => <Personal />} />

                        <Route path='/editNeedy/:id' render={(props) => <EditNeedy personId={props.match.params.id} />} />

                        <Route path='/beneficiary/needyDefine' render={(props) => <NeedyDefine />} />

                        <Route path='/plan' render={(props) => <Plan />} />

                        <Route path='/operation/settelment' render={(props) => <Settelment />} />
                        
                        <Route path='/userManagement/roles' render={(props) => <Roles />} />

                        <Route path='/userManagement/users' render={(props) => <Users />} />

                    </Switch>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MainDashboard;