import React, { Suspense, useEffect, useState, useNa } from 'react';
import {useParams, useRoutes, useNavigate} from 'react-router-dom';
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
import {APICore} from "../helpers/api/apiCore";

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/Login'));
const Logout = React.lazy(() => import('../pages/Logout'));
const Register = React.lazy(() => import('../pages/Register'));
const ActivateUser = React.lazy(() => import('../pages/ActivateUser'));

//panel
const Companies = React.lazy(() => import('../pages/Companies'));

//panel/company
const TechnicalConsultantList = React.lazy(() => import('../pages/technical-consultant/List'));
const TechnicalConsultantForm = React.lazy(() => import('../pages/technical-consultant/Form'));

const VehicleBrandList = React.lazy(() => import('../pages/vehicle-brand/List'));
const VehicleBrandForm = React.lazy(() => import('../pages/vehicle-brand/Form'));

const VehicleModelList = React.lazy(() => import('../pages/vehicle-model/List'));
const VehicleModelForm = React.lazy(() => import('../pages/vehicle-model/Form'));

const VehicleList = React.lazy(() => import('../pages/vehicle/List'));
const VehicleForm = React.lazy(() => import('../pages/vehicle/Form'));

const ClientVehicleList = React.lazy(() => import('../pages/client-vehicle/List'));
const ClientVehicleForm = React.lazy(() => import('../pages/client-vehicle/Form'));


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
const api = new APICore();

const LoadComponent = ({ component: Component }) => {
    const history = useNavigate();
    const {companyId} = useParams();
    const [company, setCompany] = useState({id: companyId});

    const getCompany = (id) => {
        if(id){
            api.get('/company/' + id).then((response) => {
                setCompany(response.data.data);
            }, (error) => {
                setCompany(null);
                history('/panel/companies');
            });
        } else {
            setCompany(null);
        }
    };

    useEffect(() => {
        getCompany(companyId);
    }, [companyId]);

    return (
        <Suspense fallback={loading()}>
            <Component company={company}/>
        </Suspense>
    );
};

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
                { path: 'logout', element: <LoadComponent component={Logout} /> },
                { path: 'register', element: <LoadComponent component={Register} /> },
                { path: 'activate-user/:code', element: <LoadComponent component={ActivateUser} /> },
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
            path: 'panel',
            element: <PrivateRoute roles={'Admin'} component={FullLayout} />,
            children: [
                { path: 'companies', element: <LoadComponent component={Companies} /> },
            ]
        },
        {
            path: 'panel/company/:companyId',
            element: <PrivateRoute roles={'Admin'} component={Layout} />,
            children: [
                {
                    path: 'dashboard',
                    element: <LoadComponent component={CRMDashboard} />,
                },
                {
                    path: 'technical-consultants',
                    children: [
                        {
                            path: 'list',
                            element: <LoadComponent component={TechnicalConsultantList} />,
                        },
                        {
                            path: 'create',
                            element: <LoadComponent component={TechnicalConsultantForm} />,
                        },
                        {
                            path: ':id/edit',
                            element: <LoadComponent component={TechnicalConsultantForm} />,
                        },
                    ]
                },
                {
                    path: 'vehicle-brands',
                    children: [
                        {
                            path: 'list',
                            element: <LoadComponent component={VehicleBrandList} />,
                        },
                        {
                            path: 'create',
                            element: <LoadComponent component={VehicleBrandForm} />,
                        },
                        {
                            path: ':id/edit',
                            element: <LoadComponent component={VehicleBrandForm} />,
                        },
                    ]
                },
                {
                    path: 'vehicle-models',
                    children: [
                        {
                            path: 'list',
                            element: <LoadComponent component={VehicleModelList} />,
                        },
                        {
                            path: 'create',
                            element: <LoadComponent component={VehicleModelForm} />,
                        },
                        {
                            path: ':id/edit',
                            element: <LoadComponent component={VehicleModelForm} />,
                        },
                    ]
                },
                {
                    path: 'vehicles',
                    children: [
                        {
                            path: 'list',
                            element: <LoadComponent component={VehicleList} />,
                        },
                        {
                            path: 'create',
                            element: <LoadComponent component={VehicleForm} />,
                        },
                        {
                            path: ':id/edit',
                            element: <LoadComponent component={VehicleForm} />,
                        },
                    ]
                },

                {
                    path: 'client-vehicles',
                    children: [
                        {
                            path: 'list',
                            element: <LoadComponent component={TechnicalConsultantList} />,
                        },
                        {
                            path: 'create',
                            element: <LoadComponent component={TechnicalConsultantForm} />,
                        },
                        {
                            path: ':id/edit',
                            element: <LoadComponent component={TechnicalConsultantForm} />,
                        },
                    ]
                },
            ]
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
