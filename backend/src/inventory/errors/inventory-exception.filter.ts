import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import {
  InventoryInvariantError,
  InventoryNotFoundError,
  InventoryValidationError,
} from "./inventory.errors.js";

@Catch(
  InventoryValidationError,
  InventoryInvariantError,
  InventoryNotFoundError,
)
export class InventoryExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | InventoryValidationError
      | InventoryInvariantError
      | InventoryNotFoundError,
    host: ArgumentsHost,
  ): void {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof InventoryNotFoundError) {
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
        error: exception.name,
      });
      return;
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: exception.name,
    });
  }
}
