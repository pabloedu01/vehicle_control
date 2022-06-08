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

    /*{
        key: 'checklist.index',
        label: 'Checklist',
        url: '/panel/checklist',
        icon: 'uil-tachometer-fast',
    },
    {
        key: 'checklistVersion.index',
        label: 'Checklist Versión',
        url: '/panel/checklist-version',
        icon: 'uil-tachometer-fast',
    },*/

    {
        key: 'technicalConsultants.index',
        label: 'Consultores Técnicos',
        url: '/technical-consultants/list',
        icon: 'uil-tachometer-fast',
    },

    {
        key: 'vehiclesCrud',
        label: 'Cadastro de Vehiculos',
        isTitle: false,
        icon: 'uil-users-alt',
        children: [
            {
                key: 'vehicleBrands.index',
                label: 'Marcas',
                url: '/vehicle-brands/list',
                icon: 'uil-tachometer-fast',
                parentKey: 'vehiclesCrud'
            },
            {
                key: 'vehicleModels.index',
                label: 'Modelos',
                url: '/vehicle-models/list',
                icon: 'uil-tachometer-fast',
                parentKey: 'vehiclesCrud'
            },
            {
                key: 'vehicles.index',
                label: 'Vehiculos',
                url: '/vehicles/list',
                icon: 'uil-tachometer-fast',
                parentKey: 'vehiclesCrud'
            },
        ],
    },

    {
        key: 'clientVehicles.index',
        label: 'Vehiculos do Clientes',
        url: '/client-vehicles/list',
        icon: 'uil-tachometer-fast',
    },

    {
        key: 'serviceSchedules.index',
        label: 'Horários de Serviço',
        url: '/service-schedules/list',
        icon: 'uil-tachometer-fast',
    },
    {
        key: 'clients.index',
        label: 'Clientes',
        url: '/clients/list',
        icon: 'uil-tachometer-fast',
    },



];

export default MENU_ITEMS;
