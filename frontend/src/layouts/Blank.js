// @flow
import React, { useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const loading = () => <div className=""></div>;

type DefaultLayoutProps = {};

const BlankLayout = (props: DefaultLayoutProps): React$Element<any> => {

    return (
        <Suspense fallback={loading()}>
            <div>
                <Outlet />
            </div>
        </Suspense>
    );
};
export default BlankLayout;
