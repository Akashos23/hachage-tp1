
import {createServer} from "node:http"
import {create, liste, findBlockByID} from "./blockchain.js";
import {NotFoundError} from "./errors.js";

createServer(async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const url = new URL(req.url, `http://${req.headers.host}`)
        const endpoint = `${req.method}:${url.pathname}`

        let results

        try {
            switch (endpoint) {
                case 'GET:/blockchain':
                    console.log("Get:blockchain")
                    results = await liste(req, res, url)
                    break
                case 'POST:/blockchain':
                    console.log("Post:blockchain")
                    results = await create(req, res)
                    break
                case 'GET:/findBlockByID':
                    console.log("GET:/findBlockByID");
                    results = await findBlockByID(req, res)
                    break
                default :
                    res.writeHead(404)
            }
            if (results) {
                res.write(JSON.stringify(results))
            }
        } catch (erreur) {
            if (erreur instanceof NotFoundError) {
                res.writeHead(404)
            } else {
                throw erreur
            }
        }
        res.end()
    }
).listen(3000)
