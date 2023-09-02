export class TemplateCardDto {
  public id: number;
  public name: string;
  public ownerUsername: string;
  public updatedAt: Date;
  public status: string;
  public length: number;

  constructor(id: number, name: string, ownerUsername: string, updatedAt: Date, status: string, length: number) {
    this.id = id;
    this.name = name;
    this.ownerUsername = ownerUsername;
    this.updatedAt = updatedAt;
    this.status = status;
    this.length = length;
  }
}
