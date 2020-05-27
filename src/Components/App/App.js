import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';
import Header from '../Header';
import Dashboard from '../Dashboard';
import NotFound from '../NotFound';
import PlanTrip from '../Nav/PlanTrip';
import LandingPage from '../LandingRoute/LandingPage'
import MapContainer from '../MapContainer/MapContainer'
import Interests from '../../Interests/Interests'


class App extends React.Component {
  render(){
    return (
      <main className='App'>

        <Router>
          <Header />
          <Switch>
            <Route exact path={'/'} component={LandingPage} />
            <Route
              path={'/register'}
              component={Register}>
            </Route>
            <Route
              path={'/login'}
              component={Login}>
            </Route>
            <Route
              path={'/dashboard'}
              component={Dashboard}>
            </Route>
            <Route 
            path={'/new-trip'} 
            component={PlanTrip}>
            </Route>
            <Route 
            path={'/map'} 
            component={MapContainer}>
            </Route>
            <Route 
            path={'/interests'} 
            component={Interests}>
            </Route>
            <Route
            component={NotFound}>
            </Route>
        </Switch>
        </Router>
      </main>
    );
  }
}

export default App;