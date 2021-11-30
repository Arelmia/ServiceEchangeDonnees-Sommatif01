# Sommatif 1

###### 420-5SE-AA : Développement de service d'échange de données 
###### Date de remise : 11 Novembre 2021
___
## Description du projet

À noté que ce travail à été fait en équipe de deux dans le cadre d'un travail scolaire et que le projet sert uniquement 
à être visualiser afin d'avoir une idées de mes compétences, notamment en travail d'équipe.

Nous avons réalisé un service d'échange de données complet servant à l'affichage, l'ajout, 
la suppression ainsi que la modification de données représentés par des films. 

---

## Instalations requises:  
* `npm install` 

### Prérequis:
* Initialiser la base de données
  * Voir: [/db/init.sql](./db/init.sql)
* Un fichier pgpass.conf valide
  * `hostname:port:database:username:password`
* Les variables d'environement nécessaires au fonctionnement de `pg`, soit:
  * `PGPASSFILE`
  * `PGHOST`
  * `PGPORT`
  * `PGUSER`
  * `PGDATABASE`