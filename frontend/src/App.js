import './App.css';

import AddCustomer from './component/AddCustomer.jsx';
import Board from './component/Board.jsx';
import AllCustomers from './component/AllCustomers.jsx';
import EditCustomer from './component/EditCustomer.jsx';
import Details from './component/CustomerDetail.jsx';
import LoginForm from './component/Login.jsx'
import AllOrders from './component/AllOrders.jsx';
import Orders from './component/Orders.jsx';
import SettingsPage from './component/Settings.jsx';
import Revenue from './component/Revenue.jsx';
import PrivateRoute from './component/PrivateRoute.jsx';
import LockedPage from './component/LockedPage.jsx';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/' element={<Navigate to="/dashboard" replace />} />
          <Route path='/dashboard' element={<PrivateRoute><LockedPage><Board /></LockedPage></PrivateRoute>} />
          <Route path='/add' element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
          <Route path='/all' element={<PrivateRoute><LockedPage><AllCustomers /></LockedPage></PrivateRoute>} />
          <Route path='/edit/:id' element={<PrivateRoute><EditCustomer /></PrivateRoute>} />
          <Route path='/info/:id' element={<PrivateRoute><Details /></PrivateRoute>} />
          <Route path='/Allorders' element={<PrivateRoute><AllOrders /></PrivateRoute>} />
          <Route path='/orders' element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path='/settings' element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path='/revenue' element={<PrivateRoute><LockedPage><Revenue /></LockedPage></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
