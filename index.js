const express = require('express')
const {exec} = require('child_process')
require('dotenv/config')

const app = express()

app.post('/gitlab', (req, res)=>{
	// Valida o token enviado
	if(req.headers["x-gitlab-token"] !== process.env.GitToken){
		res.status(401).send("Conexão recusada")
		return
	}

	// Tratativa para caso demore mais de 5s a requisição
	let timeout = setTimeout(()=>{
		res.send("Timeout detectado")
		timeout = false
	}, 5 * 1000)

	// Executa o comando CMD
	exec("autoPull.cmd", (error, stdout, stderr)=>{
		if(error){
			console.log("erro =>", error)
			if(timeout){				
				res.status(500).json({
					msg: "Erro ao realizar o pull",
					error: error
				})
				clearTimeout(timeout)
			}
			return
		}
		console.log("stdout =>", stdout)
		console.log("stderr =>", stderr)
		if(timeout){
			res.send("Sucesso")
			clearTimeout(timeout)
		}
	})
})

app.get('/', (req, res)=>{
	res.send("olá mundo")
})

app.listen(3001, ()=>{
	console.log(new Date().toLocaleString('pt-br'), "servidor aberto na url http://localhost:3001")
})