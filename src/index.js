import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Search from './Search';
import Settings from './Settings';

class Routing extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.connectedApp = props.stripes.connect(Search);
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={() => <this.connectedApp {...this.props} />}
        />
        <Route component={() => <div><p>Uh-oh!</p></div>} />
      </Switch>
    );
  }
}

export default hot(module)(Routing);
