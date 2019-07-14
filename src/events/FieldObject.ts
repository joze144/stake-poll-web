export class FieldObject {
  public fieldId: string;
  public isShip: boolean;
  public isHit: boolean;
  public isAccessed: boolean;
  public isPlayer: boolean;
  constructor(fieldId: string, isShip: boolean, isHit: boolean, isPlayer: boolean, isAccessed: boolean) {
    this.fieldId = fieldId;
    this.isShip = isShip;
    this.isHit = isHit;
    this.isPlayer = isPlayer;
    this.isAccessed = isAccessed;
  }
}
