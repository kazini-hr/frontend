import Announcements from '@/app/components/announcements';
import AttendanceChart from '@/app/components/attendance-chart';
import CountChart from '@/app/components/count-chart';
import EventCalendar from '@/app/components/event-calendar';
import FinanceChart from '@/app/components/finance-chart';
import UserCard from '@/app/components/user-card';
import React from 'react';

const AdminPage = () => {
  return (
    <div className="flex p-4 gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User Cards */}
        <div className="flex flex-wrap gap-4 justify-between">
          <UserCard type="admin" />
          <UserCard type="executive" />
          <UserCard type="manager" />
          <UserCard type="employee" />
        </div>
        {/* middle charts */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* count chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            {/* AttendanceChart */}
            <AttendanceChart />
          </div>
        </div>
        {/* bottom charts */}
        <div className="w-full h=[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
