import { RELATIVE_DIRECTIONS } from '@warriorjs/geography';
import { attack, feel, look, shoot } from '../abilities';

// Warrior unit
export const Warrior = {
  character: '@',
  color: '#8fbcbb',
  maxHealth: 20,
};

// Sludge unit
export const Sludge = {
  name: 'Sludge',
  character: 's',
  color: '#d08770',
  maxHealth: 12,
  abilities: {
    attack: attack({ power: 3 }),
    feel: feel(),
  },
  playTurn(sludge) {
    const threatDirection = RELATIVE_DIRECTIONS.find(direction => {
      const unit = sludge.feel(direction).getUnit();
      return unit && unit.isEnemy() && !unit.isBound();
    });
    if (threatDirection) {
      sludge.attack(threatDirection);
    }
  },
};

// Thick Sludge unit
export const ThickSludge = {
  ...Sludge,
  name: 'Thick Sludge',
  character: 'S',
  color: '#bf616a',
  maxHealth: 24,
};

// Archer unit
export const Archer = {
  name: 'Archer',
  character: 'a',
  color: '#ebcb8b',
  maxHealth: 7,
  abilities: {
    look: look({ range: 3 }),
    shoot: shoot({ range: 3, power: 3 }),
  },
  playTurn(archer) {
    const threatDirection = RELATIVE_DIRECTIONS.find(direction => {
      const spaceWithUnit = archer
        .look(direction)
        .find(space => space.isUnit());
      return (
        spaceWithUnit &&
        spaceWithUnit.getUnit().isEnemy() &&
        !spaceWithUnit.getUnit().isBound()
      );
    });
    if (threatDirection) {
      archer.shoot(threatDirection);
    }
  },
};

// Captive unit
export const Captive = {
  name: 'Captive',
  character: 'C',
  color: '#81a1c1',
  maxHealth: 1,
  reward: 20,
  enemy: false,
  bound: true,
  playTurn() {},
};

// Wizard unit
export const Wizard = {
  ...Archer,
  name: 'Wizard',
  character: 'w',
  color: '#b48ead',
  maxHealth: 3,
  abilities: {
    look: look({ range: 3 }),
    shoot: shoot({ range: 3, power: 11 }),
  },
};
