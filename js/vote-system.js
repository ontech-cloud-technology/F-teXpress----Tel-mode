/**
 * Système de vote pour les activités
 */

/**
 * Récupère toutes les activités disponibles
 */
async function getAllActivities() {
    try {
        const activitiesSnapshot = await firebase.firestore().collection('activities')
            .orderBy('createdAt', 'desc')
            .get();
        
        return activitiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des activités:', error);
        return [];
    }
}

/**
 * Récupère les paramètres de vote
 */
async function getVoteSettings() {
    try {
        const settingsDoc = await firebase.firestore().collection('settings').doc('vote').get();
        if (settingsDoc.exists) {
            return settingsDoc.data();
        }
        return {
            votingEnabled: false,
            finalVotingEnabled: false
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des paramètres de vote:', error);
        return {
            votingEnabled: false,
            finalVotingEnabled: false
        };
    }
}

/**
 * Met à jour les paramètres de vote
 */
async function updateVoteSettings(settings) {
    try {
        await firebase.firestore().collection('settings').doc('vote').set({
            ...settings,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres de vote:', error);
        return false;
    }
}

/**
 * Crée une nouvelle activité
 */
async function createActivity(name, description) {
    try {
        const docRef = await firebase.firestore().collection('activities').add({
            name: name,
            description: description || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            active: true
        });
        return docRef.id;
    } catch (error) {
        console.error('Erreur lors de la création de l\'activité:', error);
        return null;
    }
}

/**
 * Met à jour une activité
 */
async function updateActivity(activityId, data) {
    try {
        await firebase.firestore().collection('activities').doc(activityId).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'activité:', error);
        return false;
    }
}

/**
 * Supprime une activité
 */
async function deleteActivity(activityId) {
    try {
        await firebase.firestore().collection('activities').doc(activityId).delete();
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'activité:', error);
        return false;
    }
}

/**
 * Vérifie si un utilisateur a déjà voté
 */
async function hasUserVoted(userId, isFinal = false) {
    try {
        const voteType = isFinal ? 'final' : 'initial';
        const votesSnapshot = await firebase.firestore().collection('votes')
            .where('userId', '==', userId)
            .where('type', '==', voteType)
            .limit(1)
            .get();
        
        return !votesSnapshot.empty;
    } catch (error) {
        console.error('Erreur lors de la vérification du vote:', error);
        return false;
    }
}

/**
 * Récupère le vote d'un utilisateur
 */
async function getUserVote(userId, isFinal = false) {
    try {
        const voteType = isFinal ? 'final' : 'initial';
        const votesSnapshot = await firebase.firestore().collection('votes')
            .where('userId', '==', userId)
            .where('type', '==', voteType)
            .limit(1)
            .get();
        
        if (votesSnapshot.empty) {
            return null;
        }
        
        return {
            id: votesSnapshot.docs[0].id,
            ...votesSnapshot.docs[0].data()
        };
    } catch (error) {
        console.error('Erreur lors de la récupération du vote:', error);
        return null;
    }
}

/**
 * Enregistre un vote
 */
async function submitVote(userId, activityId, isFinal = false) {
    try {
        const voteType = isFinal ? 'final' : 'initial';
        
        // Vérifier si l'utilisateur a déjà voté
        const existingVote = await getUserVote(userId, isFinal);
        
        if (existingVote) {
            // Mettre à jour le vote existant
            await firebase.firestore().collection('votes').doc(existingVote.id).update({
                activityId: activityId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // Créer un nouveau vote
            await firebase.firestore().collection('votes').add({
                userId: userId,
                activityId: activityId,
                type: voteType,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du vote:', error);
        return false;
    }
}

/**
 * Récupère les résultats de vote
 */
async function getVoteResults(isFinal = false) {
    try {
        const voteType = isFinal ? 'final' : 'initial';
        const votesSnapshot = await firebase.firestore().collection('votes')
            .where('type', '==', voteType)
            .get();
        
        const results = {};
        const activities = await getAllActivities();
        
        // Initialiser tous les compteurs à 0
        activities.forEach(activity => {
            results[activity.id] = {
                activity: activity,
                count: 0,
                percentage: 0
            };
        });
        
        // Compter les votes
        votesSnapshot.docs.forEach(doc => {
            const vote = doc.data();
            if (results[vote.activityId]) {
                results[vote.activityId].count++;
            }
        });
        
        const totalVotes = votesSnapshot.size;
        
        // Calculer les pourcentages
        Object.keys(results).forEach(activityId => {
            if (totalVotes > 0) {
                results[activityId].percentage = (results[activityId].count / totalVotes) * 100;
            }
        });
        
        // Trier par nombre de votes (décroissant)
        const sortedResults = Object.values(results).sort((a, b) => b.count - a.count);
        
        return {
            results: sortedResults,
            totalVotes: totalVotes,
            activities: activities
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        return {
            results: [],
            totalVotes: 0,
            activities: []
        };
    }
}

/**
 * Récupère les détails de tous les votes (pour l'admin)
 */
async function getAllVoteDetails(isFinal = false) {
    try {
        const voteType = isFinal ? 'final' : 'initial';
        const votesSnapshot = await firebase.firestore().collection('votes')
            .where('type', '==', voteType)
            .get();
        
        const votes = [];
        
        for (const voteDoc of votesSnapshot.docs) {
            const vote = voteDoc.data();
            const userDoc = await firebase.firestore().collection('users').doc(vote.userId).get();
            const activityDoc = await firebase.firestore().collection('activities').doc(vote.activityId).get();
            
            votes.push({
                id: voteDoc.id,
                user: userDoc.exists ? userDoc.data() : null,
                activity: activityDoc.exists ? activityDoc.data() : null,
                createdAt: vote.createdAt,
                updatedAt: vote.updatedAt
            });
        }
        
        return votes;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails des votes:', error);
        return [];
    }
}

