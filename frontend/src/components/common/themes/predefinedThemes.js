export const predefinedThemes = [
    {
        id: "default",
        name: "Mặc định",
        // nền sẽ dùng CSS của bạn -> không cần đặt màu
        background: "hsl(var(--background))",
        preview: "hsl(var(--card))",

        messageSent: {
            bg: "hsl(var(--chat-bubble-sent))",
            text: "hsl(var(--chat-bubble-sent-foreground))"
        },

        messageReceived: {
            bg: "hsl(var(--chat-bubble-received))",
            text: "hsl(var(--chat-bubble-received-foreground))"
        }
    },

    {
        id: "dark-elegant",
        name: "Dark Elegant",
        background: "linear-gradient(135deg, hsl(0, 0%, 6%) 0%, hsl(0, 0%, 12%) 100%)",
        preview: "hsl(0, 0%, 12%)",
        messageSent: {
            bg: "hsl(217, 92%, 60%)",
            text: "hsl(0, 0%, 100%)"
        },
        messageReceived: {
            bg: "hsl(0, 0%, 20%)",
            text: "hsl(210, 40%, 96%)"
        }
    },

    {
        id: "glass-blue",
        name: "Glass Blue",
        background: "linear-gradient(135deg, hsla(210, 100%, 98%, 0.8), hsla(210, 90%, 95%, 0.8))",
        preview: "hsl(210, 100%, 95%)",
        messageSent: {
            bg: "hsl(221, 83%, 53%)",
            text: "hsl(0, 0%, 100%)"
        },
        messageReceived: {
            bg: "hsla(0, 0%, 100%, 0.7)",
            text: "hsl(215, 25%, 20%)"
        }
    },

    {
        id: "mint-fresh",
        name: "Mint Fresh",
        background: "linear-gradient(135deg, hsl(88, 95%, 85%) 0%, hsl(150, 60%, 75%) 100%)",
        preview: "hsl(150, 60%, 75%)",
        messageSent: {
            bg: "hsl(142, 70%, 40%)",
            text: "hsl(0, 0%, 100%)"
        },
        messageReceived: {
            bg: "hsla(0, 0%, 100%, 0.85)",
            text: "hsl(210, 20%, 20%)"
        }
    },

    {
        id: "peach-soft",
        name: "Peach Soft",
        background: "linear-gradient(135deg, hsl(15, 100%, 92%) 0%, hsl(20, 95%, 82%) 100%)",
        preview: "hsl(20, 95%, 82%)",
        messageSent: {
            bg: "hsl(350, 75%, 70%)",
            text: "hsl(0, 0%, 100%)"
        },
        messageReceived: {
            bg: "hsla(0, 0%, 100%, 0.9)",
            text: "hsl(210, 20%, 20%)"
        }
    },

    {
        id: "cyber-purple",
        name: "Cyber Purple",
        background: "linear-gradient(135deg, hsl(278, 100%, 20%) 0%, hsl(270, 100%, 50%) 100%)",
        preview: "hsl(270, 100%, 50%)",
        messageSent: {
            bg: "hsl(0, 0%, 100%)",
            text: "hsl(278, 100%, 20%)"
        },
        messageReceived: {
            bg: "hsla(0, 0%, 100%, 0.95)",
            text: "hsl(0, 0%, 10%)"
        }
    },

    {
        id: "aqua-neon",
        name: "Aqua Neon",
        background: "linear-gradient(135deg, hsl(184, 100%, 50%) 0%, hsl(205, 100%, 55%) 100%)",
        preview: "hsl(184, 100%, 50%)",
        messageSent: {
            bg: "hsl(0, 0%, 100%)",
            text: "hsl(200, 80%, 45%)"
        },
        messageReceived: {
            bg: "hsla(0, 0%, 100%, 0.9)",
            text: "hsl(220, 30%, 15%)"
        }
    },

    {
        id: "rose-gold",
        name: "Rose Gold",
        background: "linear-gradient(135deg, hsl(8, 60%, 90%) 0%, hsl(0, 50%, 92%) 100%)",
        preview: "hsl(0, 50%, 92%)",
        messageSent: {
            bg: "hsl(340, 60%, 50%)",
            text: "hsl(0, 0%, 100%)"
        },
        messageReceived: {
            bg: "hsla(0, 0%, 100%, 0.9)",
            text: "hsl(210, 20%, 20%)"
        }
    },

    {
        id: "night-sky",
        name: "Night Sky",
        background: "linear-gradient(135deg, hsl(222, 47%, 10%) 0%, hsl(222, 33%, 20%) 100%)",
        preview: "hsl(222, 33%, 20%)",
        messageSent: {
            bg: "hsl(198, 93%, 60%)",
            text: "hsl(222, 47%, 10%)"
        },
        messageReceived: {
            bg: "hsl(222, 22%, 30%)",
            text: "hsl(210, 40%, 96%)"
        }
    },

    {
        id: "sand-warm",
        name: "Sand Warm",
        background: "linear-gradient(135deg, hsl(39, 45%, 93%) 0%, hsl(39, 35%, 85%) 100%)",
        preview: "hsl(39, 35%, 85%)",
        messageSent: {
            bg: "hsl(32, 75%, 45%)",
            text: "hsl(0, 0%, 100%)"
        },
        messageReceived: {
            bg: "hsla(0, 0%, 100%, 0.85)",
            text: "hsl(210, 20%, 20%)"
        }
    }
];
