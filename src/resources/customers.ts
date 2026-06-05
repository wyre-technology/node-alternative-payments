import type { HttpClient } from '../http.js';
import type {
  AddCustomerUserData,
  CreateCustomerData,
  Customer,
  CustomerUser,
  ListCustomersParams,
  PaginatedList,
} from '../types/index.js';

export class CustomersResource {
  constructor(private readonly http: HttpClient) {}

  /** List customers (cursor paginated). */
  list(params?: ListCustomersParams): Promise<PaginatedList<Customer>> {
    return this.http.request<PaginatedList<Customer>>('/customers', { params });
  }

  /** Retrieve a single customer by id. */
  get(id: string): Promise<Customer> {
    return this.http.request<Customer>(`/customers/${encodeURIComponent(id)}`);
  }

  /** Create a new customer. */
  create(data: CreateCustomerData): Promise<Customer> {
    return this.http.request<Customer>('/customers', { method: 'POST', body: data });
  }

  /** Archive (soft-delete) a customer. Destructive. */
  archive(id: string): Promise<void> {
    return this.http.request<void>(`/customers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  /** List users associated with a customer. */
  listUsers(id: string): Promise<PaginatedList<CustomerUser>> {
    return this.http.request<PaginatedList<CustomerUser>>(
      `/customers/${encodeURIComponent(id)}/users`,
    );
  }

  /** Add a user to a customer account. */
  addUser(id: string, data: AddCustomerUserData): Promise<CustomerUser> {
    return this.http.request<CustomerUser>(
      `/customers/${encodeURIComponent(id)}/users`,
      { method: 'POST', body: data },
    );
  }
}
