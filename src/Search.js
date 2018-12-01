import React from 'react'

const Search = (props) => (
    <div className="search">
        <input  placeholder="Search" className="form-control" value={props.value} onChange={(e) => props.changeFilter(e.target.value)}></input>
    </div>
)

export default Search;