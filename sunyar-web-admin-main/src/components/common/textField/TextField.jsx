import React from 'react';
import './textField.css'

const TextField = ({ placeHolder, type, id, className, length, mode, classNameInput }) => {

    return (
        <label className={`textField ${className}`}>
            <input className={classNameInput} type={type} id={id} placeholder=" " maxLength={length ? length : 50} autoComplete="new-password" />
            <span>{placeHolder}</span>
        </label>
    );
}

export default TextField;