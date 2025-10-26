export type FormActionResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: { property: string; constraints: string[] }[];
    };
