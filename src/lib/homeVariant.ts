// Which Home a signed-in user gets, decided from two facts about them. A plain function so it can be tested.
export type HomeVariant = 'player' | 'manager';
export type HomeChip = 'pass' | 'admin';

/** An admin who doesn't play (Coach) manages runs and never RSVPs. Everyone else sees the player Home. */
export function homeVariant(isAdmin: boolean, plays: boolean): HomeVariant {
  return isAdmin && !plays ? 'manager' : 'player';
}

/** The chip in Home's top corner: "Admin" for a manager, the season-pass chip for a player. */
export function topChip(variant: HomeVariant): HomeChip {
  return variant === 'manager' ? 'admin' : 'pass';
}
