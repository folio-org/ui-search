import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Icon from '@folio/stripes-components/lib/Icon';

// eslint-disable-next-line react/prefer-stateless-function
class ViewRecord extends React.Component {
  static propTypes = {
    paneWidth: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const detailMenu = <span>detailMenu</span>;
    return (
      <Pane
        id="pane-recorddetails"
        defaultWidth={this.props.paneWidth}
        paneTitle={<span><Icon icon="profile" /> {'Record'}</span>}
        lastMenu={detailMenu}
        dismissible
        onClose={this.props.onClose}
      >
        <p>Viewing full record</p>
      </Pane>
    );
  }
}

export default ViewRecord;
