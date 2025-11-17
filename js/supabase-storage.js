/**
 * Système de gestion des photos de profil avec Supabase Storage
 */

class SupabaseStorage {
    constructor() {
        this.supabaseUrl = 'https://avtvanaglunqsipblmvf.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dHZhbmFnbHVucXNpcGJsbXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjA5MzksImV4cCI6MjA3ODgzNjkzOX0.lb_kiHMJPvCq8oAk5hLE-NGENEq7FxGisttiixeD1KQ';
        this.bucketName = 'profile-photos';
    }

    /**
     * Lister tous les buckets disponibles (pour diagnostic)
     */
    async listBuckets() {
        try {
            const response = await fetch(`${this.supabaseUrl}/storage/v1/bucket`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'apikey': this.supabaseKey
                }
            });
            
            if (response.ok) {
                const buckets = await response.json();
                return buckets;
            }
            return [];
        } catch (error) {
            console.warn('Erreur lors de la liste des buckets:', error);
            return [];
        }
    }

    /**
     * Vérifier si le bucket existe
     */
    async checkBucketExists() {
        try {
            const response = await fetch(`${this.supabaseUrl}/storage/v1/bucket/${this.bucketName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'apikey': this.supabaseKey
                }
            });
            
            if (response.status === 404) {
                // Essayer de lister tous les buckets pour voir ce qui est disponible
                const buckets = await this.listBuckets();
                if (buckets.length > 0) {
                    console.log('Buckets disponibles:', buckets.map(b => b.name).join(', '));
                }
                return false;
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.warn('Erreur lors de la vérification du bucket:', errorText);
                // Même si la vérification échoue, on peut quand même essayer l'upload
                // car parfois les policies RLS bloquent la lecture mais permettent l'écriture
                return null; // null = incertain, on essaiera quand même
            }
            
            const bucketData = await response.json();
            return bucketData && bucketData.name === this.bucketName;
        } catch (error) {
            console.error('Erreur lors de la vérification du bucket:', error);
            return null; // Incertain, on essaiera quand même
        }
    }

    /**
     * Essayer de créer le bucket (nécessite généralement une clé service_role)
     */
    async createBucket() {
        try {
            const response = await fetch(`${this.supabaseUrl}/storage/v1/bucket`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'apikey': this.supabaseKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.bucketName,
                    public: true,
                    file_size_limit: 5242880, // 5MB
                    allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
                })
            });

            if (response.ok) {
                console.log('Bucket créé avec succès');
                return true;
            } else {
                const errorText = await response.text();
                console.warn('Impossible de créer le bucket automatiquement:', errorText);
                return false;
            }
        } catch (error) {
            console.warn('Erreur lors de la création du bucket:', error);
            return false;
        }
    }

    /**
     * Upload une photo de profil
     */
    async uploadProfilePhoto(userId, file) {
        try {
            // Vérifier que le fichier est une image
            if (!file.type.startsWith('image/')) {
                throw new Error('Le fichier doit être une image');
            }

            // Limiter la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('L\'image est trop grande (max 5MB)');
            }

            // Vérifier que le bucket existe (mais on essaiera l'upload même si la vérification échoue)
            let bucketExists = await this.checkBucketExists();
            if (bucketExists === false) {
                // Le bucket n'existe vraiment pas, essayer de le créer
                console.log('Bucket non trouvé, tentative de création automatique...');
                const created = await this.createBucket();
                if (created) {
                    bucketExists = true;
                } else {
                    // Vérifier à nouveau au cas où il aurait été créé entre temps
                    bucketExists = await this.checkBucketExists();
                }
            }
            
            // Si bucketExists est null, cela signifie que la vérification a échoué mais on essaiera quand même
            // (parfois les policies RLS bloquent la lecture mais permettent l'écriture)
            if (bucketExists === false) {
                const errorMessage = `Le bucket "${this.bucketName}" n'existe pas dans Supabase Storage.\n\n` +
                    `📋 Instructions pour créer le bucket :\n\n` +
                    `1. Allez sur https://supabase.com/dashboard\n` +
                    `2. Sélectionnez votre projet\n` +
                    `3. Allez dans "Storage" dans le menu de gauche\n` +
                    `4. Cliquez sur "New bucket"\n` +
                    `5. Nom du bucket : "${this.bucketName}"\n` +
                    `6. ✅ Cochez "Public bucket"\n` +
                    `7. Cliquez sur "Create bucket"\n\n` +
                    `⚠️ IMPORTANT : Après avoir créé le bucket, vous DEVEZ configurer les policies RLS :\n\n` +
                    `8. Cliquez sur le bucket "${this.bucketName}"\n` +
                    `9. Allez dans l'onglet "Policies"\n` +
                    `10. Cliquez sur "New Policy"\n` +
                    `11. Sélectionnez "For full customization"\n` +
                    `12. Nom : "Allow public uploads"\n` +
                    `13. Allowed operation : SELECT "INSERT"\n` +
                    `14. Policy definition : Laissez vide ou mettez "true" pour permettre à tous\n` +
                    `15. Répétez pour "SELECT" et "UPDATE" si nécessaire\n\n` +
                    `Une fois configuré, réessayez d'uploader votre photo.`;
                throw new Error(errorMessage);
            }

            // Créer un nom de fichier unique
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            // Convertir le fichier en ArrayBuffer pour un meilleur contrôle
            const arrayBuffer = await file.arrayBuffer();

            // Upload vers Supabase Storage avec l'API REST
            const response = await fetch(`${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${filePath}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': file.type,
                    'x-upsert': 'true', // Remplacer si existe déjà
                    'Cache-Control': '3600',
                    'apikey': this.supabaseKey
                },
                body: arrayBuffer
            });

            if (!response.ok) {
                let errorText = '';
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = `Status: ${response.status} ${response.statusText}`;
                }
                
                let errorMessage = '';
                
                // Vérifier différents types d'erreurs
                if (response.status === 404 || errorText.includes('Bucket not found') || errorText.includes('NoSuchBucket')) {
                    errorMessage = `Le bucket "${this.bucketName}" n'existe pas ou n'est pas accessible.\n\n` +
                        `📋 Vérifications :\n` +
                        `1. Le bucket "${this.bucketName}" existe dans Supabase Storage\n` +
                        `2. Le bucket est marqué comme "Public bucket"\n` +
                        `3. Les policies RLS sont configurées (voir instructions ci-dessous)\n\n` +
                        `🔧 Configuration des Policies RLS :\n` +
                        `1. Allez dans Storage > "${this.bucketName}" > Policies\n` +
                        `2. Créez une policy pour "INSERT" :\n` +
                        `   - Nom : "Allow public uploads"\n` +
                        `   - Operation : INSERT\n` +
                        `   - Policy : true (ou laissez vide pour permettre à tous)\n` +
                        `3. Créez une policy pour "SELECT" (lecture) :\n` +
                        `   - Nom : "Allow public read"\n` +
                        `   - Operation : SELECT\n` +
                        `   - Policy : true\n`;
                } else if (response.status === 400) {
                    // Essayer de parser l'erreur JSON si possible
                    let parsedError = errorText;
                    try {
                        const errorJson = JSON.parse(errorText);
                        parsedError = errorJson.message || errorJson.error || errorText;
                    } catch (e) {
                        // Garder le texte brut
                    }
                    errorMessage = `Erreur 400: ${parsedError}\n\n` +
                        `🔧 Le bucket existe probablement mais les policies RLS bloquent l'upload.\n\n` +
                        `📋 Solution : Configurez les policies RLS :\n` +
                        `1. Allez dans Supabase Dashboard > Storage > "${this.bucketName}"\n` +
                        `2. Cliquez sur l'onglet "Policies"\n` +
                        `3. Cliquez sur "New Policy"\n` +
                        `4. Sélectionnez "For full customization"\n` +
                        `5. Créez une policy pour INSERT :\n` +
                        `   - Nom : "Allow public uploads"\n` +
                        `   - Allowed operation : INSERT\n` +
                        `   - Policy definition : true\n` +
                        `6. Sauvegardez et réessayez`;
                } else if (response.status === 401 || response.status === 403) {
                    errorMessage = `Erreur d'autorisation (${response.status}).\n\n` +
                        `🔧 Le problème vient des policies RLS (Row Level Security).\n\n` +
                        `📋 Solution :\n` +
                        `1. Allez dans Supabase Dashboard > Storage > "${this.bucketName}"\n` +
                        `2. Cliquez sur "Policies"\n` +
                        `3. Créez une nouvelle policy :\n` +
                        `   - Nom : "Allow public uploads"\n` +
                        `   - Operation : INSERT\n` +
                        `   - Policy : true (permet à tous d'uploader)\n` +
                        `4. Créez aussi une policy pour SELECT (lecture) :\n` +
                        `   - Nom : "Allow public read"\n` +
                        `   - Operation : SELECT\n` +
                        `   - Policy : true\n` +
                        `5. Sauvegardez et réessayez`;
                } else {
                    errorMessage = `Erreur ${response.status}: ${errorText}\n\n` +
                        `Si le bucket existe, vérifiez les policies RLS dans Supabase Dashboard.`;
                }
                
                throw new Error(errorMessage);
            }

            // Retourner l'URL publique
            const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucketName}/${filePath}`;
            return publicUrl;

        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            throw error;
        }
    }

    /**
     * Récupérer l'URL de la photo de profil
     */
    getProfilePhotoUrl(userId) {
        // Essayer de récupérer depuis Firestore d'abord
        // Sinon, construire l'URL par défaut
        return `${this.supabaseUrl}/storage/v1/object/public/${this.bucketName}/${userId}/profile.jpg`;
    }

    /**
     * Supprimer une photo de profil
     */
    async deleteProfilePhoto(userId, fileName) {
        try {
            const filePath = `${userId}/${fileName}`;
            const response = await fetch(`${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${filePath}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.supabaseKey}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            throw error;
        }
    }
}

// Exposer globalement
window.SupabaseStorage = SupabaseStorage;

