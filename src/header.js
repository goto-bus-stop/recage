var Struct = require('awestruct')
  , ct = require('./types')
  , playerStats = require('./player-stats')

var t = Struct.types

const stringTable = Struct({
  u0: t.int16 // 5000, max strings?
, numStrings: t.int16
, u1: t.int32
, strings: t.array('numStrings', ct.string(t.int32))
, u2: ct.buf(6)
})

exports.header = Struct({
  version: t.char(8)
, subVersion: t.float
, includeAi: ct.longBool
, ai: t.if('includeAi', Struct({
    stringTable: stringTable
  , ai: t.array(8, Struct({
      u0: t.int32
    , seq: t.int32
    , maxRules: t.int16
    , numRules: t.int16
    , u1: t.int32
    , rules: t.array('numRules', Struct({
        u0: ct.buf(12)
      , numFacts: 'int8'
      , numFactsActions: 'int8'
      , zero: t.int16
      , data: t.array(16, Struct({
          type: t.int32
        , id: t.int16
        , u0: t.int16
        , params: t.array(4, t.int32)
        }))
      }))
    }))
  , u0: ct.buf(104)
  , timers: t.array(8, t.array(10, t.int32))
  , sharedGoals: t.array(256, t.int32)
  , zero: ct.buf(4096)
  }))
, u0: 'uint32'
, gameSpeed1: t.int32
, u1: t.int32
, gameSpeed2: t.int32
, u2: t.float
, u3: t.int32
, u4: ct.buf(21)
, owner: t.int16
, playersCount: t.int8
, u5: t.int16
, gameMode: t.int16
, u6: ct.buf(12)
, u7: ct.buf(14)
, u8: t.array(8, t.int32)
, mapSize: Struct({
    x: t.int32
  , y: t.int32
  })
, u9len: t.int32 // AI only?
, u9: t.array('u9len', Struct({
    u0: ct.buf(255)
  , u1: t.array(255, t.int32)
  , u2: ct.matrix('../mapSize.y', '../mapSize.x', t.int8)
  , u3len: t.int32
  , u3: t.array('u3len', t.float)
  , u4: t.int32
  }))
, u10: ct.buf(2)
, map: ct.matrix('mapSize.x', 'mapSize.y', ct.tile)
, u11_1: ct.buf(120)
, mapSize1: Struct({
    x: t.int32
  , y: t.int32
  })
, u12: ct.matrix('mapSize.x', 'mapSize.y', t.int32)
, u13: t.int32
, u14: t.int32
, u15: ct.buf(function () { return this.u14 * 27 + 4 })
})

exports.player = Struct({
  diploFrom: t.array('../playersCount', t.int8)
, diploTo: t.array(9, t.int8)
, u0: ct.buf(5 + 24 + 2)
, name: ct.string(t.int16)
, u1: t.int8
, civHeaderLen: t.int32 // 198
, u2: t.int8
, civHeader: playerStats
, u3: t.int8
, u4: t.array(2, t.float)
, u5: ct.buf(9)
, civilization: t.int8
, u6: ct.buf(3)
, color: t.int8
  // 455
, u7: ct.buf(function () { return 629 - this.civHeaderLen + 41 - 1-8-9-1-3-1 })
, position: Struct({
    x: t.float
  , y: t.float
  })
, u11: ct.buf(9)
, civilization2: t.int8
, u12: ct.buf(3)
, color2: t.int8
, u8: ct.buf(function() { return 4183 - (629 - this.civHeaderLen + 41 - 1-8-9-1-3-1) - 8 - 10 - 4 })
, pad: ct.buf(41249)
, pad2: ct.buf(function () { return this.$parent.mapSize.x * this.$parent.mapSize.y })
})