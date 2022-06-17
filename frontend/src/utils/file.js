export const createAndFireInputFile = (multiple = false, fileValidationCallback = null, callbackOnLoadEnd = null) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    if(multiple){
      input.setAttribute('multiple', '');
    }
    input.setAttribute('type', 'file');
    input.setAttribute('value', null);
    input.setAttribute('id', 'temp-input-file');
    input.onchange = (inputOnChangeEvent) => {
      if(inputOnChangeEvent.target.files.length > 0){
        const files = multiple ? Array.from(inputOnChangeEvent.target.files) : [inputOnChangeEvent.target.files[0]];

        processingFiles(files,resolve, reject, multiple, fileValidationCallback, callbackOnLoadEnd);
      } else {
        reject('No seleccionaste ningun archivo.');
      }
    };
    input.style.display = 'none';
    document.body.appendChild(input);
    document.getElementById('temp-input-file').click();

    setTimeout(() => {
      document.getElementById('temp-input-file').remove();
    }, 100);
  });
};

export const dataURLtoFile = (base64String, filename) => {

  var arr = base64String.split(','),
      mimeType = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type:mimeType});
};

export const processingFiles = (files,resolve,reject, multiple = false, validateFile = null, onLoadEnd = null) => {
  if(files.length > 0){
    Promise.all(files.map( (file) => {
      return new Promise ((readAsDataURLResolve, readAsDataURLReject) => {
        if(validateFile){
          const result = validateFile(file);

          if(result === true){
            readAsDataURLResolve(file);
          } else {
            readAsDataURLReject(result);
          }
        } else {
          readAsDataURLResolve(file);
        }
      });
    })).then((files) => {
      files.forEach((file) => {
        if(onLoadEnd){
          const fileReader = new FileReader();

          fileReader.onloadend = (e) => {
            onLoadEnd(e);
          };

          fileReader.readAsDataURL(file);
        }
      });

      resolve(multiple ? files : files[0]);
    }).catch((error) => {
      reject(error);
    });
  } else {
    reject('Nenhum arquivo selecionado');
  }
};

export const prepareFormData = (data) => {
  const formData = new FormData();

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, typeof data[key] === 'object' && data[key] instanceof File === false && data[key] !== null ? JSON.stringify(data[key]) : data[key]);
    }
  }

  return formData;
};

export const getFileExtension = (file) => {
  return file.split('.').reverse()[0].toLowerCase();
};
