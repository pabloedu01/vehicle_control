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

        var parameter = reportBro.getParameterById(id)
        var defaultParameter = {
            'id': id,
            'name': item.formatted_name,
            'type': type,
            'arrayItemType': 'string',
            'testData': item.preview_data.value
        };

        if(parameter){
            reportBro.deleteParameter(parameter);

            parameter = Object.assign(parameter ?? {}, defaultParameter);
        } else {
            parameter = Object.assign({
                'eval': false,
                'nullable': false,
                'pattern': '',
                'expression': '',
                'showOnlyNameType': false,
            }, defaultParameter);
        }

        reportBro.createParameter(parameter);
    });
});
