
LIVRES BLANCS - PROJET DRUPAL
-----------------------------

Projet développé en licence au Lycée Saint Vincent de Senlis

 - Admin mail : corentin.regnier59@gmail.com
 - Admin PWD : admin
 
--

 - User mail : thibautpenhard@yahoo.fr
 - User PWD : user
 
 Pré-prod : [Livres Blancs](http://www.livresblancs.esy.es)
 
Installation
------------
Récupérer le projet sur notre environnement de développement:

 * git clone git@github.com:eusaintvincent/Livres-Blancs.git
 * cd [votre_repository]

On met ensuite à jour les autorisations en écriture sur les dossiers qui le nécessitent :
 
 * chmod -R 777 sites/default/files


#### Ne le faire qu'au démarrage du projet !

On duplique notre fichier production_settings.php et on le met à jour avec les informations de connexion à notre base
 de données locale:

 * cp sites/default/production_settings.php sites/default/settings.php
 * gedit sites/default/settings.php
Tout en bas du fichier, on remplace les informations de connexion à la base de données par les informations de
connexion à notre base de données locale que nous venons de créer.

Importation de la base de données
---------------------------------

Pour que notre site fonctionne correctement, il est évidemment indispensable d’importer la base de données à l’aide de la commande suivante :

 * drush sql-query --file="backup/livresblancs.sql"

Et voilà ! Votre projet et maintenant prêt à fonctionner avec git !




Au cours de la phase de développement (ou au moins à la fin de cette phase), vous aurez besoin d’envoyer vos modifications vers votre environnement de production. Pour ce faire, il vous faudra suivre les opérations suivantes.

Push du projet sur GITHUB
-------------------------
Sur l’environnement de développement, on sauvegarde toutes nos modifications en créant un nouveau dump de la base de données et en exportants les configurations de notre projet :

 * (Sur le back office drupal) -> Configuration -> Development -> Synchronisation de configuration -> Exporter (à mettre dans LivresBlancs/backup-config/)
 * drush sql-dump --result-file="backup/livresblancs-[VotrePseudo]-[NuméroIssue].sql"
 * git add -A
 * git commit -am "Sauvegarde des dernières modifications effectués sur l'environnement de développement"
 * git push


Récupération du projet
----------------------

 * git pull
 * (Sur le back office drupal) -> Configuration -> Development -> Synchronisation de configuration -> Exporter (à récupérer dans LivresBlancs/backup-config/)
 * drush sql-drop
 * drush sql-query --file="backup/dump-[VotrePseudo]-[NuméroIssue].sql"
 
Si vous utilisez les caches, il sera nécessaire de les vider pour voir toutes les nouveautés grâce à la commande suivante:

 * drush cache-rebuild

# Browser Stack

Pour les test Navigateur, normalement, c’est définit dans le cahier des charges.
Par défaut c’est N et N-1 pour tout les navigateurs (Chrome, firefox, edge, Ie, safari)
