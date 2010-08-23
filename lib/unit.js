var sys = require('sys')

function Unit() {
    this.name = ''
    this.player = null
    this.playground = null
    this.position = [null, null]
    this.abilities = {} 
    this.setAbilities({move: 0, hitpoints: 0, attack_powa: 0, defense_powa: 0, attack_count: 0, initiative: 0})
}

Unit.prototype.setName = function(value) {
    this.name = value
    return this
}
Unit.prototype.setPlayer = function(value) {
    this.player = value
    return this
}
Unit.prototype.setPosition = function(value) {
    this.position = value
    return this
}
Unit.prototype.setAbilities = function(value) {
    this.abilities = {}
    this.state = {}
    for(var property in value) {
        this.abilities[property] = value[property]
        this.state[property] = value[property]
    }
    return this
}
Unit.prototype.upkeep = function() {
    this.state = {}
    for(var property in this.abilities) this.state[property] = this.abilities[property]
    return this
}
Unit.prototype.move = function(to) {
    if(this.canMove(to)){
        this.position = to
        this.state.move--
        return true
    } 
    return false
}
Unit.prototype.canMove = function(to) {
    return Math.abs(this.position[0] - to[0]) <= 1
        && Math.abs(this.position[1] - to[1]) <= 1
        && !(this.position[0] == to[0] && this.position[1] == to[1])
        && this.state.move > 0
}
Unit.prototype.attack = function(target) {
    if(this.canAttack(target)) {
        target.state.hitpoints -= Math.ceil(Math.random() * this.abilities.attack_powa)
        this.state.attack_count--
        if(target.state.hitpoints > 0) {
            target.riposte(this)
        } else {
            this.playground.graveyard.bury(target)
        }
    }
}
Unit.prototype.canAttack = function(target) {
    return this.player != target.player &&
        this.canMove(target.position) &&
        this.state.attack_powa &&
        this.state.attack_powa > 0 &&
        this.state.attack_count > 0
}
Unit.prototype.riposte = function(opponant) {
    opponant.state.hitpoints -= Math.ceil(Math.random() * this.abilities.defense_powa)
    if(opponant.state.hitpoints < 0) {
        this.playground.graveyard.bury(opponant)
    }
}

exports.Unit = Unit
