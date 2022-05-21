import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import * as layoutConstants from '../constants/layout';

// All layouts/containers
import DefaultLayout from '../layouts/Default';
import VerticalLayout from '../layouts/Vertical';
import DetachedLayout from '../layouts/Detached';
import HorizontalLayout from '../layouts/Horizontal';
import FullLayout from '../layouts/Full';

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/Login'));

const Logout = React.lazy(() => import('../pages/Logout'));
const Register = React.lazy(() => import('../pages/Register'));
const ActivateUser = React.lazy(() => import('../pages/ActivateUser'));
const Confirm = React.lazy(() => import('../pages/account/Confirm'));
const ForgetPassword = React.lazy(() => import('../pages/account/ForgetPassword'));
const LockScreen = React.lazy(() => import('../pages/account/LockScreen'));

// dashboard

// -crm
const CRMDashboard = React.lazy(() => import('../pages/apps/CRM/Dashboard'));
const CRMProjects = React.lazy(() => import('../pages/apps/CRM/Projects'));
const CRMManagement = React.lazy(() => import('../pages/apps/CRM/Management'));
const CRMClients = React.lazy(() => import('../pages/apps/CRM/Clients'));
const CRMOrderList = React.lazy(() => import('../pages/apps/CRM/OrderList'));

//Services Schedules
const ServiceSchedule = React.lazy(() => import('../pages/ServiceSchedule'));

const ScheduleDetail = React.lazy(() => import('../pages/ScheduleDetail'));


// Users Manager
const Users = React.lazy(() => import('../pages/Users'));
const UsersManager = React.lazy(() => import('../pages/UsersManager')); //UsersManager

// pages

const ErrorPageNotFound = React.lazy(() => import('../pages/error/PageNotFound'));
const ServerError = React.lazy(() => import('../pages/error/ServerError'));

const Maintenance = React.lazy(() => import('../pages/other/Maintenance'));
const Starter = React.lazy(() => import('../pages/other/Starter'));


const loading = () => <div className=""></div>;


const LoadComponent = ({ component: Component }) => (
    <Suspense fallback={loading()}>
        <Component />
    </Suspense>
);

const AllRoutes = () => {
    const { layout } = useSelector((state) => ({
        layout: state.Layout,
    }));

    const getLayout = () => {
        let layoutCls = VerticalLayout;

        switch (layout.layoutType) {
            case layoutConstants.LAYOUT_HORIZONTAL:
                layoutCls = HorizontalLayout;
                break;
            case layoutConstants.LAYOUT_DETACHED:
                layoutCls = DetachedLayout;
                break;
            case layoutConstants.LAYOUT_FULL:
                layoutCls = FullLayout;
                break;
            default:
                layoutCls = VerticalLayout;
                break;
        }
        return layoutCls;
    };
    let Layout = getLayout();

    return useRoutes([
        { path: '/', element: <Root /> },
        { path: '/login', element: <LoadComponent component={Login} /> },
        {
            // public routes
            path: '/',
            element: <DefaultLayout />,
            children: [
                {
                    path: 'account',
                    children: [
                       
                        { path: 'logout', element: <LoadComponent component={Logout} /> },
                        { path: 'register', element: <LoadComponent component={Register} /> },
                        { path: 'activate-user/:code', element: <LoadComponent component={ActivateUser} /> },
                        { path: 'confirm', element: <LoadComponent component={Confirm} /> },
                        { path: 'forget-password', element: <LoadComponent component={ForgetPassword} /> },
                        { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
                    ],
                },
                {
                    path: 'error-404',
                    element: <LoadComponent component={ErrorPageNotFound} />,
                },
                {
                    path: 'error-500',
                    element: <LoadComponent component={ServerError} />,
                },
                {
                    path: 'maintenance',
                    element: <LoadComponent component={Maintenance} />,
                }
            ],
        },
        {
            // auth protected routes
            path: '/',
            element: <PrivateRoute roles={'Admin'} component={Layout} />,
            children: [
                {
                    path: 'apps',
                    children: [
                        {
                            path: 'duc',
                            children: [
                                {
                                    path: 'dashboard',
                                    element: <LoadComponent component={CRMDashboard} />,
                                },
                                {
                                    path: 'projects',
                                    element: <LoadComponent component={CRMProjects} />,
                                },
                                {
                                    path: 'management',
                                    element: <LoadComponent component={CRMManagement} />,
                                },
                                {
                                    path: 'clients',
                                    element: <LoadComponent component={CRMClients} />,
                                },
                                
                            ],
                        },
                        {
                            path: 'schedule',
                            children: [
                                {
                                    path: 'dashboard',
                                    element: <LoadComponent component={CRMDashboard} />,
                                },
                                {
                                    path: 'listas',
                                    element: <LoadComponent component={CRMOrderList} />,
                                },
                                {
                                    path: 'lista',
                                    element: <LoadComponent component={CRMProjects} />,
                                },
                                {
                                    path: 'services',
                                    element: <LoadComponent component={ServiceSchedule} />,
                                },
                                {
                                    path: 'detail',
                                    element: <LoadComponent component={ScheduleDetail} />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: 'manager',
                    children: [
                        {
                            path: 'users',
                            element: <LoadComponent component={Users} />,
                        },
                        {
                            path: 'user',//user-details
                            element: <LoadComponent component={UsersManager} />,
                        },
                    ],
                },
                {
                    path: 'pages',
                    children: [
                        {
                            path: 'starter',
                            element: <LoadComponent component={Starter} />,
                        },
                    ],
                },
            ],
        },
    ]);
};

export { AllRoutes };
