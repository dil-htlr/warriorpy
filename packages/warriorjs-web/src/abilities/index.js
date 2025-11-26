import { FORWARD, BACKWARD } from '@warriorjs/geography';

// Attack ability
export function attack({ power }) {
  return unit => ({
    action: true,
    description: `Attacks a unit in the given direction (\`'forward'\` by default), dealing ${power} HP of damage.`,
    perform(direction = FORWARD) {
      const receiver = unit.getSpaceAt(direction).getUnit();
      if (receiver) {
        unit.log(`attacks ${direction} and hits ${receiver}`);
        const attackingBackward = direction === BACKWARD;
        const amount = attackingBackward ? Math.ceil(power / 2.0) : power;
        unit.damage(receiver, amount);
      } else {
        unit.log(`attacks ${direction} and hits nothing`);
      }
    },
  });
}

// Feel ability
export function feel() {
  return unit => ({
    description: `Returns the adjacent space in the given direction (\`'forward'\` by default).`,
    perform(direction = FORWARD) {
      return unit.getSensedSpaceAt(direction);
    },
  });
}

// Health ability
export function health() {
  return unit => ({
    description: 'Returns an integer representing your health.',
    perform() {
      return unit.health;
    },
  });
}

// Max Health ability
export function maxHealth() {
  return unit => ({
    description: 'Returns an integer representing your maximum health.',
    perform() {
      return unit.maxHealth;
    },
  });
}

// Rest ability
export function rest({ healthGain }) {
  const healthGainPercentage = healthGain * 100;
  return unit => ({
    action: true,
    description: `Gains ${healthGainPercentage}% of max health back, but does nothing more.`,
    perform() {
      if (unit.health < unit.maxHealth) {
        unit.log('rests');
        const amount = Math.round(unit.maxHealth * healthGain);
        unit.heal(amount);
      } else {
        unit.log('is already fit as a fiddle');
      }
    },
  });
}

// Walk ability
export function walk() {
  return unit => ({
    action: true,
    description: `Moves one space in the given direction (\`'forward'\` by default).`,
    perform(direction = FORWARD) {
      const space = unit.getSpaceAt(direction);
      if (space.isEmpty()) {
        unit.move(direction);
        unit.log(`walks ${direction}`);
      } else {
        unit.log(`walks ${direction} and bumps into ${space}`);
      }
    },
  });
}

// Rescue ability
export function rescue() {
  return unit => ({
    action: true,
    description: `Releases a unit from his chains in the given direction (\`'forward'\` by default).`,
    perform(direction = FORWARD) {
      const receiver = unit.getSpaceAt(direction).getUnit();
      if (receiver && receiver.isBound()) {
        unit.log(`unbinds ${direction} and rescues ${receiver}`);
        unit.release(receiver);
      } else {
        unit.log(`unbinds ${direction} and rescues nothing`);
      }
    },
  });
}

// Pivot ability
export function pivot() {
  return unit => ({
    action: true,
    description: `Rotates in the given direction (\`'backward'\` by default).`,
    perform(direction = BACKWARD) {
      unit.rotate(direction);
      unit.log(`pivots ${direction}`);
    },
  });
}

// Look ability
export function look({ range }) {
  return unit => ({
    description: `Returns an array of up to ${range} spaces in the given direction (\`'forward'\` by default).`,
    perform(direction = FORWARD) {
      const offsets = Array.from(new Array(range), (_, index) => index + 1);
      const spaces = offsets.map(offset =>
        unit.getSensedSpaceAt(direction, offset),
      );
      const firstWallIndex = spaces.findIndex(space => space && space.isWall());
      return firstWallIndex === -1
        ? spaces
        : spaces.slice(0, firstWallIndex + 1);
    },
  });
}

// Shoot ability
export function shoot({ power, range }) {
  return unit => ({
    action: true,
    description: `Shoots the bow & arrow in the given direction (\`'forward'\` by default), dealing ${power} HP of damage to the first unit in a range of ${range} spaces.`,
    perform(direction = FORWARD) {
      const offsets = Array.from(new Array(range), (_, index) => index + 1);
      const receiver = offsets
        .map(offset => unit.getSpaceAt(direction, offset).getUnit())
        .find(unitInRange => unitInRange);
      if (receiver) {
        unit.log(`shoots ${direction} and hits ${receiver}`);
        unit.damage(receiver, power);
      } else {
        unit.log(`shoots ${direction} and hits nothing`);
      }
    },
  });
}

// Think ability (browser-compatible version without util module)
export function think() {
  return unit => ({
    description: 'Thinks out loud (`console.log` replacement).',
    perform(...args) {
      const thought = args.length > 0 ? args.map(arg => {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return '[object Object]';
          }
        }
        return String(arg);
      }).join(' ') : 'nothing';
      unit.log(`thinks ${thought}`);
    },
  });
}
