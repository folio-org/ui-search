import get from 'lodash/get';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Pane,
  Icon,
  KeyValue,
} from '@folio/stripes/components';

function renderContributors(contributors) {
  if (!contributors) return '(none)';
  return (
    <ul>
      {contributors.map((c, key) => (
        <li key={key}>
          {`${c.type}: ${c.name}`}
        </li>
      ))}
    </ul>
  );
}

function renderBody(record) {
  if (!record) return '(unknown)';
  return (
    <Fragment>
      <KeyValue label="ID">
        {record.id}
      </KeyValue>

      <KeyValue label="Title">
        {record.title}
      </KeyValue>

      <KeyValue label="Publisher">
        {record.publisher}
      </KeyValue>

      <KeyValue label="Type">
        {record.type}
      </KeyValue>

      <KeyValue label="Source">
        {record.source}
      </KeyValue>

      <KeyValue label="Contributors">
        {renderContributors(record.contributor)}
      </KeyValue>
    </Fragment>
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
    const records = get(this.props.resources, ['record', 'records']) || [];
    const record = records[0];

    return (
      <Pane
        id="pane-recorddetails"
        defaultWidth={this.props.paneWidth}
        paneTitle={(
          <span>
            <Icon icon="profile" />
            {record ? record.title : 'Record'}
          </span>
        )}
        lastMenu={<span />}
        dismissible
        onClose={this.props.onClose}
      >
        {renderBody(record)}
      </Pane>
    );
  }
}

export default ViewRecord;
