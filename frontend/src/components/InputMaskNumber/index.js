import { render } from 'preact/compat';
import { useEffect, useState } from 'react';
import { useIMask } from 'react-imask';


const InputMaskNumber = ({ quantityValue, handleSetAmountProduct,  }) => {
const [ opts, setOpts ] = useState({ 
  mask: Number, 
  min: 0,
  radix:".",
  setUnmaskedValue: true,
});

const {
  ref,
  maskRef,
  value,
  setValue,
  unmaskedValue,
  setUnmaskedValue,
  typedValue,
  setTypedValue,
} = useIMask(opts, { onAccept :(valueOn) =>{
  handleSetAmountProduct(valueOn)
} });

  

  return <input 
  ref={ref}
  className="form-control"
  placeholder='Digite a quantidade'
/>
}


export default InputMaskNumber
