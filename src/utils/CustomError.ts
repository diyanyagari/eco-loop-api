export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError"; // You can set a custom name for your error class
  }
}

export const GlobalMsg = (entity: string, data: any[]) => {
  if (data.length) {
    return `${entity} retrieved successfully`;
  }
  return `No ${entity} found`;
};
