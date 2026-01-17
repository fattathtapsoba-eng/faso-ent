import type { User, Parent, StudentUser, Notification, Message, ConversationThread } from '../../types';

/**
 * Mock API service to simulate backend calls
 * This allows development without Supabase dependency
 * Can be replaced with real Supabase calls later
 */

// Utility function for delay
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ NOTIFICATIONS & MESSAGING API (localStorage-based) ============

const NOTIFICATIONS_STORAGE_KEY = 'faso_ent_notifications';
const MESSAGES_STORAGE_KEY = 'faso_ent_messages';

/**
 * Get notifications for a user
 */
export async function getNotifications(userId: string): Promise<Notification[]> {
    await delay(200);

    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];

    // Filter by userId and sort by timestamp descending
    return allNotifications
        .filter(n => n.userId === userId)
        .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
    await delay(100);

    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];

    const notification = allNotifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(allNotifications));
    }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    await delay(200);

    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];

    allNotifications.forEach(n => {
        if (n.userId === userId) {
            n.read = true;
        }
    });

    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(allNotifications));
}

/**
 * Create a new notification
 */
export async function createNotification(
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
): Promise<Notification> {
    await delay(100);

    const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        read: false,
    };

    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const allNotifications: Notification[] = stored ? JSON.parse(stored) : [];

    allNotifications.push(newNotification);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(allNotifications));

    return newNotification;
}

/**
 * Get all messages (conversations) for a user
 */
export async function getConversations(userId: string): Promise<ConversationThread[]> {
    await delay(300);

    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    const allMessages: Message[] = stored ? JSON.parse(stored) : [];

    // Filter messages involving this user
    const userMessages = allMessages.filter(
        m => m.from_user_id === userId || m.to_user_id === userId
    );

    // Group by conversation partner
    const conversationsMap = new Map<string, Message[]>();

    userMessages.forEach(message => {
        const partnerId = message.from_user_id === userId ? message.to_user_id : message.from_user_id;

        if (!conversationsMap.has(partnerId)) {
            conversationsMap.set(partnerId, []);
        }
        conversationsMap.get(partnerId)!.push(message);
    });

    // Create conversation threads
    const threads: ConversationThread[] = [];

    conversationsMap.forEach((messages, partnerId) => {
        const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);
        const lastMessage = sortedMessages[0];
        const unreadCount = sortedMessages.filter(m => !m.read && m.to_user_id === userId).length;

        const partnerName = lastMessage.from_user_id === userId
            ? lastMessage.to_user_name
            : lastMessage.from_user_name;

        threads.push({
            id: partnerId,
            participants: [userId, partnerId],
            participantNames: [partnerName],
            last_message: lastMessage,
            unread_count: unreadCount,
        });
    });

    // Sort by last message timestamp
    return threads.sort((a, b) => b.last_message.timestamp - a.last_message.timestamp);
}

/**
 * Get message thread between two users
 */
export async function getMessageThread(userId: string, partnerId: string): Promise<Message[]> {
    await delay(200);

    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    const allMessages: Message[] = stored ? JSON.parse(stored) : [];

    // Get messages between these two users
    const threadMessages = allMessages.filter(
        m => (m.from_user_id === userId && m.to_user_id === partnerId) ||
            (m.from_user_id === partnerId && m.to_user_id === userId)
    );

    // Sort by timestamp ascending (oldest first)
    return threadMessages.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Send a message
 */
export async function sendMessage(
    message: Omit<Message, 'id' | 'timestamp' | 'read'>
): Promise<Message> {
    await delay(200);

    const newMessage: Message = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        read: false,
    };

    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    const allMessages: Message[] = stored ? JSON.parse(stored) : [];

    allMessages.push(newMessage);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));

    // Create notification for recipient
    await createNotification({
        type: 'MESSAGE',
        title: 'Nouveau message',
        message: `${message.from_user_name}: ${message.subject}`,
        userId: message.to_user_id,
        actionUrl: `/messages/${message.from_user_id}`,
    });

    return newMessage;
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
    await delay(100);

    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    const allMessages: Message[] = stored ? JSON.parse(stored) : [];

    const message = allMessages.find(m => m.id === messageId);
    if (message) {
        message.read = true;
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
    }
}

/**
 * Get users by role (for recipient selection)
 */
export async function getUsersByRole(_role: string): Promise<(User | Parent | StudentUser)[]> {
    await delay(200);
    // This would normally fetch from mockUsers, but we need to import it
    // For now, return empty array - will be implemented when needed
    return [];
}
