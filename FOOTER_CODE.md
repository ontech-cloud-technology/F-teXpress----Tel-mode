# Code Footer à Ajouter à Toutes les Pages

## CSS à ajouter dans la section `<style>` :

```css
/* Footer */
.site-footer {
    background: linear-gradient(135deg, #1a0f30, #2c1a4b);
    color: #9ca3af;
    padding: 2rem 0 1rem;
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.site-footer a {
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s;
}

.site-footer a:hover {
    color: #ffffff;
}

.footer-links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
}

.footer-copyright {
    text-align: center;
    font-size: 0.875rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
```

## HTML à ajouter avant `</body>` :

```html
<!-- Footer -->
<footer class="site-footer">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        <div class="footer-links">
            <a href="privacy-policy.html">Politique de Confidentialité</a>
            <span style="color: #4b5563;">•</span>
            <a href="data-policy.html">Gestion des Données</a>
            <span style="color: #4b5563;">•</span>
            <a href="terms.html">Conditions d'Utilisation</a>
        </div>
        <div class="footer-copyright">
            <p style="margin: 0;">© 2025 <strong>ONTech-cloud Technology</strong> • 203 Celebration Hub • Tous droits réservés</p>
        </div>
    </div>
</footer>
```

## Pages à mettre à jour :
1. login.html
2. admin.html
3. committee.html
4. eleve.html
5. calendrier.html
6. change-password.html
7. privacy-policy.html
8. data-policy.html
9. terms.html
