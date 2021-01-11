import Papa from 'papaparse';

export const generateCSV = (data, headers?: string[]): string => {
  return 'sep=,\n' + Papa.unparse(data, { columns: headers || null });
}
