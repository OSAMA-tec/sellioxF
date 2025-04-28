import { Navigate, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import Header from './Layout/Header/Header';
import Footer from './Layout/Footer/Footer';
import Homepage from './Pages/Homepage/Home.page';
import LoginPage from './Pages/auth/LoginPage/Login.page';
import RegisterPage from './Pages/auth/RegisterPage/Register.page';
import RegisterSuccessPage from './Pages/auth/RegisterSuccess/RegisterSuccess';
import SignupSuccessPage from './Pages/auth/SignupSuccess/SignupSuccess.page';
import ListingPage from './Pages/ListingPage/Listing.page';
import AddListingPage from './Pages/AddListingPage/AddListing.page';
import PaymentSuccessPage from './Pages/AddListingPage/PaymentSuccess';
import AccountPage from './Pages/AccountPage/Account.Page';
import PaymentAccountPage from './Pages/AccountPage/sections/Payment.Account.page';
import SettingsAccountPage from './Pages/AccountPage/sections/Settings.Account.page';
import MyListingsPage from './Pages/MyListingsPage/MyListings.page';
import MyListingsSection from './Pages/MyListingsPage/sections/MyListings.section';
import SavedListingsSection from './Pages/MyListingsPage/sections/SavedListings.section';
import DraftedListingsSection from './Pages/MyListingsPage/sections/DraftedListings.section';
import AboutPage from './Pages/AboutPage/About.page';
import ContactPage from './Pages/ContactPage/Contact.page';
import PrivacyPage from './Pages/PrivacyPage/Privacy.page';
import TermsPage from './Pages/TermsPage/Terms.page';
import EditListingPage from './Pages/EditListingPage/EditListing.page';
import UpdatePlanPage from './Pages/UpdatePlanPage/UpdatePlan.page';
import ReactivateListingPage from './Pages/ReactivateListingPage/ReactivateListing.page';
import ReferralPage from './Pages/ReferralPage/Referral.page';
import ReferralDashboardPage from './Pages/ReferralDashboard/ReferralDashboard.page';
import ClaimPrizePage from './Pages/ReferralPage/ClaimPrize';
import DrawManagementPage from './Pages/AdminPage/DrawManagement';
import ReferralPopup from './Components/ReferralPopup/ReferralPopup';
import ReferralNotificationProvider from './context/ReferralNotificationContext';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setInitialized, setUser } from './redux/slices/user.slice';
import PrivateRoute from './utils/PrivateRouteHook/PrivateRoute';

// Admin route component
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"))?.user;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    if(localStorage.getItem("user")){
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch(setUser(user))
    }else{
      dispatch(setInitialized());
    }
  },[dispatch]);


  return (
    <ReferralNotificationProvider>
      <div className='App '>
        <ReferralPopup />
        <Header />
    <main>
    <Routes>
      <Route path='/auth/login' element={<LoginPage />}/>
      <Route path='/auth/register' element={<RegisterPage />}/>
      <Route path='/auth/register-success' element={<RegisterSuccessPage />}/>
      <Route path='/auth/signup-success' element={<SignupSuccessPage />}/>
      <Route path='/' element={<Homepage />} />
      
      <Route path='/listing/:id' element={<ListingPage />}/>
      
      {/* Allow users to start creating a listing without authentication */}
      <Route path='/addList' element={<AddListingPage />} />
      <Route path='/payment-success' element={<PaymentSuccessPage />} />
      
      <Route path='/account' element={
        <PrivateRoute>
        <AccountPage/>
        </PrivateRoute>}
        >
        <Route path='/account/' element={<SettingsAccountPage />} />
        <Route path='/account/payment' element={<PaymentAccountPage />} />
      </Route>
      <Route path='/mylistings' element={<MyListingsPage />} >
        <Route path='/mylistings/mylistings' element={<MyListingsSection />}/>
        <Route path='/mylistings/' element={<SavedListingsSection />}/>
{/*         <Route path='/mylistings/drafted' element={<DraftedListingsSection />}/> */}
      </Route>
      {/* <Route path='/about' element={<AboutPage />}/> */}
      <Route path='/contact' element={<ContactPage />}/>
      <Route path='/privacy' element={<PrivacyPage />}/>
      <Route path='/terms' element={<TermsPage />}/>
      <Route path="/editListing/:listingId" element={<PrivateRoute><EditListingPage /></PrivateRoute>} />
      <Route path="/updatePlan/:listingId" element={<PrivateRoute><UpdatePlanPage /></PrivateRoute>} />
      <Route path="/reactivateListing/:listingId" element={<PrivateRoute><ReactivateListingPage /></PrivateRoute>} />
      
      {/* Referral Program Routes */}
      <Route path="/referral" element={<PrivateRoute><ReferralPage /></PrivateRoute>} />
      <Route path="/referral-dashboard" element={<PrivateRoute><ReferralDashboardPage /></PrivateRoute>} />
      <Route path="/referral/claim-prize" element={<PrivateRoute><ClaimPrizePage /></PrivateRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin/draw-management" element={<PrivateRoute><AdminRoute><DrawManagementPage /></AdminRoute></PrivateRoute>} />
    </Routes>
    </main>
    <Footer />
      </div>
    </ReferralNotificationProvider>
  );
}

export default App
