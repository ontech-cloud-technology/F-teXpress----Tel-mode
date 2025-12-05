# Configuration Supabase Storage pour les Photos de Profil

## Problème
L'erreur "Bucket not found" indique que le bucket `profile-photos` n'existe pas dans votre projet Supabase.

## Solution : Créer le Bucket

### Étape 1 : Accéder au Dashboard Supabase
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet : `avtvanaglunqsipblmvf`

### Étape 2 : Créer le Bucket
1. Dans le menu de gauche, cliquez sur **Storage**
2. Cliquez sur **New bucket**
3. Configurez le bucket :
   - **Name**: `profile-photos`
   - **Public bucket**: ✅ **Cochez cette option** (important pour que les photos soient accessibles publiquement)
   - **File size limit**: 5 MB (ou plus selon vos besoins)
   - **Allowed MIME types**: `image/*` (ou laissez vide pour accepter tous les types)

### Étape 3 : Configurer les Permissions (IMPORTANT)
Si le bucket est **public**, vous pouvez ignorer cette étape. Sinon, configurez les policies :

1. Cliquez sur le bucket `profile-photos`
2. Allez dans l'onglet **Policies**
3. **Pour un bucket PUBLIC** (recommandé pour les photos de profil) :
   - Le bucket doit être marqué comme "Public" lors de la création
   - Aucune policy supplémentaire n'est nécessaire pour la lecture
   - Pour l'upload, créez une policy :
     - **Policy name**: `Allow public uploads`
     - **Allowed operation**: `INSERT`
     - **Policy definition**: 
       ```sql
       (bucket_id = 'profile-photos'::text)
       ```
       OU pour permettre seulement aux utilisateurs authentifiés :
       ```sql
       (bucket_id = 'profile-photos'::text) AND (auth.role() = 'authenticated'::text)
       ```

4. **Vérification importante** :
   - Assurez-vous que le bucket est bien **Public**
   - Si vous voyez une erreur 400, vérifiez que :
     - Le nom du bucket est exactement `profile-photos` (sans espaces, minuscules)
     - Le bucket est bien marqué comme "Public bucket"
     - Les policies RLS sont correctement configurées

### Étape 4 : Vérifier
Après avoir créé le bucket, l'upload de photos devrait fonctionner correctement.

## Alternative : Utiliser un Bucket Existant
Si vous préférez utiliser un bucket existant, modifiez la ligne suivante dans `js/supabase-storage.js` :
```javascript
this.bucketName = 'nom-de-votre-bucket';
```

## Notes
- Les photos sont stockées dans des dossiers par utilisateur : `{userId}/{filename}`
- L'URL publique sera : `https://avtvanaglunqsipblmvf.supabase.co/storage/v1/object/public/profile-photos/{userId}/{filename}`
- Le système remplace automatiquement les anciennes photos si elles existent déjà (grâce à `x-upsert: true`)

