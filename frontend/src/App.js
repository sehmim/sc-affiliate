import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import Member from './pages/Member';
import Invite from './pages/Invite';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGroup from './pages/CreateGroup';
import GroupForm from './pages/GroupForm';
import GroupResult from './pages/GroupResult';
import GroupList from './pages/GroupList';
import JoinGroup from './pages/JoinGroup';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage/LandingPage';

import Auth from './utils/Auth';
import OnboardingPage from './pages/extension/OnboardingPage';
import ExtensionSettings from './pages/extension/ExtensionSettingsPage';

import AdminDashboard from './pages/admin/adminDashboard';
import EmailVerificationComponent from './pages/extension/EmailVerificationComponent';
import CampaignsPage from './pages/extension/campagins-page/CampaignsPage';

function App() {

  // Group results
  return (
      <Router>
          <Routes>
            <Route path='/login' element={<EmailVerificationComponent />}/>
            <Route path='/' element={ localStorage.getItem("user") ? <Home /> : <LandingPage />}/>
            <Route path='/creategroup' element={<Auth><CreateGroup /></Auth>}/>
            <Route path='/groupform' element={<Auth><GroupForm /></Auth>}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/groupresult' element={<Auth><GroupResult /></Auth>}/>
            <Route path='/member' element={<Auth><Member /></Auth>}/>
            <Route path='/invite' element={<Auth><Invite /></Auth>}/>
            <Route path='/profile' element={<Auth><Profile /></Auth>}/>
            <Route path='/grouplist' element={<Auth><GroupList /></Auth>}/>
            <Route path='/joingroup' element={<Auth><JoinGroup /></Auth>}/>
            <Route path='/settings' element={<Auth><Settings /></Auth>}/>
            <Route path='/onboard' element={<OnboardingPage/>}></Route>
            <Route path='/extension-settings' element={<Auth><ExtensionSettings/></Auth>}></Route>
            <Route path='/admin' element={<AdminDashboard />}></Route>
            <Route path='/campaigns' element={<Auth><CampaignsPage /></Auth>}></Route>
          </Routes>
      </Router>
      
      
  );
}

export default App;
