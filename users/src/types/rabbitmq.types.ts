export interface UserCreatedMessage {
  eventId: string;
  eventType: 'USER_CREATED';
  timestamp: string;
  payload: {
    userId: string;
    email: string;
    name: string;
    createdAt: string;
  };
}

export interface UserDeletedMessage {
  eventId: string;
  eventType: 'USER_DELETED';
  timestamp: string;
  payload: {
    userId: string;
  };
}
