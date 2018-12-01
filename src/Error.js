import React from 'react'

const Error = (props) => (
    <div className="error-message" onClick={props.handleClose}>{props.message} </div>
)

export default Error;