import Map "mo:core/Map";
import ChatLib "lib/chat";
import ChatApiMixin "mixins/chat-api";

actor {
  let store : ChatLib.ConversationStore = Map.empty();
  var nextId : Nat = 0;

  include ChatApiMixin(store, nextId);
};
