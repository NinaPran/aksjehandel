import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home';
import { Layout } from './Layout';
import { Home2 } from './pages/home2';


function App() {
    return (
        <>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/home2" element={<Home2 />}></Route>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </>
    );
}

export default App;
