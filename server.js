const express = require('express');
const path = require('path');
const endereco = '0.0.0.0';
const porta = 5000;
const server = express();

server.use(express.static(__dirname));

server.listen(porta, endereco, () => {
  console.log('Face API Started');
}) 
