var sys = require('sys')

function Game() {
    this.name = ''
    this.players = []
    this.playground = null
    this.turn_owner = null
}

Game.prototype.setName = function(value) {
    this.name = value
    return this
}
Game.prototype.addPlayer = function(obj) {
    if(obj instanceof Array) {
        obj.forEach(function(p) {this.players.push(p)}, this)
    } else {
        this.players.push(obj)
    }
    return this
}
Game.prototype.setPlayground = function(obj) {
    this.playground = obj
    return this
}
Game.prototype.setTurnOwner = function(player) {
    this.turn_owner = player
    return this
}
Game.prototype.start = function() {
    if(this.players.length > 1)
    this.setTurnOwner(this.players[0])
    return this
}

Game.prototype.nextTurn = function() {
    if(this.players.length > 0)
    {
        if(this.players.length == 1) {
            this.setTurnOwner(this.players[0])
        } else {
            if(this.turn_owner == null) {
                this.setTurnOwner(this.players[0])
            } else{
                var current_pos = this.players.indexOf(this.turn_owner)
                var pos = current_pos == this.players.length - 1 ? 0 : current_pos + 1
                this.setTurnOwner(this.players[pos])
            }
        }
    }
    if(this.turn_owner !== null) {
        this.upkeep(this.turn_owner)
    }
    return this
}
Game.prototype.move = function(player, unit, position) {
    if(this.turn_owner == player) {
        return this.playground.move(unit, position)
    }
    return false
}
Game.prototype.upkeep = function(player) {
    this.playground.units.forEach(function(unit) {
        if(unit.player === player) {
            unit.upkeep()
        }
    })
    return this
}

exports.Game = Game
