import { Form } from "react-bootstrap"
import React from "react";

const FormLayout = React.forwardRef(({className='', ...props}, ref) => (
    <Form
    className={`bg-light rounded px-2 py-3 ${className}`}
    ref={ref}
    {...props}>
    </Form>
));
FormLayout.displayName = 'Form'

const FormGroup = React.forwardRef(({className='', ...props}, ref) => (
    <Form.Group className={`px-5 py-4 ${className}`} ref={ref} {...props}>
    </Form.Group>
));

const FormItem = React.forwardRef(({className='', ...props}, ref)=> (
    <div ref={ref} className={`${className}`} {...props}/>
));
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef(({className='', ...props}, ref)=>(
    <Form.Label ref={ref} className={`fw-bold small ${className}`} {...props} />
));
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef(({className='', type ='', placeholder='',...props}, ref) => (
    <Form.Control
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`shadow-none ${className}`}
      {...props}
    />
));
FormControl.displayName = 'FormControl';

export {FormLayout, FormGroup, FormItem, FormLabel, FormControl };
