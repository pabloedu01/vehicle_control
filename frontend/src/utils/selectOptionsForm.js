export const formattedOptions = (items, fieldValue = 'id', fieldLabel = 'name') => {
  return items.map((item) => {
    return {
      value: item[fieldValue],
      label: item[fieldLabel]
    };
  })
};

export const getOptionSelected = (options, value) => {
  return value !== null ? options.find((option) => option.value === value) : undefined;
};

export const addedOptionDisappeared = (options, optionSelected, data, fieldValue = 'id', fieldLabel = 'name') => {
  if(optionSelected || !data){
    return options;
  } else {
    return options.concat(optionSelected ? [] : [{value: data[fieldValue], label: data[fieldLabel] + ' ' + (data.hasOwnProperty('active') && data.active !== true ? '(Not active)' : '(Deleted)')}] );
  }
};

export const getAllOptions = (items, data, sameParent = true, fieldValue = 'id', fieldLabel = 'name') => {
  const options = formattedOptions(items);

  if(sameParent){
    const optionSelected = data ? getOptionSelected(options, data[fieldValue]) : undefined;

    return addedOptionDisappeared(options, optionSelected, data, fieldValue, fieldLabel)
  }
  else{
    return options;
  }
};
