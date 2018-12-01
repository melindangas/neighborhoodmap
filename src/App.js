import React from 'react'
import Map from './Map'
import List from './List'
import Search from './Search'
import {MAP, MARKER} from 'react-google-maps/lib/constants'

import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

class App extends React.Component {
  defaultLatLng = {lat: 32.7157, lng: -117.1611}

  constructor(props) {
    super(props)
    this.state = {searchTerms: "", markers: [], defaultCenter: this.defaultLatLng, animate: null, showSideBar: false}
    this.handleChangeFilter = this.handleChangeFilter.bind(this)
    this.renderList = this.renderList.bind(this)
    this.setMapRef = this.setMapRef.bind(this)
    this.getDefaultLocations = this.getDefaultLocations.bind(this)
    this.handleListClick = this.handleListClick.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }

  handleChangeFilter(value) {
    this.setState({searchTerms: value})
  }

  setMapRef(map) {
    this.mapRef = map
    this.getDefaultLocations()
  }

  getDefaultLocations(){
    const service = new window.google.maps.places.PlacesService(this.mapRef.context[MAP])
    service.textSearch(
      {
        query: 'fast food',
        radius: 50,
        location: new window.google.maps.LatLng(this.defaultLatLng.lat, this.defaultLatLng.lng)
      }, 
      (results, status) => {
        if (status ===  window.google.maps.places.PlacesServiceStatus.OK) {
          var markers = results.map(result => {
            return {
              id: result.place_id,
              position: {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
              },
              name: result.name,
              ref: React.createRef()
            }
          })
          this.setState({markers: markers})
        }
    })
  }

  handleListClick(index) {
    var marker = this.state.markers.find(marker => marker.id === index);
    if (marker) {
      this.setState({'animate': marker.id})
      setTimeout(() => this.setState({animate: null}), 1000)
    }
  }

  renderList(markers) {
    let filteredMarkers = [];

    if (this.state.searchTerms === "") {
      filteredMarkers = markers;
    } else {    
      filteredMarkers = markers.filter(marker => marker.name.toUpperCase().indexOf(this.state.searchTerms.toUpperCase()) > -1)
    }

    return filteredMarkers.map((marker) => {
      return <List key={marker.id} name={marker.name} handleClick={() => this.handleListClick(marker.id)}/>
    })
  }
  toggleSidebar(){
    this.setState({showSideBar: !this.state.showSideBar})
  }

  render() {
    return (
      <div className="app">
        <div className="header">
          <div className="row">
            <div className="logo">Maple</div>
            <div className="menu" onClick={this.toggleSidebar}><i className="fas fa-bars"></i></div>
          </div>
        </div>
        <div className="content">
          <div className="row">
            <div className="col-sm-8">
              <div className="map">
                <Map 
                  animate= {this.state.animate}
                  setMapRef={this.setMapRef}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div className="map-container" style={{ height: `100%` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  defaultCenter={this.state.defaultCenter} markers={this.state.markers}/>
              </div>  
            </div>
            <div className={"col-sm-4 sidebar " + (this.state.showSideBar ? " show" : "")}>
              <div className="col-sm-12 search-box"><Search changeFilter={this.handleChangeFilter} value={this.state.searchTerms}/></div>
              <div className="list">{this.renderList(this.state.markers)}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
