// @flow
import React from 'react';
import { useForm } from 'react-hook-form';

type VerticalFromProps = {
    defaultValues?: Object,
    resolver?: any,
    children?: any,
    onSubmit?: (value: any) => void,
    customMethods?: any,
    formClass?: string,
};

const VerticalForm = ({
    defaultValues,
    resolver,
    children,
    onSubmit,
    customMethods,
    formClass,
}: VerticalFromProps): React$Element<any> => {
    /*
     * form methods
     */

    let methods = useForm({ defaultValues, resolver });

    if(customMethods){
        methods = customMethods;
    }

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

    return (
        <form onSubmit={handleSubmit(onSubmit, (e) => {console.log(e);})} className={formClass} noValidate>
            {Array.isArray(children)
                ? children.map((child) => {
                      return child.props && child.props.name
                          ? React.createElement(child.type, {
                                ...{
                                    ...child.props,
                                    register,
                                    key: child.props.name,
                                    errors,
                                    control,
                                },
                            })
                          : child;
                  })
                : children}
        </form>
    );
};

export default VerticalForm;
