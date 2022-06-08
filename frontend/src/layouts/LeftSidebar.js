// @flow
import React, {useEffect, useRef, useState, useCallback} from 'react';
import { Link, useParams} from 'react-router-dom';
import SimpleBar from 'simplebar-react';


import { getMenuItems } from '../helpers/menu';

// components
import AppMenu from './Menu';

// images
import logoSm from '../assets/images/logo_tunap.png';
import logoDark from '../assets/images/logo_tunap.png';
import logoDarkSm from '../assets/images/logo_tunap.png';
import logo from '../assets/images/logo_tunap.png';
import profileImg from '../assets/images/users/avatar-1.jpg';
import {APICore} from "../helpers/api/apiCore";

const apiCore = new APICore();

type SideBarContentProps = {
    hideUserProfile: boolean,
    layout?: string
};

/* sidebar content */
const SideBarContent = ({ hideUserProfile, layout }: SideBarContentProps) => {
    const {companyId} = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [user, setUser] = useState(null);

    const changeUrlFromMenuItems = (items) => {
        return items.map((item) => {
            item = Object.assign(item, {});

            if(item.hasOwnProperty('url')){
                if(!item.hasOwnProperty('temporalUrl')){
                    item.temporalUrl = item.url;
                } else {
                    item.url = item.temporalUrl;
                }

                item.url = '/panel/company/' + companyId + item.url;
            }

            if(item.hasOwnProperty('children')){
                item.children = changeUrlFromMenuItems(item.children);
            }

            return item;
        });
    };

    useEffect(() => {
        setUser(apiCore.getLoggedInUser());
    }, []);

    useEffect(() => {
        if(layout === 'full'){
            const menuItems = [
                {
                    key: 'companies.index',
                    label: 'Empresas',
                    url: '/panel/companies',
                    icon: 'uil-tachometer-fast',
                },
            ];

            if(user?.privilege === 'admin'){
                menuItems.push({
                    key: 'checklistItem.index',
                    label: 'Lista de Verificação',
                    url: '/panel/checklist-items/list',
                    icon: 'uil-tachometer-fast',
                });

                menuItems.push({
                    key: 'checklistVersion.index',
                    label: 'Versão da Lista de Verificação',
                    url: '/panel/checklist-versions/list',
                    icon: 'uil-tachometer-fast',
                });
            }

            setMenuItems(menuItems);
        } else {
            setMenuItems(changeUrlFromMenuItems(getMenuItems()));
        }

    }, [companyId, user]);

    return (
        <>
            {!hideUserProfile && (
                <div className="leftbar-user">
                    <Link to="/">
                        <img src={profileImg} alt="" height="42" className="rounded-circle shadow-sm" />
                        <span className="leftbar-user-name">Dominic Keller</span>
                    </Link>
                </div>
            )}
            <AppMenu menuItems={menuItems} />

            <div className="clearfix" />
        </>
    );
};

type LeftSidebarProps = {
    hideLogo: boolean,
    hideUserProfile: boolean,
    isLight: boolean,
    isCondensed: boolean,
    layout?: string
};

const LeftSidebar = ({ isCondensed, isLight, hideLogo, hideUserProfile, layout }: LeftSidebarProps): React$Element<any> => {
    const menuNodeRef: any = useRef(null);

    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: any) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    return (
        <>
            <div className="leftside-menu" ref={menuNodeRef}>
                {!hideLogo && (
                    <>
                        <Link to="/" className="logo text-center logo-light">
                            <span className="logo-lg">
                                <img src={isLight ? logoDark : logo} alt="logo" height="40"  />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? logoSm : logoDarkSm} alt="logo" height="40"   />
                            </span>
                        </Link>

                        <Link to="/" className="logo text-center logo-dark">
                            <span className="logo-lg">
                                <img src={isLight ? logoDark : logo} alt="logo" height="50"   />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? logoSm : logoDarkSm} alt="logo" height="50"   />
                            </span>
                        </Link>
                    </>
                )}

                {!isCondensed && (
                    <SimpleBar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
                        <SideBarContent
                            menuClickHandler={() => {}}
                            isLight={isLight}
                            hideUserProfile={hideUserProfile}
                            layout={layout}
                        />
                    </SimpleBar>
                )}
                {isCondensed && <SideBarContent isLight={isLight} hideUserProfile={hideUserProfile} layout={layout}/>}
            </div>
        </>
    );
};

LeftSidebar.defaultProps = {
    hideLogo: false,
    hideUserProfile: false,
    isLight: false,
    isCondensed: false,
};

export default LeftSidebar;
