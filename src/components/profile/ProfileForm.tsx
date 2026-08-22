'use client'

import { useState } from 'react'
import { Pencil, User as UserIcon } from 'lucide-react'

type Tab = 'Resume' | 'Private Info' | 'Salary Info' | 'Security'

export function ProfileForm({ user, role }: { user: any, role: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('Resume')

  // Determine available tabs based on role
  const availableTabs: Tab[] = role === 'ADMIN' 
    ? ['Resume', 'Private Info', 'Salary Info', 'Security'] 
    : ['Resume', 'Private Info', 'Security']

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Header Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">My Profile</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex gap-6 items-start">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-12 h-12 text-slate-400" />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-4 min-w-[200px]">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-1 inline-block">
                  {user?.name || 'My Name'}
                </h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-slate-500 w-24">Login ID</span>
                  <span className="text-slate-900 font-medium border-b border-slate-200 pb-0.5">{user?.employeeId || 'EMP-001'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-slate-500 w-24">Email</span>
                  <span className="text-slate-900 font-medium border-b border-slate-200 pb-0.5">{user?.email || 'email@example.com'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-slate-500 w-24">Mobile</span>
                  <span className="text-slate-900 font-medium border-b border-slate-200 pb-0.5">{user?.phone || '+1 234 567 890'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Info */}
          <div className="flex-1 md:pl-12 space-y-4 pt-4 md:pt-0">
            <div className="space-y-3">
              <div className="flex flex-col text-sm border-b border-slate-200 pb-1">
                <span className="text-xs text-slate-500 mb-0.5">Company</span>
                <span className="text-slate-900 font-medium">{user?.companyName || 'Dayflow Inc.'}</span>
              </div>
              <div className="flex flex-col text-sm border-b border-slate-200 pb-1">
                <span className="text-xs text-slate-500 mb-0.5">Department</span>
                <span className="text-slate-900 font-medium">Engineering</span>
              </div>
              <div className="flex flex-col text-sm border-b border-slate-200 pb-1">
                <span className="text-xs text-slate-500 mb-0.5">Manager</span>
                <span className="text-slate-900 font-medium">Jane Doe</span>
              </div>
              <div className="flex flex-col text-sm border-b border-slate-200 pb-1">
                <span className="text-xs text-slate-500 mb-0.5">Location</span>
                <span className="text-slate-900 font-medium">Headquarters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 outline-none
                ${activeTab === tab 
                  ? 'text-indigo-600 border-indigo-600 bg-white' 
                  : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'Resume' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                
                <div className="border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">About</h4>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">What I love about my job</h4>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">My interests and hobbies</h4>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                  </p>
                </div>

              </div>

              {/* Right Column */}
              <div className="w-full md:w-1/3 space-y-6 flex flex-col">
                <div className="border border-slate-200 rounded-lg flex flex-col flex-1 min-h-[200px]">
                  <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900">Skills</h4>
                  </div>
                  <div className="p-4 flex-1">
                    {/* Dummy skills could go here */}
                  </div>
                  <div className="p-3 border-t border-slate-200 bg-slate-50/50">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      + Add Skills
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg flex flex-col flex-1 min-h-[150px]">
                  <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900">Certification</h4>
                  </div>
                  <div className="p-4 flex-1">
                    {/* Dummy certifications could go here */}
                  </div>
                  <div className="p-3 border-t border-slate-200 bg-slate-50/50">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      + Add Skills
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Private Info' && (
            <div className="flex flex-col md:flex-row gap-12">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  
                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-slate-700">Date of Birth</label>
                    <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="1985-04-12" placeholder="YYYY-MM-DD" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-slate-700">Residing Address</label>
                    <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue={user?.address || "123 Tech Park, Silicon Valley, CA"} placeholder="Address" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-slate-700">Nationality</label>
                    <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="American" placeholder="Nationality" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-slate-700">Personal Email</label>
                    <input type="email" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="personal@example.com" placeholder="Email" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-slate-700">Gender</label>
                    <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="Male" placeholder="Gender" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-slate-700">Marital Status</label>
                    <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="Married" placeholder="Status" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-slate-700">Date of Joining</label>
                    <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="2022-01-15" placeholder="YYYY-MM-DD" />
                  </div>

                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Bank Details</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-sm font-medium text-slate-700">Account Number</label>
                      <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="9876543210123" />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-sm font-medium text-slate-700">Bank Name</label>
                      <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="Global Tech Bank" />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-sm font-medium text-slate-700">IFSC code</label>
                      <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="GTB00001234" />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-sm font-medium text-slate-700">PAN NO</label>
                      <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="ABCDE1234F" />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-sm font-medium text-slate-700">UAN NO</label>
                      <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue="100054329876" />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-sm font-medium text-slate-700">Emp Code</label>
                      <input type="text" className="w-2/3 border-b border-slate-300 focus:border-indigo-500 outline-none text-slate-900 pb-1" defaultValue={user?.employeeId || 'EMP-001'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Salary Info' && (
            <div className="space-y-8">
              
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 text-center">
                  <h3 className="font-bold text-slate-900 text-lg">Salary Info</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                    <span className="text-slate-600 font-medium">Month Wage</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-slate-900">50000</span>
                      <span className="text-slate-500 text-sm ml-2">/ Month</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                    <span className="text-slate-600 font-medium">Yearly wage</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-slate-900">600000</span>
                      <span className="text-slate-500 text-sm ml-2">/ Yearly</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-4 px-2">Salary Components</h4>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-200">
                  
                  <div className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-900 text-sm">Basic Salary</span>
                      <div>
                        <span className="font-bold text-slate-900">25000.00</span>
                        <span className="text-slate-500 text-xs ml-1">/ month</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Defines Basic salary from company most compute it based on monthly wages.</p>
                  </div>

                  <div className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-900 text-sm">House Rent Allowance</span>
                      <div>
                        <span className="font-bold text-slate-900">12500.00</span>
                        <span className="text-slate-500 text-xs ml-1">/ month</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">HRA provided to employees 50% of the basic salary</p>
                  </div>

                  <div className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-900 text-sm">Standard allowance</span>
                      <div>
                        <span className="font-bold text-slate-900">4167.00</span>
                        <span className="text-slate-500 text-xs ml-1">/ month</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">A standard allowance is a predetermined, fixed amount provided to employees as part of their salary.</p>
                  </div>

                  <div className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-900 text-sm">Performance Bonus</span>
                      <div>
                        <span className="font-bold text-slate-900">2082.50</span>
                        <span className="text-slate-500 text-xs ml-1">/ month</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary.</p>
                  </div>

                  <div className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-900 text-sm">Leave Travel Allowance</span>
                      <div>
                        <span className="font-bold text-slate-900">2082.50</span>
                        <span className="text-slate-500 text-xs ml-1">/ month</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">LTA is paid by the company to employees to cover their travel expenses and calculated as a % of the basic salary.</p>
                  </div>

                  <div className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-900 text-sm">Fixed Allowance</span>
                      <div>
                        <span className="font-bold text-slate-900">2418.00</span>
                        <span className="text-slate-500 text-xs ml-1">/ month</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Fixed allowance portion of wages is determined after calculating all salary components.</p>
                  </div>

                </div>
              </div>

            </div>
          )}

          {activeTab === 'Security' && (
            <div className="text-center py-12 text-slate-500 border border-slate-200 rounded-lg border-dashed">
              <p>Security settings and login history will be displayed here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
