import { render } from 'preact/compat';
import { useEffect, useState } from 'react';
import { useIMask } from 'react-imask';


const InputMaskNumber = ({ quantityInitial, handleSetAmount,  }) => {
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
  handleSetAmount(valueOn)
} });


  useEffect(() => {
    setValue(`${quantityInitial}`)
    handleSetAmount(quantityInitial)
  }, []);

  return <input 
  ref={ref}
  value={value}
  onChange={(e) => {
    handleSetAmount(e.target.value)
  }}
  className="form-control"
  placeholder='Digite a quantidade'
/>
}


export default InputMaskNumber
