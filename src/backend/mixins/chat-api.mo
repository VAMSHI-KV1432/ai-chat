import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import CommonTypes "../types/common";
import ChatTypes "../types/chat";
import ChatLib "../lib/chat";

mixin (
  store : ChatLib.ConversationStore,
  nextId : Nat,
) {
  // Transform callback required by the IC for HTTP outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    Runtime.trap("not implemented");
  };

  // Create a new conversation for a session
  public func createConversation(sessionKey : CommonTypes.SessionKey, title : Text) : async CommonTypes.ConversationId {
    Runtime.trap("not implemented");
  };

  // Get a single conversation by ID (returns null if not found or wrong session)
  public query func getConversation(
    sessionKey : CommonTypes.SessionKey,
    id : CommonTypes.ConversationId,
  ) : async ?ChatTypes.ConversationPublic {
    Runtime.trap("not implemented");
  };

  // List all conversation summaries for a session, newest first
  public query func listConversations(sessionKey : CommonTypes.SessionKey) : async [ChatTypes.ConversationSummary] {
    Runtime.trap("not implemented");
  };

  // Send a user message and get an AI-generated assistant reply
  public func sendMessage(
    sessionKey : CommonTypes.SessionKey,
    conversationId : CommonTypes.ConversationId,
    content : Text,
  ) : async Text {
    Runtime.trap("not implemented");
  };

  // Delete a conversation
  public func deleteConversation(
    sessionKey : CommonTypes.SessionKey,
    id : CommonTypes.ConversationId,
  ) : async Bool {
    Runtime.trap("not implemented");
  };

  // Rename a conversation
  public func renameConversation(
    sessionKey : CommonTypes.SessionKey,
    id : CommonTypes.ConversationId,
    newTitle : Text,
  ) : async Bool {
    Runtime.trap("not implemented");
  };
};
