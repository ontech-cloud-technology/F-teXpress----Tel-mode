/**
 * Système de messagerie moderne pour les utilisateurs
 * Fonctionnalités: Messages privés, groupes, amis, épinglage
 */

class MessagingSystem {
    constructor(userId) {
        this.userId = userId;
        this.db = firebase.firestore();
        this.messageListeners = [];
        this.unsubscribeListeners = [];
    }

    /**
     * Envoyer un message à un utilisateur ou un groupe
     * @param {string} recipientId - ID de l'utilisateur ou du groupe destinataire
     * @param {string} messageText - Contenu du message
     * @param {boolean} isGroup - Si true, recipientId est un groupe
     * @param {boolean} pinMessage - Si true, épingle le message
     * @returns {Promise<string>} ID du message créé
     */
    async sendMessage(recipientId, messageText, isGroup = false, pinMessage = false) {
        try {
            if (!this.userId || !recipientId || !messageText) {
                throw new Error('Paramètres manquants pour l\'envoi du message');
            }

            // Récupérer les informations de l'expéditeur
            const senderDoc = await this.db.collection('users').doc(this.userId).get();
            const senderData = senderDoc.data();
            const senderName = senderData?.fullName || senderData?.email || 'Anonyme';

            const message = {
                senderId: this.userId,
                senderName: senderName,
                message: messageText.trim(),
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                type: isGroup ? 'group' : 'private',
                pinned: pinMessage,
                groupId: isGroup ? recipientId : null,
                recipientId: isGroup ? null : recipientId
            };

            // Si c'est un groupe, ajouter le message au groupe
            if (isGroup) {
                message.groupId = recipientId;
                // Ajouter le message à la sous-collection du groupe
                const groupRef = this.db.collection('groups').doc(recipientId);
                const groupDoc = await groupRef.get();
                
                if (!groupDoc.exists) {
                    throw new Error('Groupe non trouvé');
                }

                const messageRef = await groupRef.collection('messages').add(message);
                
                // Si le message doit être épinglé, mettre à jour le groupe
                if (pinMessage) {
                    await groupRef.update({
                        pinnedMessageId: messageRef.id,
                        pinnedMessage: messageText,
                        pinnedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                // Mettre à jour le dernier message du groupe
                await groupRef.update({
                    lastMessage: messageText,
                    lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastMessageSender: senderName
                });

                return messageRef.id;
            } else {
                // Message privé
                message.recipientId = recipientId;
                
                // Récupérer les informations du destinataire
                const recipientDoc = await this.db.collection('users').doc(recipientId).get();
                const recipientData = recipientDoc.data();
                const recipientEmail = recipientData?.email || '';

                message.recipientEmail = recipientEmail;

                const docRef = await this.db.collection('messages').add(message);
                
                // Si le message doit être épinglé, créer une référence dans la conversation
                if (pinMessage) {
                    const conversationId = this.getConversationId(this.userId, recipientId);
                    await this.db.collection('conversations').doc(conversationId).set({
                        pinnedMessageId: docRef.id,
                        pinnedMessage: messageText,
                        pinnedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        participants: [this.userId, recipientId],
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }

                // Envoyer une notification email si possible (en arrière-plan, ne bloque pas)
                // Utiliser setTimeout pour ne pas bloquer l'envoi du message
                // Wrapper dans une fonction immédiatement exécutée pour éviter les unhandled promise rejections
                setTimeout(() => {
                    (async () => {
                        try {
                            const EMAIL_API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                                ? 'http://localhost:3001/api'
                                : (window.location.origin.includes('github.io') 
                                    ? 'https://projet-aniversaire-email-api.onrender.com/api'
                                    : `${window.location.origin}/api`);

                            if (recipientEmail && EMAIL_API_URL && !EMAIL_API_URL.includes('votre-serveur-email.com')) {
                                // Créer un AbortController pour timeout
                                const controller = new AbortController();
                                const timeoutId = setTimeout(() => controller.abort(), 5000);
                                
                                try {
                                    const response = await fetch(`${EMAIL_API_URL}/send-message-notification`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            email: recipientEmail,
                                            recipientName: recipientData?.fullName || recipientEmail,
                                            senderName: senderName,
                                            message: messageText,
                                            isPublic: false,
                                            notificationsUrl: window.location.origin + '/messaging.html',
                                            birthdayMessage: ''
                                        }),
                                        signal: controller.signal
                                    });
                                    
                                    // Vérifier si la réponse est OK (optionnel, on ignore les erreurs silencieusement)
                                    if (!response.ok) {
                                        // Ignorer silencieusement les erreurs HTTP
                                    }
                                } catch (fetchError) {
                                    // Ignorer silencieusement toutes les erreurs de connexion/fetch
                                    // Les erreurs peuvent être: ERR_CONNECTION_REFUSED, network errors, etc.
                                    // Ne rien logger car c'est une fonctionnalité optionnelle
                                } finally {
                                    clearTimeout(timeoutId);
                                }
                            }
                        } catch (emailError) {
                            // Ignorer silencieusement toutes les erreurs d'email
                            // C'est une fonctionnalité optionnelle qui ne doit pas perturber l'expérience utilisateur
                        }
                    })().catch(() => {
                        // Catch final pour éviter les unhandled promise rejections
                        // Ne rien faire car c'est une fonctionnalité optionnelle
                    });
                }, 0);

                return docRef.id;
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            throw error;
        }
    }

    /**
     * Créer un groupe
     * @param {string} groupName - Nom du groupe
     * @param {Array<string>} memberIds - IDs des membres
     * @param {string} description - Description du groupe (optionnel)
     * @returns {Promise<string>} ID du groupe créé
     */
    async createGroup(groupName, memberIds, description = '') {
        try {
            if (!groupName || !memberIds || memberIds.length === 0) {
                throw new Error('Nom du groupe et membres requis');
            }

            // S'assurer que le créateur est dans les membres
            if (!memberIds.includes(this.userId)) {
                memberIds.push(this.userId);
            }

            const groupData = {
                name: groupName,
                description: description,
                createdBy: this.userId,
                members: memberIds,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastMessage: '',
                lastMessageAt: null,
                lastMessageSender: '',
                pinnedMessageId: null,
                pinnedMessage: null
            };

            const groupRef = await this.db.collection('groups').add(groupData);
            
            return groupRef.id;
        } catch (error) {
            console.error('Erreur lors de la création du groupe:', error);
            throw error;
        }
    }

    /**
     * Ajouter des membres à un groupe
     * @param {string} groupId - ID du groupe
     * @param {Array<string>} memberIds - IDs des nouveaux membres
     */
    async addGroupMembers(groupId, memberIds) {
        try {
            const groupRef = this.db.collection('groups').doc(groupId);
            const groupDoc = await groupRef.get();
            
            if (!groupDoc.exists) {
                throw new Error('Groupe non trouvé');
            }

            const currentMembers = groupDoc.data().members || [];
            const newMembers = [...new Set([...currentMembers, ...memberIds])];

            await groupRef.update({
                members: newMembers,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout de membres:', error);
            throw error;
        }
    }

    /**
     * Ajouter un ami
     * @param {string} friendId - ID de l'ami à ajouter
     */
    async addFriend(friendId) {
        try {
            if (friendId === this.userId) {
                throw new Error('Vous ne pouvez pas vous ajouter vous-même');
            }

            // Vérifier si l'utilisateur existe
            const friendDoc = await this.db.collection('users').doc(friendId).get();
            if (!friendDoc.exists) {
                throw new Error('Utilisateur non trouvé');
            }

            // Ajouter dans la liste d'amis de l'utilisateur actuel
            const userFriendsRef = this.db.collection('users').doc(this.userId)
                .collection('friends').doc(friendId);
            
            await userFriendsRef.set({
                friendId: friendId,
                friendName: friendDoc.data().fullName || friendDoc.data().email,
                addedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'accepted'
            });

            // Ajouter dans la liste d'amis de l'autre utilisateur (relation bidirectionnelle)
            const friendFriendsRef = this.db.collection('users').doc(friendId)
                .collection('friends').doc(this.userId);
            
            await friendFriendsRef.set({
                friendId: this.userId,
                friendName: (await this.db.collection('users').doc(this.userId).get()).data().fullName || '',
                addedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'accepted'
            });

            return true;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'ami:', error);
            throw error;
        }
    }

    /**
     * Rechercher des utilisateurs par nom
     * @param {string} searchTerm - Terme de recherche
     * @returns {Promise<Array>} Liste des utilisateurs correspondants
     */
    async searchUsers(searchTerm) {
        try {
            if (!searchTerm || searchTerm.length < 2) {
                return [];
            }

            const usersSnapshot = await this.db.collection('users')
                .where('status', '==', 'active')
                .get();

            const searchLower = searchTerm.toLowerCase();
            const results = [];

            usersSnapshot.forEach(doc => {
                if (doc.id === this.userId) return; // Exclure l'utilisateur actuel

                const data = doc.data();
                const fullName = (data.fullName || '').toLowerCase();
                const email = (data.email || '').toLowerCase();

                if (fullName.includes(searchLower) || email.includes(searchLower)) {
                    results.push({
                        id: doc.id,
                        name: data.fullName || data.email || 'Utilisateur',
                        email: data.email || '',
                        role: data.role || 'eleve'
                    });
                }
            });

            return results.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Erreur lors de la recherche d\'utilisateurs:', error);
            return [];
        }
    }

    /**
     * Récupérer la liste d'amis
     * @returns {Promise<Array>} Liste des amis
     */
    async getFriends() {
        try {
            const friendsSnapshot = await this.db.collection('users')
                .doc(this.userId)
                .collection('friends')
                .get();

            const friends = [];
            for (const doc of friendsSnapshot.docs) {
                const friendData = doc.data();
                const friendDoc = await this.db.collection('users').doc(friendData.friendId).get();
                
                if (friendDoc.exists) {
                    const userData = friendDoc.data();
                    friends.push({
                        id: friendData.friendId,
                        name: userData.fullName || userData.email || 'Utilisateur',
                        email: userData.email || '',
                        role: userData.role || 'eleve'
                    });
                }
            }

            return friends.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Erreur lors de la récupération des amis:', error);
            return [];
        }
    }

    /**
     * Récupérer tous les groupes de l'utilisateur
     * @returns {Promise<Array>} Liste des groupes
     */
    async getGroups() {
        try {
            // Récupérer sans orderBy pour éviter les index composites, on triera côté client
            const groupsSnapshot = await this.db.collection('groups')
                .where('members', 'array-contains', this.userId)
                .get();

            const groups = groupsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Trier par date du dernier message côté client
            groups.sort((a, b) => {
                const dateA = a.lastMessageAt?.toDate ? a.lastMessageAt.toDate() : new Date(0);
                const dateB = b.lastMessageAt?.toDate ? b.lastMessageAt.toDate() : new Date(0);
                return dateB - dateA; // Plus récent en premier
            });

            return groups;
        } catch (error) {
            console.error('Erreur lors de la récupération des groupes:', error);
            return [];
        }
    }

    /**
     * Récupérer les messages d'un groupe
     * @param {string} groupId - ID du groupe
     * @returns {Promise<Array>} Liste des messages
     */
    async getGroupMessages(groupId) {
        try {
            // Récupérer sans orderBy pour éviter les index composites, on triera côté client
            const messagesSnapshot = await this.db.collection('groups')
                .doc(groupId)
                .collection('messages')
                .get();

            const messages = messagesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Trier par date côté client
            messages.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateA - dateB; // Plus ancien en premier
            });

            return messages;
        } catch (error) {
            console.error('Erreur lors de la récupération des messages du groupe:', error);
            return [];
        }
    }

    /**
     * Récupérer toutes les conversations de l'utilisateur
     * @returns {Promise<Array>} Liste des conversations avec le dernier message
     */
    async getConversations() {
        try {
            // Récupérer tous les messages où l'utilisateur est expéditeur ou destinataire
            // On récupère sans orderBy pour éviter les index composites, on triera côté client
            const sentMessages = await this.db.collection('messages')
                .where('senderId', '==', this.userId)
                .get();

            const receivedMessages = await this.db.collection('messages')
                .where('recipientId', '==', this.userId)
                .get();

            // Créer un map des conversations
            const conversationsMap = new Map();

            // Traiter les messages envoyés
            sentMessages.forEach(doc => {
                const data = doc.data();
                // Exclure les messages d'anniversaire (ceux avec celebrationId ou messageType === 'birthday')
                if (data.celebrationId || data.messageType === 'birthday') return;
                if (data.type === 'private' || !data.type) { // Support anciens messages sans type
                    const otherUserId = data.recipientId;
                    if (!otherUserId) return; // Ignorer si pas de destinataire
                    
                    const otherUserName = data.recipientEmail || 'Utilisateur';
                    
                    if (!conversationsMap.has(otherUserId)) {
                        conversationsMap.set(otherUserId, {
                            userId: otherUserId,
                            userName: otherUserName,
                            lastMessage: data.message,
                            lastMessageDate: data.createdAt,
                            unreadCount: 0,
                            isReceived: false,
                            read: true,
                            type: 'private'
                        });
                    } else {
                        const conv = conversationsMap.get(otherUserId);
                        const currentDate = conv.lastMessageDate?.toDate ? conv.lastMessageDate.toDate() : new Date(0);
                        const newDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(0);
                        if (newDate > currentDate) {
                            conv.lastMessage = data.message;
                            conv.lastMessageDate = data.createdAt;
                            conv.isReceived = false;
                            conv.read = true;
                        }
                    }
                }
            });

            // Traiter les messages reçus
            receivedMessages.forEach(doc => {
                const data = doc.data();
                // Exclure les messages d'anniversaire (ceux avec celebrationId ou messageType === 'birthday')
                if (data.celebrationId || data.messageType === 'birthday') return;
                if (data.type === 'private' || !data.type) { // Support anciens messages sans type
                    const otherUserId = data.senderId;
                    if (!otherUserId) return; // Ignorer si pas d'expéditeur
                    
                    const otherUserName = data.senderName || 'Utilisateur';
                    
                    if (!conversationsMap.has(otherUserId)) {
                        conversationsMap.set(otherUserId, {
                            userId: otherUserId,
                            userName: otherUserName,
                            lastMessage: data.message,
                            lastMessageDate: data.createdAt,
                            unreadCount: data.read ? 0 : 1,
                            isReceived: true,
                            read: data.read,
                            type: 'private'
                        });
                    } else {
                        const conv = conversationsMap.get(otherUserId);
                        const currentDate = conv.lastMessageDate?.toDate ? conv.lastMessageDate.toDate() : new Date(0);
                        const newDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(0);
                        if (newDate > currentDate) {
                            conv.lastMessage = data.message;
                            conv.lastMessageDate = data.createdAt;
                            conv.isReceived = true;
                            conv.read = data.read;
                            conv.unreadCount = data.read ? 0 : 1;
                        } else if (!data.read) {
                            conv.unreadCount = (conv.unreadCount || 0) + (data.read ? 0 : 1);
                        }
                    }
                }
            });

            // Récupérer les noms complets des utilisateurs
            const userIds = Array.from(conversationsMap.keys());
            const userDocs = await Promise.all(
                userIds.map(id => this.db.collection('users').doc(id).get())
            );

            userDocs.forEach((doc, index) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const userId = userIds[index];
                    if (conversationsMap.has(userId)) {
                        conversationsMap.get(userId).userName = userData.fullName || userData.email || conversationsMap.get(userId).userName;
                    }
                }
            });

            // Ajouter les groupes (gestion d'erreur si la requête échoue)
            try {
                const groups = await this.getGroups();
                groups.forEach(group => {
                    conversationsMap.set(`group_${group.id}`, {
                        userId: group.id,
                        userName: group.name,
                        lastMessage: group.lastMessage || '',
                        lastMessageDate: group.lastMessageAt,
                        unreadCount: 0,
                        isReceived: false,
                        read: true,
                        type: 'group',
                        description: group.description || ''
                    });
                });
            } catch (groupError) {
                console.warn('Erreur lors de la récupération des groupes:', groupError);
                // Continuer sans les groupes
            }

            // Convertir en tableau et trier par date
            const conversations = Array.from(conversationsMap.values());
            conversations.sort((a, b) => {
                const dateA = a.lastMessageDate?.toDate ? a.lastMessageDate.toDate() : new Date(0);
                const dateB = b.lastMessageDate?.toDate ? b.lastMessageDate.toDate() : new Date(0);
                return dateB - dateA;
            });

            return conversations;
        } catch (error) {
            console.error('Erreur lors de la récupération des conversations:', error);
            return [];
        }
    }

    /**
     * Récupérer tous les messages d'une conversation avec un utilisateur
     * @param {string} otherUserId - ID de l'autre utilisateur
     * @returns {Promise<Array>} Liste des messages
     */
    async getConversation(otherUserId) {
        try {
            // Récupérer les messages envoyés (sans orderBy pour éviter les index composites)
            const sentMessages = await this.db.collection('messages')
                .where('senderId', '==', this.userId)
                .where('recipientId', '==', otherUserId)
                .get();

            // Récupérer les messages reçus (sans orderBy pour éviter les index composites)
            const receivedMessages = await this.db.collection('messages')
                .where('senderId', '==', otherUserId)
                .where('recipientId', '==', this.userId)
                .get();

            // Combiner et trier (en excluant les messages d'anniversaire)
            const allMessages = [];
            
            sentMessages.forEach(doc => {
                const data = doc.data();
                // Exclure les messages d'anniversaire
                if (data.celebrationId || data.messageType === 'birthday') return;
                allMessages.push({
                    id: doc.id,
                    ...data,
                    senderId: this.userId
                });
            });

            receivedMessages.forEach(doc => {
                const data = doc.data();
                // Exclure les messages d'anniversaire
                if (data.celebrationId || data.messageType === 'birthday') return;
                allMessages.push({
                    id: doc.id,
                    ...data
                });
            });

            // Trier par date
            allMessages.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateA - dateB;
            });

            return allMessages;
        } catch (error) {
            console.error('Erreur lors de la récupération de la conversation:', error);
            return [];
        }
    }

    /**
     * Récupérer le message épinglé d'une conversation
     * @param {string} conversationId - ID de la conversation (userId ou groupId)
     * @param {boolean} isGroup - Si true, c'est un groupe
     * @returns {Promise<Object|null>} Message épinglé ou null
     */
    async getPinnedMessage(conversationId, isGroup = false) {
        try {
            if (isGroup) {
                const groupDoc = await this.db.collection('groups').doc(conversationId).get();
                if (groupDoc.exists) {
                    const groupData = groupDoc.data();
                    if (groupData.pinnedMessageId) {
                        const messageDoc = await this.db.collection('groups')
                            .doc(conversationId)
                            .collection('messages')
                            .doc(groupData.pinnedMessageId)
                            .get();
                        
                        if (messageDoc.exists) {
                            return {
                                id: messageDoc.id,
                                ...messageDoc.data()
                            };
                        }
                    }
                }
            } else {
                const conversationDoc = await this.db.collection('conversations')
                    .doc(this.getConversationId(this.userId, conversationId))
                    .get();
                
                if (conversationDoc.exists) {
                    const convData = conversationDoc.data();
                    if (convData.pinnedMessageId) {
                        const messageDoc = await this.db.collection('messages')
                            .doc(convData.pinnedMessageId)
                            .get();
                        
                        if (messageDoc.exists) {
                            return {
                                id: messageDoc.id,
                                ...messageDoc.data()
                            };
                        }
                    }
                }
            }
            return null;
        } catch (error) {
            console.error('Erreur lors de la récupération du message épinglé:', error);
            return null;
        }
    }

    /**
     * Épingler un message
     * @param {string} messageId - ID du message
     * @param {string} conversationId - ID de la conversation
     * @param {boolean} isGroup - Si true, c'est un groupe
     */
    async pinMessage(messageId, conversationId, isGroup = false) {
        try {
            if (isGroup) {
                const messageDoc = await this.db.collection('groups')
                    .doc(conversationId)
                    .collection('messages')
                    .doc(messageId)
                    .get();
                
                if (messageDoc.exists) {
                    const messageData = messageDoc.data();
                    await this.db.collection('groups').doc(conversationId).update({
                        pinnedMessageId: messageId,
                        pinnedMessage: messageData.message,
                        pinnedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            } else {
                const messageDoc = await this.db.collection('messages').doc(messageId).get();
                if (messageDoc.exists) {
                    const messageData = messageDoc.data();
                    const conversationIdKey = this.getConversationId(this.userId, conversationId);
                    await this.db.collection('conversations').doc(conversationIdKey).set({
                        pinnedMessageId: messageId,
                        pinnedMessage: messageData.message,
                        pinnedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        participants: [this.userId, conversationId],
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'épinglage du message:', error);
            throw error;
        }
    }

    /**
     * Désépingler un message
     * @param {string} conversationId - ID de la conversation
     * @param {boolean} isGroup - Si true, c'est un groupe
     */
    async unpinMessage(conversationId, isGroup = false) {
        try {
            if (isGroup) {
                await this.db.collection('groups').doc(conversationId).update({
                    pinnedMessageId: null,
                    pinnedMessage: null,
                    pinnedAt: null
                });
            } else {
                const conversationIdKey = this.getConversationId(this.userId, conversationId);
                await this.db.collection('conversations').doc(conversationIdKey).update({
                    pinnedMessageId: null,
                    pinnedMessage: null,
                    pinnedAt: null
                });
            }
        } catch (error) {
            console.error('Erreur lors du désépinglage du message:', error);
            throw error;
        }
    }

    /**
     * Marquer un message comme lu
     * @param {string} messageId - ID du message
     * @returns {Promise<boolean>}
     */
    async markAsRead(messageId) {
        try {
            const messageRef = this.db.collection('messages').doc(messageId);
            const messageDoc = await messageRef.get();
            
            if (!messageDoc.exists) {
                return false;
            }

            const messageData = messageDoc.data();
            
            // Vérifier que le message est bien destiné à cet utilisateur
            if (messageData.recipientId !== this.userId) {
                return false;
            }

            // Marquer comme lu seulement s'il ne l'est pas déjà
            if (!messageData.read) {
                await messageRef.update({
                    read: true
                });
            }

            return true;
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
            return false;
        }
    }

    /**
     * Marquer tous les messages non lus d'une conversation comme lus
     * @param {string} otherUserId - ID de l'autre utilisateur (pour conversation privée)
     * @returns {Promise<number>} Nombre de messages marqués comme lus
     */
    async markAllAsRead(otherUserId) {
        try {
            // Récupérer tous les messages non lus reçus de cet utilisateur
            const unreadMessages = await this.db.collection('messages')
                .where('recipientId', '==', this.userId)
                .where('senderId', '==', otherUserId)
                .where('read', '==', false)
                .get();

            // Filtrer pour exclure les messages d'anniversaire
            const messagingMessages = unreadMessages.docs.filter(doc => {
                const data = doc.data();
                return !data.celebrationId && data.messageType !== 'birthday';
            });

            // Marquer tous les messages comme lus en batch
            const batch = this.db.batch();
            messagingMessages.forEach(doc => {
                batch.update(doc.ref, { read: true });
            });

            if (messagingMessages.length > 0) {
                await batch.commit();
            }

            return messagingMessages.length;
        } catch (error) {
            console.error('Erreur lors du marquage de tous les messages comme lus:', error);
            return 0;
        }
    }

    /**
     * Récupérer le nombre de messages non lus
     * @returns {Promise<number>}
     */
    async getUnreadCount() {
        try {
            const unreadMessages = await this.db.collection('messages')
                .where('recipientId', '==', this.userId)
                .where('read', '==', false)
                .get();

            // Filtrer pour exclure les messages d'anniversaire
            const messagingMessages = unreadMessages.docs.filter(doc => {
                const data = doc.data();
                return !data.celebrationId && data.messageType !== 'birthday';
            });

            return messagingMessages.length;
        } catch (error) {
            console.error('Erreur lors du comptage des messages non lus:', error);
            return 0;
        }
    }

    /**
     * Récupérer tous les utilisateurs (pour la liste de sélection)
     * @returns {Promise<Array>} Liste des utilisateurs
     */
    async getAllUsers() {
        try {
            const usersSnapshot = await this.db.collection('users')
                .where('status', '==', 'active')
                .get();

            return usersSnapshot.docs
                .filter(doc => doc.id !== this.userId) // Exclure l'utilisateur actuel
                .map(doc => ({
                    id: doc.id,
                    name: doc.data().fullName || doc.data().email || 'Utilisateur',
                    email: doc.data().email || '',
                    role: doc.data().role || 'eleve'
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            return [];
        }
    }

    /**
     * Écouter les nouveaux messages en temps réel
     * @param {Function} callback - Fonction appelée lorsqu'un nouveau message est reçu
     */
    onNewMessage(callback) {
        if (typeof callback !== 'function') {
            console.error('Le callback doit être une fonction');
            return;
        }

        this.messageListeners.push(callback);

        // Écouter les nouveaux messages destinés à cet utilisateur
        const unsubscribe = this.db.collection('messages')
            .where('recipientId', '==', this.userId)
            .where('read', '==', false)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const messageData = {
                            id: change.doc.id,
                            ...change.doc.data(),
                            senderId: change.doc.data().senderId
                        };
                        this.messageListeners.forEach(cb => {
                            try {
                                cb(messageData);
                            } catch (error) {
                                console.error('Erreur dans le callback onNewMessage:', error);
                            }
                        });
                    }
                });
            }, (error) => {
                console.error('Erreur lors de l\'écoute des messages:', error);
            });

        this.unsubscribeListeners.push(unsubscribe);
    }

    /**
     * Nettoyer les listeners (à appeler lors de la déconnexion)
     */
    cleanup() {
        this.unsubscribeListeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.unsubscribeListeners = [];
        this.messageListeners = [];
    }

    /**
     * Génère un ID de conversation unique pour deux utilisateurs
     * @param {string} userId1 - Premier ID utilisateur
     * @param {string} userId2 - Deuxième ID utilisateur
     * @returns {string} ID de conversation
     */
    getConversationId(userId1, userId2) {
        return [userId1, userId2].sort().join('_');
    }
}

// Exposer globalement
window.MessagingSystem = MessagingSystem;
