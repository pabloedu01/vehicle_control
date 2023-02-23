import { render } from 'preact/compat';
import { useEffect, useState } from 'react';
import { useIMask } from 'react-imask';


const InputMaskPercent = ({ discountValue, handleDiscountChange, calculateAmountDiscountValue }) => {
const [ opts, setOpts ] = useState({ 
  mask: Number, 
  min: 0,
  max: 100,
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
} = useIMask(opts, { onComplete :(valueOn) =>{
  handleDiscountChange(valueOn)
} });

  useEffect(() => {
    setValue(`${discountValue}`)
    handleDiscountChange(discountValue)
  },[])

  return <input 
  ref={ref}
  value={value}
  className="form-control"
  placeholder='Digite o desconto'
  onChange={(e) => {
    setValue(e.target.value)
    handleDiscountChange(e.target.value)
  }}
/>
}


export default InputMaskPercent
