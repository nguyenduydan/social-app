import { conversationService } from '@/services/conversationService';
import { messageService } from '@/services/messageService';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useConversationStore = create(
    devtools(
        (set, get) => ({
            // State
            conversations: [],
            currentConversation: null,
            messages: {},
            loading: false,
            error: null,
            hasMore: {},
            cursors: {},
            searchQuery: '',
            activeTab: 'users', // 'users' | 'groups'

            // ===== Basic Setters =====
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            setSearchQuery: (query) => set({ searchQuery: query }),
            setActiveTab: (tab) => set({ activeTab: tab }),

            // ===== Fetch Conversations =====
            fetchConversations: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await conversationService.getConversations();
                    set({
                        conversations: data.conversations || data,
                        loading: false
                    });
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Không thể tải danh sách trò chuyện',
                        loading: false
                    });
                }
            },

            // ===== Create Conversation =====
            createConversation: async (conversationData) => {
                set({ loading: true, error: null });
                try {
                    const newConversation = await conversationService.createConversation(conversationData);
                    set((state) => ({
                        conversations: [newConversation, ...state.conversations],
                        currentConversation: newConversation,
                        loading: false
                    }));
                    return newConversation;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Không thể tạo cuộc trò chuyện',
                        loading: false
                    });
                    throw error;
                }
            },

            // ===== Set Current Conversation =====
            setCurrentConversation: (conversation) => {
                set({ currentConversation: conversation });
                if (conversation) {
                    get().fetchMessages(conversation._id);
                }
            },

            // ===== Fetch Messages (Cursor Pagination) =====
            fetchMessages: async (conversationId, loadMore = false) => {
                const state = get();
                const cursor = loadMore ? state.cursors[conversationId] : null;

                set({ loading: !loadMore, error: null });

                try {
                    const res = await conversationService.getMessages(conversationId, 50, cursor);
                    const data = res?.data || res; // fallback nếu API bọc trong .data

                    set((state) => {
                        const existing = state.messages[conversationId] || [];
                        const newMessages = loadMore
                            ? [...data.messages, ...existing]
                            : data.messages;

                        return {
                            messages: {
                                ...state.messages,
                                [conversationId]: newMessages
                            },
                            cursors: {
                                ...state.cursors,
                                [conversationId]: data.nextCursor
                            },
                            hasMore: {
                                ...state.hasMore,
                                [conversationId]: !!data.nextCursor
                            },
                            loading: false
                        };
                    });
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Không thể tải tin nhắn',
                        loading: false
                    });
                }
            },

            // ===== Send Direct Message =====
            sendDirectMessage: async (recipientId, content, conversationId) => {
                try {
                    const message = await messageService.sendDirectMessage({
                        recipientId,
                        content,
                        conversationId
                    });

                    const convId = message.conversation?._id || message.conversationId || message.conversation;

                    set((state) => {
                        const existing = state.messages[convId] || [];
                        return {
                            messages: {
                                ...state.messages,
                                [convId]: [...existing, message]
                            }
                        };
                    });

                    get().updateConversationLastMessage(message);
                    return message;
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Không thể gửi tin nhắn' });
                    throw error;
                }
            },

            // ===== Send Group Message =====
            sendGroupMessage: async (conversationId, content) => {
                try {
                    const message = await messageService.sendGroupMessage({
                        conversationId,
                        content
                    });

                    const convId = message.conversation?._id || message.conversationId || message.conversation;

                    set((state) => {
                        const existing = state.messages[convId] || [];
                        return {
                            messages: {
                                ...state.messages,
                                [convId]: [...existing, message]
                            }
                        };
                    });

                    get().updateConversationLastMessage(message);
                    return message;
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Không thể gửi tin nhắn' });
                    throw error;
                }
            },

            // ===== Add Message (Realtime / Socket) =====
            addMessage: (message) => {
                const convId = message.conversation?._id || message.conversationId || message.conversation;

                set((state) => {
                    const existing = state.messages[convId] || [];
                    const exists = existing.some((m) => m._id === message._id);
                    if (exists) return state;

                    return {
                        messages: {
                            ...state.messages,
                            [convId]: [...existing, message]
                        }
                    };
                });

                get().updateConversationLastMessage(message);
            },

            // ===== Update Last Message =====
            updateConversationLastMessage: (message) => {
                const convId = message.conversation?._id || message.conversationId || message.conversation;
                const sender = message.sender || message.senderId;

                set((state) => ({
                    conversations: state.conversations
                        .map((conv) =>
                            conv._id === convId
                                ? {
                                    ...conv,
                                    lastMessage: {
                                        content: message.content,
                                        sender,
                                        createdAt: message.createdAt
                                    },
                                    lastMessageAt: message.createdAt
                                }
                                : conv
                        )
                        .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
                }));
            },

            // ===== Update Unread Count =====
            updateUnreadCount: (conversationId, userId, count) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv._id === conversationId
                            ? {
                                ...conv,
                                unreadCounts: {
                                    ...conv.unreadCounts,
                                    [userId]: count
                                }
                            }
                            : conv
                    )
                }));
            },

            // ===== Mark As Read =====
            markAsRead: (conversationId, userId) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv._id === conversationId
                            ? {
                                ...conv,
                                unreadCounts: {
                                    ...conv.unreadCounts,
                                    [userId]: 0
                                }
                            }
                            : conv
                    )
                }));
            },

            // ===== Filter Conversations =====
            getFilteredConversations: () => {
                const state = get();
                const { conversations, activeTab, searchQuery } = state;

                let filtered = conversations.filter((conv) => {
                    if (activeTab === 'users') return conv.type === 'direct';
                    if (activeTab === 'groups') return conv.type === 'group';
                    return true;
                });

                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    filtered = filtered.filter((conv) => {
                        if (conv.type === 'group') {
                            return conv.group?.name?.toLowerCase().includes(query);
                        } else {
                            return conv.participants?.some((p) =>
                                (p.displayName || p.userId?.displayName || '')
                                    .toLowerCase()
                                    .includes(query)
                            );
                        }
                    });
                }

                return filtered;
            },

            // ===== Conversation Info =====
            getConversationInfo: (conversation, currentUserId) => {
                if (!conversation) return null;

                if (conversation.type === 'group') {
                    return {
                        name: conversation.group?.name || 'Nhóm',
                        avatar: conversation.group?.avatar?.url || null,
                        isOnline: false,
                        lastSeen: null
                    };
                }

                const other =
                    conversation.participants?.find(
                        (p) => (p._id || p.userId?._id) !== currentUserId
                    ) || {};

                return {
                    name: other.displayName || other.userId?.displayName || 'Người dùng',
                    avatar: other.avatar?.url || other.userId?.avatar?.url || null,
                    isOnline: other.isOnline || other.userId?.isOnline || false,
                    lastSeen: other.lastSeen || other.userId?.lastSeen || null
                };
            },

            // ===== Reset / Clear =====
            clearError: () => set({ error: null }),
            reset: () =>
                set({
                    conversations: [],
                    currentConversation: null,
                    messages: {},
                    loading: false,
                    error: null,
                    hasMore: {},
                    cursors: {},
                    searchQuery: '',
                    activeTab: 'users'
                })
        }),
        { name: 'useConversationStore', enabled: import.meta.env.MODE === 'development' }
    )
);

export default useConversationStore;
