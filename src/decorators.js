"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
exports.MeasureTime = MeasureTime;
exports.ValidateSpellPower = ValidateSpellPower;
exports.Cache = Cache;
/**
 * Legacy TypeScript method decorator.
 * Enable "experimentalDecorators": true in tsconfig.json.
 */
function Log(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`[CALL] ${String(propertyKey)}`, args);
        try {
            const result = originalMethod.apply(this, args);
            console.log(`[RETURN] ${String(propertyKey)}`, result);
            return result;
        }
        catch (error) {
            console.error(`[ERROR] ${String(propertyKey)}`, error);
            throw error;
        }
    };
}
function MeasureTime(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const start = Date.now();
        try {
            return originalMethod.apply(this, args);
        }
        finally {
            console.log(`[TIME] ${String(propertyKey)}: ${Date.now() - start} ms`);
        }
    };
}
// TAF - Exercice 4 : Vérification de la puissance d'un sort
function ValidateSpellPower(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const candidate = args[0];
        if (typeof candidate === "object" &&
            candidate !== null &&
            "power" in candidate &&
            typeof candidate.power === "number" &&
            candidate.power < 0) {
            throw new Error("Spell power cannot be negative");
        }
        return originalMethod.apply(this, args);
    };
}
// TAF - Exercice 5 : Décorateur de méthode avec mise en cache
function Cache(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    const instanceCaches = new WeakMap();
    descriptor.value = function (...args) {
        let cache = instanceCaches.get(this);
        if (!cache) {
            cache = new Map();
            instanceCaches.set(this, cache);
        }
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log(`[CACHE HIT] ${String(propertyKey)}`);
            return cache.get(key);
        }
        console.log(`[CACHE MISS] ${String(propertyKey)}`);
        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };
}
