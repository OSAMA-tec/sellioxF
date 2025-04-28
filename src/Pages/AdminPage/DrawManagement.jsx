import React, { useEffect, useState } from 'react';
import { FaTrophy, FaUsers, FaTicketAlt, FaCalendarAlt, FaSpinner, FaCheckCircle, FaMoneyBill } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DrawManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [drawData, setDrawData] = useState({
    currentDraw: null,
    pastDraws: [],
    totalEntries: 0,
    totalParticipants: 0,
    pendingPayments: 0,
  });
  const [isRunningDraw, setIsRunningDraw] = useState(false);
  
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      navigate('/');
      toast.error('Unauthorized access');
      return;
    }
    
    fetchDrawData();
  }, [user, navigate]);
  
  const fetchDrawData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/admin/draw-management');
      setDrawData(response.data);
    } catch (error) {
      console.error('Error fetching draw data:', error);
      toast.error('Error fetching draw data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const runMonthlyDraw = async () => {
    if (!confirm('Are you sure you want to run the monthly draw? This will select a winner and cannot be undone.')) {
      return;
    }
    
    setIsRunningDraw(true);
    try {
      const response = await axiosInstance.post('/admin/run-draw');
      toast.success('Draw completed successfully');
      fetchDrawData(); // Refresh data
    } catch (error) {
      console.error('Error running draw:', error);
      toast.error(error.response?.data?.message || 'Error running draw');
    } finally {
      setIsRunningDraw(false);
    }
  };
  
  const processPayment = async (drawId) => {
    try {
      await axiosInstance.post(`/admin/process-payment/${drawId}`);
      toast.success('Payment marked as processed');
      fetchDrawData(); // Refresh data
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment');
    }
  };
  
  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };
  
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 flex justify-center">
        <FaSpinner className="text-primaryA0 text-2xl animate-spin" />
      </div>
    );
  }
  
  const { currentDraw, pastDraws, totalEntries, totalParticipants, pendingPayments } = drawData;
  
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Draw Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaUsers className="text-primaryA0 text-2xl mr-3" />
            <h2 className="text-xl font-medium">Participants</h2>
          </div>
          <p className="text-4xl font-bold">{totalParticipants}</p>
          <p className="text-gray-500 text-sm mt-2">Total users with entries</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaTicketAlt className="text-primaryA0 text-2xl mr-3" />
            <h2 className="text-xl font-medium">Entries</h2>
          </div>
          <p className="text-4xl font-bold">{totalEntries}</p>
          <p className="text-gray-500 text-sm mt-2">Total active entries</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaMoneyBill className="text-primaryA0 text-2xl mr-3" />
            <h2 className="text-xl font-medium">Pending Payments</h2>
          </div>
          <p className="text-4xl font-bold">{pendingPayments}</p>
          <p className="text-gray-500 text-sm mt-2">Winners awaiting payment</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="bg-primaryA0 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaTrophy className="text-2xl mr-3" />
              <h2 className="text-xl font-medium">Current Draw</h2>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>
                {getMonthName(new Date().getMonth())} {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Draw Status</h3>
              <p className="text-gray-700">
                {currentDraw?.status === 'completed' 
                  ? 'Completed' 
                  : 'Pending - Scheduled for end of month'}
              </p>
              
              <h3 className="font-medium mt-4 mb-2">Prize</h3>
              <p className="text-2xl font-bold text-primaryA0">$1,000</p>
              
              <h3 className="font-medium mt-4 mb-2">Entries</h3>
              <p className="text-gray-700">{totalEntries} total entries from {totalParticipants} participants</p>
            </div>
            
            <div>
              {currentDraw?.status === 'completed' ? (
                <div>
                  <h3 className="font-medium mb-2">Winner</h3>
                  <div className="bg-green-50 p-4 rounded border border-green-200">
                    <div className="flex items-center mb-2">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="font-medium">{currentDraw.winner?.userId?.fullName || 'Unknown User'}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Email: {currentDraw.winner?.userId?.email || 'Unknown'}<br />
                      Entries: {currentDraw.winner?.entries || 0}<br />
                      Status: {currentDraw.paymentStatus || 'pending'}
                    </p>
                    
                    {currentDraw.paymentStatus === 'claimed' && (
                      <button
                        onClick={() => processPayment(currentDraw._id)}
                        className="mt-3 px-4 py-2 bg-primaryA0 text-white rounded text-sm hover:bg-primaryA0/90 transition-colors"
                      >
                        Process Payment
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-600 mb-4 text-center">
                    The draw hasn't been run yet. It will automatically run on the last day of the month, or you can run it manually.
                  </p>
                  <button
                    onClick={runMonthlyDraw}
                    disabled={isRunningDraw}
                    className="px-6 py-3 bg-primaryA0 text-white rounded font-medium hover:bg-primaryA0/90 transition-colors disabled:opacity-70"
                  >
                    {isRunningDraw ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Running Draw...
                      </span>
                    ) : (
                      'Run Draw Now'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-100 p-6">
          <h2 className="text-xl font-medium">Past Draws</h2>
        </div>
        
        <div className="p-0">
          {pastDraws.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No past draws yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Winner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prize
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pastDraws.map(draw => (
                    <tr key={draw._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {draw.drawDate ? new Date(draw.drawDate).toLocaleDateString() : `${getMonthName(draw.month)} ${draw.year}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {draw.winner?.userId?.fullName || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${draw.prizeAmount || 1000}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {draw.totalEntries || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          draw.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : draw.paymentStatus === 'claimed' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {(draw.paymentStatus?.charAt(0).toUpperCase() + draw.paymentStatus?.slice(1)) || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {draw.paymentStatus === 'claimed' && (
                          <button
                            onClick={() => processPayment(draw._id)}
                            className="px-3 py-1 bg-primaryA0 text-white rounded text-xs hover:bg-primaryA0/90 transition-colors"
                          >
                            Process Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 