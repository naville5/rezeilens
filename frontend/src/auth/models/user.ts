
export class User {
  id: string; // Added id
  token: string; // Added token
  expiration: string; // Renamed from expiration to expiresAt
  userType: string[]; // Renamed from roles to userType, and changed type to array of strings
  fullname: string;
  email: string;
  username: string;
  userProfileImage: string;
}

