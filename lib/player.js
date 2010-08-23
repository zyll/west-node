var sys = require('sys'),
    events = require('events')


function Player() {
    this.name = null
}

Player.prototype.setName = function(value) {
    this.name = value
    return this
}

exports.Player = Player
