const MENU_ITEMS = [
    {
        key: 'companies.index',
        label: 'Empresas',
        url: '/panel/companies',
        icon: 'mdi mdi-office-building-outline',
    },

    {
        key: 'import',
        label: 'Importação',
        url: '/import/upload',
        icon: 'mdi mdi-file-import-outline',
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

            {
                key: 'clientVehicles.index',
                label: 'Veículo de passagem',
                url: '/client-vehicles/list',
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
                key: 'serviceType.index',
                label: 'Tipos de Serviços',
                url: '/service-types/list',
                icon: 'mdi mdi-toolbox-outline',
                parentKey: 'crud'
            },

            {
                key: 'maintenanceReview.index',
                label: 'Revisión de Mantenimiento',
                url: '/maintenance-reviews/list',
                icon: 'mdi mdi-toolbox-outline',
                parentKey: 'crud'
            },

            {
                key: 'recommendation.index',
                label: 'Recomendaciones',
                url: '/recommendations/list',
                icon: 'mdi mdi-toolbox-outline',
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

            {
                key: 'claimServices.index',
                label: 'Reclamações',
                url: '/claim-services/list',
                icon: 'mdi mdi-face-agent',
                parentKey: 'crud'
            },
            {
                key: 'OrderService',
                label: 'Ordem de Serviços',
                icon: 'mdi mdi-file-document', 
                parentKey: 'crud',
                children: [
                    {
                        key: 'OsType.index',
                        label: 'Tipo de OS',
                        url: '/order-service/os-type/list',
                        icon: 'mdi mdi-order-bool-ascending-variant',
                        parentKey: 'OrderService'
                    },
                    {
                        key: 'MantenanceReview.index',
                        label: 'Revisões',
                        url: '/order-service/mantenance-review/list',
                        icon: 'mdi mdi-car-wrench',
                        parentKey: 'OrderService'
                    },
                    {
                        key: 'recomentation.index',
                        label: 'Recomendações',
                        url: '/order-service/recomentation/list',
                        icon: 'mdi mdi-package',
                        parentKey: 'OrderService'
                    }
                ]
            },
        ],
    },

    {
        key: 'serviceSchedules.index',
        label: 'Agenda de Serviços',
        url: '/service-schedules/list',
        icon: 'mdi mdi-clipboard-clock',
    },
    {
        key: 'workshop.index',
        label: 'Oficina',
        url: '/workshop/estimate/list',
        icon: 'mdi mdi-garage-open-variant',
        children: [
            {
                key: 'estimate.index',
                label: 'Orçamentos',
                url: '/workshop/estimate/list',
                icon: 'mdi mdi-clipboard-text',
                parentKey: 'workshop.index'
            },
        ]
    },
];

export default MENU_ITEMS;
