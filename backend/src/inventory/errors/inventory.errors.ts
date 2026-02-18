export class InventoryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryValidationError";
  }
}

export class InventoryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryNotFoundError";
  }
}

export class InventoryInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryInvariantError";
  }
}
