import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AgentOrders from './pages/agent/AgentDashboard';
import CustomerHome from './pages/customer/CustomerHome';
import PrivateRoute from './components/PrivateRoute';

// Admin Pages
import SidebarLayout from './pages/admin/SidebarLayout';
import ManageVendors from './pages/admin/ManageVendors';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageAgents from './pages/admin/ManageAgents';
import SalesChart from './pages/admin/SalesChart';

// Agent Pages
import AgentSidebarLayout from './pages/agent/AgentSidebarLayout';
import AssignedOrders from './pages/agent/AssignedOrders';
import UpdateStatus from './pages/agent/UpdateStatus';
import DeliveryTimeline from './pages/agent/DeliveryTimeline';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import HomePage from './pages/vendor/VendorHome';
import AddProducts from './pages/vendor/VendorAddProduct';
import Products from './pages/vendor/VendorProducts';
import StockTracker from './pages/vendor/VendorManageStock';
import VendorSales from './pages/vendor/VendorViewSales';
import Orders from './pages/vendor/VendorOrders'; 
import VendorRevenueChart from './pages/vendor/VendorRevenueChart'; 

// Customer Pages & Layout
import Wishlist from './pages/customer/Wishlist';
import Cart from './pages/customer/CartPage';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerLayout from './pages/customer/CustomerLayout';
import PaymentSuccess from './pages/customer/PaymentSuccess'; 
import CategoryPage from './pages/customer/CategoryPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route
          path="/customer"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <CustomerLayout />
            </PrivateRoute>
          }
        >
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="/customer/category/:categoryName" element={<CategoryPage />} /> {/* ✅ Added route */}
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <SidebarLayout>
                <AdminDashboard />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <SidebarLayout>
                <ManageVendors />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <SidebarLayout>
                <ManageCustomers />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/agents"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <SidebarLayout>
                <ManageAgents />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/sales-chart"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <SidebarLayout>
                <SalesChart />
              </SidebarLayout>
            </PrivateRoute>
          }
        />

        {/* Vendor Routes */}
        <Route
          path="/vendor/dashboard"
          element={
            <PrivateRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </PrivateRoute>
          }
        >
          <Route path="add-products" element={<AddProducts />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="homepage" element={<HomePage />} />
          <Route path="stock-tracker" element={<StockTracker />} />
          <Route path="sales" element={<VendorSales />} />
          <Route path="revenue-chart" element={<VendorRevenueChart />} /> 
        </Route>

        {/* Agent Routes */}
        <Route
          path="/agent/orders"
          element={
            <PrivateRoute allowedRoles={['agent']}>
              <AgentSidebarLayout>
                <AgentOrders />
              </AgentSidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/agent/assigned-orders"
          element={
            <PrivateRoute allowedRoles={['agent']}>
              <AgentSidebarLayout>
                <AssignedOrders />
              </AgentSidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/agent/update-status"
          element={
            <PrivateRoute allowedRoles={['agent']}>
              <AgentSidebarLayout>
                <UpdateStatus />
              </AgentSidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/agent/delivery-timeline"
          element={
            <PrivateRoute allowedRoles={['agent']}>
              <AgentSidebarLayout>
                <DeliveryTimeline />
              </AgentSidebarLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
