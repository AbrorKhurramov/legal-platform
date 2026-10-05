export interface TBaseResponseDTO<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TPageableEndpointDTO<T> {
  data: T;
  totalCount: number;
}

export interface TPageableRequestParams {
  page: number;
  size: number;
}

export interface TReferenceDTO {
  id: string;
  name: string;
}
