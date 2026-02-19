# Où trouver le token Airtable

1. **Ouvre Airtable** et connecte-toi sur [airtable.com](https://airtable.com).

2. **Developer hub**  
   - Clique sur ton **avatar** (en haut à droite) ou sur **Help** (?)  
   - Choisis **Developer hub** (ou **Developers** selon l’interface).

3. **Créer un token**  
   - Dans le menu de gauche : **Personal access tokens** (ou **Tokens**).  
   - Clique sur **Create new token** (ou **Create token**).

4. **Nomme le token** (ex. : `Script restos`) pour le reconnaître.

5. **Scopes (droits)**  
   - Coche au minimum : **data.records:read** et **data.records:write**  
   - (Parfois proposé comme “Read” + “Write” sur ta base.)

6. **Accès à la base**  
   - Dans “Access”, ajoute la **base** où se trouve ta table Restaurants.  
   - Donne-lui **read** et **write** sur cette base.

7. **Créer**  
   - Clique sur **Create token**.  
   - **Copie le token tout de suite** : il commence en général par `pat...` et ne sera plus affiché en entier après.

8. **Dans ton `.env`**  
   - Colle ce token dans :  
     `AIRTABLE_API_KEY=patxxxxxxxxxxxx`  
   - (en remplaçant `patxxxxxxxxxxxx` par ton token).

**Important :** ne partage jamais ce token et ne le mets pas dans un fichier versionné (Git). Il donne un accès complet à ta base.
