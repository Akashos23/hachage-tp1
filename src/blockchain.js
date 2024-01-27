import {createBlock, findBlocks, findBlock} from "./blockchainStorage.js";
import {json} from "node:stream/consumers"

export async function liste(req, res, url) {
    return findBlocks()
}

export async function create(req, res) {
    return createBlock(await json(req))
}

export async function  findBlockByID(req, res){
    return findBlock(await json(req))
}