import React from 'react'
import  {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps'
import Error from './Error'

class Map extends React.Component{
    constructor(props) {
        super(props)
        this.state = {selected:{}, active: null}
        this.selectLocation = this.selectLocation.bind(this)
        this.removeSelected = this.removeSelected.bind(this)
        this.closeErrorMessage = this.closeErrorMessage.bind(this)
    }

    selectLocation(index) {
        const client_id = 'WO2X12VGXWJ3V5HXIZT3LKZHMEHHZIV5JRPFTB1PG1TPCPEZ'
        const client_secret = '0DV3GODCLIEMQGCOTBDUTMWD5M1ZNC00G2LQSIRHSHRMWIRQ'
        const marker = this.props.markers.find(marker => marker.id === index);
        this.setState({active: null})
        if (marker) {

            fetch(`https://api.foursquare.com/v2/venues/search?ll=${marker.position.lat},${marker.position.lng}&client_id=${client_id}&client_secret=${client_secret}&v=20180323&limit=1`, )
            .then((result)=> {
                return result.json()
            })
            .then((result) => {
                if (result.meta.code === 200) {
                    if (result.response.venues.length > 0) {
                        fetch(`https://api.foursquare.com/v2/venues/${result.response.venues[0].id}?client_id=${client_id}&client_secret=${client_secret}&v=20180323`)
                        .then (r => {
                            return r.json()
                        })
                        .then(r => {
                            if (r.meta.code === 200) {
                                var selected = {
                                    name: r.response.venue.name,
                                    likes: r.response.venue.likes.count || '--',
                                    rating: r.response.venue.rating || '--',
                                    open: r.response.venue.popular.isOpen ? "Yes" : "No"
                                }
                                this.setState({selected: selected, active: index})
                            }
                        })
                        .catch(error => {
                            this.setState({error : 'Cannot find this location. Please try another one.'})
                        })
                    }
                }
            })
            .catch(error => {
                this.setState({error: 'Cannot connect to server. Try again later.'})
            })
        }      
    }

    
    closeErrorMessage() {
        this.setState({error: ''})
    }

    removeSelected() {
        this.setState({active: null})
    }
    render() {
        return (
            <GoogleMap
                ref={this.props.setMapRef}
                defaultZoom={12}
                defaultCenter={this.props.defaultCenter}
            >
            
            {(this.state.error) ? <Error message={this.state.error} handleClose={this.closeErrorMessage}/> : ""}
            {(this.props.markers.length > 0)
                ? this.props.markers.map((marker) => {
                    return (
                        <Marker key={marker.id} ref={marker.ref} position={marker.position} 
                            animation={(this.props.animate === marker.id) ? window.google.maps.Animation.BOUNCE : undefined}
                            onClick={() => this.selectLocation(marker.id)}>
                           {(this.state.selected !== {} && this.state.active === marker.id) 
                                ? <InfoWindow onCloseClick={this.removeSelected}>
                                    <div>
                                    <h2>{this.state.selected.name}</h2>
                                    <p>Likes: {this.state.selected.likes}</p>
                                    <p>Rating: {this.state.selected.rating}</p>
                                    <p>Open: {this.state.selected.open}</p>
                                    </div>
                                </InfoWindow>
                                : ""
                           }
                        </Marker>
                    )
                })
                : ""
            }
            </GoogleMap>
        )
    }
}

export default withGoogleMap(Map)