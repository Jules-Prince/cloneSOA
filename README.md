
# Mars Y

Toutes les users story sont implémentées. 

Nous avons décider de rajouter les Users Storys suivantes :

 1. **Stage 2** : Nous avons ajouter la récupération d'un autre stage. Une fois que le stage 2 est vide, il retombe au sol comme le stage 1.
 2. **Laboratoire** : Nous avons installé un laboratoire de recherche chargé de mesurer le taux de radiations solaires à l'aide du satellite. Une fois le satellite en position, celui-ci enverra les mesures qui seront ensuite interprétées par le laboratoire.
 
Nous vous invitons également à faire un tour sur notre onglet **Wiki** ou nous avons répertorié semaine après semaine le compte rendu de notre projet et les choses prévu pour les semaines à venir

## Etape 1 - Init

```bash
./prepare.sh
```
Cette commande build les images docker et monte le conteneur **Marsy**.

## Etape 2 - Run

```bash
./run.sh
```

Cette commande lance les 6 scenarions à la chaîne.
Dans le terminal, vous verrez les logs de tous les services. 
</br>
</br>
Le run bénéficie d'un health check qui reboucle si les services ne sont pas tous run.
Donc si le curl du test end to end échoue parce qu'un ou des containers n'est pas up, 
il va attendre 5 secondes avant de refaire un test. Il boucle jusqu'a la réussite du test end to end. 
  
  Le scenario 1 dit classique se déroule ainsi :
1. **MissionCommander** demande les statuts de **Weather** et  de **rocket launcher** pour le décollage.
2. Une fois le décollage possible,  **MissionCommander** envoie l'ordre d'enclencher la fusée.
3. **MissionCommander** envoie un event kafka à Rocket pour lancer le décollage.
4. **Rocket** lance le simulateur lance la fusée.
5. **Rocket** signale à **Telemetry** que le service peut démarer la collecte de telemetry.
6. **Telemetry** via le topic Kafka demande à **Rocket** ses métriques et les reçois, les stocke puis les envoient via le bus evenementil à **Mission Commander**
7. Les événements clés de l'ascension de la fusée comme l'arrivé à MaxQ au **WebCaster**
8. Une fois le stage vide, le service **Stage** est crée et simule la retombée sur terre du stage.
9. De même qu pour **Rocket**, **Stage** lance les telemetry et sont traités de façon identiques.
10. La même opération est répétée lorsque le stage 2 est vide.
11.  À une altitude de 20 000 km, la fusée déploie le **Payload**.
12.  Elle informe le **Payload Department** de démarrer la mesure de position du satellite.
13.  Simultanément, elle communique au **Laboratory** de lancer les mesures des radiations solaires.

## Etape 3 - Stop

Une chaque scénario terminé, un message vous indiquera la fin et vous demanderas d'appuyer sur une touche pour passer scénario suivant.

# Points

| Nom      | Prénom      | Point |
|----------|-------------|-------|
| Yvars    | Théophile   | 100   |
| Amedomey | Roméo David | 100   |
| Zoubair  | Hamza       | 100   |
| Prince   | Jules       | 100   |


Nous avons travaillé équitablement sur l'implémentation de toutes les users
story. 


# Exécution manuelle 

Pour une exécution manuelle, il faudra : 
### Configuration de la base de données
Démarrer les bases de données necessaire en exécutant `docker compose up -d database_telemetry database_payload cassandra` 
ou modifier le fichier .env des services telemetry, payload et mission commander pour se connecter à la bonne base de données 
### Demarrage des services 
Démarrer tous les services ensuite.

Se reférer au contenu de `run.sh` pour lancer le test
