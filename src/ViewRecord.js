import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Icon from '@folio/stripes-components/lib/Icon';


function renderContributors(contributors) {
  if (!contributors) return '(none)';
  return (
    <ul>
      {contributors.map((c, key) => <li key={key}>{c.type}: {c.name}</li>)}
    </ul>
  );
}

function renderBody(record) {
  if (!record) return '(unknown)';
  return (
    <ul>
      <li><b>ID</b>: {record.id}</li>
      <li><b>Title</b>: {record.title}</li>
      <li><b>Publisher</b>: {record.publisher}</li>
      <li><b>Type</b>: {record.type}</li>
      <li><b>Source</b>: {record.source}</li>
      <li><b>Contributors</b>: {renderContributors(record.contributor)}</li>
    </ul>
  );
}


class ViewRecord extends React.Component {
  static propTypes = {
    paneWidth: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    resources: PropTypes.shape({
      record: PropTypes.object,
    }),
  }

  static manifest = Object.freeze({
    record: {
      type: 'okapi',
      path: 'codex-instances/:{id}',
    },
  });

  render() {
    const records = _.get(this.props.resources, ['record', 'records']) || [];
    const record = records[0];

    return (
      <Pane
        id="pane-recorddetails"
        defaultWidth={this.props.paneWidth}
        paneTitle={<span><Icon icon="profile" /> {record ? record.title : 'Record'}</span>}
        lastMenu={<span />}
        dismissible
        onClose={this.props.onClose}
      >{renderBody(record)}
      </Pane>
    );
  }
}

export default ViewRecord;
