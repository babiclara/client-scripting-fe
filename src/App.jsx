import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CustomersPage from './pages/CustomersPage'
import LoginPage from './pages/LoginPage'
import BillsPage from './pages/BillsPage'
import ItemsPage from './pages/ItemsPage'
import CustomerFormPage from './pages/CustomerFormPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/customers" replace />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/new" element={<CustomerFormPage />} />
        <Route path="customers/:customerId/bills" element={<BillsPage />} />
        <Route path="bills/:billId/items" element={<ItemsPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
