function restoreChatUI() {
    const full = getFullConversation();

    full.forEach(pair => {
        addMessage(pair.user.content, 'user');

        if (pair.bot.type === "object") {
            addPersonInfo(pair.bot.content, 'bot');
        } else if (pair.bot.type === "rating") {
            if (pair.bot.content === "null") {
                addRatingCard();
            } else if (pair.bot.content === "booking") {
                addMessage(pair.bot.message, 'bot');
                addRatingCard();
            }
        } else if (pair.bot.type === "string") {
            addMessage(pair.bot.content, 'bot');
        }
    });
}
