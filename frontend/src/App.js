import './App.css';

import NavBar from './component/NavBar.jsx';
import AddCustomer from './component/AddCustomer.jsx';
import Pending from './component/Pending.jsx';
import Checked from './component/Checked.jsx';
import AllCustomers from './component/AllCustomers.jsx';
import EditCustomer from './component/EditCustomer.jsx';
import Details from './component/CustomerDetail.jsx';
import Completed from './component/Completed.jsx';
import LoginForm from './component/Login.jsx'
import AllOrders from './component/AllOrders.jsx';
import Orders from './component/Orders.jsx';
import PrivateRoute from './component/PrivateRoute.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/' element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
          <Route path='/pending' element={<PrivateRoute><Pending /></PrivateRoute>} />
          <Route path='/checked' element={<PrivateRoute><Checked /></PrivateRoute>} />
          <Route path='/completed' element={<PrivateRoute><Completed /></PrivateRoute>} />
          <Route path='/all' element={<PrivateRoute><AllCustomers /></PrivateRoute>} />
          <Route path='/edit/:id' element={<PrivateRoute><EditCustomer /></PrivateRoute>} />
          <Route path='/info/:id' element={<PrivateRoute><Details /></PrivateRoute>} />
          <Route path='/Allorders' element={<PrivateRoute><AllOrders /></PrivateRoute>} />
          <Route path='/orders' element={<PrivateRoute><Orders /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
