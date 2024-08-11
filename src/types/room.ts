export interface Room {
  _id: string;
  number: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  available: boolean;
}