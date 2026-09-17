export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface FieldValidationError {
  field: string;
  rejectedValue?: unknown;
  message: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  fieldErrors?: FieldValidationError[];
}
