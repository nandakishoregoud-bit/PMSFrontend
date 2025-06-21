import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api'

const AllDailyReports = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [employeeFilter, setEmployeeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage, setReportsPerPage] = useState(20); // Page size state

    const [monthFilter, setMonthFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [reportType, setReportType] = useState('');
    const [exportFormat, setExportFormat] = useState('');



    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/admin/reports/dailyreports`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const sortedReports = response.data.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
                setReports(sortedReports);
                setFilteredReports(sortedReports);
                
            } catch (err) {
                console.error(err);
                setError('Failed to fetch reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    useEffect(() => {
        let filtered = [...reports];
    
        if (employeeFilter.trim() !== '') {
            filtered = filtered.filter(report =>
                report.employeeId?.toLowerCase().includes(employeeFilter.toLowerCase())
            );
        }
    
        if (fromDate !== '') {
            const from = new Date(fromDate);
            filtered = filtered.filter(report => {
                const submitted = new Date(report.submittedDate);
                return submitted >= from;
            });
        }
    
        if (toDate !== '') {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            filtered = filtered.filter(report => {
                const submitted = new Date(report.submittedDate);
                return submitted <= to;
            });
        }
    
        // ✅ Sort by latest submittedDate
        filtered.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
    
        setFilteredReports(filtered);
        setCurrentPage(1);
    }, [employeeFilter, fromDate, toDate, reports]);
    

    const fetchFilteredReports = async () => {
        const token = localStorage.getItem('token');

        if (!employeeFilter.trim()) {
            alert('Please enter Employee ID.');
            return;
        }

        try {
            let response;

            if (monthFilter && yearFilter) {
                response = await axios.get(`${BASE_URL}/admin/reports/dailyreport/${employeeFilter}/month/${monthFilter}/year/${yearFilter}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else if (yearFilter) {
                response = await axios.get(`${BASE_URL}/admin/reports/dailyreport/${employeeFilter}/year/${yearFilter}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                alert('Please provide either (Month and Year) or just Year.');
                return;
            }

            setFilteredReports(
                response.data.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
            );
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch filtered reports.');
        }
    };

    const handleExportCombined = async () => {
        if (!exportFormat || !reportType) {
            alert("Please select both report type and format.");
            return;
        }

        const token = localStorage.getItem('token');
        let url = '', fileName = '', fileExtension = exportFormat === 'excel' ? 'xlsx' : 'pdf';

        try {
            if (reportType === 'yearly') {
                if (!employeeFilter || !yearFilter) {
                    alert("Enter Employee ID and Year");
                    return;
                }

                url = `${BASE_URL}/admin/reports/dailyreport/${employeeFilter}/year/${yearFilter}/download?format=${exportFormat}`;
                fileName = `Yearly_Report_${employeeFilter}_${yearFilter}.${fileExtension}`;
            } else if (reportType === 'monthly') {
                if (!employeeFilter || !yearFilter || !monthFilter) {
                    alert("Enter Employee ID, Month and Year");
                    return;
                }

                url = `${BASE_URL}/admin/reports/dailyreport/${employeeFilter}/month/${monthFilter}/year/${yearFilter}/download?format=${exportFormat}`;
                fileName = `Monthly_Report_${employeeFilter}_${monthFilter}_${yearFilter}.${fileExtension}`;
            } else if (reportType === 'betweenDates') {
                if (!fromDate || !toDate) {
                    alert("Select From and To dates");
                    return;
                }

                url = `${BASE_URL}/admin/reports/dailyreport/download?from=${fromDate}&to=${toDate}&format=${exportFormat}`;
                fileName = `Reports_${fromDate}_to_${toDate}.${fileExtension}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Download failed");
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed. Please check inputs and try again.");
        }
    };
    


    const resetFilters = () => {
        setEmployeeFilter('');
        setFromDate('');
        setToDate('');
        setMonthFilter('');
        setYearFilter('');
        setFilteredReports(reports);
        setCurrentPage(1);
    };
    
    
    // Pagination
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>All Daily Reports</h2>
            
            <div style={styles.topControls}>
                <div style={styles.filters}>
                    <input
                        type="text"
                        placeholder="Filter by Employee ID"
                        value={employeeFilter}
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                        style={styles.input}
                    />
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

                    <input
                        type="number"
                        placeholder="Month (1-12)"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        style={styles.input}
                        min="1" max="12"
                    />
                    <input
                        type="number"
                        placeholder="Year (e.g. 2025)"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        style={styles.input}
                    />
                    <button
                        onClick={fetchFilteredReports}
                        style={styles.fetchButton}
                    >
                        Fetch Reports
                    </button>
                    <button
                        onClick={resetFilters}
                        style={styles.resetButton}
                    >
                        Reset
                    </button>

                    <div style={styles.pageSizeSelector}>
                        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                            <option value="">Select Report Type</option>
                            <option value="yearly">Yearly</option>
                            <option value="monthly">Monthly</option>
                            <option value="betweenDates">Between Dates</option>
                        </select>

                        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                            <option value="">Select Format</option>
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                        </select>

                        <button onClick={handleExportCombined} style={styles.exportButton}>Export</button>
                    </div>

                </div>

               
            </div>

            {loading && <p style={styles.loading}>Loading reports...</p>}
            {error && <p style={styles.error}>{error}</p>}
            {!loading && filteredReports.length === 0 && <p style={styles.noData}>No reports found.</p>}

            {!loading && filteredReports.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Employee ID</th>
                                <th style={styles.tableHeader}>Date & Time</th>
                                <th style={styles.tableHeader}>Hours Spent</th>
                                <th style={styles.tableHeader}>Title</th>
                                <th style={styles.tableHeader}>Report Content</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReports.map((report, index) => (
                                <tr key={index}>
                                    
                                    <td style={styles.tableCell}>{report.employeeId}</td>
                                    <td style={styles.tableCell}>{new Date(report.submittedDate).toLocaleString()}</td>
                                    <td style={styles.tableCell}>{report.hoursSpend ?? 'N/A'}</td>
                                    <td style={styles.tableCell}>{report.title}</td>
                                    <td style={styles.tableCell}>{report.reportContent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={styles.pagination}>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                style={{
                                    ...styles.pageButton,
                                    backgroundColor: currentPage === index + 1 ? '#2563eb' : '#e5e7eb',
                                    color: currentPage === index + 1 ? '#fff' : '#000', cursor: 'pointer',
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}

                    </div>

                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    heading: { textAlign: 'center', marginBottom: '20px' },
    topControls: { marginBottom: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' },
    filters: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' },
    input: { padding: '5px' },
    fetchButton: { padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white' },
    resetButton: { padding: '5px 10px', backgroundColor: '#f44336', color: 'white' },
    exportPdfButton: { padding: '5px 10px', backgroundColor: '#2196F3', color: 'white' },
    exportExcelButton: { padding: '5px 10px', backgroundColor: '#FFC107', color: 'black' },
    pageSizeSelector: { display: 'flex', alignItems: 'center', gap: '5px' },
    select: { padding: '5px' },
    tableHeader: { border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' },
    tableCell: { border: '1px solid #ddd', padding: '8px' },
    loading: { textAlign: 'center' },
    error: { color: 'red', textAlign: 'center' },
    noData: { textAlign: 'center' },
    exportButton: { padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white' },
    pagination: {
        marginTop: '15px',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',

    },

};

export default AllDailyReports;
