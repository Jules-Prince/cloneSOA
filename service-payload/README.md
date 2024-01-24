### Routes 

- /start [POST] Pour lancer le déplacement du payload (satellite)
- /position [GET] Pour récupérer la position actuelle du satelitte

Le calcule de la position du satellite se fait en utlisant le temps écoulé depuis sont lancement.
Par défaut, le temps de lancement est définit par l'heure de démarrage du service. 
L'appel sur la route /start redéfinit ce temps au temps actuel.
