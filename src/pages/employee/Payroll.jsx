import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { Download, DollarSign } from 'lucide-react';

const EmployeePayroll = () => {
  const payrollHistory = [
    { id: 1, month: 'October', year: '2023', basic: '$4,000.00', allowances: '$500.00', deductions: '$250.00', net: '$4,250.00' },
    { id: 2, month: 'September', year: '2023', basic: '$4,000.00', allowances: '$500.00', deductions: '$250.00', net: '$4,250.00' },
    { id: 3, month: 'August', year: '2023', basic: '$4,000.00', allowances: '$450.00', deductions: '$250.00', net: '$4,200.00' },
    { id: 4, month: 'July', year: '2023', basic: '$3,800.00', allowances: '$450.00', deductions: '$230.00', net: '$4,020.00' },
  ];

  const columns = [
    { 
      header: 'Month / Year', 
      key: 'month',
      render: (row) => <span className="font-medium">{row.month} {row.year}</span>
    },
    { header: 'Basic Salary', key: 'basic' },
    { header: 'Allowances', key: 'allowances', cellClassName: 'text-green-600' },
    { header: 'Deductions', key: 'deductions', cellClassName: 'text-red-600' },
    { header: 'Net Salary', key: 'net', cellClassName: 'font-bold text-slate-800' },
    {
      header: 'Action',
      key: 'action',
      render: () => (
        <Button variant="secondary" size="sm" className="gap-2">
          <Download size={14} /> Payslip
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payroll History</h1>
        <p className="text-slate-500 text-sm mt-1">View your salary details and download payslips.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary-600 text-white md:col-span-1 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-100 font-medium">Last Month Net Pay</p>
                <h3 className="text-3xl font-bold mt-2">$4,250.00</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-sm font-medium">October 2023</p>
              <div className="mt-3 space-y-2 text-sm text-primary-100">
                <div className="flex justify-between">
                  <span>Basic:</span>
                  <span>$4,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Allowances:</span>
                  <span>+$500.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Deductions:</span>
                  <span>-$250.00</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6 bg-white text-primary-700 hover:bg-slate-50 border-none">
              Download Latest Payslip
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable 
              columns={columns}
              data={payrollHistory}
              searchable={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeePayroll;
