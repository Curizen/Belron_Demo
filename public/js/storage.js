    const CHAT_KEY = "chat_history"; // مفتاح التخزين
    const EXPIRY_HOURS = 12;
    const TTL_MS = EXPIRY_HOURS * 60 * 60 * 1000;

    // إرجاع الوقت الحالي بالـ ms
    function nowMs() {
        return Date.now();
    }

    // التحقق إذا المحادثة لا تزال صالحة
    function isFresh(ts) {
        return nowMs() - ts < TTL_MS;
    }

    // استرجاع كامل المحادثة (مع التصفية للمنتهية)
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
            localStorage.setItem(CHAT_KEY, JSON.stringify(fresh)); // تنظيف التخزين
        }
        return fresh;
    }

    // حفظ كامل المحادثة
    function saveFullConversation(list) {
        localStorage.setItem(CHAT_KEY, JSON.stringify(list));
    }

    // إضافة زوج (user → bot) جديد
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


    // استرجاع آخر 5 رسائل (لإرسالها للسيرفر مثلا)
    function getLastPairs(n = 5) {
        const full = getFullConversation();
        return full.slice(-n).map(({ user, bot }) => ({ user, bot }));
    }