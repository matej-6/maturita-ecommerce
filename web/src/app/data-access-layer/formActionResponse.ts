export type ActionResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: { property: string; constraints: string[] }[]; // only if form validation error
    };
