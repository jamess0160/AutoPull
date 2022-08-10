const express = require('express')
const { exec } = require('child_process')
require('dotenv/config')

const app = express()

app.use(express.json())

app.post('/gitlab', (req, res) => {
    // Valida o token enviado
    if (req.headers["x-gitlab-token"] !== process.env.GitToken) {
        res.status(401).send("Conexão recusada")
        return
    }

    // Executa os comandos CMD
    executarPull().then((result) => {
        let { status, body } = result
        if (status == 500) {
            res.status(status).json(body)
            return
        }
        if (req.body.commits[0].title == "Download npm package") {
            execNpmInstall().then((resultInstall) => {
                let { status, body } = resultInstall
                res.status(status).json(body)
            })
            return
        }
        res.status(status).json(body)
    })
})

app.get('/', (req, res) => {
    res.send("olá mundo")
})

app.listen(3001, () => {
    console.log(new Date().toLocaleString('pt-br'), "servidor aberto na url http://localhost:3001")
})

function executarPull() {
    return new Promise(resolve => {
        exec("autoPull.cmd", (error, stdout, stderr) => {
            if (error) {
            	console.log(new Date().toLocaleString('pt-br'), "Erro >>>", error)
                resolve({
                    status: 500,
                    body: "Ocorreu um erro ao executar autoPull.cmd"
                })
                return
            }
            resolve({
                status: 200,
				body: "Sucesso executando autoPull.cmd"
            })
        })
    })
}

function execNpmInstall() {
    return new Promise(resolve => {
        exec("installPackages.cmd", (error, stdout, stderr) => {
            if (error) {
            	console.log(new Date().toLocaleString('pt-br'), "Erro >>>", error)
                resolve({
                    status: 500,
                    body: "Ocorreu um erro ao executar installPackages.cmd"
                })
                return
            }
            resolve({
                status: 200,
				body: "Sucesso executando installPackages.cmd"
            })
        })
    })
}