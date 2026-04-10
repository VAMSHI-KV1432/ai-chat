import Common "common";

module {
  public type Role = { #user; #assistant };

  public type Message = {
    role : Role;
    content : Text;
    timestamp : Common.Timestamp;
  };

  public type Conversation = {
    id : Common.ConversationId;
    sessionKey : Common.SessionKey;
    var title : Text;
    messages : [Message];
    createdAt : Common.Timestamp;
  };

  // Shared (immutable) version safe for API boundary
  public type ConversationPublic = {
    id : Common.ConversationId;
    sessionKey : Common.SessionKey;
    title : Text;
    messages : [Message];
    createdAt : Common.Timestamp;
  };

  public type ConversationSummary = {
    id : Common.ConversationId;
    title : Text;
    createdAt : Common.Timestamp;
    messageCount : Nat;
  };
};
