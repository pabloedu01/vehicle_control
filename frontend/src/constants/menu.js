const MENU_ITEMS = [
    {
        key: 'companies.index',
        label: 'Empresas',
        url: '/panel/companies',
        icon: 'mdi mdi-office-building-outline',
    },



    {
        key: 'vehiclesCrud',
        label: 'Cadastro de Veículos',
        isTitle: false,
        icon: 'mdi mdi-car',
        children: [
            {
                key: 'vehicleBrands.index',
                label: 'Marcas',
                url: '/vehicle-brands/list',
                icon: 'mdi mdi-library',
                parentKey: 'vehiclesCrud'
            },
            {
                key: 'vehicleModels.index',
                label: 'Modelos',
                url: '/vehicle-models/list',
                icon: 'mdi mdi-car-info',
                parentKey: 'vehiclesCrud'
            },
            {
                key: 'vehicles.index',
                label: 'Veículos',
                url: '/vehicles/list',
                icon: 'mdi mdi-car',
                parentKey: 'vehiclesCrud'
            },
        ],
    },

    {
        key: 'crud',
        label: 'Cadastros',
        isTitle: false,
        icon: 'mdi mdi-application-edit',
        children: [
            {
                key: 'products.index',
                label: 'Produtos',
                url: '/products/list',
                icon: 'mdi mdi-animation',
                parentKey: 'crud'
            },
            {
                key: 'services.index',
                label: 'Serviços',
                url: '/services/list',
                icon: 'mdi mdi-toolbox-outline',
                parentKey: 'crud'
            },
            {
                key: 'clients.index',
                label: 'Clientes',
                url: '/clients/list',
                icon: 'mdi mdi-briefcase-account',
                parentKey: 'crud'
            },
            {
                key: 'tireBrands.index',
                label: 'Pneus',
                url: '/tire-brands/list',
                icon: 'mdi mdi-tire',
                parentKey: 'crud'
            },
            {
                key: 'technicalConsultants.index',
                label: 'Consultores Técnicos',
                url: '/technical-consultants/list',
                icon: 'mdi mdi-account-tie',
                parentKey: 'crud'
            },

        ],
    },


    {
        key: 'clientVehicles.index',
        label: 'Veículos do Clientes',
        url: '/client-vehicles/list',
        icon: 'mdi mdi-car',
    },
    {
        key: 'serviceSchedules.index',
        label: 'Agenda de Serviços',
        url: '/service-schedules/list',
        icon: 'mdi mdi-clipboard-clock',
    },
    {
        key: 'claimServices.index',
        label: 'Reclamações',
        url: '/claim-services/list',
        icon: 'mdi mdi-face-agent',
    },

];

export default MENU_ITEMS;
