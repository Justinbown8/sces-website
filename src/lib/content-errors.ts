// Content-specific error classes and handling

export class ContentError extends Error {
  public readonly code: string;
  public readonly field?: string;
  public readonly value?: unknown;

  constructor(message: string, code: string, field?: string, value?: unknown) {
    super(message);
    this.name = 'ContentError';
    this.code = code;
    this.field = field;
    this.value = value;
  }
}

export class ContentValidationError extends ContentError {
  constructor(message: string, field?: string, value?: unknown) {
    super(message, 'VALIDATION_ERROR', field, value);
    this.name = 'ContentValidationError';
  }
}

export class ContentNotFoundError extends ContentError {
  constructor(message: string, field?: string, value?: unknown) {
    super(message, 'NOT_FOUND', field, value);
    this.name = 'ContentNotFoundError';
  }
}

export class ContentParseError extends ContentError {
  constructor(message: string, field?: string, value?: unknown) {
    super(message, 'PARSE_ERROR', field, value);
    this.name = 'ContentParseError';
  }
}

// Error handler utility
export class ContentErrorHandler {
  private static logError(error: ContentError): void {
    console.error(`[${error.name}] ${error.code}: ${error.message}`, {
      field: error.field,
      value: error.value,
      stack: error.stack
    });
  }

  public static handle(error: unknown): ContentError {
    if (error instanceof ContentError) {
      this.logError(error);
      return error;
    }

    if (error instanceof Error) {
      const contentError = new ContentError(
        error.message,
        'UNKNOWN_ERROR'
      );
      this.logError(contentError);
      return contentError;
    }

    const unknownError = new ContentError(
      'An unknown error occurred',
      'UNKNOWN_ERROR',
      undefined,
      error
    );
    this.logError(unknownError);
    return unknownError;
  }

  public static handleAsync<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    return operation().catch((error) => {
      throw this.handle(error);
    });
  }

  public static handleSync<T>(
    operation: () => T
  ): T {
    try {
      return operation();
    } catch (error) {
      throw this.handle(error);
    }
  }
}

// Utility functions for common error scenarios
export const throwIfNotFound = <T>(
  item: T | null | undefined,
  itemType: string,
  identifier: string
): T => {
  if (item === null || item === undefined) {
    throw new ContentNotFoundError(
      `${itemType} not found`,
      'identifier',
      identifier
    );
  }
  return item;
};

export const throwIfInvalid = (
  condition: boolean,
  message: string,
  field?: string,
  value?: unknown
): void => {
  if (!condition) {
    throw new ContentValidationError(message, field, value);
  }
};

// Safe content access utilities
export const safeGetContent = <T>(
  getter: () => T,
  fallback: T
): T => {
  try {
    return getter();
  } catch (error) {
    ContentErrorHandler.handle(error);
    return fallback;
  }
};

export const safeGetContentAsync = async <T>(
  getter: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await getter();
  } catch (error) {
    ContentErrorHandler.handle(error);
    return fallback;
  }
};

// Content operation result wrapper
export interface ContentResult<T> {
  success: boolean;
  data?: T;
  error?: ContentError;
}

export const wrapContentOperation = <T>(
  operation: () => T
): ContentResult<T> => {
  try {
    const data = operation();
    return { success: true, data };
  } catch (error) {
    const contentError = ContentErrorHandler.handle(error);
    return { success: false, error: contentError };
  }
};

export const wrapContentOperationAsync = async <T>(
  operation: () => Promise<T>
): Promise<ContentResult<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const contentError = ContentErrorHandler.handle(error);
    return { success: false, error: contentError };
  }
};

const contentErrorsExport = {
  ContentError,
  ContentValidationError,
  ContentNotFoundError,
  ContentParseError,
  ContentErrorHandler,
  throwIfNotFound,
  throwIfInvalid,
  safeGetContent,
  safeGetContentAsync,
  wrapContentOperation,
  wrapContentOperationAsync
};

export default contentErrorsExport;