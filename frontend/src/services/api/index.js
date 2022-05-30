// const baseUrl = 'https://tunap-intranet-backend.herokuapp.com/api'; //
import config from '../../config';
import {toastService} from "../../services/toast";
import {loadingService} from "../loading";
import {APICore} from "../../helpers/api/apiCore";

const apiCore = new APICore();

const baseUrl = config.API_URL;

const request = async (method, endpoint, params, token = null, taketwo = null) => {
    try {
        loadingService.show();
        method = method.toLowerCase();
        let fullUrl = `${baseUrl}${endpoint}`;
        let body = null;
        switch (method) {
            case 'get':
                let queryString = new URLSearchParams(params).toString();
                fullUrl += `?${queryString}`;
                break;
            case 'post':
            case 'put':
            case 'delete':
                body = JSON.stringify(params);
                break;
        }
        let headers;
        if (taketwo) {
            headers = { 'Content-Type': 'application/pdf' };
        } else {
            headers = { 'Content-Type': 'application/json' };
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        let req = await fetch(fullUrl, { method, headers, body });

        let json = await req.json();

        json['httpCode'] = req.status;

        switch(req.status){
            case 201:
                toastService.show('success','Salvo com sucesso.');
                break;
            case 500:
                toastService.show('error',json.msg || 'Ha ocorreu um erro interno.');
                break;
            case 400:
                toastService.show('error',json.msg || 'Dados inválidos.');
                break;
            case 401:
                toastService.show('error',json.msg || 'Não autorizado.');
                break;
            case 404:
                toastService.show('error',json.msg || 'Não encontrado.');
                break;
            default:
                break;
        }

        loadingService.hide();

        return json;
    } catch (error) {
        loadingService.hide();
        return { error: 'Erro de Conexão com API' };
    }
};

export default () => {
    const token = apiCore.getLoggedInUser()?.token || null;

    return {
        // funções basicas de login
        getToken: () => {
            return apiCore.getLoggedInUser();
        },
        validateToken: async () => {
            let json = await request('post', '/auth/check-token', {}, token);
            return json;
        },
        login: async (data) => {
           
            let json = await request('post', '/login', data, {});
            return json;
        },
        logout: async () => {
            let json = await request('post', '/logout', {}, token);
            localStorage.removeItem('token');
            return json;
        },
        checkMe: async () => {
            let json = await request('post', '/auth/me', {}, token);
            return json;
        },
        signup: async (data) => {
            let json = await request('post', '/register', data, {});
            return json;
        },
        activateUser: async (data) => {
            let json = await request('post', '/activate-user', data, {});
            return json;
        },
        getSchedules: async () => {
            let json = await request('get', '/service-schedule' ,"company_id=1", token);
            return json;
        },
        delSchedules: async (id) => {
            let json = await request('get', `/service-schedule/${id}` , {}, token);
            return json;
        },
        ///api/client?company_id=1
        getClients: async () => {
            let json = await request('get', '/client' ,"company_id=1", token);
            return json;
        },
        ///api/technical-consultant?company_id=1
        getTechnicalConsultant: async () => {
            let json = await request('get', '/technical-consultant' ,"company_id=1", token);
            return json;
        },
        ///api/vehicle?company_id=1
        getVehicles: async () => {
            let json = await request('get', '/vehicle' ,"company_id=1", token);
            return json;
        },
        ///api/vehicle-brand?company_id=1
        getVehicleBrand: async () => {
            let json = await request('get', '/vehicle-brand' ,"company_id=1", token);
            return json;
        },
        ///api/vehicle-model?brand_id=1
        getVehicleModel: async () => {
            let json = await request('get', `/vehicle-model` ,"brand_id=1", token);
            return json;
        },
        ///api/checklist-version?brand_id=1
        getChecklistVersion: async (id) => {
            let json = await request('get', `/checklist-version` ,"brand_id=1", token);
            return json;
        },
       ///api/vehicle?model_id=1
        getVehicle: async () => {
            let json = await request('get', `/vehicle` ,"model_id=1", token);
            return json;
        },
        //Fecthc route: /api/claim-service?company_id=1
        getClaims: async () => {
            let json = await request('get', `/claim-service` ,"company_id=1", token);
            return json;
        },
        // get /api/service?company_id=1
        getServices: async () => {
            let json = await request('get', `/service` ,"company_id=1", token);
            return json;
        },
        getProducts: async () => {
            let json = await request('get', `/product` ,"company_id=1", token);
            return json;
        }

        

    };
};
