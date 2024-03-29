import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

const defaultMaskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 2, 
  integerLimit: 7, 
  allowNegative: false,
  allowLeadingZeroes: false,
}

const InputMaskPrice = ({ maskOptions, ...inputProps }) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    ...maskOptions,
  })

  return <MaskedInput mask={currencyMask} {...inputProps} />
}

InputMaskPrice.defaultProps = {
  inputMode: 'numeric',
  maskOptions: {},
}

// InputMaskPrice.propTypes = {
//   inputmode: PropTypes.string,
//   maskOptions: PropTypes.shape({
//     prefix: PropTypes.string,
//     suffix: PropTypes.string,
//     includeThousandsSeparator: PropTypes.boolean,
//     thousandsSeparatorSymbol: PropTypes.string,
//     allowDecimal: PropTypes.boolean,
//     decimalSymbol: PropTypes.string,
//     decimalLimit: PropTypes.string,
//     requireDecimal: PropTypes.boolean,
//     allowNegative: PropTypes.boolean,
//     allowLeadingZeroes: PropTypes.boolean,
//     integerLimit: PropTypes.number,
//   }),
// }

export default InputMaskPrice
