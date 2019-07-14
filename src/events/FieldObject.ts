export class FieldObject {
  public fieldId: string;
  public isShip: boolean;
  public isHit: boolean;

  constructor(fieldId: string, isShip: boolean, isHit: boolean) {
    this.fieldId = fieldId;
    this.isShip = isShip;
    this.isHit = isHit;
  }
}
