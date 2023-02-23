import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

const defaultMaskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 2, 
  integerLimit: 3, 
  allowNegative: false,
  allowLeadingZeroes: false,
}

const InputMaskPercent = ({ maskOptions, ...inputProps }) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    ...maskOptions,
  })

  return <MaskedInput mask={currencyMask} {...inputProps} />
}

InputMaskPercent.defaultProps = {
  inputMode: 'numeric',
  maskOptions: {},
}


export default InputMaskPercent
