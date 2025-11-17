/**
 * Système d'annonces pour les admins
 * Permet aux admins de publier des annonces visibles par tous les élèves
 */

class AnnouncementsSystem {
    constructor() {
        this.db = firebase.firestore();
    }

    /**
     * Créer une nouvelle annonce (admin seulement)
     * @param {string} title - Titre de l'annonce
     * @param {string} content - Contenu de l'annonce
     * @param {string} priority - Priorité ('low', 'normal', 'high', 'urgent')
     * @param {string} userId - ID de l'admin créateur
     * @param {Array<string>} targetUsers - Liste des IDs d'utilisateurs cibles (vide = tous)
     */
    async createAnnouncement(title, content, priority = 'normal', userId, targetUsers = []) {
        try {
            // Vérifier que l'utilisateur est admin
            const userDoc = await this.db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            
            if (userData.role !== 'admin') {
                throw new Error('Seuls les administrateurs peuvent créer des annonces');
            }

            const announcement = {
                title: title,
                content: content,
                priority: priority, // 'low', 'normal', 'high', 'urgent'
                createdBy: userId,
                createdByName: userData.fullName || userData.email || 'Admin',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true,
                targetUsers: targetUsers, // Liste des IDs d'utilisateurs cibles (vide = tous)
                isPublic: targetUsers.length === 0, // Public si aucun utilisateur ciblé
                readBy: [] // Liste des IDs des utilisateurs qui ont lu l'annonce
            };

            const docRef = await this.db.collection('announcements').add(announcement);
            return docRef.id;
        } catch (error) {
            console.error('Erreur lors de la création de l\'annonce:', error);
            throw error;
        }
    }

    /**
     * Récupérer toutes les annonces actives pour un utilisateur
     * @param {string} userId - ID de l'utilisateur (null pour admin = toutes les annonces)
     */
    async getActiveAnnouncements(userId = null) {
        try {
            const snapshot = await this.db.collection('announcements')
                .where('isActive', '==', true)
                .get();

            const announcements = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                
                // Si userId est fourni, filtrer les annonces ciblées
                if (userId) {
                    const targetUsers = data.targetUsers || [];
                    // Si l'annonce a des utilisateurs cibles, vérifier que l'utilisateur est dans la liste
                    if (targetUsers.length > 0 && !targetUsers.includes(userId)) {
                        return; // Ignorer cette annonce
                    }
                }
                
                announcements.push({
                    id: doc.id,
                    ...data,
                    isRead: userId ? (data.readBy || []).includes(userId) : false
                });
            });

            // Trier par priorité puis par date
            announcements.sort((a, b) => {
                const priorityOrder = { 'urgent': 4, 'high': 3, 'normal': 2, 'low': 1 };
                const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                if (priorityDiff !== 0) return priorityDiff;
                
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });

            return announcements;
        } catch (error) {
            console.error('Erreur lors de la récupération des annonces:', error);
            return [];
        }
    }

    /**
     * Marquer une annonce comme lue
     */
    async markAsRead(announcementId, userId) {
        try {
            const announcementRef = this.db.collection('announcements').doc(announcementId);
            const announcementDoc = await announcementRef.get();
            
            if (!announcementDoc.exists) {
                throw new Error('Annonce introuvable');
            }

            const data = announcementDoc.data();
            const readBy = data.readBy || [];
            
            if (!readBy.includes(userId)) {
                readBy.push(userId);
                await announcementRef.update({
                    readBy: readBy
                });
            }

            return true;
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
            return false;
        }
    }

    /**
     * Désactiver une annonce (admin seulement)
     */
    async deactivateAnnouncement(announcementId, userId) {
        try {
            // Vérifier que l'utilisateur est admin
            const userDoc = await this.db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            
            if (userData.role !== 'admin') {
                throw new Error('Seuls les administrateurs peuvent désactiver des annonces');
            }

            await this.db.collection('announcements').doc(announcementId).update({
                isActive: false
            });

            return true;
        } catch (error) {
            console.error('Erreur lors de la désactivation:', error);
            return false;
        }
    }

    /**
     * Supprimer une annonce (admin seulement)
     */
    async deleteAnnouncement(announcementId, userId) {
        try {
            // Vérifier que l'utilisateur est admin
            const userDoc = await this.db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            
            if (userData.role !== 'admin') {
                throw new Error('Seuls les administrateurs peuvent supprimer des annonces');
            }

            await this.db.collection('announcements').doc(announcementId).delete();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            return false;
        }
    }

    /**
     * Compter les annonces non lues pour un utilisateur
     */
    async getUnreadCount(userId) {
        try {
            const announcements = await this.getActiveAnnouncements(userId);
            return announcements.filter(a => !a.isRead).length;
        } catch (error) {
            console.error('Erreur lors du comptage des annonces non lues:', error);
            return 0;
        }
    }
}

// Exposer globalement
window.AnnouncementsSystem = AnnouncementsSystem;

