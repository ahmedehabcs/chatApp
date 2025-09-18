import MessageBubble from "./MessageBubble";

export default function MessageDayGroup({ day, messages, user }) {
    const formattedDay = new Date(day).toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="mb-6">
            {/* Date header */}
            <div className="flex justify-center my-3">
                <span className="px-3 py-1 text-xs border border-[#fff] rounded-full text-[var(--color-text)]">
                    {formattedDay}
                </span>
            </div>

            {/* Messages of this day */}
            {messages.map((message, idx) => {
                const time = new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });
                const isOwnMessage = message.sender === user?.publicKey;

                return (
                    <MessageBubble
                        key={idx}
                        message={message}
                        isOwnMessage={isOwnMessage}
                        time={time}
                    />
                );
            })}
        </div>
    );
}