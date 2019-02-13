/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
export default function defaultScenario(server) {
  const INSTANCES_NUMBER = 3;
  server.createList('codex-instance', INSTANCES_NUMBER);
}
