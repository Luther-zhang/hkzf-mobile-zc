import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Home from './pages/Home'
import City from './pages/City/index.js'
import Map from './pages/Map'
import NotFound from './pages/NotFound'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/city" component={City} />
          <Route path="/map" component={Map} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    )
  }
}

export default App
