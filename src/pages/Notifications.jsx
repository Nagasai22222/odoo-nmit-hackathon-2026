import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Bell, Check, FileText, CalendarClock, DollarSign, Info } from 'lucide-react';
import { cn } from '../utils/cn';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'leave', title: 'Leave Request Approved', message: 'Your leave request for Oct 10 - Oct 11 has been approved by HR.', time: '2 hours ago', isRead: false },
    { id: 2, type: 'payroll', title: 'Payroll Updated', message: 'Your salary for the month of October has been credited.', time: '1 day ago', isRead: false },
    { id: 3, type: 'attendance', title: 'Attendance Reminder', message: 'You missed checking out yesterday. Please update your attendance.', time: '2 days ago', isRead: true },
    { id: 4, type: 'system', title: 'System Maintenance', message: 'The HRMS portal will be down for maintenance on Saturday from 2 AM to 4 AM.', time: '3 days ago', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'leave': return <FileText className="text-green-500 w-5 h-5" />;
      case 'payroll': return <DollarSign className="text-purple-500 w-5 h-5" />;
      case 'attendance': return <CalendarClock className="text-yellow-500 w-5 h-5" />;
      default: return <Info className="text-blue-500 w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Stay updated with your latest alerts.</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-4 sm:p-6 flex items-start gap-4 transition-colors",
                    notification.isRead ? "bg-white" : "bg-blue-50/50"
                  )}
                >
                  <div className="mt-1 flex-shrink-0 bg-white p-2 rounded-full shadow-sm border border-slate-100">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className={cn(
                        "text-sm sm:text-base truncate",
                        notification.isRead ? "font-medium text-slate-700" : "font-bold text-slate-900"
                      )}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-slate-400 flex-shrink-0">{notification.time}</span>
                    </div>
                    <p className={cn(
                      "text-sm",
                      notification.isRead ? "text-slate-500" : "text-slate-700"
                    )}>
                      {notification.message}
                    </p>
                  </div>
                  
                  {!notification.isRead && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="flex-shrink-0 text-slate-400 hover:text-primary-600 p-2 rounded-full hover:bg-white transition-colors tooltip-trigger"
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>You have no notifications right now.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
