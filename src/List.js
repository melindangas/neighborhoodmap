import React from 'react'

const List = props => (
    
    <div onClick={props.handleClick} className="item">{props.name}</div>
)

export default List;