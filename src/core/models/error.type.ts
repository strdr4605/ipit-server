export enum ErrorType {
  AuthUserExists = "AUTH_USER_EXISTS",
  AuthInvalidEmail = "AUTH_INVALID_EMAIL",
  AuthBlocked = "AUTH_USER_BLOCKED",
  AuthDeleted = "AUTH_USER_DELETED",
  AuthInvalidRole = "AUTH_INVALID_ROLE",
  ProfileNotFound = "PROFILE_NOT_FOUND",
  WrongPassword = "WRONG_PASSWORD",
  NotFoundByMatches = "NOT_FOUND_BY_MATCHES",
  AuthActivated = "AUTH_ALREADY_ACTIVATED",
  PublicProductEditNoRights = "PUBLIC_PRODUCT_EDIT_NO_RIGHT",
  PublicProductDeleteNoRights = "PUBLIC_PRODUCT_DELETE_NO_RIGHT",
}
