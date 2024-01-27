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
        return new Promise((resolve,error)=>{
            resolve(JSON.parse(contents))
        });
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
        for(let i = 0; i < jsonFile.length; i++){
            if(jsonFile[i].id === partialBlock.identifiant){
                return new Promise((resolve,error)=>{resolve(jsonFile[i]);})
            }
        }
        const data = {
            id : "inconnu",
            etat : "Id inconnu"
        };
        return new Promise((resolve,error)=>{
            resolve(data)
        });
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
        return new Promise((resolve,error)=>{
            resolve(jsonFile[jsonFile.length-1] | null)
        });
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
    return new Promise((resolve,error)=>{
        resolve([...contents,data])
    });
}

