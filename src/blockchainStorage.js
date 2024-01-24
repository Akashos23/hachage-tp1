import {readFile, writeFile} from 'node:fs/promises'
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto'
import { uuid } from 'uuidv4';

/* Chemin de stockage des blocks */
const path = '../data/blockchain.json'

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {
    try {
        const filePath = new URL(path, import.meta.url);
        const contents = await readFile(filePath, { encoding: 'utf8' });
        return JSON.parse(contents);
    } catch (err) {
        console.error(err.message);
    }
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    try {
        const filePath = new URL(path, import.meta.url);
        const contents = await readFile(filePath, { encoding: 'utf8' });
        const jsonFile = JSON.parse(contents);
        console.log(jsonFile[jsonFile.length-1])
        for(let i = 0; i < jsonFile.length; i++){
            if(jsonFile[i].id === partialBlock){
                return jsonFile[i];
            }
        }
        const data = {
            id : "inconnu",
            etat : "Id inconnu"
        };
        return data;
    } catch (err) {
        console.error(err.message);
    }
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    try {
        const filePath = new URL(path, import.meta.url);
        const contents = await readFile(filePath, { encoding: 'utf8' });
        const jsonFile = JSON.parse(contents);
        return jsonFile[jsonFile.length-1];
    } catch (err) {
        console.error(err.message);
    }
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {
    const data = {
        id : uuid(),
        date : getDate(),
        nom : contenu.nom,
        don : contenu.don,
        hash : createHash('sha256').update(JSON.stringify(findLastBlock())).digest('hex')
    };
    const contents = await findBlocks()
    await writeFile(path, JSON.stringify([...contents,data]), 'utf8');
    return [...contents,data];
}

