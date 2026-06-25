export interface NumerologyNumbers {
  life_path: number;
  destiny: number;
  soul_urge: number;
  personality: number;
  birthday: number;
  personal_year: number;
  expression: number;
  lucky_numbers: number[];
  lucky_colors: string[];
  lucky_days: string[];
  lucky_categories: Record<string, string[]>;
  meanings: Record<string, string>;
  name_optimizations?: string[];
  lucky_handles?: string[];
}

export interface ReportResponse {
  full_name: string;
  dob: string;
  gender: string;
  country: string;
  question?: string;
  numbers: NumerologyNumbers;
  ai_response: string;
  generated_at: string;
}

export interface ReportFormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  dob: string;
  gender: string;
  country: string;
  question?: string;
}
