//Fichier:		labyrinthe.js
//Auteur:	Wael ABOU ALI et Redha ATTAOUA.
// Ce programme est utilisé pour dessiner un labyrinthe ayant un et un seul chemin entre l'entrée et la sortie
// Ce programme est composé d'une procédure laby qui prend 3 paramètres(nx,ny,pas) et ne retourne aucun résultat
// Ce programme est composé des fonctions qui font séléction aléatoire d'une cellule puis une des voisines etc...
// en enlevant un mur reliant entre ces 2 cellules aléatoirement puis en enleve la cellule choisi du tableau front
// et en ajoutant cette cellule au tableau cave, la nouvelle cellule choisie sera ajoutée puis on choisi un de ces
// cellules voisines et en enleve un mur reliant les deux et on continue jusqu'on termine toutes les cellules dans la
// grille.

// La fonction initiale(procédure) qui appele les autres fonctions.
var laby = function (nx,ny,pas){
    var murs = algoLaby(nx,ny);
    var mursH = murs[0];
    var mursV = murs[1];
    positionTortue(nx,ny,pas);
    mursdessin(mursH,nx,ny,pas,true);
    if(ny != 1 && nx != 1) {				// Si c'est pas le cas spécial si nx = 1 ou ny = 1 pour ne pas redessiner
        mursdessin(mursV,nx,ny,pas,false);	// la grille une autre fois.
    }
    ajustementTortue(pas);					// repositionner la tortue pour commencer le dessin.
};

// La fonction algoLaby c'est la fonction initiale qui va générer le tableau front, les murs horizontales, les murs
// verticales puis je retire les 2 murs percés dans la grille 0 et le mur Horizontal finale, je crée cave qui va
// reçevoir les cellules de la cavité jusqu'au on a toutes les cellules dans la cavité. Je vais avoir les coordonnées
// de la cellule choisie pour choisir une des cellules voisines, si la cellule se trouve dans la cavité alors j'itère
// pour avoir une autre cellule dont on va l'ajouter au cavité et enlever le mur qui se trouve entre les 2 cellules.
// Si le mur est déjà dans les murs(mursCaveH ou mursCaveV) alors on choisi aléatoirement entre les 2 pour le retirer
// , si un seulement se trouve dans la cavité alors on le retire de(mursH ou mursV).
var algoLaby = function (nx,ny) {
	var total = nx*ny; 							//Le nombre total des cellules d'une grille.
    var front = iota(total);					// l'ensemble des cells non choisi par cave.
    var totalH = nx*(ny+1);						// le nombre total des murs horizontaux.
    var mursH = iota(totalH);					// asigner tous les murs horizontaux.
    var totalV = (nx+1)*ny;						// le nombre total des murs verticaux.
    var mursV = iota(totalV);					// assigner tous les murs verticaux.
    mursH = retirer(mursH,0);					// Retirer le mur d'entrée du labyrinthe.
    mursH = retirer(mursH,totalH-1);			// Retirer le mur de sortie du labyrinthe.
    var cave = [];								// tableau pour les cellules de cavité.
    var cellChoisi = randomiser(front); 		// Choisir la première cellule de la cavité.
    var coordonneesCell = coordCell(cellChoisi,nx,1);	// Obtenir les coordonnées de la cellule choisi.	 
    front = retirer(front,cellChoisi);			// Retirer la cellule choisi de front.
    cave = ajouter(cave,cellChoisi);			// Ajouter la cellule choisi dans cave.
    var tabVoisins = voisins(coordonneesCell.x,coordonneesCell.y,nx,ny);//Définir les cellule voisines de la cellule.														//choisie.
    var mursCaveH = mursHouV(coordonneesCell,nx,true); 
    var mursCaveV = mursHouV(coordonneesCell,nx,false);
    for (var j=1;j<total;j++){  // La boucle finit dès que toutes les cellues du front entrent dans la cavité.	
        cellChoisi = randomiser(tabVoisins);	// Nouvelle cellule choisie de manière aléatoire.
        tabVoisins = retirer(tabVoisins,cellChoisi);
        coordonneesCell = coordCell(cellChoisi,nx,1);
        //On définit les voisins de cette nouvelle cellule
        var nouveauVoisin = voisins(coordonneesCell.x,coordonneesCell.y,nx,ny);
        for (var i=0;i<nouveauVoisin.length;i++){
        //On ajoute ces voisins aux voisins de la cavités s'ils ne sont pas déjà membres de la cavité.
            if (contient(cave, nouveauVoisin[i]) == false){	
                tabVoisins = ajouter(tabVoisins,nouveauVoisin[i]);
            }
        }
        var nouveauMursCaveH = mursHouV(coordonneesCell,nx,true);	// Les murs N et S de la nouvelle cellule.
        var nouveauMursCaveV = mursHouV(coordonneesCell,nx,false);	// Les murs E et W de la nouvelle cellule.
        var murs = verifierMurs(mursH,mursV,mursCaveH,mursCaveV,nouveauMursCaveH,nouveauMursCaveV);
        mursH = murs[0];
        mursV = murs[1];
        mursCaveH = assignerMurs(mursCaveH,nouveauMursCaveH);
        mursCaveV = assignerMurs(mursCaveV,nouveauMursCaveV);
        retirer(front,cellChoisi);
        ajouter(cave,cellChoisi);
    }
    return [mursH,mursV];
};

// Cette fonction prend un numéro et retourne un tableau entre 0 et numéro-1
var iota = function (int) {
    var tab = Array(int);
    for(var i=0;i<int;i++) {
    	tab[i]=i;
    }
    return tab;
};

// Cette fonction c'est pour retirer la valeur x du tableau tab.
var retirer = function (tab,x) {
	for(var i=0;i<tab.length;i++) {
        if(tab[i] == x) {
            tab.splice(i,1);
            break;
        }
    }
    return tab;
};

//On se sert de cette fonction pour avoir une cellule aléatoire.
function randomiser(tab){
	return tab[Math.floor(tab.length*Math.random())];
};

//Cette fonction donne la coordonnée d'une cellule en prenant le numéro de cellule et la largeur de la grille.
function coordCell(cellChoisi,nx,isHorizontal){
	if(isHorizontal == false) {
    	nx = nx+1;
    }
    var u = cellChoisi%nx;
	var v = Math.floor(cellChoisi/nx);
	return {x: u, y: v};
};

// Cette fonction verifie avec la fonction contient si x est dans tab et sinon on l'ajoute à tab. 
var ajouter = function (tab,x) {
    if(contient(tab,x) == false) {
        tab.push(x);
    }
    return tab;
};

// Cette fonction est essentiel pour verifier si la valeur x se trouve dans le tableau tab ou pas
var contient = function (tab,x) {
    var int = tab.indexOf(x,0);
    if(int != -1) {
    	return true;
    }
    return false;
};

// Cette fonction sert à déterminer les cellules voisines de la cellule choisie obtenu.
var voisins = function (x,y,nx,ny) {
    var nord = x+y*nx;
    var nordV = nord-nx;
    var estV = nord+1;
    var sudV = nord+nx;
    var ouestV = nord-1;
    if(x == 0 || x == nx-1 || y == 0 || y == ny-1) {
    	if(x == 0 && y == 0) {
        	return [sudV,estV];
        } else if(x == 0 && y == ny-1) {
        	return [nordV,estV];
        } else if(x == nx-1 && y == 0) {
        	return [ouestV,sudV];
        } else if(x == nx-1 && y == ny-1) {
        	return [nordV,ouestV];
        } else {
        	if(x == 0) {
            	return [nordV,sudV,estV];
            } else if(x == nx-1) {
            	return [nordV,ouestV,sudV];
            } else if(y == 0) {
            	return [ouestV,sudV,estV];
            } else {
            	return [nordV,ouestV,estV];
            }
        } 
    } else {
    	return[nordV,ouestV,sudV,estV];
    }
};

//Cette fonction aide à obtienir les coordonnées de cellule choisi en horizontal(nord,sud) et vertical(ouest,est).
var mursHouV = function (coordonneesCell,nx,boolean) {
	var x = coordonneesCell.x;
    var y = coordonneesCell.y;
    if(boolean == true) {
        var nord = x+y*nx;
        var sud = x+(y+1)*nx;
    	return [nord,sud];
    } else {
        var ouest = x+y*(nx+1);
        var est = 1+x+y*(nx+1);
        return [ouest,est];
    }
};

// La fonction verifierMurs va verifier au début si le nouveauMur choisi à partir de sa position i dans la boucle qui
// prend 2 itérations seulement lorsque chaque cellule a 2 murs horizontales et 2 verticales seulement comme les murs
// formant la cellule. Si les murs assignés se trouvent les deux dans le tableau des murs horizontales et verticales 
// du chemin on prend 1 randomisé en utilisant randomMur, si un des deux est contenu dans le tableau alors on le 
// retire de l'ensemble des murs(H ou V) et on itère.
var verifierMurs = function (mursH,mursV,mursCaveH,mursCaveV,nouveauMursCaveH,nouveauMursCaveV) { 
    var randomMur = Math.random();
    for (var i=0;i<2;i++){
        if(contient(mursCaveV,nouveauMursCaveV[i]) && contient(mursCaveH,nouveauMursCaveH[i])){			
            if(randomMur < 0.5){	// si le nouveau mur horizontal et vertical sont dans les mursCaves les deux. 
                retirerMurs(mursH,mursCaveH,nouveauMursCaveH[i]);	// Élimination de mur horizontal.
                break;
            }else{
                retirerMurs(mursV,mursCaveV,nouveauMursCaveV[i]);	// Élimination de mur vertical.
                break;	
            }	// sinon alors ...
        }else if (contient(mursCaveH, nouveauMursCaveH[i])){		// si c'est juste le mur horizontal contenu.		
            retirerMurs(mursH,mursCaveH,nouveauMursCaveH[i]);		// Élimination de mur horizontal.
            break;
        }else if(contient(mursCaveV,nouveauMursCaveV[i])){ 			// si c'est juste le mur vertical contenu.
            retirerMurs(mursV,mursCaveV,nouveauMursCaveV[i]);		// Élimination de mur vertical.
            break;
        }
    }
    return [mursH,mursV];
};

// Cette fonction va ajouter les autres murs de la nouvelle cellule aux murs de la cavité dépendamment 
// de sa position horizontal ou vertical.
var assignerMurs = function (tab,nouveauTab) {
	for(var i=0;i<nouveauTab.length;i++) {
    	tab.push(nouveauTab[i]);
    }
    return tab;
};

var retirerMurs = function (murs,mursCave,nouveauMursCave) {
    var murIntersection;
    murIntersection = nouveauMursCave;								//mur de l'intersection
    retirer(mursCave,murIntersection);								//Retirer ce mur des murs de la cavité.
    nouveauMursCave = retirer(nouveauMursCave, murIntersection);	//Retirer ce mur des murs de lui-même.
    retirer(murs, murIntersection);
};

// Cette fonction va positionner la tortue vers la position (0,0) de la grille.
var positionTortue = function (nx,ny,pas) {
	var hauteur = ny * pas, largeur = nx * pas;
    pu();lt(90);fd(1/2*largeur);rt(90);fd(1/2*hauteur);pd();
};


// Cette fonction dessine les murs horizontaux et verticaux en changeant la variable isHorizontal.
function mursdessin(tab,nx,ny,pas,isHorizontal){
    var coord;
    if(ny != 1 && nx != 1) {
        for(var i=0;i<tab.length;i++){
            if(isHorizontal) {
                coord = coordCell(tab[i],nx,isHorizontal);
            } else {
                coord = coordCell(tab[i],nx,isHorizontal);
            }
            var x = coord.x;
            var y = coord.y;
            pu();rt(90);fd(x*pas);rt(90);fd(y*pas);
            if(isHorizontal) {
                lt(90); 
            }
            pd();fd(pas);pu();bk(pas); 
            if(isHorizontal) {
                rt(90);
            }
            bk(y*pas);lt(90);bk(x*pas);lt(90);pd();
        }
    } else {
        var i=0;
        rt(180);
        if(ny == 1) {
            
            while(i<2) {
                pd();fd(ny*pas);lt(90);fd((nx-1)*pas);pu();fd(pas);lt(90);
                i++;
            }
        } else {
            while(i<2) {
                pd();fd(ny*pas);lt(90);pu();fd(nx*pas);lt(90);
                i++;
            }
        }
        lt(180);
    }
};

// Pour positioner la tortue pour commencer la résolution de labyrinthe et donne la couleur rouge.
var ajustementTortue = function(pas) {
    var i=0, miniPas = 1/2*pas;
    pu();
    while(i<2) {
        fd(miniPas);rt(90);
        i++;
    }
    setpc(1,0,0);pd();fd(pas);
};

//retourne la nouvelle cellule ayant l'angle assigné.
var ajusterCell = function (nx,cell,angle){
    if (angle == 0){ 			// aiguille en direction nord.
        cell -= nx;
    } else if (angle == 180){ 	// aiguille en direction sud.
        cell +=nx;
    } else if (angle == 90){ 	// aiguille en direction est.
        cell += 1;
    } else if (angle == 270){ 	// aiguille en direction ouest.
        cell -= 1;
    }  
    return cell;				// retourne la nouvelle cellule.		
};

//retourne un booléen, faux s'il n'y a pas de murs devant, vrai sinon
var detecterMur = function (nx,posCell,mursH,mursV,direction,isVertical){
    var x = posCell%nx;		
    var y = Math.floor(posCell/nx);
    var murNord = posCell, murSud = posCell+nx, murOuest = x+y*(nx+1), murEst = 1+x+y*(nx+1);  
    if (direction ==  0){ 				// si on se déplace vers le nord.
        if(isVertical) {
            if (contient(mursH,murNord)){
                return true;
            }
        } else {
            if(contient(mursV,murEst)){
                return true;
            }
        }
    } else if (direction == 90){ 		//si on se déplace vers le l'est.
        if(isVertical) {
            if(contient(mursV,murEst)){
                return true;
            }
        } else {
            if(contient(mursH,murSud)){
                return true;
            }	
        }
    } else if (direction== 180){ 		// si on se déplace vers le sud.
        if(isVertical) {
            if (contient(mursH,murSud)){
                return true;
            }
        } else {
            if (contient(mursV,murOuest)){
                return true;
            }
        }
    } else if(direction == 270){ 		// si on se déplace vers l'ouest.
        if(isVertical) {
            if (contient(mursV,murOuest)){
                return true;
            }
        } else {
            if(contient(mursH,murNord)) {
                return true;
            }
        }
    }
    return false;						// Sinon la fonction va retourner faux.
};

// retourne la nouvelle direction après une rotation, les paramètres sont en degrés.
var rotation = function (direction){
  var nouvelleDirection= (direction) % 360;	// La nouvelle direction sera 0,90,180,270 +(rt) ou - 90(lt).
  if (nouvelleDirection < 0){				// Si l'angle est plus petit que 0 alors on ajoute 360.
    nouvelleDirection += 360;
  }
  return nouvelleDirection;					// On retourne la nouvelle direction.

};

// C'est une fonction responsable pour verifier si la cellule choisie est égale à la cellule sortie ou pas.
var verifierPos = function(posCell,cellSortie) {
    if(posCell == cellSortie) { 
        return true;
    }
    return false;
};

// La fonction labySol c'est la fonction initiale pour dessiner le trajet en utilisant l'algorithme de Pledge
// qui a comme un fonctionnement que l'algorithme est si la direction tout droite est libre sans avoir un mur
// qui la bloque alors l'aiguille va se diriger tout droit, si c'est bloqué alors il va continuer à droite si 
// la direction n'est pas bloquée par un mur et si les 2 directions sont bloqués alors il va se déplacé 
// vers la gauche.
// Cette fonction prend des paramètres nx,ny,pas et retourne un dessin qui résoud le labyrinthe ou s'il n'a pas pu
// alors il va se retourner vers le début.
var labySol=function(nx,ny,pas){
    var murs = algoLaby(nx,ny);
    var mursH = murs[0];
    var mursV = murs[1];
    positionTortue(nx,ny,pas);
    mursdessin(mursH,nx,ny,pas,true); 
    if(ny != 1 && nx != 1) { 				// Si c'est pas le cas spécial si nx = 1 ou ny = 1 pour ne pas redessiner
        mursdessin(mursV,nx,ny,pas,false);	// la grille une autre fois.
    }
    if(ny != 1 && nx != 1) {
        ajustementTortue(pas);				// repositionner la tortue pour commencer le dessin.
        var total = nx*ny; 
        var positionCellule = 0, celluleSortie = (nx*ny)-1;
        var direction = 180 ;				// on initialise la direction de sud
        var compteur = 0; 					// le compteur de virage de l'algorithme de pledge
        var i=0;
        moveForward:
        while(positionCellule != celluleSortie) {
            pause(0.01);
            // 1ère étape: aller tout droit jusqu'au mur :
            while(detecterMur(nx,positionCellule,mursH,mursV,direction,true) == false){
                positionCellule = ajusterCell(nx,positionCellule,direction);
                fd(pas);
                if(i != 0) {
                    if(verifierPos(positionCellule,celluleSortie) || positionCellule < -1) {
                        fd(pas);
                        break moveForward;
                    }
                }
            }
            //2ème étape: suivre le mur à droite :
            do{ 
                moveRight:
                while(detecterMur(nx,positionCellule, mursH, mursV, direction,false)){ //tant qu'il y a un mur à droite
                    if(detecterMur(nx,positionCellule, mursH, mursV, direction,true) == false){
                        positionCellule = ajusterCell(nx,positionCellule,direction);
                        fd(pas);
                        if(verifierPos(positionCellule,celluleSortie) || positionCellule < -1) {
                            if(verifierPos(positionCellule,celluleSortie)) {
                                rt(90);
                                fd(pas);
                            }
                            break moveForward;
                        }
                    }
                    if (detecterMur(nx,positionCellule,mursH,mursV,direction,false) == false){
                        break moveRight;
                    }
                    while(detecterMur(nx,positionCellule,mursH,mursV,direction,true)){ //s'il y a un mur devant
                        lt(90);
                        direction = rotation(direction-90);
                        compteur++;
                    }
                }
                rt(90);
                direction = rotation(direction+90);
                compteur--;
                positionCellule = ajusterCell(nx,positionCellule,direction);
                if(verifierPos(positionCellule,celluleSortie) || positionCellule < -1) {
                    fd(pas);
                    break moveForward;
                }
                fd(pas);
            } while(compteur != 0);
            i++;
        } 
    } else {
        var i=0;
        while(i<2) {
            fd(1/2*pas);rt(90);
            i++;
        }
        if(ny == 1) {
            setpc(1,0,0);pd();fd(pas);lt(90);fd((nx-1)*pas);rt(90);fd(pas); 
        } else {
        	setpc(1,0,0);pd();fd((ny+1)*pas);
        }
    }
};

/*var testLaby = function () {
    assert (iota(0) == "");
    assert (iota(5) == "0,1,2,3,4");

    assert (contient([9,2,5],2) == true);
    assert (contient([9,2,5],4) == false);
    assert (contient([],0) == false);

    assert(ajouter([9,2,5],2) == "9,2,5");
    assert(ajouter([9,2,5],4) == "9,2,5,4");
    assert(ajouter([],0) == "0");

    assert(retirer([9,2,5],2) == "9,5");
    assert(retirer([9,2,5],4) == "9,2,5");
    assert(retirer([],0) == "");

    assert(voisins(7,2,8,4) == "15,22,31");
    assert(voisins(0,0,8,4) == "8,1");
    assert(voisins(7,3,8,4) == "23,30");

    assert(coordCell(21,8,1).x == "5");		// x de cellChoisi(le 1 retourne la valeur true).
    assert(coordCell(21,8,1).y == "2");		// y de cellChoisi(pour différencier entre cellChoisi et nouveauMur). 
    assert(coordCell(21,8,true).x == "5");	// x de nouveau mur horizontal.
    assert(coordCell(21,8,true).y == "2");	// y de nouveau mur horizontal.
    assert(coordCell(21,8,false).x == "3");	// x de nouveau mur vertical.
    assert(coordCell(21,8,false).y == "2");	// y de nouveau mur vertical.
    assert(coordCell(0,8,1).x == "0");		// x de cellChoisi(le 1 retourne la valeur true).
    assert(coordCell(0,8,1).y == "0");		// y de cellChoisi(pour différencier entre cellChoisi et nouveauMur). 
    assert(coordCell(0,8,true).x == "0");	// x de nouveau mur horizontal.
    assert(coordCell(0,8,true).y == "0");	// y de nouveau mur horizontal.
    assert(coordCell(0,8,false).x == "0");	// x de nouveau mur vertical.
    assert(coordCell(0,8,false).y == "0");	// y de nouveau mur vertical.

    assert(mursHouV({x: 0, y: 0},8,true)[0] == "0"); 	// nord
    assert(mursHouV({x: 0, y: 0},8,true)[1] == "8"); 	// sud
    assert(mursHouV({x: 0, y: 0},8,false)[0] == "0");	// ouest
    assert(mursHouV({x: 0, y: 0},8,false)[1] == "1");	// est
    assert(mursHouV({x: 4, y: 2},8,true)[0] == "20");	// nord
    assert(mursHouV({x: 4, y: 2},8,true)[1] == "28");	// sud
    assert(mursHouV({x: 4, y: 2},8,false)[0] == "22");	// ouest
    assert(mursHouV({x: 4, y: 2},8,false)[1] == "23");	// est

    var mursH = [1,2,3,4,5,6,7,9,13,14,15,16,17,18,19,22,23,25,27,29,31,32,33,34,35,36,37,38];
    var mursV = [0,2,4,8,9,12,14,17,18,19,22,26,27,33,35];
    assert(detecterMur(8,11,mursH,mursV,0,true)== false); 	// mur en devant est en nord
    assert(detecterMur(8,11,mursH,mursV,90,true)== false); 	// mur en devant est en est
    assert(detecterMur(8,11,mursH,mursV,180,true)== true); // mur en devant est en sud
    assert(detecterMur(8,11,mursH,mursV,270,true)== true); // mur en devant est en ouest
    assert(detecterMur(8,11,mursH,mursV,0,false)== false);	// mur à droite est en nord
    assert(detecterMur(8,11,mursH,mursV,90,false)== true);	// mur à droite est en est
    assert(detecterMur(8,11,mursH,mursV,180,false)== true);	// mur à droite est en sud
    assert(detecterMur(8,11,mursH,mursV,270,false)== false);	// mur à droite est en ouest
    assert(detecterMur(8,31,mursH,mursV,0,true)== true);
    assert(detecterMur(8,31,mursH,mursV,90,true)== true);
    assert(detecterMur(8,31,mursH,mursV,180,true)== false);
    assert(detecterMur(8,31,mursH,mursV,270,true)== false);
    assert(detecterMur(8,31,mursH,mursV,0,false)== true);
    assert(detecterMur(8,31,mursH,mursV,90,false)== false);
    assert(detecterMur(8,31,mursH,mursV,180,false)== false);
    assert(detecterMur(8,31,mursH,mursV,270,false)== true);

    assert(verifierPos(0,31) == false); 	// pour une grille 8x4
    assert(verifierPos(31,31) == true);
    assert(verifierPos(11,15) == false);	// pour une grille 8x4
    assert(verifierPos(15,15) == true);
    assert(verifierPos(88,89) == false);	// pour une grille 10x9
    assert(verifierPos(89,89) == true);

};

testLaby();*/

// laby(8,4,40);							// tester les fonctions laby et labySol.
// laby(10,9,20);
// laby(16,9,20);
// laby(34,18,10);
// laby(7,1,20);
// laby(1,20,10);

// labySol(8,4,40);
// labySol(20,1,10);
// labySol(1,20,10);
// labySol(16,9,20);
// labySol(20,20,10);
// labySol(7,0,20);

labySol(10,9,20);
