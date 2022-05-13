const MENU_ITEMS = [
    { key: 'navigation', label: 'Navigation', isTitle: true },

    { key: 'apps', label: 'Apps', isTitle: true },
    {
        key: 'managers',
        label: 'Manager',
        isTitle: false,
        icon: 'uil-users-alt',
        children: [
            {
                key: 'users',
                label: 'Usuarios',
                url: '/manager/users',
                parentKey: 'managers',
            },
        ],
    },

    {
        key: 'uil-money-withdrawal',
        label: 'Services Scheduler',
        url: '/apps/schedule/services',
        parentKey: 'apps-crm',
        icon: 'uil-tachometer-fast',
       
    },
];

export default MENU_ITEMS;
