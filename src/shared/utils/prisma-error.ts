import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

function isPrismaClientKnownRequestError(
  error: unknown,
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}

export function isUniqueConstraintPrismaError(
  error: unknown,
): error is PrismaClientKnownRequestError {
  return isPrismaClientKnownRequestError(error) && error.code === "P2002";
}

export function isRecordToUpdateNotFoundPrismaError(
  error: unknown,
): error is PrismaClientKnownRequestError {
  return isPrismaClientKnownRequestError(error) && error.code === "P2025";
}

export { isPrismaClientKnownRequestError };
