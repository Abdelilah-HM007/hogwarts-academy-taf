"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./repository");
const decorators_1 = require("./decorators");
// TAF - Exercice 6 : Étape 1 - Créer un type guard dédié à isHouse()
const validHouses = [
    "Gryffindor",
    "Slytherin",
    "Ravenclaw",
    "Hufflepuff"
];
function isHouse(value) {
    return (typeof value === "string" &&
        validHouses.some(house => house === value));
}
// TAF - Exercice 6 : Étape 2 - Mise à jour de la fonction isWizard()
function isWizard(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value;
    return (typeof candidate.id === "number" &&
        typeof candidate.name === "string" &&
        isHouse(candidate.house) &&
        typeof candidate.level === "number" &&
        typeof candidate.active === "boolean");
}
// TAF - Exercice 3 : Étape 2 - Créer un eventHandler
function handleSpellCast(event) {
    console.log(`Wizard ${event.wizardId} cast ${event.spellName}`);
}
// TAF - Exercice 5 : Étape 2 - Créer un service avec le décorateur @Cache
class SpellCalculator {
    calculatePower(basePower, multiplier) {
        console.log("Calculating...");
        return basePower * multiplier;
    }
}
__decorate([
    decorators_1.Cache
], SpellCalculator.prototype, "calculatePower", null);
class AcademyService {
    wizards;
    spells;
    constructor(wizards, spells) {
        this.wizards = wizards;
        this.spells = spells;
    }
    registerWizard(newWizard) {
        return this.wizards.create(newWizard);
    }
    castSpell(wizardId, spellId) {
        const wizard = this.wizards.findById(wizardId);
        const spell = this.spells.findById(spellId);
        if (!wizard || !spell) {
            throw new Error("Wizard or spell not found");
        }
        return `${wizard.name} casts ${spell.name}!`;
    }
    findByHouse(house) {
        return this.wizards
            .findByHouse(house)
            .map(({ id, name, house }) => ({ id, name, house }));
    }
    updateWizard(id, changes) {
        return this.wizards.update(id, changes);
    }
    getSpellEvents(events) {
        return events.filter((event) => event.type === "spell-cast");
    }
}
__decorate([
    decorators_1.Log
], AcademyService.prototype, "castSpell", null);
const wizards = new repository_1.WizardRepository();
const spells = new repository_1.SpellRepository();
wizards.add({
    id: 1,
    name: "Harry Potter",
    house: "Gryffindor",
    level: 5,
    active: true,
    patronus: "Stag"
});
wizards.add({
    id: 2,
    name: "Hermione Granger",
    house: "Gryffindor",
    level: 8,
    active: true
});
wizards.add({
    id: 3,
    name: "Draco Malfoy",
    house: "Slytherin",
    level: 6,
    active: true
});
spells.add({
    id: 101,
    name: "Expelliarmus",
    category: "attack",
    power: 80
});
const academy = new AcademyService(wizards, spells);
console.log("\n--- Cast a spell ---");
console.log(academy.castSpell(1, 101));
console.log("\n--- Find wizards by house ---");
console.log(academy.findByHouse("Gryffindor"));
console.log("\n--- Update a wizard ---");
academy.updateWizard(1, { level: 6 });
console.log(wizards.findById(1));
console.log("\n--- Type guard ---");
const unknownWizard = wizards.findById(1);
if (isWizard(unknownWizard)) {
    console.log(`${unknownWizard.name} belongs to ${unknownWizard.house}`);
}
console.log("\n--- Record utility type ---");
const points = {
    Gryffindor: 100,
    Slytherin: 80,
    Ravenclaw: 90,
    Hufflepuff: 70
};
console.log(points);
console.log("\n--- Extract spell-cast events ---");
const events = [
    { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
    { type: "level-up", wizardId: 2, newLevel: 9 },
    { type: "wizard-expelled", wizardId: 3 }
];
console.log(academy.getSpellEvents(events));
// ============================================================================
// TESTS DU TAF (EXERCICES 1 À 6)
// ============================================================================
console.log("\n--- TAF Exercice 1 : Ajouter un nouvel sorcier (NewWizard) ---");
const newWizardCreated = wizards.create({
    name: "Luna Lovegood",
    house: "Ravenclaw",
    level: 5,
    active: true
});
console.log(newWizardCreated);
console.log("\n--- TAF Exercice 2 : Filtrer les sorciers par maison ---");
console.log(wizards.findByHouse("Gryffindor"));
console.log("\n--- TAF Exercice 3 : Utilisation d'Extract (handleSpellCast) ---");
handleSpellCast({
    type: "spell-cast",
    wizardId: 1,
    spellName: "Expelliarmus"
});
console.log("\n--- TAF Exercice 4 : Vérification de la puissance d'un sort ---");
spells.add({
    id: 102,
    name: "Protego",
    category: "defense",
    power: 50
});
try {
    spells.add({
        id: 103,
        name: "Invalid Spell",
        category: "attack",
        power: -10
    });
}
catch (error) {
    console.error("Sort rejeté :", error.message);
}
console.log("\n--- TAF Exercice 5 : Décorateur de méthode avec mise en cache ---");
const calculator = new SpellCalculator();
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(5, 2));
console.log("\n--- TAF Exercice 6 : Renforcer le Type Guard ---");
const validData = {
    id: 1,
    name: "Harry Potter",
    house: "Gryffindor",
    level: 5,
    active: true
};
const invalidData = {
    id: 2,
    name: "Viktor",
    house: "Durmstrang",
    level: 5,
    active: true
};
console.log(isWizard(validData)); // true
console.log(isWizard(invalidData)); // false
const typeExamples = null;
void typeExamples;
