import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BriefingRoom from './pages/BriefingRoom'
import DeclassifiedArchive from './pages/DeclassifiedArchive'
import TheAgency from './pages/TheAgency'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/briefing" element={<BriefingRoom />} />
        <Route path="/declassified" element={<DeclassifiedArchive />} />
        <Route path="/agency" element={<TheAgency />} />
      </Routes>
    </BrowserRouter>
  )
}
