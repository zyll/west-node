var vows = require('vows'),
    assert = require('assert'),
    sys = require('sys'),

    Unit = require('../lib/unit').Unit

vows.describe('Unit').addBatch({
    'Given a unit': {
        topic: function() {
            return new Unit()
                .setName("Aod")
                .setAbilities({move: 1})
                .setPosition([1,1])
        },
        'is set accordingly and then moving': {
            'topic': function(topic) {
                assert.deepEqual(topic, { name: 'Aod'
                    , player: null
                    , playground: null
                    , position: [ 1, 1 ]
                    , abilities: { move: 1} 
                    , state: { move: 1}
                })
                assert.isTrue(topic.move([1,2]))
                return topic
            },
            'should change position and move level then unit can\'t move and after upkeeping it can': {
                topic: function(topic) {
                    assert.deepEqual(topic, { name: 'Aod'
                        , playground: null
                        , player: null
                        , position: [ 1, 2 ]
                        , abilities: { move: 1 } 
                        , state: { move: 0 }
                    })
                    assert.isFalse(topic.canMove([1,1]))
                    assert.isFalse(topic.move([1,1]))
                    topic.upkeep()
                    assert.isTrue(topic.canMove([1,1]))
                    assert.isTrue(topic.move([1,1]))
                    topic.upkeep()
                    assert.isTrue(topic.canMove([1,2]))
                    assert.isTrue(topic.move([1,2]))
                    return topic.upkeep()
                },
                'state should be reset': function(topic) {
                    assert.deepEqual(topic, { name: 'Aod'
                        , player: null
                        , playground: null
                        , position: [ 1, 2 ]
                        , abilities: { move: 1 } 
                        , state: { move: 1 }
                    })
                },
                'unit may be able to move to an adjacent position)': function(topic) {
                    var positions = [[0, 1], [0, 2], [0, 3],
                                     [1, 1],         [1, 3],
                                     [2, 1], [2, 2], [2, 3]]
                    for(var i in positions) assert.isTrue(topic.canMove(positions[i]))
                },
                'unit may not be able to move to an unadjacent position)': function(topic) {
                    var positions = [[3, 3], [1, 4], [0,4], [3, 2], [3,4]]
                    for(var i in positions) assert.isFalse(topic.canMove(positions[i]))
                },
                'unit may not move to it\'s own position)': function(topic) {
                    assert.isFalse(topic.canMove([1,2]))
                }
            }
        }
    },
    'Given a unit running out of move point': {
        topic: function() {
             var u = new Unit()
                .setName("Aod")
                .setAbilities({move: 1})
                .setPosition([1,1])

            assert.isTrue(u.move([1, 2]))
            return u
        },
        'unit may not be able to move to an adjacent position)': function(topic) {
            var positions = [[0, 1], [0, 2], [0, 3],
                             [1, 1],         [1, 3],
                             [2, 1], [2, 2], [2, 3]]
            for(var i in positions) assert.isFalse(topic.canMove(positions[i]))
        },
        'unit may not be able to move to an unadjacent position)': function(topic) {
            var positions = [[3, 3], [1, 4], [0,4], [3, 2], [3,4]]
            for(var i in positions) assert.isFalse(topic.canMove(positions[i]))
        },
        'unit may not be able to move to it\'s own position)': function(topic) {
            assert.isFalse(topic.canMove([1,2]))
        }
    }
}).export(module)
