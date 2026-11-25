import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CustomersPage from './pages/CustomersPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/customers" replace />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
