import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import ChatTypes "../types/chat";

module {
  public type ConversationStore = Map.Map<CommonTypes.ConversationId, ChatTypes.Conversation>;

  public func createConversation(
    store : ConversationStore,
    nextId : Nat,
    sessionKey : CommonTypes.SessionKey,
    title : Text,
  ) : (ChatTypes.Conversation, Nat) {
    Runtime.trap("not implemented");
  };

  public func getConversation(
    store : ConversationStore,
    id : CommonTypes.ConversationId,
  ) : ?ChatTypes.ConversationPublic {
    Runtime.trap("not implemented");
  };

  public func listConversations(
    store : ConversationStore,
    sessionKey : CommonTypes.SessionKey,
  ) : [ChatTypes.ConversationSummary] {
    Runtime.trap("not implemented");
  };

  public func addMessage(
    store : ConversationStore,
    id : CommonTypes.ConversationId,
    sessionKey : CommonTypes.SessionKey,
    role : ChatTypes.Role,
    content : Text,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func deleteConversation(
    store : ConversationStore,
    id : CommonTypes.ConversationId,
    sessionKey : CommonTypes.SessionKey,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func renameConversation(
    store : ConversationStore,
    id : CommonTypes.ConversationId,
    sessionKey : CommonTypes.SessionKey,
    newTitle : Text,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func toPublic(conv : ChatTypes.Conversation) : ChatTypes.ConversationPublic {
    Runtime.trap("not implemented");
  };
};
