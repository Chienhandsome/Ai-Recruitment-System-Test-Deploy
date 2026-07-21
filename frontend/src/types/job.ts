export interface Department {
  id: string;
  name: string;
  jobCount: number;
  icon?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  postedAt: string;
  isUrgent?: boolean;
}
