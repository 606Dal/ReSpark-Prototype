/** Stage 2 gateway-facing contracts. Stage 1 uses Mock adapters via /api Route Handlers. */

export type AdapterResult<T> = {
  success: boolean;
  data: T;
  message: string;
  mock?: boolean;
};

export interface AuthAdapter {
  login(email: string, password: string): Promise<AdapterResult<unknown>>;
  signup(input: unknown): Promise<AdapterResult<unknown>>;
}

export interface ProductAdapter {
  list(params: Record<string, string | undefined>): Promise<AdapterResult<unknown>>;
  get(id: string | number): Promise<AdapterResult<unknown>>;
  create(input: unknown): Promise<AdapterResult<unknown>>;
  update(id: string | number, input: unknown): Promise<AdapterResult<unknown>>;
  remove(id: string | number): Promise<AdapterResult<unknown>>;
}

export interface PlatformAdapters {
  auth: AuthAdapter;
  products: ProductAdapter;
}
