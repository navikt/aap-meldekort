export type FetchResponse<ResponseType> = SuccessResponseBody<ResponseType> | ErrorResponseBody<ApiException>;

export interface ApiException {
  message: string;
  code?: string;
}

type ErrorResponseBody<T> = {
  type: 'ERROR';
  status: number;
  apiException: T;
};

export type SuccessResponseBody<ResponseType> = {
  type: 'SUCCESS';
  status?: number;
  data: ResponseType;
};

export const isError = (res?: FetchResponse<unknown>): res is ErrorResponseBody<ApiException> =>
  (res && res.type === 'ERROR')!!;

export const isSuccess = <T>(res?: FetchResponse<T>): res is SuccessResponseBody<T> =>
  (res && res.type === 'SUCCESS')!!;
