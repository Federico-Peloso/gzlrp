importScripts('https://cdn.keepa.com/localforage.min.1.6.0.js', 'https://cdn.keepa.com/helper4.js');
'use strict';

var _db = {
    pakoType: {
        to: "string"
    },
    initDatabase: function(R, T) {

        (asyncSupported = localforage.supports(localforage.INDEXEDDB)) ? (L = localforage.createInstance({
            driver: localforage.INDEXEDDB,
            name: "keepaCache",
            version: 1,
            size: 838860800,
            storeName: "cache",
            description: "Caches network data"
        }), databaseMeta = localforage.createInstance({
            driver: localforage.INDEXEDDB,
            name: "keepaCache",
            version: 1,
            size: 838860800,
            storeName: "cacheMeta",
            description: "Caches Cache metadata"
        }), L.getItem("test").then(databaseMeta.getItem("test")).then(function() {
            T(!0)
        }).catch(function(oa) {
            asyncSupported = !1;
            T(!1)
        })) : T(!1)
    },
    clearDatabase: function() {
        L.clear();
        databaseMeta.clear()
    },
    keepaTime: {
        now: function() {
            return Math.floor(Date.now() / 6E4 - 21564E3)
        },
        minutesToEpoch: function(R) {
            return 6E4 *
                (R + 21564E3)
        },
        epochToMinutes: function(R) {
            return Math.round(R / 6E4) - 21564E3
        },
        timeShiftOffset: 60
    },
    removeOudatedCacheEntries: function() {
        if (asyncSupported) try {
            databaseMeta.getItem("lastClear").then(function(R) {
                var T = Date.now();
                null == R && (R = 0);
                if (!(30 > T - R)) {
                    databaseMeta.setItem("lastClear", T);
                    var oa = [];
                    databaseMeta.iterate(function(Z, ja, W) {
                        "lastClear" != ja && T - Z.cached > Z.ttl && oa.push(ja)
                    }).then(function() {
                        if (0 < oa.length) {
                            console.log("Clearing cached items: ", oa.length);
                            for (var Z in oa) L.removeItem(oa[Z]),
                                databaseMeta.removeItem(oa[Z])
                        }
                    }).catch(function(Z) {
                        console.log("2: " + Z.toString())
                    })
                }
            }).catch(function(R) {
                console.log("3: " + R.toString())
            })
        } catch (R) {
            console.log(R)
        }
    },
    calculateStatistics: function(R) {
        return R
    },
    read: function(R) {
        try {
            R instanceof ArrayBuffer && (R = pako.inflate(R, this.pakoType));
            var T = JSON.parse(R);
            return T && "object" === typeof T && null !== T ? T : null
        } catch (oa) {
            return console.error("4: " + oa.toString()), null
        }
    },
    addProduct: function(R) {
        try {
            var T = R.pr,
                oa = null != T.csv;
            if (!oa || !T.csv[3] || 2 !== T.csv[3].length ||
                -2 !== T.csv[3][1]) {
                var Z = T.domainId + T.asin + "h" + (oa ? "1" : "0"),
                    ja = Date.now(),
                    W = oa ? T.csv[15] : null,
                    Aa = null == W || 0 == W.length ? -1 : W[W.length - 2];
                oa = !1;
                0 < Aa && 12E4 > ja - this.keepaTime.minutesToEpoch(Aa) && (oa = !0);
                databaseMeta.setItem(Z, {
                    g: T.g,
                    extra: oa,
                    cached: ja,
                    ttl: R.ttl,
                    type: "pr"
                }).then(function() {
                    L.setItem(Z, pako.deflate(JSON.stringify(T)))
                })
            }
        } catch (Ca) {
            console.error("5: " + Ca.toString())
        }
    },
    getProduct: function(R, T, oa) {
        var Z = this;
        try {
            var ja = R.domainId + R.asin + "h" + (R.history ? "1" : "0");
            databaseMeta.getItem(ja).then(function(W) {
                null ==
                    W ? T(null) : 0 < R.offerPages && !W.extra ? T(null) : L.getItem(ja).then(function(Aa) {
                        T(null == Aa ? null : {
                            data: JSON.parse(pako.inflate(Aa, Z.pakoType)),
                            cached: W.cached
                        })
                    }).catch(function(Aa) {
                        T(null)
                    })
            }).catch(function(W) {
                T(null);
                console.log("7: " + e.toString())
            })
        } catch (W) {
            T(null), console.error("8; " + W.toString())
        }
    },
    trackingKeyPrefix: "tr",
    addComTracking: function(R) {
        try {
            var T = R.tr;
            if (T && 0 != T.length) {
                var oa = this.trackingKeyPrefix + T[0].asin,
                    Z = Date.now();
                databaseMeta.setItem(oa, {
                    cached: Z,
                    ttl: R.ttl,
                    type: "tr"
                }).then(function() {
                    L.setItem(oa,
                        pako.deflate(JSON.stringify(T)))
                })
            }
        } catch (ja) {
            console.error("5: " + ja.toString())
        }
    },
    getComTracking: function(R, T, oa) {
        var Z = this;
        try {
            var ja = Z.trackingKeyPrefix + R.asin;
            databaseMeta.getItem(ja).then(function(W) {
                null == W ? T(null) : L.getItem(ja).then(function(Aa) {
                    T(null == Aa ? null : {
                        data: JSON.parse(pako.inflate(Aa, Z.pakoType)),
                        cached: W.cached
                    })
                }).catch(function(Aa) {
                    T(null)
                })
            }).catch(function(W) {
                console.log("c7: " + W.toString());
                T(null)
            })
        } catch (W) {
            console.error("c8: " + W.toString())
        }
    },
    __codeWord__: "com.catilinejs.worker0.6896589268437046",
    __initialize__: [function(R) {
        self.__iFrame__ = "undefined" != typeof document;
        self.__self__ = {
            onmessage: function(ca) {
                return R.trigger("messege", ca.data[1]), ca.data[0][0] === R.__codeWord__ ? ra(ca) : (R.trigger(ca.data[0][0], ca.data[1]), void 0);
            }
        };
        __iFrame__ ? window.onmessage = function(ca) {
            "string" == typeof ca.data && (ca = {
                data: JSON.parse(ca.data)
            });
            __self__.onmessage(ca);
        } : self.onmessage = __self__.onmessage;
        __self__.postMessage = function(ca, oa) {
            self._noTransferable || __iFrame__ ? __iFrame__ ? (ca = R.__codeWord__ + JSON.stringify(ca), window.parent.postMessage(ca, "*")) : self._noTransferable && self.postMessage(ca) : self.postMessage(ca, oa);
        };
        self.console = {};
        var ra = function(ca) {
            var oa = function(Ba, La) {
                __self__.postMessage([ca.data[0], Ba], La);
            };
            if (__iFrame__) {
                try {
                    var ta = R[ca.data[1]](ca.data[2], oa, R);
                } catch (Ba) {
                    R.fire("error", JSON.stringify(Ba));
                }
            } else {
                ta = R[ca.data[1]](ca.data[2], oa, R);
            }
            "undefined" != typeof ta && oa(ta);
        };
    }, function n(R, ra) {
        var ca, oa = {};
        "undefined" != typeof __self__ ? ca = __self__.postMessage : ra && (ca = ra);
        R.on = function(ta, Ba, La) {
            if (La = La || R, 0 < ta.indexOf(" ")) {
                return ta.split(" ").map(function(Ka) {
                    return R.on(Ka, Ba, La);
                }, this), R;
            }
            ta in oa || (oa[ta] = []);
            var Ya = function(Ka) {
                Ba.call(La, Ka, La);
            };
            return Ya.orig = Ba, oa[ta].push(Ya), R;
        };
        R.one = function(ta, Ba, La) {
            function Ya(Ka) {
                R.off(ta, Ya);
                Ba.call(La, Ka, La);
            }
            return La = La || R, R.on(ta, Ya);
        };
        R.trigger = function(ta, Ba) {
            return 0 < ta.indexOf(" ") ? (ta.split(" ").forEach(function(La) {
                R.trigger(La, Ba);
            }), R) : ta in oa ? (oa[ta].forEach(function(La) {
                La(Ba);
            }), R) : R;
        };
        R.fire = function(ta, Ba, La) {
            return ca([
                [ta], Ba
            ], La), R;
        };
        R.off = function(ta, Ba) {
            return 0 < ta.indexOf(" ") ? (ta.split(" ").map(function(La) {
                return R.off(La, Ba);
            }), R) : ta in oa ? (Ba ? oa[ta] = oa[ta].map(function(La) {
                return La.orig === Ba ? !1 : La;
            }).filter(function(La) {
                return La;
            }) : delete oa[ta], R) : R;
        };
    }, function t(R) {
        function ra(ca) {
            return function() {
                for (var oa = arguments.length, ta = [], Ba = 0; oa > Ba;) {
                    ta.push(arguments[Ba]), Ba++;
                }
                R.fire("console", [ca, ta]);
            };
        }
        "log debug error info warn time timeEnd".split(" ").forEach(function(ca) {
            console[ca] = ra(ca);
        });
    }],
    events: {}
};
_db.__initialize__.forEach(function(f) {
    f.call(_db, _db);
});
for (var key in _db.events) {
    _db.on(key, _db.events[key]);
}