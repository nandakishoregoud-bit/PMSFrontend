import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import ProjectsPage from './pages/ProjectsPage';
import EmployeeRegistration from './pages/EmployeeRegistration';
import UnActiveEmployees from './pages/UnActiveEmployees';
import ForgotPassword from './pages/ForgotPassword';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import EmployeeProjectsPage from './pages/EmployeeProjectsPage';
import SubmitReportFormPage from './pages/SubmitReportFormPage';
import AllDailyReportsPage from './pages/AllDailyReportsPage';
import AssignTaskPage from './pages/AssignTaskPage';
import AdminTaskScreenPage from './pages/AdminTaskScreenPage';
import ManagerTasksPage from './pages/ManagerTasksPage';
import ManagerHeader from './components/ManagerHeader';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import ManagerProjectsPage from './pages/ManagerProjectsPage';
import ManagerdailyreportPage from './pages/MangerdailyreportPage';
import ManagerTaskPage from './pages/ManagerTaskPage';
import EmployeeTaskScreenPage from './pages/EmployeeTaskScreenPage';
import DiActiveEmployeePage from './pages/DiActiveEmployeePage';
import AdminProfilePage from './pages/AdminProfilePage';
import ManagerProfilePage from './pages/ManagerProfilePage';
import ManagerTaskScreenPage from './pages/ManagerTaskScreenPage';
import LoginRecordsPage from './pages/LoginRecordsPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />     { /*for all */}
        <Route path="/register" element={<EmployeeRegistration />} />   { /* for all*/}
        <Route path="/password" element={< ForgotPassword />} />   { /*For all */}
        <Route path="/loginrecords" element={<LoginRecordsPage />} />
       
       
        <Route path="/dashboard" element={<DashboardPage />} />    { /*Admin */}
        <Route path="/employees" element={<EmployeesPage />} />   { /*Admin */}
        <Route path="/Diemployees" element ={ < DiActiveEmployeePage />} /> {/* Admin */ }
        <Route path="/projects" element={<ProjectsPage />} />    { /* Admin and Manager */}
        <Route path='/request' element={< UnActiveEmployees />} />   { /* Admin  */}
        <Route path="/alldailyreports" element={< AllDailyReportsPage />} />  { /* Admin */}
        <Route path="/tasks" element={< AssignTaskPage />} />  { /* Admin and Manger */}
        <Route path="/admintasks" element={< AdminTaskScreenPage />} />   {/* Admin*/}
        <Route path='/AdminProfile' element={< AdminProfilePage />} />  {/* Admin*/}


        <Route path="/Managerdashboard" element={<ManagerDashboardPage />} />  { /* Manager*/}
        <Route path='/Manprojects' element={< ManagerProjectsPage />} />   { /* Manager*/}
        <Route path='/mandailyreport' element={< ManagerdailyreportPage />} />  { /* Manager*/}
        <Route path='/Mantasks' element={< ManagerTaskPage />} />   { /* Manager*/}
        <Route path='/PersonTasks' element={< ManagerTasksPage />} />   { /* Manager */}
        <Route path='/Manger' element={< ManagerHeader />} />   { /*Manager */}
        <Route path='/Manprofile' element={<ManagerProfilePage />} />
        <Route path='/ManTasksToYou' element={< ManagerTaskScreenPage />} />
        {/* We will later add routes for employees and projects */}

        <Route path='/dash' element={< EmployeeDashboardPage />} /> { /* Employee */}
        <Route path='/profile' element={< UserProfilePage />} />  { /*Employee */}
        <Route path='/empprojects' element={< EmployeeProjectsPage />} />  { /* Employee*/}
        <Route path='/dailyReport' element={< SubmitReportFormPage />} />  { /* Employee & Manager */}
        <Route path='/EmpTasks' element={< EmployeeTaskScreenPage />} />  { /* Employee */}
        
      </Routes>
    </Router>
  );
};

export default App;
