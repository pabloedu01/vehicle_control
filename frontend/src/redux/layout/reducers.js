// @flow
import { LayoutActionTypes } from './constants';

import * as layoutConstants from '../../constants/layout';

const INIT_STATE = {
    layoutColor: layoutConstants.LAYOUT_COLOR_LIGHT,
    layoutType: layoutConstants.LAYOUT_VERTICAL,
    layoutWidth: layoutConstants.LAYOUT_WIDTH_FLUID,
    leftSideBarTheme: layoutConstants.LEFT_SIDEBAR_THEME_LIGHT,
    leftSideBarType: layoutConstants.LEFT_SIDEBAR_TYPE_FIXED,
    showRightSidebar: false,
    actualUser: '',
};

const Layout = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LayoutActionTypes.CHANGE_LAYOUT:
            return {
                ...state,
                layoutType: action.payload,
            };
        case LayoutActionTypes.CHANGE_LAYOUT_COLOR:
            return {
                ...state,
                layoutColor: action.payload,
            };
        case LayoutActionTypes.CHANGE_LAYOUT_WIDTH:
            return {
                ...state,
                layoutWidth: action.payload,
            };
        case LayoutActionTypes.CHANGE_SIDEBAR_THEME:
            return {
                ...state,
                leftSideBarTheme: action.payload,
            };
        case LayoutActionTypes.CHANGE_SIDEBAR_TYPE:
            return {
                ...state,
                leftSideBarType: action.payload,
            };
        case LayoutActionTypes.SHOW_RIGHT_SIDEBAR:
            return {
                ...state,
                showRightSidebar: true,
            };
        case LayoutActionTypes.HIDE_RIGHT_SIDEBAR:
            return {
                ...state,
                showRightSidebar: false,
            };
        case 'actualUser':
            return {
                ...state,
                actualUser: action.payload,
            };
        default:
            return state;
    }
};

export default Layout;
