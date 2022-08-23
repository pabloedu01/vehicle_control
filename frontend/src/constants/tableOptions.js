const TABLE_OPTIONS = {
    filter: true,
    filterType: 'dropdown',
    tableBodyWidth: '100%',
    responsive: 'vertical',
    tableBodyHeight: 'calc(45vh)',
    searchText: '',
    sizePerPageList:[
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: 'All',
            value: 50000,
        }],
};

export default TABLE_OPTIONS;
