export function groupMessagesByDay(messages) {
    return messages.reduce((groups, msg) => {
        const day = new Date(msg.createdAt).toDateString();
        if (!groups[day]) groups[day] = [];
        groups[day].push(msg);
        return groups;
    }, {});
}