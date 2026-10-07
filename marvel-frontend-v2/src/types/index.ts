export interface Character {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics?: {
    items: { name: string }[];
  };
}

export interface Comic {
  _id: string;
  title: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
}

export interface ApiResponse<T> {
  count: number;
  results: T[];
}

export interface User {
  username: string;
}
