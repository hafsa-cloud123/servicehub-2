import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import AddService from './pages/AddService.jsx';
import EditService from './pages/EditService.jsx';
import Categories from './pages/Categories.jsx';
import NotFound from './pages/NotFound.jsx';

// Each URL is matched to one page component.
export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/new" element={<AddService />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/services/:id/edit" element={<EditService />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
