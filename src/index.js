import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import Header from './Components/Header';
import Presentation from './Components/Presentation';
import Experiences from './Components/Experiences';
import Projets from './Components/Projets';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Header/>
  },
  {
    path: "AboutMe",
    element: <Presentation/>,
  },
  {
    path: "Experiences",
    element: <Experiences/>,
  },
  {
    path: "Projets",
    element: <Projets/>,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);

