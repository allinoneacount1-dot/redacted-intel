import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const BriefingRoom = lazy(() => import('./pages/BriefingRoom'))
const DeclassifiedArchive = lazy(() => import('./pages/DeclassifiedArchive'))
const TheAgency = lazy(() => import('./pages/TheAgency'))

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0C0C0C',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '0.8rem',
            letterSpacing: '0.3em',
            color: '#39FF6E',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          LOADING...
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/briefing" element={<BriefingRoom />} />
          <Route path="/declassified" element={<DeclassifiedArchive />} />
          <Route path="/agency" element={<TheAgency />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
