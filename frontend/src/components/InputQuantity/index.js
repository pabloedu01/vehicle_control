import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import Form from 'react-bootstrap/Form';

export function InputQuantity({ control, className = '', name, placeholder, errors, containerClass, label }) {
  return (
        <div className={containerClass}>
          {label && <label htmlFor={name} className="form-label">{label}</label>}
          <Controller
            name={name}
            control={control}
            rules={{ required: true }}
        render={({ ref, field }) => {
          
          return (
                  <NumericFormat
                    className={`form-control ${className}`}
                    decimalScale={0}
                    ref={ref}
                    value={field.value}
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