import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import Form from 'react-bootstrap/Form';

export function InputPrice({ control, className = '', name, placeholder, errors, containerClass, label }) {
  return (
        <div className={containerClass}>
          {label && <label htmlFor={name} className="form-label">{label}</label>}
          <Controller
            name={name}
            control={control}
            rules={{ required: true }}
        render={({ ref, field }) => {
          // console.log(field);
          return (
                  <NumericFormat
                    type="text"
                    thousandsGroupStyle="thousand"
                    thousandSeparator="."
                    className={`form-control ${className}`}
                    decimalScale={2}
                    decimalSeparator=","
                    prefix={'R$ '}
                    ref={ref}
                    value={field.value?.formattedValue}
                    onValueChange={field.onChange}
                    placeholder={placeholder}
                  />
                )}}
              />
            {errors && errors[name] ? (
                <Form.Control.Feedback type="invalid" className="d-block">
                    <span dangerouslySetInnerHTML={{__html: errors[name]['message']}}/>
                </Form.Control.Feedback>
            ) : null}
        </div>
  )
}