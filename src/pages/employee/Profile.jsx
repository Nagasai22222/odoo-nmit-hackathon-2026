import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Edit2 } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const isViewingSelf = !id || (id && parseInt(id) === user?.id);
  const [activeTab, setActiveTab] = useState('resume');
  
  // Mock profile data
  const profileData = {
    name: isViewingSelf ? user?.name : 'Employee Name',
    loginId: isViewingSelf ? user?.email : 'employee@dayflow.com',
    email: isViewingSelf ? user?.email : 'employee@dayflow.com',
    mobile: '+1 234 567 8900',
    company: 'Dayflow Inc.',
    department: 'Engineering',
    manager: 'Jane Doe',
    location: 'New York, USA'
  };

  // Mock salary data
  const salaryData = {
    basic: 65000,
    allowance: 12000,
    bonus: 5000,
    deductions: 8000,
    net: 74000,
    bank: 'Bank of America',
    account: '**** **** **** 1234'
  };

  return (
    <div className="max-w-5xl mx-auto py-6 bg-white min-h-[80vh] border border-slate-200 shadow-sm mt-4">
      
      {/* Header Title */}
      <div className="px-8 py-4 border-b border-slate-200">
        <h1 className="text-xl text-slate-700">My Profile</h1>
      </div>

      <div className="px-8 py-8">
        {/* Top Section: Avatar and Fields */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-8">
          
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-[#ffd1d9] flex items-center justify-center border border-slate-300 relative cursor-pointer hover:bg-[#ffc0cb] transition-colors">
              <Edit2 size={24} className="text-slate-700" />
            </div>
          </div>

          {/* Form Fields - 2 Columns */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  defaultValue={profileData.name} 
                  className="w-full text-3xl text-slate-800 border-0 border-b border-slate-400 focus:ring-0 px-0 pb-1 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Login ID</label>
                <div className="text-slate-800 text-sm">{profileData.loginId}</div>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Email</label>
                <input 
                  type="email" 
                  defaultValue={profileData.email} 
                  className="w-full text-sm text-slate-800 border-0 border-b border-slate-400 focus:ring-0 px-0 pb-1 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Mobile</label>
                <input 
                  type="text" 
                  defaultValue={profileData.mobile} 
                  className="w-full text-sm text-slate-800 border-0 border-b border-slate-400 focus:ring-0 px-0 pb-1 bg-transparent"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Company</label>
                <input 
                  type="text" 
                  defaultValue={profileData.company} 
                  className="w-full text-sm text-slate-800 border-0 border-b border-slate-400 focus:ring-0 px-0 pb-1 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Department</label>
                <input 
                  type="text" 
                  defaultValue={profileData.department} 
                  className="w-full text-sm text-slate-800 border-0 border-b border-slate-400 focus:ring-0 px-0 pb-1 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Manager</label>
                <input 
                  type="text" 
                  defaultValue={profileData.manager} 
                  className="w-full text-sm text-slate-800 border-0 border-b border-slate-400 focus:ring-0 px-0 pb-1 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Location</label>
                <input 
                  type="text" 
                  defaultValue={profileData.location} 
                  className="w-full text-sm text-slate-800 border-0 border-b border-slate-400 focus:ring-0 px-0 pb-1 bg-transparent"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-300 mb-6 relative">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-6 py-2 text-sm transition-colors ${
              activeTab === 'resume'
                ? 'border-t border-l border-r border-slate-800 bg-white text-slate-800 font-medium -mb-[1px]'
                : 'text-slate-600 hover:text-slate-800 border-transparent border'
            }`}
          >
            Resume
          </button>
          
          <button
            onClick={() => setActiveTab('private')}
            className={`px-6 py-2 text-sm transition-colors ${
              activeTab === 'private'
                ? 'border-t border-l border-r border-slate-800 bg-white text-slate-800 font-medium -mb-[1px]'
                : 'text-slate-600 hover:text-slate-800 border-transparent border'
            }`}
          >
            Private Info
          </button>
          
          <button
            onClick={() => setActiveTab('salary')}
            className={`px-6 py-2 text-sm transition-colors ${
              activeTab === 'salary'
                ? 'border-t border-l border-r border-slate-800 bg-white text-slate-800 font-medium -mb-[1px]'
                : 'text-slate-600 hover:text-slate-800 border-transparent border'
            }`}
          >
            Salary Info
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-2 text-sm transition-colors ${
              activeTab === 'security'
                ? 'border-t border-l border-r border-slate-800 bg-white text-slate-800 font-medium -mb-[1px]'
                : 'text-slate-600 hover:text-slate-800 border-transparent border'
            }`}
          >
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2 pb-8">
          
          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {/* Left Column (No border container, just bordered items) */}
              <div className="space-y-6">
                
                {/* About Section */}
                <div className="border border-slate-300 rounded-sm">
                  <div className="p-3 border-b border-slate-300 flex items-center gap-2 bg-slate-50">
                    <span className="text-slate-800 font-medium text-sm">About</span>
                    <Edit2 size={14} className="text-slate-500 cursor-pointer hover:text-slate-800" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                  </div>
                </div>

                {/* What I love about my job */}
                <div className="border border-slate-300 rounded-sm">
                  <div className="p-3 border-b border-slate-300 flex items-center gap-2 bg-slate-50">
                    <span className="text-slate-800 font-medium text-sm">What I love about my job</span>
                    <Edit2 size={14} className="text-slate-500 cursor-pointer hover:text-slate-800" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                  </div>
                </div>

                {/* My interests and hobbies */}
                <div className="border border-slate-300 rounded-sm">
                  <div className="p-3 border-b border-slate-300 flex items-center gap-2 bg-slate-50">
                    <span className="text-slate-800 font-medium text-sm">My interests and hobbies</span>
                    <Edit2 size={14} className="text-slate-500 cursor-pointer hover:text-slate-800" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                  </div>
                </div>

              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Skills Box */}
                <div className="border border-slate-300 rounded-sm flex flex-col h-[280px]">
                  <div className="border-b border-slate-300 p-3 bg-slate-50">
                    <span className="text-slate-800 font-medium text-sm">Skills</span>
                  </div>
                  <div className="p-4 flex-1">
                    {/* Empty content area */}
                  </div>
                  <div className="p-3 border-t border-slate-300 bg-slate-50">
                    <button className="text-xs font-medium text-slate-700 hover:text-slate-900">+ Add Skills</button>
                  </div>
                </div>

                {/* Certification Box */}
                <div className="border border-slate-300 rounded-sm flex flex-col h-[180px]">
                  <div className="border-b border-slate-300 p-3 bg-slate-50">
                    <span className="text-slate-800 font-medium text-sm">Certification</span>
                  </div>
                  <div className="p-4 flex-1">
                    {/* Empty content area */}
                  </div>
                  <div className="p-3 border-t border-slate-300 bg-slate-50">
                    <button className="text-xs font-medium text-slate-700 hover:text-slate-900">+ Add Skills</button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Private Info Tab */}
          {activeTab === 'private' && (
            <div className="animate-in fade-in duration-300 pt-6 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8">
                {/* Left Side */}
                <div className="space-y-6">
                  <div className="flex items-end gap-6">
                    <label className="text-slate-700 w-32">Date of Birth</label>
                    <input 
                      type="text" 
                      defaultValue="May 20, 1990" 
                      className="flex-1 text-slate-800 border-0 border-b border-slate-800 focus:ring-0 px-0 pb-1 bg-transparent font-medium"
                    />
                  </div>
                  <div className="flex items-end gap-6">
                    <label className="text-slate-700 w-32">Residing Address</label>
                    <input 
                      type="text" 
                      defaultValue="123 Tech Lane, CA 94025" 
                      className="flex-1 text-slate-800 border-0 border-b border-slate-800 focus:ring-0 px-0 pb-1 bg-transparent font-medium"
                    />
                  </div>
                  <div className="flex items-end gap-6">
                    <label className="text-slate-700 w-32">Nationality</label>
                    <input 
                      type="text" 
                      defaultValue="American" 
                      className="flex-1 text-slate-800 border-0 border-b border-slate-800 focus:ring-0 px-0 pb-1 bg-transparent font-medium"
                    />
                  </div>
                </div>
                
                {/* Right Side */}
                <div className="space-y-6">
                  <div className="flex items-end gap-6 border-b border-slate-300 pb-2 mb-2">
                    <label className="text-slate-700 font-medium">Bank Details</label>
                  </div>
                  <div className="flex items-end gap-6">
                    <label className="text-slate-700 w-32">Account Number</label>
                    <input 
                      type="text" 
                      defaultValue="**** **** **** 1234" 
                      className="flex-1 text-slate-800 border-0 border-b border-slate-800 focus:ring-0 px-0 pb-1 bg-transparent font-medium"
                    />
                  </div>
                  <div className="flex items-end gap-6">
                    <label className="text-slate-700 w-32">Bank Name</label>
                    <input 
                      type="text" 
                      defaultValue="Bank of America" 
                      className="flex-1 text-slate-800 border-0 border-b border-slate-800 focus:ring-0 px-0 pb-1 bg-transparent font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Salary Info Tab */}
          {activeTab === 'salary' && (
            <div className="animate-in fade-in duration-300">
              {/* Top Section */}
              <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Left Side (Wages) */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-end gap-4">
                    <label className="text-slate-700 w-24">Month Wage</label>
                    <div className="flex items-end gap-2 flex-1">
                      <input 
                        type="text" 
                        defaultValue="50000" 
                        className="flex-1 text-center text-slate-800 border-0 border-b border-slate-500 focus:ring-0 px-0 pb-1 bg-transparent"
                      />
                      <span className="text-slate-700">/ Month</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="text-slate-700 w-24">Yearly wage</label>
                    <div className="flex items-end gap-2 flex-1">
                      <input 
                        type="text" 
                        defaultValue="600000" 
                        className="flex-1 text-center text-slate-800 border-0 border-b border-slate-500 focus:ring-0 px-0 pb-1 bg-transparent"
                      />
                      <span className="text-slate-700">/ Yearly</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Side (Working days) */}
                <div className="flex-1 space-y-8">
                  <div className="flex items-end gap-4">
                    <label className="text-slate-700 w-36">No of working days<br/>in a week:</label>
                    <input 
                      type="text" 
                      defaultValue="" 
                      className="flex-1 border-0 border-b border-slate-500 focus:ring-0 px-0 pb-1 bg-transparent"
                    />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="text-slate-700 w-36 text-sm">Break Time:</label>
                    <div className="flex items-end gap-2 flex-1">
                      <input 
                        type="text" 
                        defaultValue="" 
                        className="flex-1 border-0 border-b border-slate-500 focus:ring-0 px-0 pb-1 bg-transparent"
                      />
                      <span className="text-slate-700 text-xl">/hrs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Salary Components */}
                <div>
                  <h3 className="text-slate-700 mb-2 font-medium">Salary Components</h3>
                  <div className="border-t border-slate-400 pt-4 space-y-6">
                    <div>
                      <div className="flex items-end justify-between gap-4 text-sm mb-1">
                        <span className="text-slate-800 w-32">Basic Salary</span>
                        <div className="flex items-end justify-end gap-1 flex-1">
                          <input type="text" defaultValue="25000.00" className="w-24 text-right text-slate-800 border-0 border-b-2 border-slate-800 focus:ring-0 px-0 pb-0.5 bg-transparent text-sm" />
                          <span className="text-xs text-slate-600">₹ / month</span>
                        </div>
                        <div className="flex items-end gap-1 w-20 justify-end">
                          <input type="text" defaultValue="50.00" className="w-12 text-right text-slate-800 border-0 border-b-2 border-slate-800 focus:ring-0 px-0 pb-0.5 bg-transparent text-sm" />
                          <span className="text-xs text-slate-600">%</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">Define Basic salary from company cost compute it based on monthly Wages</p>
                    </div>
                    
                    <div>
                      <div className="flex items-end justify-between gap-4 text-sm mb-1">
                        <span className="text-slate-800 w-32">House Rent Allowance</span>
                        <div className="flex items-end justify-end gap-1 flex-1">
                          <span className="text-sm">12500.00</span>
                          <span className="text-xs text-slate-600">₹ / month</span>
                        </div>
                        <div className="flex items-end gap-1 w-20 justify-end">
                          <span className="text-sm">50.00</span>
                          <span className="text-xs text-slate-600">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PF Contribution */}
                <div>
                  <h3 className="text-slate-700 mb-2 font-medium">Provident Fund (PF) Contribution</h3>
                  <div className="border-t border-slate-400 pt-4 space-y-6">
                    <div>
                      <div className="flex items-end justify-between gap-4 text-sm mb-1">
                        <span className="text-slate-800 w-24">Employee</span>
                        <div className="flex items-end justify-end gap-1 flex-1">
                          <input type="text" defaultValue="3000.00" className="w-32 text-center text-slate-800 border-0 border-b-2 border-slate-800 focus:ring-0 px-0 pb-0.5 bg-transparent text-sm" />
                          <span className="text-xs text-slate-600">₹ / month</span>
                        </div>
                        <div className="flex items-end gap-1 w-20 justify-end">
                          <input type="text" defaultValue="12.00" className="w-12 text-right text-slate-800 border-0 border-b-2 border-slate-800 focus:ring-0 px-0 pb-0.5 bg-transparent text-sm" />
                          <span className="text-xs text-slate-600">%</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">PF is calculated based on the basic salary</p>
                    </div>

                    <div>
                      <div className="flex items-end justify-between gap-4 text-sm mb-1">
                        <span className="text-slate-800 w-24">Employer</span>
                        <div className="flex items-end justify-end gap-1 flex-1">
                          <input type="text" defaultValue="3000.00" className="w-32 text-center text-slate-800 border-0 border-b-2 border-slate-800 focus:ring-0 px-0 pb-0.5 bg-transparent text-sm" />
                          <span className="text-xs text-slate-600">₹ / month</span>
                        </div>
                        <div className="flex items-end gap-1 w-20 justify-end">
                          <input type="text" defaultValue="12.00" className="w-12 text-right text-slate-800 border-0 border-b-2 border-slate-800 focus:ring-0 px-0 pb-0.5 bg-transparent text-sm" />
                          <span className="text-xs text-slate-600">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in duration-300 border border-slate-800 rounded-sm p-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Security Settings</h3>
              <p className="text-sm text-slate-600 mb-6">Manage your password and security preferences.</p>
              
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-[#df80ff]" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-[#df80ff]" />
                </div>
                <button className="bg-[#df80ff] hover:bg-[#c960e8] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
