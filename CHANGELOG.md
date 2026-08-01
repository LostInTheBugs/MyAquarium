# Changelog

## 2026.08.001 (2026-08-01)

### Added
- Fichier `VERSION` à la racine contenant le numéro de version `2026.08.001`
- `.env.example` avec la variable `PORT=8000`
- Section déploiement Docker et configuration dans `README.md`
- Lien vers les releases GitHub dans `README.md`

### Changed
- Version dans `package.json` passée de `0.0.0` à `2026.08.001`
- Port d'écoute nginx par défaut de 80 → 8000, piloté par la variable d'environnement `PORT`
- `nginx.conf` : `listen` utilise `${PORT}` (template traité par l'entrypoint nginx officiel)
- `Dockerfile` : copie de `nginx.conf` comme template, `ENV PORT=8000`, `EXPOSE 8000`
- `docker-compose.yml` : `loadbalancer.server.port` mis à 8000, ajout de la variable `PORT` au service
- `README.md` : refonte complète avec description, installation, déploiement Docker, configuration, version et lien releases
