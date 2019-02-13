import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = {
      instances: ApplicationSerializer.prototype.serialize.apply(this, args).codexInstances,
    };

    return Array.isArray(json.instances)
      ? {
        ...json,
        resultInfo: {
          totalRecords: json.instances.length
        },
      }
      : json.instances;
  }
});
