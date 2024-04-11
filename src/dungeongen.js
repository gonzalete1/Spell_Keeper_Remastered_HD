import e1 from './rooms/e1.js'
import r1 from './rooms/r1.js'
import r2 from './rooms/r2.js';
import r3 from './rooms/r3.js';
import r4 from './rooms/r4.js';
import r5 from './rooms/r5.js';
import r6 from './rooms/r6.js';
import r7 from './rooms/r7.js';
import r8 from './rooms/r8.js';
import r9 from './rooms/r9.js';
import r10 from './rooms/r10.js';
import r11 from './rooms/r11.js';
import r12 from './rooms/r12.js';
import r13 from './rooms/r13.js';
import r14 from './rooms/r14.js';
import r15 from './rooms/r15.js';
import sh1 from './rooms/sh1.js';
import sh2 from './rooms/sh2.js';
import sh3 from './rooms/sh3.js';
import sh4 from './rooms/sh4.js';
import sh5 from './rooms/sh5.js';
import sh6 from './rooms/sh6.js';
import sh7 from './rooms/sh7.js';
import sh8 from './rooms/sh8.js';
import x1 from './rooms/x1.js';
import x2 from './rooms/x2.js';
import x3 from './rooms/x3.js';
import x4 from './rooms/x4.js';


const N = 5; //Numero de filas
const M = 5; //Numero de columnas
const maxSteps = 60; //Maximo de habitaciones


/*//El "tablero" del mapa, en el que se van generando las habitaciones
let genMatrix;

let exitArray;
let entrance; //La entrada
let shopArray;
let deadendArray;
*/



class RoomInfo {
    constructor(roomJson, x, y) {
        this.roomJson = roomJson;
        this.x = x;
        this.y = y;
    }
};



export default class Dungeongen {

    constructor() {
        this.roomArray = []
        this.specialRoomArray = []
        this.entranceX = 0
        this.entranceY = 0
        this.thereIsExit = false;
        this.thereIsShop  = false
        this.init();
    }

    generateSaveStateMatrix(n,m){
        let SSM = [];
        let state = null;
        for (let i = 0; i < n; i++) {
            SSM[i] = [];
            for (let j = 0; j < m; j++) {
                SSM[i][j] = state
            }
        }

        return SSM
    }

    getN(){
        return N;
    }

    getM(){
        return M;
    }

    //Genera la mazmorra del tutorial (siempre la misma)
    tutorial(){
        //Inicializacion
        let dungeon = [];

        //Llenamos la mazmorra de habitaciones vacías
        for (let i = 0; i < 4; i++) {
            dungeon[i] = [];
            for (let j = 0; j < 1; j++) {
                dungeon[i][j] = {

                    name: "em_r",

                    level: "all",

                    path: "../../assets/armory/em_r.tmx",

                    entrance: false,
                    exit: false,
                    empty: true, //Habitacion vacia
                    deadend: false,//para saber que solo tiene una salida
                    shop: false,

                    door_north: false,
                    door_south: false,
                    door_east: false,
                    door_west: false
                };
            }
        }

        dungeon[3][0] = r1;
        dungeon[2][0] = r2;
        dungeon[1][0] = r3;
        dungeon[0][0] = x1;

        return dungeon;
    }


    init() {

        //Inicializacion
        let dungeon = [];

        //Llenamos la mazmorra de habitaciones vacías
        for (let i = 0; i < N; i++) {
            dungeon[i] = [];
            for (let j = 0; j < M; j++) {
                dungeon[i][j] = {

                    name: "em_r",

                    level: "all",

                    path: "../../assets/armory/em_r.tmx",

                    entrance: false,
                    exit: false,
                    empty: true, //Habitacion vacia
                    deadend: false,//para saber que solo tiene una salida
                    shop: false,

                    door_north: false,
                    door_south: false,
                    door_east: false,
                    door_west: false

                };
            }
        }


        this.fillRoomArray(0);
        this.fillSpecialRoomArray(0);

        //Generamos dos cordenadas aleatorias desde donde empezar
        this.entranceX = Math.floor(Math.random() * (N - 2)) + 1;
        this.entranceY = Math.floor(Math.random() * (M - 2)) + 1;

        //Ponemos la entrada
        

        dungeon[this.entranceY][this.entranceX] = e1
         //Asignamos la entrada
        console.log(`Entrada generada en la casilla: ${this.entranceY}, ${this.entranceX}`);

        this.thereIsExit = false;
        this.thereIsShop = false;

        // const generator = this.generate(dungeon, this.entranceX, this.entranceY);

        let found = null
        let maxTries = 60
        //Empezamos a generar la mazmorra
        for (found of this.generate(dungeon, this.entranceX, this.entranceY)) {
            // found = dungeonTry

            maxTries--
            if (maxTries <= 0) {
                break
            }
        }

        //Si no es valida, reempezamos el proceso
        if (!found) {
            console.log("Resetiado")
            return this.init();
        }

        this.showMatrix(found);
        //Paso 2: Rellenar huecos

        //Rellenamos las habitaciones que no lleven a ningun lado
        let candidateDungeon = this.fillDungeon(found);

        if (candidateDungeon === null) {
            console.log("Resetiado")
            return this.init();
        }


        console.log("--------------------------------");
        this.showMatrix(candidateDungeon);

        //Paso 3: Mirar si es valida
        if (!this.checkForValidity()) {
            console.log("Mazmorra no válida, reintentando")
            return this.init();
        }

        return candidateDungeon;
    }

    getEntranceX(){
        return this.entranceX;
    }

    getEntranceY(){
        return this.entranceY;
    }

    

    /*
    // dada una matrix, deuelve true si esto funcionaría y está terminada
    plausibleDungeon(dungeon) {
        //Preguntar pa q vale esto
        return false;
    }*/

    // devuelve null si no es aplicable, y una dungeon """nueva""" si si
    applyDirection(dungeon, direction, x, y, numberOfSteps) {
        // deep clone: JSON.parse(JSON.stringify(dungeon))

        //El array de habitaciones candidatas definitivo y los parciales
        //Así conseguimos que si sale la probabilidad de habitacion especial y no conecta ninguna, todavía tenemos el "backup" de las habitaciones normales
        //Antes de dar la casilla por perdida
        let validRoomArray = [];
        let normalValidRoomArray = [];
        let specialValidRoomArray = [];

        if (Math.random() * numberOfSteps >= (maxSteps / (Math.max(1, Math.min(numberOfSteps, maxSteps))))) { //Si sale la probabilidad generamos habitación especial
            specialValidRoomArray = this.getValidRooms(this.specialRoomArray, direction, x, y)
            console.log("Salió chance");
        }

        normalValidRoomArray = this.getValidRooms(this.roomArray, direction, x, y)
        //Mezclamos el array
        this.shuffleArray(normalValidRoomArray)

        if (specialValidRoomArray.length !== 0) { //Si no es 0
            this.shuffleArray(specialValidRoomArray) //Lo mezclamos
            validRoomArray = this.specialRoomArray.concat(normalValidRoomArray); //Los concatenamos
        } else {
            validRoomArray = normalValidRoomArray; //Sino simplemente el normal
        }

        //Ajustamos las coordenadas
        if (direction === 'n') {
            y -= 1;
        } else if (direction === 's') {
            y += 1;
        } else if (direction === 'e') {
            x += 1;
        } else if (direction === 'w') {
            x -= 1;
        }

        if (this.isCoordinateInsideMatrix(x, y))
            if (!this.isCoordinateOccupied(dungeon, x, y)) {
                let newDungeon = [];
                newDungeon = JSON.parse(JSON.stringify(dungeon));
                for (let room of validRoomArray) {
                    if (room.exit === true)
                        if (this.thereIsExit === false) {
                            newDungeon[y][x] = room; 
                            let distanceX = Math.abs(x - this.entranceX);
                            let distanceY = Math.abs(y - this.entranceY);
                            if (this.checkIfRoomConnects(x, y, newDungeon) && distanceX >= maxSteps * 0.05 && distanceY >= maxSteps * 0.05) {
                                console.log("Generando salida");
                                this.thereIsExit = true;
                                return newDungeon;
                            }
                        }
                    if (room.shop === true)
                        if (this.thereIsShop === false) {
                            newDungeon[y][x] = room; 
                            if (this.checkIfRoomConnects(x, y, newDungeon)) {
                                console.log("Generando tienda");
                                this.thereIsShop = true;
                                return newDungeon;
                            }
                        }
                    if (!room.shop && !room.exit) {
                        newDungeon[y][x] = room; 
                        if (this.checkIfRoomConnects(x, y, newDungeon))
                            return newDungeon;
                    }
                }


            }

        return null;
    }

    * generate(dungeon, x, y) {
        let numberOfSteps = 0;
        /* if (this.plausibleDungeon(dungeon)) {
             yield dungeon;
         }*/
        let addedRooms = []; addedRooms.push(new RoomInfo(dungeon[y][x], x, y))
        for (let roomInfo of addedRooms) {

            for (let direction of ['n', 's', 'e', 'w']) {

                numberOfSteps++;

                const newDungeon = this.applyDirection(dungeon, direction, roomInfo.x, roomInfo.y, numberOfSteps)
                if (newDungeon !== null) {
                    //Actualizamos coordenadas x y
                    if (direction === 'n') {
                        addedRooms.push(new RoomInfo(dungeon[y][x], x, y - 1))
                    } else if (direction === 's') {
                        addedRooms.push(new RoomInfo(dungeon[y][x], x, y + 1))
                    } else if (direction === 'e') {
                        addedRooms.push(new RoomInfo(dungeon[y][x], x + 1, y))
                    } else if (direction === 'w') {
                        addedRooms.push(new RoomInfo(dungeon[y][x], x - 1, y))
                    }
                    dungeon = newDungeon;
                    yield newDungeon
                } else {
                    yield dungeon;
                }
            }
        }
    }


    fillDungeon(dungeon) {
        let newDungeon = dungeon;
        for (let x = 0; x < N; x++) {
            for (let y = 0; y < M; y++) {
                //Si hay habitacion
                if (dungeon[y][x].empty === false) {
                    //Mirar si hay caminos vacios
                    let dir;
                    for (dir of this.checkForEmptyPathways(x, y, dungeon[y][x], dungeon)) {
                        if (dir !== null) {
                            newDungeon = this.fixEmptyPathway(x, y, dungeon, dir)
                            if (newDungeon === null) //Si no ha sido posible no tiene sentido seguir
                                return null;
                            dungeon = newDungeon;
                        }
                    }
                }
            }
        }

        return newDungeon;
    }

    *checkForEmptyPathways(x, y, room, dungeon) {

        for (let direction of ['n', 's', 'e', 'w']) {

            switch (direction) {

                case 'n':
                    if (y - 1 >= 0) {
                        if (room.door_north === true && dungeon[y - 1][x].empty === true) { //Si hay un camino que lleva a la nada norte
                            yield direction;
                        }
                    }
                    yield null;
                    break;
                case 's':
                    if (y + 1 < M) {
                        if (room.door_south === true && dungeon[y + 1][x].empty === true) { //Si hay un camino que lleva a la nada sur
                            yield direction;
                        }
                    }
                    yield null;
                    break;
                case 'e':
                    if (x + 1 < N) {
                        if (room.door_east === true && dungeon[y][x + 1].empty === true) { //Si hay un camino que lleva a la nada este
                            yield direction;
                        }
                    }
                    yield null;
                    break;
                case 'w':
                    if (x - 1 >= 0) {
                        if (room.door_west === true && dungeon[y][x - 1].empty === true) { //Si hay un camino que lleva a la nada oeste
                            yield direction;
                        }
                    }
                    yield null;
                    break;

            }

        }

    }

    fixEmptyPathway(x, y, dungeon, direction) {

        let validRoomArray = [];
        let normalValidRoomArray = [];
        let specialValidRoomArray = [];


        if (!this.thereIsExit || !this.thereIsShop) { //Si no hay ni tienda ni salida
            specialValidRoomArray = this.getValidRooms(this.specialRoomArray, direction, x, y) //Las asignamos con prioridad al array de habs validas
        }

        normalValidRoomArray = this.getValidRooms(this.roomArray, direction, x, y) //Ahora generamos las normales
        this.shuffleArray(normalValidRoomArray) //Lo mezclamos
        if (specialValidRoomArray.length !== 0) { //Si no es 0
            this.shuffleArray(specialValidRoomArray) //Lo mezclamos
            validRoomArray = this.specialRoomArray.concat(normalValidRoomArray); //Los concatenamos
        } else {
            validRoomArray = normalValidRoomArray; //Sino simplemente el normal
        }


        //Ajustamos las coordenadas
        if (direction === 'n') {
            y -= 1;
        } else if (direction === 's') {
            y += 1;
        } else if (direction === 'e') {
            x += 1;
        } else if (direction === 'w') {
            x -= 1;
        }

        let newDungeon = JSON.parse(JSON.stringify(dungeon));

        for (let room of validRoomArray) { //Recorremos los candidatos a nueva habitacion
            newDungeon[y][x] = room; //Las ponemos en la mazmorra
            if (!this.thereIsExit) { //Si no hay salida aun
                if (room.exit === true) { //Y la habitacion es una salida
                    console.log("Generando salida al cerrar");
                    if (this.checkIfRoomConnectsForClosing(x, y, newDungeon)) { //Miramos si conecta
                        this.thereIsExit = true; //Marcamos
                        return newDungeon; //Devolvemos nueva mazmorra si cierra
                    }
                }
            }
            if (!this.thereIsShop) { //Aqui igual
                if (room.shop === true && this.thereIsShop === false) {
                    console.log("Generando tienda al cerrar");
                    if (this.checkIfRoomConnectsForClosing(x, y, newDungeon)) {
                        this.thereIsShop = true;
                        return newDungeon; //Devolvemos nueva mazmorra si cierra
                    }
                }
            }
            if (!room.exit && !room.shop) { //Si es una habitacion normal
                if (this.checkIfRoomConnectsForClosing(x, y, newDungeon)) {
                    return newDungeon; //Devolvemos nueva mazmorra si cierra
                }
            }

        }

        return null; //Si no null y así sabemos que la mazmorra no se va a cerrar :(
    }



    getValidRooms(roomArray, direction, x, y) {

        let validRoomArray = [];

        switch (direction) {
            case 'n':
                if (!this.isCoordinateInsideMatrix(x, y - 1)) //Si la coordenada no está dentro de la matriz 
                    return validRoomArray;
                for (let room of this.roomArray) {
                    if (room.door_south && ((room.door_north && this.isRoomNotGoingToHaveUselessDoors(x, y - 1) || !room.door_north))) //Si se conecta a la anterior y no lleva a la nada
                        validRoomArray.push(room);
                }
                break;
            case 's':
                if (!this.isCoordinateInsideMatrix(x, y + 1)) //Si la coordenada no está dentro de la matriz 
                    return validRoomArray;
                for (let room of this.roomArray) {
                    if (room.door_north && ((room.door_south && this.isRoomNotGoingToHaveUselessDoors(x, y + 1) || !room.door_south)))
                        validRoomArray.push(room);
                }

                break;
            case 'e':
                if (!this.isCoordinateInsideMatrix(x + 1, y)) //Si la coordenada no está dentro de la matriz 
                    return validRoomArray;
                for (let room of this.roomArray) {
                    if (room.door_west && ((room.door_east && this.isRoomNotGoingToHaveUselessDoors(x + 1, y) || !room.door_east)))
                        validRoomArray.push(room);
                }

                break;
            case 'w':
                if (!this.isCoordinateInsideMatrix(x - 1, y)) //Si la coordenada no está dentro de la matriz 
                    return validRoomArray;
                for (let room of this.roomArray) {
                    if (room.door_east && (room.door_west && this.isRoomNotGoingToHaveUselessDoors(x - 1, y) || !room.door_west))
                        validRoomArray.push(room);
                }

                break;
        }

        return validRoomArray;
    }

    checkIfRoomConnectsForClosing(x, y, dungeon) {

        //Igual que el otro checkForClosing pero además comprueba que no vayas a dejar un camino que no lleva a la nada
        if (x + 1 < N)
            if (((dungeon[y][x + 1].empty === false && ((dungeon[y][x].door_east === true && dungeon[y][x + 1].door_west === false) || (dungeon[y][x].door_east === false && dungeon[y][x + 1].door_west === true)))) || (dungeon[y][x + 1].empty === true && dungeon[y][x].door_east === true))
                return false
        if (x - 1 >= 0)
            if ((dungeon[y][x - 1].empty === false && ((dungeon[y][x].door_west === true && dungeon[y][x - 1].door_east === false) || (dungeon[y][x].door_west === false && dungeon[y][x - 1].door_east === true))) || (dungeon[y][x - 1].empty === true && dungeon[y][x].door_west === true))
                return false
        if (y + 1 < M)
            if ((dungeon[y + 1][x].empty === false && ((dungeon[y][x].door_south === true && dungeon[y + 1][x].door_north === false) || (dungeon[y][x].door_south === false && dungeon[y + 1][x].door_north === true))) || (dungeon[y + 1][x].empty === true && dungeon[y][x].door_south === true))
                return false
        if (y - 1 >= 0)
            if ((dungeon[y - 1][x].empty === false && ((dungeon[y][x].door_north === true && dungeon[y - 1][x].door_south === false) || (dungeon[y][x].door_north === false && dungeon[y - 1][x].door_south === true))) || (dungeon[y - 1][x].empty === true && dungeon[y][x].door_north === true))
                return false

        return true;
    }

    checkIfRoomConnects(x, y, dungeon) {

        //No estoy muy orgulloso de esto xD
        if (x + 1 < N)
            if ((dungeon[y][x + 1].empty === false && ((dungeon[y][x].door_east === true && dungeon[y][x + 1].door_west === false) || (dungeon[y][x].door_east === false && dungeon[y][x + 1].door_west === true))))
                return false
        if (x - 1 >= 0)
            if ((dungeon[y][x - 1].empty === false && ((dungeon[y][x].door_west === true && dungeon[y][x - 1].door_east === false) || (dungeon[y][x].door_west === false && dungeon[y][x - 1].door_east === true))))
                return false
        if (y + 1 < M)
            if ((dungeon[y + 1][x].empty === false && ((dungeon[y][x].door_south === true && dungeon[y + 1][x].door_north === false) || (dungeon[y][x].door_south === false && dungeon[y + 1][x].door_north === true))))
                return false
        if (y - 1 >= 0)
            if ((dungeon[y - 1][x].empty === false && ((dungeon[y][x].door_north === true && dungeon[y - 1][x].door_south === false) || (dungeon[y][x].door_north === false && dungeon[y - 1][x].door_south === true))))
                return false

        return true;
    }


    isRoomNotGoingToHaveUselessDoors(x, y) {
        //Reducimos el cuadrado efectivo de las habitaciones que apuntan en la misma direccion para evitar que sus caminos lleven a la nada.
        if (x < 1)
            return false;
        else if (x >= N - 1)
            return false;
        else if (y >= M - 1)
            return false;
        else if (y < 1)
            return false;

        return true;
    }

    isCoordinateOccupied(dungeon, x, y) {
        if (dungeon[y][x].empty === false)
            return true;
        return false;
    }


    isCoordinateInsideMatrix(x, y) {
        if (x < 0)
            return false;
        else if (x >= N)
            return false;
        else if (y >= M)
            return false;
        else if (y < 0)
            return false;

        return true;
    }

    //Para mezclar el array de habitaciones para que no siempre salga la misma
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }



    checkForValidity() {
        return this.thereIsExit //&& this.thereIsShop;
    }

    fillRoomArray(floor) {
        if (floor === 0) { //Armeria
            //deadendArray.push(r1);
            this.roomArray.push(r2);
            this.roomArray.push(r4);
            this.roomArray.push(r1);
            this.roomArray.push(r3);
            this.roomArray.push(r5);
            this.roomArray.push(r6);
            this.roomArray.push(r7);
            this.roomArray.push(r8);
            this.roomArray.push(r9);
            this.roomArray.push(r10);
            this.roomArray.push(r11);
            this.roomArray.push(r12);
            this.roomArray.push(r13);
            this.roomArray.push(r14);
            this.roomArray.push(r15);

            //TODO push exits y shops
        }
    }

    fillSpecialRoomArray(floor) {
        this.specialRoomArray = [];
        if (floor === 0) { //Armeria
            this.specialRoomArray.push(x1);
            this.specialRoomArray.push(x2);
            this.specialRoomArray.push(x3);
            this.specialRoomArray.push(x4);
           /* this.specialRoomArray.push(sh1);
            this.specialRoomArray.push(sh2);
            this.specialRoomArray.push(sh3);
            this.specialRoomArray.push(sh4);
            this.specialRoomArray.push(sh5);
            this.specialRoomArray.push(sh6);
            this.specialRoomArray.push(sh7);
            this.specialRoomArray.push(sh8);*/
        }
    }

    showMatrix(dungeon) {
        for (let i = 0; i < dungeon.length; i++) {
            let row = '';
            for (let j = 0; j < dungeon[i].length; j++) {
                if (dungeon[i][j] && dungeon[i][j].name) {
                    row += dungeon[i][j].name.padEnd(8); // Adjust the padding as needed
                } else {
                    row += '         '; // Placeholder for invalid room object
                }
            }
            console.table(row);
        }
    }

}


