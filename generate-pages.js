const fs = require('fs');
const path = require('path');

const employeePages = ['dashboard', 'profile', 'attendance', 'leave', 'payroll'];
const adminPages = ['dashboard', 'employees', 'attendance', 'leave', 'payroll', 'reports'];

const createPage = (route, title) => {
  const dir = path.join('src', 'app', '(dashboard)', route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), 
    `export default function Page() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
      <h1 className="text-2xl font-bold text-white mb-4">${title}</h1>
      <p className="text-slate-400">This page is a placeholder for Phase 2. Full functionality will be implemented in later phases.</p>
    </div>
  )
}`
  );
};

employeePages.forEach(p => createPage('employee/' + p, 'Employee ' + p.charAt(0).toUpperCase() + p.slice(1)));
adminPages.forEach(p => createPage('admin/' + p, 'Admin ' + p.charAt(0).toUpperCase() + p.slice(1)));
createPage('admin/employees/[id]', 'Employee Details (Admin)');
