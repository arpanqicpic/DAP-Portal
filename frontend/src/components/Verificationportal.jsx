
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

function Verificationportal() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get('http://localhost:5000/verify/verificationData')
      .then((result) => {
        setData(result.data);
        setFilteredData(result.data.filter((item) => item.status === 'pending'));
        console.log(result.data);
      })
      .catch((err) => {
        console.log('Error fetching profile data:', err);
      });
  }, []);

console.log(data)

  useEffect(() => {
    const handler = debounce(() => setDebouncedQuery(searchQuery), 300);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  useEffect(() => {
    const filtered = data
      .filter((row) => (statusFilter !== 'all' ? row.status === statusFilter : true))
      .filter((row) => {
        return (
          row.merchant_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          row.merchant_lead_id.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          row.tlid.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          row.sector_id.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
      });

    setFilteredData(filtered);
  }, [debouncedQuery, statusFilter, data]);

  const handleFilterChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
  };

  const handleViewDetails = (row) => {
    navigate('/merchatdetails', { state: { row } });
  };

  const highlightSearchTerm = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="text-yellow-500 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };


  const indexOfLastEmployee = currentPage * rowsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
    const currentEmployees = filteredData.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // Pagination handlers
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
        console.log(currentEmployees)
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1); // Reset to first page when rows per page change
    };


  

  return (
    <div className=" overflow-x-auto rounded-lg border border-gray-200 shadow-lg max-h-[72vh] mt-2">
      <div className="flex justify-around mt-2 mb-2 ">
        

        <div className=" relative  z-100 border border-gray-800 shadow-sm rounded-full w-72 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill=""
            className="absolute w-5 h-5 top-1/2 left-3 transform -translate-y-1/2 text-slate-600"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by any data"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 border border-gray-300 bg-white-800 rounded-full px-3 py-2 text-sm shadow focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all"
          />
        </div>
      </div>

      <table id="data-table" className="w-full border-collapse text-sm text-gray-700">
        <thead className="bg-gray-200">
          <tr>
            <th className="sticky top-0 border-b border-gray-300 px-4 py-3 text-center bg-gray-100">Merchant Lead ID</th>
            <th className="sticky top-0 border-b border-gray-300 px-4 py-3 text-center bg-gray-100">Merchant Name</th>
            <th className="sticky top-0 border-b border-gray-300 px-4 py-3 text-center bg-gray-100">EMP ID</th>
            <th className="sticky top-0 border-b border-gray-300 px-4 py-3 text-center bg-gray-100">Sector ID</th>
            <th className="sticky top-0 border-b border-gray-300 px-4 py-3 text-center bg-gray-100">
              <select
                className="p-2 border-2 rounded-lg"
                value={statusFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
            </th>
            <th className="sticky top-0 border-b border-gray-300 px-4 py-3 text-center bg-gray-100">TimeStamp</th>
            <th className="sticky top-0 border-b border-gray-300 px-4 py-3 text-center bg-gray-100">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentEmployees.map((row, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-all`}>
              <td className="border-b border-gray-300 px-4 py-3 text-center">{row.merchant_lead_id}</td>
              <td className="border-b border-gray-300 px-4 py-3 text-center">{highlightSearchTerm(row.merchant_name, debouncedQuery)}</td>
              <td className="border-b border-gray-300 px-4 py-3 text-center">{row.tlid}</td>
              <td className="border-b border-gray-300 px-4 py-3 text-center">{row.sector_id}</td>
              <td className="border-b border-gray-300 px-4 py-3 text-center">
                <span
                  className={classNames({
                    'text-green-500': row.status === 'Accepted',
                    'text-red-500': row.status === 'Rejected',
                    'text-yellow-500': row.status === 'pending',
                  })}
                >
                  {row.status || 'pending'}
                </span>
              </td>
              <td className="border-b border-gray-300 px-4 py-3 text-center">{row.submitted}</td>
              <td className="border-b border-gray-300 px-4 py-3 text-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => handleViewDetails(row)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       {/* Footer */}
       <footer className="fixed bottom-0 left-0 w-full  p-2 border-t shadow-lg flex justify-center gap-4 items-center  from-white-800 to-white-200 shadow-xl  z-100">

<button
    onClick={handlePrevPage}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gradient-to-r to-orange-400 from-yellow-200 ... text-black rounded disabled:bg-gray-300"
>
    Prev
</button>
<p className="text-sm font-medium">
    Page {currentPage} of {totalPages}
</p>
<button
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-gradient-to-r to-orange-400 from-yellow-200 ... text-black rounded disabled:bg-gray-300"
>
    Next
</button>
</footer>
    </div>
  );
}

export default Verificationportal;




