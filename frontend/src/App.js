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

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />        
        <Routes>
          <Route path='/' element={<AddCustomer />} />
          <Route path='/pending' element={<Pending />} />
          <Route path='/checked' element={<Checked />} />
          <Route path='/completed' element={<Completed />} />
          <Route path='/all' element={<AllCustomers />} />
          <Route path='/edit/:id' element={<EditCustomer />} />
          <Route path='/info/:id' element={<Details />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/Allorders' element={<AllOrders />} />
          <Route path='/orders' element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
