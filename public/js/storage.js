    const CHAT_KEY = "chat_history"; 
    const EXPIRY_HOURS = 12;
    const TTL_MS = EXPIRY_HOURS * 60 * 60 * 1000;

    function nowMs() {
        return Date.now();
    }

    function isFresh(ts) {
        return nowMs() - ts < TTL_MS;
    }

    function getFullConversation() {
        const raw = localStorage.getItem(CHAT_KEY);
        if (!raw) return [];
        let list;
        try {
            list = JSON.parse(raw) || [];
        } catch {
            return [];
        }
        const fresh = list.filter((item) => isFresh(item.timestamp));
        if (fresh.length !== list.length) {
            localStorage.setItem(CHAT_KEY, JSON.stringify(fresh));
        }
        return fresh;
    }

    function saveFullConversation(list) {
        localStorage.setItem(CHAT_KEY, JSON.stringify(list));
    }

    function addConversationPair(userMessage, botReply, rating = null) {
        const full = getFullConversation();

        let botObj = {};
        if (rating) {
            botObj = { type: "rating", content: rating, message: botReply || "" };
        } else if (typeof botReply === "object" && botReply !== null) {
            botObj = { type: "object", content: botReply };
        } else {
            botObj = { type: "string", content: botReply };
        }

        full.push({
            user: { content: String(userMessage), type: "string" },
            bot: botObj,
            timestamp: nowMs()
        });

        saveFullConversation(full);
    }


    function getLastPairs(n = 5) {
        const full = getFullConversation();
        return full.slice(-n).map(({ user, bot }) => ({ user, bot }));
    }