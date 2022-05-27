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
        key: 'technicalConsultants.index',
        label: 'Consultores Técnicos',
        url: '/technical-consultants/list',
        icon: 'uil-tachometer-fast',
    },

    {
        key: 'vehicleBrands.index',
        label: 'Marcas',
        url: '/vehicle-brands/list',
        icon: 'uil-tachometer-fast',
    },

    {
        key: 'uil-money-withdrawal',
        label: 'Services Scheduler',
        url: '/apps/schedule/services',
        icon: 'uil-tachometer-fast',

    },
];

export default MENU_ITEMS;
