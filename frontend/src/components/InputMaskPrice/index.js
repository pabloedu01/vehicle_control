import { useEffect, useState } from 'react';
import { useIMask } from 'react-imask';


export default function InputMaskPrice ({ handlePriceChange, priceActual = null }) {
const [ opts, setOpts ] = useState({ 
  mask: Number,
  min: 0,
  radix:".",
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
} = useIMask(opts, { onAccept:(valueOn, mask) =>{
  setValue(valueOn)
  handlePriceChange(valueOn)

} } );

  useEffect(() => {
    if(priceActual) {
      setValue(`${priceActual}`)
      handlePriceChange(priceActual)
    }
  },[priceActual])

  return <input 
  ref={ref}
  value={value}
  onChange={(e) => {
    handlePriceChange(e.target.value)
  }}
  className="form-control"
  placeholder='Digite o preço'
/>
}

