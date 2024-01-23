import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";
//import ECommerce from './pages/Dashboard/homePage';
import Loader from './common/Loader';
import routes from './routes';
import LoginPage from './pages/login';
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from './routes/ProctectedRoutes';
import { DataProvider } from './DataContext';
import ImageCapture from './components/ImageCapture';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
   
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      
      <ToastContainer autoClose={3000} position={"top-center"}  hideProgressBar={true} />
      <Routes>
      <Route index element={<LoginPage />} />
        <Route path="/loginPage" element={<LoginPage />} /> 
        <Route path="/imageCapture" element={<ImageCapture imageData ={""}onCapture={undefined} fieldId={undefined} onRowClickInParent={undefined}/>} />
        <Route element={<DefaultLayout />}>
         
          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <ProtectedRoute>
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Route>
      </Routes>
    
    </>
    
  );
}

export default App;
