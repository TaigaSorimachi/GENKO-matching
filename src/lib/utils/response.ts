import { NextResponse } from "next/server";
import { NotFoundError, ValidationError, ConflictError } from "@/lib/errors";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(error: unknown) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.message } },
      { status: 400 }
    );
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: error.message } },
      { status: 404 }
    );
  }

  if (error instanceof ConflictError) {
    return NextResponse.json(
      { error: { code: "CONFLICT", message: error.message } },
      { status: 409 }
    );
  }

  console.error("Unexpected error:", error);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "予期しないエラーが発生しました" } },
    { status: 500 }
  );
}
