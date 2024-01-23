import VisitorsImage from '../components/VisitorsImage';
import VisitorReport from '../Reports/VisitorReports';
import AppointmentReport from '../Reports/AppointmentReport';
import LoginReport from '../Reports/LoginLogoutReports';
import VisitDateReport from '../Reports/VisitorVisitDateReport';
import UpdateVisitorForm from '../passes/updateVisitorForm';
import LoginPage from '../pages/login';
import ChangePassword from '../pages/changePassword';
import ViewCancelPasses from '../passes/viewCancelPass';
import AddVisitor from '../passes/AddVisitor';
import VisitorsNew from '../passes/Visitors';
import VisitorsByRange from '../pages/visitorsByDateRange';
import { AppointmentsNew } from '../pages/Appointments';
import Users from '../Users/Users';
import AddUser from '../Users/addUser';
import VisitingInfo from '../passes/VisitingInfo';
import UpdateVisitor from '../passes/updateVisitors';
import Pass from '../passes/Pass';
import Test from '../components/test';
import CreateAppointment from '../pages/CreateAppointment';
import ImageCapture from '../components/ImageCapture';


const coreRoutes = [
  {
    path: '/loginPage',
    title: 'loginPage',
    component: LoginPage,
  },
  // {  path:'/ImageCapture',
  //   component:ImageCapture
  // },
  {
    path: '/users',
    title: 'viewuser',
    component: Users,
  },
  {
    path: '/adduser',
    title: 'adduser',
    component: AddUser,
  },
  {
    path: '/create-appointment',
    title: 'createAppointment',
    component: CreateAppointment,
  },

  {
    path: '/pass/addVisitor',
    title: 'pass',
    component: AddVisitor,
  },
  {
    path: "/VisitingInfo/:Id",
    title: 'pass',
    component: VisitingInfo,
  },
  {
    path: "/updateVisitorForm/:Id",
    title: 'pass',
    component: UpdateVisitorForm,
  },
  {
    path: '/Pass/:indexId',
    title: 'pass',
    component: Pass,
  },
  {
    path: '/pass/updateVisitor',
    title: 'pass',
    component: UpdateVisitor,
  },
  {
    path: "/pass/viewPassDetails",
    title: 'pass',
    component: ViewCancelPasses,
  },

  {
    path: '/reports/VisitorReports',
    title: 'reports',
    component: VisitorReport,
  },
  {
    path: '/reports/AppointmentReport',
    title: 'reports',
    component: AppointmentReport,
  },
  {
    path: '/reports/loginReport',
    title: 'reports',
    component: LoginReport,
  },
  {
    path: '/reports/VisitorVisitDateReport',
    title: 'reports',
    component: VisitDateReport,
  },
  {
    path: '/visitors',
    title: 'visitors list',
    component: VisitorsNew,

  },
  {
    path: '/visitorlist',
    title: 'visitors list',
    component: VisitorsByRange,

  },
  {
    path: '/appointment',
    title: 'appointment list',
    component: AppointmentsNew,

  },
  {
    path: '/visitorsImage',
    title: 'visitors image',
    component: VisitorsImage,

  },
  {
    path: '/test',
    title: 'testing',
    component: Test,

  },
  {
    path: '/auth/changePassword',
    title: 'auth',
    component: ChangePassword,

  },
];

const routes = [...coreRoutes];
export default routes;
