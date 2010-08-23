var sys = require('sys')

function Playground() {
    this.size = [0,0]
    this.units = []
    this.graveyard = new Graveyard()
    this.range=[[], []] // quircky convenience on foreach loop...
}

Playground.prototype.setSize = function(value) {
    this.size = value
    this.range[[], []]
    for(var i = 0; i < this.size[0]; i++) this.range[0][i] = null
    for(var i = 0; i < this.size[1]; i++) this.range[1][i] = null
    return this
}
Playground.prototype.setGraveyard = function(value) {
    this.graveyard = value
    return this
}
Playground.prototype.addUnit = function(value) {
    if(value instanceof Array) {
        var self = this
        value.forEach(function(u) {
            if(this.inBound(u.position) && this.emptyPosition(u.position)) {
                this.units.push(u)
                u.playground = self
            }
        }, this)
    } else {
        if(this.inBound(value.position) && this.emptyPosition(value.position)) {
            this.units.push(value)
            value.playground = this
        }
    }
    return this
}
Playground.prototype.move = function(unit, to) {
    return this.canMove(unit, to) ? unit.move(to) : false
}
Playground.prototype.canMove = function(unit, to) {
    // is an attach unit, is the unit inbound, is place clear ?
    return this.units.indexOf(unit) >= 0 && this.inBound(to) && this.emptyPosition(to)
}
Playground.prototype.emptyPosition = function(position) {
    for(var i = 0, l = this.units.length; i < l; i++) {
        if(this.units[i].position[0] == position[0] && this.units[i].position[1] == position[1]) {
            return false
        }
    }
    return true
}
Playground.prototype.at = function(position) {
    for(var i = 0, l = this.units.length; i < l; i++) {
        if(this.units[i].position[0] == position[0] && this.units[i].position[1] == position[1]) {
            return this.units[i]
        }
    }
    return null
}
Playground.prototype.inBound = function(position) {
    return position[0] < this.size[0]
       && position[0] >= 0
       && position[1] < this.size[1]
       && position[1] >= 0
}

function Graveyard() {
    this.units = []
}
// @todo graveyard

Graveyard.prototype.bury = function(unit) {
    this.units = this.units.concat(unit)
    return this
}
Graveyard.prototype.find = function(unit) {
    return this.units.indexOf(unit) >= 0
}

exports.Playground = Playground
