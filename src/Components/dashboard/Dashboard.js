import React from 'react';
import ContextProvider from '../../Context'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import HamburgerIcon from '../HamburberIcon/HamburgerIcon';
import LoadingScreen from "../loading/loading";
// import FadeIn from "react-fade-in";
import { Link } from 'react-router-dom';
//import PlanTrip from './Nav/PlanTrip';
import { Spring } from 'react-spring/renderprops'
import './dashboard.css'
import Header from '../Header/Header';

class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lat: 0,
      lng: 0,
      data: { points: [] },
      loading: true,
      activeImage: "",
      error: false
    };
  }

  static contextType = ContextProvider

  componentDidMount() {
    let myVar = this;
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      myVar.context.setOriginCoords({ lat: latitude, lng: longitude })
      myVar.setState({ lat: latitude, lng: longitude })
    })
  }
  // This is a stupid solution change if possible
  componentDidUpdate() {
    if (this.state.data.points.length === 0 && this.state.lat) {
      fetch(`${process.env.REACT_APP_URL}/waypoints/nearby`, {
        method: "POST",
        body: JSON.stringify({
          lat: this.state.lat,
          lng: this.state.lng,
          query: this.context.userInterests
        }),
        headers: {
          "Content-Length": 61,
          "Content-Type": "application/json; charset=utf-8"
        },
        credentials: "same-origin"
      }).then((res) => {
        if (res.status !== 200) {
          this.setState({ error: true })
        }
        return res.json()
      }).then((data) => {
        this.setState({ data, loading: false })
      }).catch(function (error) {
        return error.message
      })
    }
  }
  async getPhoto(photo_reference) {
    let result = await fetch(`${process.env.REACT_APP_URL}/waypoints/photo`, {
      method: "POST",
      body: JSON.stringify({
        photo_reference: photo_reference
      }),
      headers: {
        "Content-Length": 61,
        "Content-Type": "application/json; charset=utf-8"
      },
      credentials: "same-origin"
    }).then(res => {
      return res.json()
    }).then(data => {
      return data
    })
    return result

  }

  renderUsername() {
    return(
      <h2>Welcome, {this.context.user.username}!</h2>
    )
  }

  renderNoUsername() {
    return(
      <h2>Welcome!</h2>
    )
  }

  render() {
    if (this.state.error === true) {
      return (
        <>
          <h2>sorry something went wrong could you try again with the link below?</h2>
          <Link to="/interests">Try again</Link>
        </>
      )
    } else if (this.state.loading === true) {
      return (<><HamburgerIcon />
        <Header />
        <LoadingScreen /></>)
    } else {
      return (
        <div>
          <Header />

          <HamburgerIcon />
          <div className='dashboard-container'>
            {this.context.user.username ? this.renderUsername() : this.renderNoUsername()}
            <Link to="/new-trip" className='start-trip-link'>Start a Trip</Link>
            <div className='new-places-container'>
              <h2>Here are some places nearby you might like to visit.</h2>
              <div className='top-options'>
                {
                  this.state.data.points.map((location, i) => {
                    return (
                      <div className='whole-option'>
                        <div className='option' ref={`${location.name}`} key={i}>

                          <Spring
                            from={{ marginLeft: -500 }}
                            to={{ marginLeft: 0 }}>
                            {props => <div style={props}><div className='title-button-container'>
                              <h2>{location.name}</h2>
                              {location.photoInfo ?
                                <> <button onClick={() => this.refs[location.name].lastChild.nodeName === "IMG" ? this.refs[location.name].removeChild(this.refs[location.name].lastChild) : this.getPhoto(location.photoInfo[0].photo_reference
                                ).then(url => {
                                  let img = document.createElement('img')
                                  img.src = url
                                  img.alt = `an image on ${location.name}`
                                  this.refs[location.name].append(img)
                                })}>See Image</button> </> : null}
                            </div></div>}
                          </Spring>

                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

        </div >

      )
    }
  }
}

export default Dashboard;