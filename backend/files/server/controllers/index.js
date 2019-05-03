// const docente = require('./docente')
// const aula = require('./aula')
// const materia = require('./materia')
// const horario = require('./horario')
// const user = require('./user')

// module.exports = {
//   docente,
//   aula,
//   materia,
//   horario,
//   user
// }
const members = require('./members')
const events = require('./events')
const attendee = require('./attendee')
const user = require('./user')

module.exports = {
    members,
    events,
    attendee,
    user
}