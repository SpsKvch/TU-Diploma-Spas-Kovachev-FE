export interface UserDetails {
  id: string,
  username: string,
  firstName: string | null,
  lastName: string | null,
  profileImageUrl: string | null,
  currentEmail: string,
  friends: string[],
  groups: string[],
  previousEmails: string[],
  country: string | null,
  region: string | null,
  joinDate: Date
}


export interface SimpleUserDetails {
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  joinDate: Date
}

export interface PublicUserDetails {
  username: string,
  email: string,
  friends: string[],
  groups: string[],
  country: string,
  joinDate: Date
}

export interface FriendRequest {
  id: string,
  sender: string,
  senderImageUrl: string,
  recipient: string,
  recipientImageUrl: string,
  sendDate: Date;
}

export interface UpdateUserRequest {
  firstName: string | null,
  lastName: string | null,
  newEmail: string | null,
  profileImageUrl: string | null,
  country: string | null,
  region: string | null
}
