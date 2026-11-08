import { Suspense } from "react";
import { ChatRoomClient } from "./ChatRoomClient";

export default function ChatRoomPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading chat...</p>}>
      <ChatRoomClient />
    </Suspense>
  );
}
