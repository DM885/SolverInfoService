import {host, query, subscriber} from './helpers.js';

export async function listSolvers(msg, publish) {
  const solvers = await query('SELECT * FROM `solvers`;');

  publish('list-solvers-response', {
    solvers: solvers,
    sessionId: msg.sessionId,
    requestId: msg.requestId
  })
}

export async function addSolver(msg, publish) {
  const stmt = await query('INSERT INTO `solvers` (`name`, `docker_image`) VALUES (?, ?)', [
    msg.name,
    msg.docker_image
  ]);

  publish('add-solver-response', {
    error: !stmt,
    sessionId: msg.sessionId,
    requestId: msg.requestId
  });
}

export async function deleteSolver(msg, publish) {
  const stmt = await query('DELETE FROM `solvers` WHERE `id` = ?', [
    msg.solverId
  ]);

  publish('delete-solver-response', {
    error: !stmt,
    sessionId: msg.sessionId,
    requestId: msg.requestId
  });
}

export async function updateSolver(msg, publish) {
  const stmt = await query('UPDATE `solvers` SET `name` = ?, `docker_image` = ?  WHERE `id` = ?', [
    msg.name,
    msg.docker_image,
    msg.solverId
  ]);

  publish('update-solver-response', {
    error: !stmt,
    sessionId: msg.sessionId,
    requestId: msg.requestId
  });
}

if (process.env.RAPID) {
  subscriber(host, [
    {river: 'solvers', event: 'list-solvers', work: listSolvers},
    {river: 'solvers', event: 'add-solver', work: addSolver},
    {river: 'solvers', event: 'delete-solver', work: deleteSolver},
    {river: 'solvers', event: 'update-solver', work: updateSolver}
  ]);
}
