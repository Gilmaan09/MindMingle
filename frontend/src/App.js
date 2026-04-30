import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from './context/AuthContext';
// import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MoodCheckin from './pages/MoodCheckIn';
import Exercises from './pages/Exercises';
import MoodTracker from './pages/MoodTracker';
import Community from './pages/Community';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';
import HomePage from './pages/Home';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-spinner" style={{ minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  return children
  // const { user, loading } = useAuth();
  // if (loading) return (
  //   <div className="loading-spinner" style={{ minHeight: '100vh' }}>
  //     <div className="spinner" />
  //   </div>
  // );
  // return !user ? children : <Navigate to="/dashboard" replace />;
};
const checkReminders = () => {
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const today = now.toLocaleDateString('en-US', { weekday: 'short' });

  reminders.forEach((reminder) => {
    if (
      reminder.isActive &&
      reminder.time === currentTime &&
      now.getSeconds() === 0 &&
      (
        reminder.frequency === 'daily' ||
        (reminder.frequency === 'weekly' && reminder.days.includes(today)) ||
        (reminder.frequency === 'custom' && reminder.days.includes(today))
      )
    ) {
      if (Notification.permission === "granted") {
        new Notification("MindMingle Reminder 🔔", {
          body: reminder.message,
        });
      }
    }
  });
};


function App() {
    useEffect(() => {
    const interval = setInterval(() => {
      checkReminders();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <AuthProvider>
      <Router>
        <Routes>

  {/* Public Routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Private Routes Wrapped With Layout */}
  <Route element={<PrivateRoute><Layout /></PrivateRoute>}>

    <Route path="/dashboard" element={<Dashboard />} />
    <Route path='/mood-checkin' element={<MoodCheckin/>}/>
    <Route path="/exercises" element={<Exercises />} />
    <Route path="/mood" element={<MoodTracker />} />
    <Route path="/community" element={<Community />} />
    <Route path="/reminders" element={<Reminders />} />
    <Route path="/profile" element={<Profile />} />
    

  </Route>

</Routes>
        {/* <Routes>
           <Route path="/" element={<HomePage />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route element={<PrivateRoute><Layout/></PrivateRoute>}/>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="mood" element={<MoodTracker />} />
            <Route path="community" element={<Community />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes> */}
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastStyle={{ borderRadius: '12px', fontFamily: 'DM Sans, sans-serif' }}
      />
    </AuthProvider>
  );
}

export default App;

// import React, { useState, createContext, useContext } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './index.css';

// import { AuthProvider, useAuth } from './context/AuthContext';
// import Layout from './components/Layout';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Exercises from './pages/Exercises';
// import MoodTracker from './pages/MoodTracker';
// import Community from './pages/Community';
// import Reminders from './pages/Reminders';
// import Profile from './pages/Profile';
// // import MoodCheckIn from './pages/MoodCheckIn';
// import Home from './pages/Home';

// export const MoodCheckInContext = createContext(null);
// export const useMoodCheckIn = () => useContext(MoodCheckInContext);

// // ─────────────────────────────────────────────
// // Private Route (Requires Login)
// // ─────────────────────────────────────────────
// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-spinner" style={{ minHeight: '100vh' }}>
//         <div className="spinner" />
//       </div>
//     );
//   }

//   return user ? children : <Navigate to="/home" replace />;
// };

// // ─────────────────────────────────────────────
// // Public Route (Login/Register/Home)
// // ─────────────────────────────────────────────
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-spinner" style={{ minHeight: '100vh' }}>
//         <div className="spinner" />
//       </div>
//     );
//   }

//   return !user ? children : <Navigate to="/app/dashboard" replace />;
// };

// function AppInner() {
//   const { user } = useAuth();
//   const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);

//   return (
//     <MoodCheckInContext.Provider
//       value={{ triggerMoodCheckIn: () => setShowMoodCheckIn(true) }}
//     >
//       {/* {showMoodCheckIn && user && (
//         <MoodCheckIn
//           userName={user.name}
//           onComplete={() => setShowMoodCheckIn(false)}
//           onSkip={() => setShowMoodCheckIn(false)}
//         />
//       )} */}

//       <Routes>

//         {/* Default entry → always go to home */}
//         <Route path="/" element={<Navigate to="/home" replace />} />

//         {/* Landing Page */}
//         <Route
//           path="/home"
//           element={
//             <PublicRoute>
//               <Home />
//             </PublicRoute>
//           }
//         />

//         {/* Auth Pages */}
//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <Login />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path="/register"
//           element={
//             <PublicRoute>
//               <Register />
//             </PublicRoute>
//           }
//         />

//         {/* Private App Shell */}
//         <Route
//           path="/app"
//           element={
//             <PrivateRoute>
//               <Layout />
//             </PrivateRoute>
//           }
//         >
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="exercises" element={<Exercises />} />
//           <Route path="mood" element={<MoodTracker />} />
//           <Route path="community" element={<Community />} />
//           <Route path="reminders" element={<Reminders />} />
//           <Route path="profile" element={<Profile />} />
//         </Route>

//         {/* Catch-all */}
//         <Route path="*" element={<Navigate to="/home" replace />} />

//       </Routes>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         toastStyle={{
//           borderRadius: '12px',
//           fontFamily: 'DM Sans, sans-serif',
//         }}
//       />
//     </MoodCheckInContext.Provider>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppInner />
//     </AuthProvider>
//   );
// }

// export default App;


// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './index.css';

// import { AuthProvider, useAuth } from './context/AuthContext';
// import Layout from './components/Layout';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Exercises from './pages/Exercises';
// import MoodTracker from './pages/MoodTracker';
// import Community from './pages/Community';
// import Reminders from './pages/Reminders';
// import Profile from './pages/Profile';
// // import HomePage from './pages/Home';
// import HomePage from './pages/Home';

// // ─────────────────────────────────────────────
// // Private Route (Requires Login)
// // ─────────────────────────────────────────────
// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-spinner" style={{ minHeight: '100vh' }}>
//         <div className="spinner" />
//       </div>
//     );
//   }

//   return user ? children : <Navigate to="/home" replace />;
// };

// // ─────────────────────────────────────────────
// // Public Route (Login/Register/Home)
// // ─────────────────────────────────────────────
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-spinner" style={{ minHeight: '100vh' }}>
//         <div className="spinner" />
//       </div>
//     );
//   }

//   return !user ? children : <Navigate to="/app/dashboard" replace />;
// };

// function AppInner() {
//   return (
//     <>
//       <Routes>

//         {/* Default entry → always go to home */}
//         <Route path="/" element={<Navigate to="/home" replace />} />

//         {/* Landing Page */}
//         <Route
//           path="/home"
//           element={
//             <PublicRoute>
//               <HomePage />
//             </PublicRoute>
//           }
//         />

//         {/* Auth Pages */}
//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <Login />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path="/register"
//           element={
//             <PublicRoute>
//               <Register />
//             </PublicRoute>
//           }
//         />

//         {/* Private App Shell */}
//         <Route
//           path="/app"
//           element={
//             <PrivateRoute>
//               <Layout />
//             </PrivateRoute>
//           }
//         >
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="exercises" element={<Exercises />} />
//           <Route path="mood" element={<MoodTracker />} />
//           <Route path="community" element={<Community />} />
//           <Route path="reminders" element={<Reminders />} />
//           <Route path="profile" element={<Profile />} />
//         </Route>

//         {/* Catch-all */}
//         <Route path="*" element={<Navigate to="/home" replace />} />

//       </Routes>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         toastStyle={{
//           borderRadius: '12px',
//           fontFamily: 'DM Sans, sans-serif',
//         }}
//       />
//     </>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppInner />
//     </AuthProvider>
//   );
// }

// export default App;
