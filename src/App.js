import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KoreaMovie } from './components/KoreaMovie';
import { LoginPage } from './components/LoginPage';
import { NotFound } from './components/NotFound';

const isLogin = false;

function App() {
  return (
    // <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* isLogin ? <Route path="/KoreaMovie" element={<KoreaMovie />} /> : <Route path="/*" element={<NotFound />} /> */}
          <Route path="/KoreaMovie" element={<KoreaMovie />} />
          <Route path="/*" element={<NotFound />} /> 
        </Routes>
      </BrowserRouter>
    // </div>
  );
}

export default App;
