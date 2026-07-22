import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import Aktuel from './pages/Aktuel';
import AktuelDetail from './pages/AktuelDetail';
import AppOnly from './pages/AppOnly';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detay/:id" element={<Detail />} />
      <Route path="/favoriler" element={<Favorites />} />
      <Route path="/aktuel" element={<Aktuel />} />
      <Route path="/aktuel/:store" element={<AktuelDetail />} />
      <Route
        path="/profil"
        element={
          <AppOnly
            icon="👤"
            title="Profilim"
            body="Rütbe, puan ve bildirim ayarların için İNDİVA uygulamasını indirin."
          />
        }
      />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
