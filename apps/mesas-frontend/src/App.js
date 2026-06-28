import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TablesPage from './pages/TablesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TablesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
