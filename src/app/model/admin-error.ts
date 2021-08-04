export interface AdminError {
  id: number;
  name: string;
  message: string;
  stack: string;
  sqlCode?: string;
  sqlHint?: string;
  sqlParameters?: string[];
  sqlQuery?: string;
  sqlQueryWithParameters?: string;
  createdBy: number;
  createdByUsername?: string;
  creationDate: Date;

  sqlParametersFormatted?: string;
}
