export class Constants {

  public static AUTH_KEY = "authToken";
  public static USERNAME = ":username";
  public static ID = ":id";
  public static FRIEND_REQUEST = ":friend"
  public static NEW_DRAFT_FLAG = "new";

  public static templateServiceHost: string = "http://localhost:8080";

  //Users
  public static userEndpoint = this.templateServiceHost + "/v1/users";
  public static getUserEndpoint = this.userEndpoint + "/" + this.USERNAME;
  public static searchUsersEndpoint = this.userEndpoint + "/search";

  public static baseFriendsEndpoint = this.userEndpoint + "/friends";
  public static friendsEndpoint = this.baseFriendsEndpoint + "/" + this.USERNAME;
  public static baseFriendRequestsEndpoint = this.baseFriendsEndpoint + "/requests";
  public static friendRequestsEndpoint = this.baseFriendRequestsEndpoint + "/" + this.FRIEND_REQUEST;
  public static acceptFriendRequestEndpoint = this.friendRequestsEndpoint + "/accept";
  public static declineFriendRequestEndpoint = this.friendRequestsEndpoint + "/decline";
  public static sentFriendRequestEndpoint = this.baseFriendRequestsEndpoint + "/sent";
  public static pendingFriendRequestEndpoint = this.baseFriendRequestsEndpoint + "/pending";

  //Auth
  public static loginUrl: string = this.templateServiceHost + "/v1/users/login";
  public static registrationUrl: string = this.templateServiceHost + "/v1/users/register";
  public static logoutUrl: string = this.templateServiceHost + "/v1/users/logout";
  public static authUrl: string = this.templateServiceHost + "/v1/auth";
  public static getPermissionsUrl = this.templateServiceHost + "/v1/users/permissions";

  //Complete template
  public static completeTemplateUrl: string = this.templateServiceHost + "/v1/templates/complete/";
  public static getCompleteTemplatesForUser = this.getUserEndpoint + "/templates/complete";

  //Drafts
  public static templateDraftUrl = this.templateServiceHost + "/v1/templates/drafts";
  public static branchDraftUrl = this.templateServiceHost + "/v1/templates/complete/" + this.ID + "/drafts";
  public static getDraftsForUser = this.getUserEndpoint + "/templates/drafts";
  public static deleteDraftUrl = this.templateServiceHost + "/v1/templates/drafts/";

  //Journals
  public static createJournalUrl = this.templateServiceHost + "/v1/templates/complete/" + this.ID + "/journal";
  public static templateJournalUrl = this.templateServiceHost + "/v1/templates/%/journal";
  public static updateTemplateJournalUrl = this.templateServiceHost + "/v1/templates/journal/";
  public static getAllJournalsForUserUrl = this.templateServiceHost + "/v1/users/" + this.USERNAME + "/templates/journal"

  //Categories
  public static categoriesUrl = this.templateServiceHost + "/v1/categories";
}
