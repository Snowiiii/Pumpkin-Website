# Format de monde

## Format de fichiers de region

Minecraft Beta 1.3 à la Release 1.2 utilisait un format connu comme "Format de fichiers de region"

Les fichiers enregistrés dans ce format avaient l'extension `.mcr`, chacun enregistrant un groupe de 32x32 chunks apellé Region.

Plus de détails peuvent être trouvés sur le [Minecraft Wiki](https://fr.minecraft.wiki/w/Format_de_fichier_Région).

## Format de fichier "Anvil"

Remplaçant le format de fichier de region après Release 1.2, ce format est encore utilisé pour stocker les mondes Vanilla Minecraft: Édition Java.

Les fichiers enregistrés dans ce format ont l'extension `.mca`. Il utilise la même logique de region, il y a un certain nombre de changements. Les plus notables sont le changement de la limite de hauteur à 256, puis à 320, de paire avec un plus haut nombre d'IDs de block. 

Plus de détails peuvent être trouvés sur le [Minecraft Wiki](https://fr.minecraft.wiki/w/Format_de_fichier_Anvil).

## Format de fichier linéaire

Il existe un format de fichier plus moderne connu sous le nom de format de région linéaire. Il économise de l’espace disque et utilise la bibliothèque zstd au lieu de zlib. C’est bénéfique car zlib est extrêmement vieux et dépassé.

Les fichiers stockés dans ce format sont des fichiers `.linear` et il économise environ 50% de l’espace disque dans l'Overworld' et le Nether, et économise 95% dans l'End.

Plus de détails peuvent être trouvés sur la page GitHub pour [Format de fichier linéaire](https://github.com/xymb-endcrystalme/LinearRegionFileFormatTools).

## Format de fichier "Slime"

Développé par Hypixel pour résoudre de nombreux problèmes du format de fichier Anvil, Slime remplace également zlib et permet d’économiser de l’espace par rapport à Anvil. Il enregistre le monde entier dans un seul fichier de sauvegarde, et permet à ce fichier d’être chargé dans plusieurs instances.

Les fichiers stockés dans ce format sont des fichiers `.slime`

Plus de détails peuvent être trouvés sur la page GitHub pour [Slime World Manager](https://github.com/cijaaimee/Slime-World-Manager#:~:text=Slime%20World%20Manager%20is%20a,worlds%20faster%20and%20save%20space.), ainsi que sur le [Dev Blog #5](https://hypixel.net/threads/dev-blog-5-storing-your-skyblock-island.2190753/) d'Hypixel.

## Format de fichier pour schématique

Contrairement aux autres formats de fichiers répertoriés, le format de fichier schématique n’est pas utilisé pour stocker des mondes Minecraft, mais plutôt dans des programmes tiers tels que MCEdit, WorldEdit et Schematica.

Les fichiers stockés dans ce format sont des fichiers `.schematic`, et sont formattés dans en [NBT](https://fr.minecraft.wiki/w/Format_NBT)

Plus de détails peuvent être trouvés sur le [Minecraft Wiki](https://fr.minecraft.wiki/w/Format_de_fichier_.schematic)

### Génération du monde

Quand le serveur démarre, il vérifie si il y a une sauvegarde présente, aussi connu comme le "monde".

Pumpkin appelle ensuite la génération du monde:

#### Sauvegarde présente

`AnvilChunkReader` est appelé pour traiter les fichiers region d'uns sauvegarde donnée.

- Comme indiqué ci-dessus, les fichiers de région stockent 32x32 chunks.
> Chaque fichier région est nommé par rapport aux coordonnés de où il se trouve dans le monde

> r.{}.{}.mca

- La table de localisation est lu depuis le fichier de sauvegarde, représentant les cordonnées du chunk.
- La table de timestamp est lu depuis le fichier de sauvegarde, représentant la dernière fois que le chunk a été modifié.

#### Pas de sauvegarde présente

La graine mondiale est définie sur "0". À l’avenir, elle sera définie sur la valeur de la configuration "de base".

`PlainsGenerator` est appelé, car jusqu’à présent les `plaines` sont le seul biome qui a été implémenté.

- `PerlinTerrainGenerator` est appelé pour définir la hauteur du chunk
- La hauteur de la pierre est défini à 5 en dessous de la hauteur du chunk
- La hauteur de la terre est défini à 2 en dessous de la hauteur du chunk
- Les blocs d'herbe appraissent sur les bloc de terre
- Il y a de la bedrock en y = -64
- Des fleurs et de l'herbe courte sont placés aléatoirement

`SuperflatGenerator` est aussi disponible mais n'est pas actuellement appellable.

- Il y a de la bedrock en y = -64
- Suivie de 2 blocs de terre
- Les blocs d’herbe sont placés un bloc de plus en haut

Les blocs peuvent être placés et cassés, mais les modifications ne peuvent être enregistrées sous aucun format de monde. Les mondes Anvil sont actuellement en lecture seule.
