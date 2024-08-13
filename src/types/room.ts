export interface Room {
  title: any;
  _id: string;
  number: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  available: boolean;
}