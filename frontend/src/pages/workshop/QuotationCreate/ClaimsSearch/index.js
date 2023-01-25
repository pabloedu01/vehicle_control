import { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async-creatable';
import { components } from "react-select";
import {useParams} from "react-router-dom";

import { APICore } from '../../../../helpers/api/apiCore';


const NoOptionsMessage = props => {
  return (
    <components.NoOptionsMessage {...props}>
      <span className="custom-css-class">Nenhuma Reclamação encontrada</span> 
    </components.NoOptionsMessage>
  );
};

const LoadingMessage = (props) => {
  return (
    <div
      {...props.innerProps}
      style={props.getStyles("loadingMessage", props)}
    >
      <span>Carregando...</span>
    </div>
  );
};

export function ClaimsSearch ({handleClaimsData, items}) {
  const [claimsData, setClaimsData] = useState([]);
  const { companyId } = useParams();

  const api = new APICore();

  let delayTimerSearch

  function filterSearch (inputValue, data = []) {
    return data.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  function isClaimsExist (inputValue = 'Problema na bomba') {
    return claimsData.filter((i) =>
      i.description.toLowerCase() === inputValue.toLowerCase()
    ).length > 0
  }

  function promiseOptions (inputValue) {
    return new Promise((resolve, reject) => {
      if (inputValue.trim().length > 3) {
        clearTimeout(delayTimerSearch);
        
        delayTimerSearch = setTimeout(function() {
          api.get('/claim-service?company_id='+ companyId).then((res) => {
            const claims = res.data.data.map((i) => ({
              value: i.id , label: i.description, isDisabled: isClaimsExist(i.description)
            }))
            console.log(res.data.data)
            resolve(filterSearch(inputValue, claims))
          })
        }, 3000)
      } else {
        clearTimeout(delayTimerSearch);
        resolve([])
      }
    })
  };

  useEffect(() => {
    if(items) {
      setClaimsData(items)
    }
  },[items])

  return <AsyncSelect 
    defaultOptions
    isDisabled={false}
    loadOptions={promiseOptions} 
    onCreateOption={(text) => {
      if(text.trim().length > 3 && !isClaimsExist(text)) {
        handleClaimsData({
          description: text,
          company_id: companyId,
        })
      }
    }} 
    onChange={(value) => {
      console.log(value)
      console.log(isClaimsExist())
    }}
    components={{ NoOptionsMessage, LoadingMessage }}
    placeholder="Buscar Reclamações"
    formatCreateLabel={userInput => {
      if(isClaimsExist(userInput)) {
        return `Reclamação ${userInput} já existente!`
      }
      return userInput.length > 3 ? `Adicionar: ${userInput}` : 'mínimo de 4 dígitos'
    }}
  />
} 

