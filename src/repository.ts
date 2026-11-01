import type { Wizard, Spell, NewWizard } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  // TAF - Exercice 1 
 
  create(newWizard: NewWizard): Wizard {
    const all = this.getAll();
    const nextId = all.length > 0 ? Math.max(...all.map(w => w.id)) + 1 : 1;

    
    const wizard = {
      ...newWizard,
      id: nextId
    } as Wizard;

    this.add(wizard);
    return wizard;
  }

  // TAF - Exercice 2 : Filtrer les sorciers par maison
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(
      wizard => wizard.house === house
    );
  }
}

export class SpellRepository extends Repository<Spell> {
  // TAF - Exercice 4 : Appliquer ValidateSpellPower sur add()
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}