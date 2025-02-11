export interface ICall {
  id: number;
  date: string;
  time: number;
  from_number: string;
  from_site: string;
  source: string;
  to_number: string;
  status: string;
  in_out: number;
  record?: string;
  partnership_id?: string;
  person_avatar: string;
}

export interface IFilters {
  dateStart?: string;
  dateEnd?: string;
  inOut?: number;
}
