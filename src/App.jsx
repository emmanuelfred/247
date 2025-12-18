import { Routes, Route, Link } from 'react-router-dom';


import Home from './Pages/Home'
import Header from './Component/Header/Header';
import Footer from './Component/Footer';
import ChatWidget from './Component/ChatWidget';
import JobList from './Pages/JobList';
import PropertyList from './Pages/PropertyList';
import MyListings from './Pages/MyListings';
import NotFound from './Pages/NotFound';
import ProfilePage from './Pages/ProfilePage';
import ChatPage from './Pages/ChatPage';
import ReviewApplicationsPage, { ReviewApplicationDetailPage } from './Pages/ReviewApplications';
import JobListingDetail from './Pages/Job-listing-detail';
import PropertyDetail from './Pages/PropertyDetail';
import PostJobForm from './Pages/PostJobForm';
import PostPropertyForm from './Pages/PostPropertyForm';
import SuccessPost from './Pages/Success';
import SuccessApplcation from './Pages/SuccessApplcation';
import Application from './Pages/Application';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import IdentityVerification from './Pages/IdentityVerification';
import EmailVerify from './Pages/EmailVerify';
import ResetPassword from './Pages/ResetPassword';
import ResetSuccess from './Pages/ResetSuccess';
import VerifyOTP from './Pages/VerifyOTP';
import VerificationSuccess from './Pages/VerificationSuccess';

import NotificationsPage from './Pages/NotificationsPage'; // ✅ NEW
import { Toaster } from "react-hot-toast";
import EmailVerificationSuccess from './Pages/EmailVerificationSuccess';
import ProtectedRoute from './Component/ProtectedRoute';


function App() {
  return (
    <div >
      <Toaster position="top-right" />
      <ChatWidget/>

     

     <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
         <Route path="/home" element={<Home />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/properties" element={<PropertyList />} />
         <Route path="/mylisting" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
         <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
         <Route path="/chat/:id" element={<ProtectedRoute><ChatPage/></ProtectedRoute>} />
         <Route path="/chat" element={<ProtectedRoute><ChatPage/></ProtectedRoute>} />
         {/* ✅ NEW: Notifications Page */}
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          <Route path="/jobs/:jobId/applications" element={<ProtectedRoute><ReviewApplicationsPage /></ProtectedRoute>} />
          <Route path="/applications/:applicationId" element={<ProtectedRoute><ReviewApplicationDetailPage /></ProtectedRoute>} />
         <Route path="/jobs/:id" element={<JobListingDetail/>} />
         <Route path="/properties/:id" element={<PropertyDetail/>} />
         <Route path="/post-job" element={<ProtectedRoute><PostJobForm/></ProtectedRoute>} />
         <Route path="/post-property" element={<ProtectedRoute><PostPropertyForm/></ProtectedRoute>} />
         <Route path="/success" element={<SuccessPost/>} />
         <Route path="/success_application" element={<SuccessApplcation/>} />
         <Route path="/apply/:id" element={<ProtectedRoute><Application/></ProtectedRoute>} />
         <Route path="/login" element={<LoginPage/>} />
         <Route path="/signup" element={<SignupPage/>} />
         <Route path="/verify_identity/:user_id" element={<IdentityVerification/>} />
         <Route path="/verify" element={<EmailVerify/>} />
         <Route path="/reset_password" element={<ResetPassword/>} />
         <Route path="/reset_success" element={<ResetSuccess/>} />
         <Route path="/verify-otp" element={<VerifyOTP/>} />
         <Route path="/Verify_success" element={<VerificationSuccess/>} />
         <Route path="/verify-email/:uid/:token" element={<EmailVerificationSuccess/>} />
        


         

       
      
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
