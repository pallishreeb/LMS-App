export const endpoints = {
  SIGN_UP: 'auth/register',
  VERIFY_OTP: 'auth/verify-otp',
  LOGIN: 'auth/login',
  GOOGLE_SIGNIN: 'auth/google/callback',

  //~  AFTER AUTH
  GET_CATEGORIES: 'categories',
  GET_BOOKS: 'books',
  GET_COURSES: 'courses',
  GET_COURSE_DETAILS: 'course-chapters',
  GET_PROFILE: 'auth/user',
  UPDATE_PROFILE: 'profile/update-profile',
  CHANGE_PASSWORD: 'profile/change-password',
  GET_BOOKS_BY_CATEGORY_ID: 'categories/search-book?category_id=',

  //?  CHAT
  GET_ALL_MESSAGES: 'chat/messages',
  SEND_MESSAGE: 'chat/send',
  DELETE_MESSAGE: 'chat/messages',
};
