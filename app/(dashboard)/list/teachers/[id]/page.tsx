import Announcements from '@/app/components/announcements';
import MyCalendar from '@/app/components/big-calendar';
import FormModal from '@/app/components/form-modal';
import Performance from '@/app/components/performance';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const SingleTeacherPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* left */}
      <div className="w-full xl:w-2/3">
        {/* top */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* user info card */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">Argyle Nderitu</h1>
                <FormModal
                  table="teacher"
                  type="update"
                  data={{
                    id: 1,
                    username: 'ArgyleN',
                    email: 'someemail@kipepeo.com',
                    password: 'password',
                    phone: '0100522105',
                    address: 'Kilimani, Nairobi',
                    bloodType: 'AB+',
                    firstName: 'Argyle',
                    lastName: 'Nderitu',
                    birthday: '2000-01-01',
                    sex: 'male',
                    image:
                      'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200',
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsue ndoaios fdisfhu fbidaiuh afhuidhi ifdhiuew diauish
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>AB+</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>March 2025</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>akakiplimo@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>0100522105</span>
                </div>
              </div>
            </div>
          </div>
          {/* small cards */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* cards */}
            <div className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] bg-white p-4 rounded-md flex gap-4">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            <div className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] bg-white p-4 rounded-md flex gap-4">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
            <div className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] bg-white p-4 rounded-md flex gap-4">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            <div className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] bg-white p-4 rounded-md flex gap-4">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">2</h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <MyCalendar />
        </div>
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Teacher&apos;s Classes
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
              Teacher&apos;s Students
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
              Teacher&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/">
              Teacher&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-indigo-50" href="/">
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
