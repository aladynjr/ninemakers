import React, { Suspense } from 'react'
import './App.scss';
import lazy from "react-lazy-with-preload";
import 'tw-elements';
import 'animate.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const AdminPage = lazy(() => import('./pages/AdminPage'));
const CreatePostPage = lazy(() => import('./pages/CreatePostPage'));
const PostsPage = lazy(() => import('./pages/PostsPage'));
const MiniPostsPage =  lazy(() => import('./pages/MiniPostsPage'));
const SinglePostPage = lazy(() => import('./pages/SinglePostPage'));

function App() {
  return (

      <div className="App">
        <BrowserRouter>
        <Suspense fallback={<div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex:'10'}} className="loadingio-spinner-interwind-flyom1cz6sv"><div className="ldio-zxrz71mlja">
              <div><div><div><div></div></div></div><div><div><div></div></div></div></div>
            </div></div>}>

          <div>
         

              <Routes>
      
                <Route exact path="/" element={<PostsPage />} />
                <Route exact path="/posts" element={<PostsPage />} />
                <Route exact path="/admin" element={<AdminPage />} />
                <Route exact path="/mini" element={<MiniPostsPage />} />
                <Route exact path="/post/:id" element={<SinglePostPage />} />

                <Route exact path="/create" element={<CreatePostPage />} />

              </Routes>

          </div>
            </ Suspense >
        </BrowserRouter>

      </div>

  );
}

export default App;
