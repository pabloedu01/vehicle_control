var reportBro;

$(document).ready(function() {
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    reportBro = $("#reportbro").reportBro({
        saveCallback: function(){
            $.ajax('/api/checklist-version/' + getParameterByName('id') + '/report', {
                data: {
                    report: JSON.stringify(reportBro.getReport()),
                },
                type: "POST",
                headers: {
                    'Authorization': 'Bearer ' + getParameterByName('token')
                },
                success: function(data) {
                    swal({
                        title: 'Salvou',
                        icon: 'success',
                        buttons: {
                            confirm: {
                                text: 'Ok',
                                value: 'confirm'
                            }
                        },
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    swal({
                        title: 'Error',
                        icon: 'error',
                        buttons: {
                            confirm: {
                                text: 'Ok',
                                value: 'confirm'
                            }
                        },
                    })
                }
            });
        }
    });

    if(oldReport){
        if(Object.keys(oldReport).length === 5){
            reportBro.load(oldReport);
        }
    }
    reportBro.setModified(true);

    console.log(reportBro);

    var date = new Date();
    var formattedDate = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).substr(-2,2) + '-' + ('00' + (date.getDate())).substr(-2,2) + ' 12:00:00'

    var customParameters = [
        {
            'id': 3,
            'name': 'clientSignature',
            'type': 'image',
            'arrayItemType': 'string',
            'testData': '',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        },
        {
            'id': 4,
            'name': 'technicalConsultantSignature',
            'type': 'image',
            'arrayItemType': 'string',
            'testData': '',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        },
        {
            'id': 5,
            'name': 'clientSignatureDate',
            'type': 'date',
            'arrayItemType': 'string',
            'testData': formattedDate,
            'eval': false,
            'nullable': false,
            'pattern': 'dd/MM/yyyy hh:mma',
            'expression': '',
            'showOnlyNameType': false,
        },
        {
            'id': 6,
            'name': 'technicalConsultantSignatureDate',
            'type': 'date',
            'arrayItemType': 'string',
            'testData': formattedDate,
            'eval': false,
            'nullable': false,
            'pattern': 'dd/MM/yyyy hh:mma',
            'expression': '',
            'showOnlyNameType': false,
        },

        {
            'id': 7,
            'name': 'vehicleModel',
            'type': 'string',
            'arrayItemType': 'string',
            'testData': 'Model',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        },

        {
            'id': 8,
            'name': 'vehicleBrand',
            'type': 'string',
            'arrayItemType': 'string',
            'testData': 'Brand',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        },

        {
            'id': 9,
            'name': 'vehicleName',
            'type': 'string',
            'arrayItemType': 'string',
            'testData': 'Name',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        },

        {
            'id': 10,
            'name': 'vehiclePlate',
            'type': 'string',
            'arrayItemType': 'string',
            'testData': 'Plate',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        },

        {
            'id': 11,
            'name': 'vehicleChasis',
            'type': 'string',
            'arrayItemType': 'string',
            'testData': 'Chasis',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        },

        {
            'id': 12,
            'name': 'scheduleDate',
            'type': 'date',
            'arrayItemType': 'string',
            'testData': formattedDate,
            'eval': false,
            'nullable': false,
            'pattern': 'dd/MM/yyyy hh:mma',
            'expression': '',
            'showOnlyNameType': false,
        },

        {
            'id': 13,
            'name': 'clientName',
            'type': 'string',
            'arrayItemType': 'string',
            'testData': 'Chasis',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        },
    ];

    customParameters.forEach(function(parameter){
        if(!reportBro.getParameterById(parameter.id)){
            reportBro.createParameter(parameter);
        }
    });

    checklistItems.forEach(function(item){
        var id = item.id + 100;
        var type;

        switch(item.validation.type){
            case 'boolean':
                type = 'boolean';
                break;
            case 'integer':
            case 'numeric':
                type = 'number';
                break;
            default:
                type = 'string';
                break;
        }

        var parameter = reportBro.getParameterById(id);
        var observationParameter = reportBro.getParameterById(id + 5000);
        var defaultParameterBody = {
            'id': '',
            'name': '',
            'type': '',
            'arrayItemType': 'string',
            'testData': '',
            'eval': false,
            'nullable': false,
            'pattern': '',
            'expression': '',
            'showOnlyNameType': false,
        };

        if(parameter){
            reportBro.deleteParameter(parameter);
        }

        if(observationParameter){
            reportBro.deleteParameter(observationParameter);
        }

        var newParameter = Object.assign({...defaultParameterBody}, {
            'id': id,
            'name': item.formatted_name,
            'type': 'map',
            'testData': '',
            'children': [
                Object.assign({...defaultParameterBody}, {}, {
                    'id': id + 5000,
                    'name': 'Value',
                    'type': type,
                    'testData': item.preview_data.value
                }),
                Object.assign({...defaultParameterBody}, {}, {
                    'id': id + 6000,
                    'name': 'Observation',
                    'type': 'string',
                    'testData': 'Observation'
                })
            ]
        });

        reportBro.createParameter(newParameter);
        /*reportBro.createParameter({...newParameter, type: 'string', name: newParameter.name + 'Observacao', id: (newParameter.id + 5000), 'testData': 'Observacao'});*/
    });
});
