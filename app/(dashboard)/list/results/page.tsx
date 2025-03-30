import FormModal from '@/app/components/form-modal';
import Pagination from '@/app/components/pagination';
import Table from '@/app/components/table';
import TableSearch from '@/app/components/table-search';
import { resultsData, role } from '@/app/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type ResultInfo = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  student: string;
  date: string;
  type: 'exam' | 'assignment';
  score: number;
};

const columns = [
  { header: 'Subject Name', accessor: 'subject' },
  {
    header: 'Student',
    accessor: 'student',
  },
  {
    header: 'Score',
    accessor: 'score',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Teacher',
    accessor: 'teacher',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Class',
    accessor: 'class',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Date',
    accessor: 'dueDate',
    className: 'hidden md:table-cell',
  },
  { header: 'Actions', accessor: 'actions' },
];

const ResultsList = () => {
  const renderRow = (item: ResultInfo) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 text-sm even:bg-slate-50 hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.subject}</h3>
          </div>
        </td>
        <td className="">{item.student}</td>
        <td className="hidden md:table-cell">{item.score}</td>
        <td className="hidden md:table-cell">{item.teacher}</td>
        <td className="hidden md:table-cell">{item.class}</td>
        <td className="hidden md:table-cell">{item.date}</td>
        <td>
          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <>
                <FormModal table="result" type="update" data={item} />
                <FormModal table="result" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table="result" type="create" />}
          </div>
        </div>
      </div>
      {/* list */}
      <Table columns={columns} renderRow={renderRow} data={resultsData} />
      {/* pagination */}
      <Pagination />
    </div>
  );
};

export default ResultsList;
