var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

// Definição do GL global
var gl = undefined

// Quantidade de objetos no buffer
var qntObjetos = 0

// Campo que contém a bolinha naquela posição
var campoBolinhas = []

// Contém os objetos que podem ser carregados
var listaObjetos = []

// Posicao do pacman no campo
var posicaoPyramid = [3, 1]
var posicaoPacman = [3, 1]

// Tamanho (todos valores dos pontos) do pacman
var tamanhoPacman = 144

//Configurações de camera
var cx = 0;
var cy = -15;
var cz = 12;

// Modelo de bolinha posicionada em (0,0)
var bolinhaDefault = [
		// Top
		-9.5, 3.5, -0.5,   1.0, 1.0, 0.0, 
		-9.5, 3.5, 0.5,    1.0, 1.0, 0.0,
		-8.5, 3.5, 0.5,     1.0, 0.8, 0.0, 
		-8.5, 3.5, -0.5,   1.0, 0.8, 0.0,

		// Left
		-9.5, 3.5, 0.5,    1.0, 1.0, 0.0,
		-9.5, 2.5, 0.5,   1.0, 1.0, 0.0,
		-9.5, 2.5, -0.5,  1.0, 1.0, 0.0,
		-9.5, 3.5, -0.5,   1.0, 1.0, 0.0,

		// Right
		-8.5, 3.5, 0.5,    1.0, 0.8, 0.0,
		-8.5, 2.5, 0.5,   1.0, 0.8, 0.0,
		-8.5, 2.5, -0.5,  1.0, 1.0, 0.0,
		-8.5, 3.5, -0.5,   1.0, 1.0, 0.0,

		// Front
		-8.5, 3.5, 0.5,    1.0, 0.8, 0.0,
		-8.5, 2.5, 0.5,    1.0, 0.8, 0.0,
		-9.5, 2.5, 0.5,    1.0, 1.0, 0.0,
		-9.5, 3.5, 0.5,    1.0, 1.0, 0.0,

		// Back
		-8.5, 3.5, -0.5,    1.0, 1.0, 0.0,
		-8.5, 2.5, -0.5,    1.0, 1.0, 0.0,
		-9.5, 2.5, -0.5,    1.0, 1.0, 0.0,
		-9.5, 3.5, -0.5,    1.0, 1.0, 0.0,

		// Bottom
		-9.5, 2.5, -0.5,   1.0, 1, 0.0,
		-9.5, 2.5, 0.5,    1.0, 1, 0.0,
		-8.5, 2.5, 0.5,     1.0, 0.8, 0.0,
		-8.5, 2.5, -0.5,    1.0, 0.8, 0.0
]

// Indices padrões de um quadrado
var indicesDefault = [	
	// Top
	0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
]

// Quantidade de movimento que ainda falta ser realizado
var movRestante = 0
var movRestantePyramid = 0;

// Quantidade de movimento que é realizado a cada iteração do loop
var incremento = 0
var incrementoPy = 0;

// Offset para iterar sobre o buffer, se offset está em 0, serão alterados
// os valores de X, se está em 1, serão alterados valores de Y
var offset = 0
var offsetPyramid = 0;

// Diz se o Pacman está andando no momento
var andando = false
var andandoPyramid = false

// Distância entre cada "quadrado" do campo
var deslocamento = 3

var mesaVertices = 
[     // X, Y, Z           R, G, B
	//MESA RGB
	// Top
	-12.0, 6.0, -8.0,   0.5, 0.5, 1.0,
	-12.0, 6.0, -1.0,    0.5, 0.5, 1.0,
	12.0, 6.0, -1.0,     0.5, 0.5, 1.0,
	12.0, 6.0, -8.0,    0.5, 0.5, 1.0,

	// Left
	-12.0, 6.0, -1.0,    0.25, 0.25, 0.75,
	-12.0, -5.0, -1.0,   0.25, 0.25, 0.75,
	-12.0, -5.0, -8.0,  0.25, 0.25, 0.75,
	-12.0, 6.0, -8.0,   0.25, 0.25, 0.75,

	// Right
	12.0, 6.0, -1.0,    0.25, 0.25, 0.75,
	12.0, -5.0, -1.0,   0.25, 0.25, 0.75,
	12.0, -5.0, -8.0,  0.25, 0.25, 0.75,
	12.0, 6.0, -8.0,   0.25, 0.25, 0.75,

	// Front
	12.0, 6.0, -1.0,    0.9, 0.0, 0.0,
	12.0, -5.0, -1.0,    0.5, 0.0, 0.5,
	-12.0, -5.0, -1.0,    0.0, 0.0, 0.9,
	-12.0, 6.0, -1.0,    0.5, 0.0, 0.5,

	// Back
	3.0, 1.0, -8.0,    0.0, 1.0, 0.0,
	3.0, -5.0, -8.0,    0.0, 1.0, 0.0,
	-3.0, -5.0, -8.0,    0.0, 1.0, 0.0,
	-3.0, 1.0, -8.0,    0.0, 1.0, 0.0,

	// Bottom
	-12.0, -5.0, -8.0,   0.0, 0.0, 0.0,
	-12.0, -5.0, -1.0,    0.0, 0.0, 0.4,
	12.0, -5.0, -1.0,     0.5, 0.0, 0.5,
	12.0, -5.0, -8.0,    0.0, 0.0, 0.0
];
var mesaIndices = [...indicesDefault]

var pacManVertices =
	[ 	// X, Y, Z           R, G, B
		//PACMAN
		// Top
		-1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
		1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
		1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0, 0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0, 0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0, 0.25, 0.25, 0.75,
		1.0, -1.0, 1.0, 0.25, 0.25, 0.75,
		1.0, -1.0, -1.0, 0.25, 0.25, 0.75,
		1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
		1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
		1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
		1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
		1.0, -1.0, -1.0, 0.5, 0.5, 1.0
	];


	var pyramidVertices= [
		// Top
		-1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
		0.0, 0.0, 1.0, 0.5, 0.5, 0.5,
		0.0, 0.0, 1.0, 0.5, 0.5, 0.5,
		1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
		// Left
		0.0, 0.0, 1.0, 0.75, 0.25, 0.5,
		0.0, 0.0, 1.0, 0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0, 0.75, 0.25, 0.5,
		// Right
		0.0, 0.0, 1.0, 0.25, 0.25, 0.75,
		0.0, 0.0, 1.0, 0.25, 0.25, 0.75,
		1.0, -1.0, -1.0, 0.25, 0.25, 0.75,
		1.0, 1.0, -1.0, 0.25, 0.25, 0.75,
		// Front
		0.0, 0.0, 1.0, 1.0, 0.0, 0.15,
		0.0, 0.0, 1.0, 1.0, 0.0, 0.15,
		0.0, 0.0, 1.0, 1.0, 0.0, 0.15,
		0.0, 0.0, 1.0, 1.0, 0.0, 0.15,
		// Back
		1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
		1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
		// Bottom
		-1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
		0.0, 0.0, 1.0, 0.5, 0.5, 1.0,
		0.0, 0.0, 1.0, 0.5, 0.5, 1.0,
		1.0, -1.0, -1.0, 0.5, 0.5, 1.0
	];
	var pyramidIndices= [
		// Top
		0, 1, 2,
		0, 2, 3,
		// Left
		5, 4, 6,
		6, 4, 7,
		// Right
		8, 9, 10,
		8, 10, 11,
		// Front
		13, 12, 14,
		15, 14, 12,
		// Back
		16, 17, 18,
		16, 18, 19,
		// Bottom
		21, 20, 22,
		22, 20, 23
	];
var pacManIndices =[...indicesDefault];

// Buffer com os vértices que "ligam" os pontos
var boxIndices = [];

// Criamos o buffer com os pontos
var boxVertices = [];

var main = function () {
	let pacManObj = {
		nome: "pacman",
		id: 0,
		ativo: true,
		vertices: pacManVertices,
		indices: [...pacManIndices] 
	} 

	let mesaObj = {
		nome: "mesa",
		id: -1,
		ativo: true,
		vertices: mesaVertices,
		indices: [...mesaIndices] 
	} 

	let pyramidObj = {
		nome: "pyramid",
		id: 11,
		ativo: true,
		vertices: pyramidVertices,
		indices: [...pyramidIndices]
	}

	// Adiciona o pacman na lista de objetos
	listaObjetos.push(pacManObj)
	listaObjetos.push(mesaObj)
	listaObjetos.push(pyramidObj)

	// Cria todas as bolinhas e as coloca na lista de objetos
	criarTodasBolinhas()

	for(let x = 0; x < listaObjetos.length; x++) 
		addObject(listaObjetos[x], boxVertices, boxIndices)

	// Deletamos a bolinha onde o pacman inicia
	removerBolinha(3,1)

	listaObjetos.push()

	// Criamos o canvas com o webGl
	setupScene (boxVertices, boxIndices)

	document.addEventListener ('keypress', (event) => {
		const tecla = event.key;
		mover(tecla)
	})

	// Loop que atualiza a tela a cada frame
	var loop = function () {
		qntObjetos = 0;
		boxVertices = []
		boxIndices = []

		// Adiciona apenas os objetos ativos
		for(let x = 0; x < listaObjetos.length; x++) {
			if (listaObjetos[x].ativo) {
				addObject(listaObjetos[x], boxVertices, boxIndices)
			}
		}

		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

		// Vetor que vamos fazer as mudanças
		var novoVetor = [...boxVertices]

		// Realiza o movimento do pacman caso houver
		moverPacman();
		moverPyramid();

		// O buffer renderizado agora vai ser o novo que realizamos as alterações
		boxVertices = novoVetor

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};

// Adiciona um objeto ao canvas
function addObject(objeto, boxVertices, boxIndices) {
	boxVertices.push(...objeto.vertices)
	boxIndices.push(...formatarIndices([...objeto.indices]))
	qntObjetos++;
}

function criarBolinha(linha, coluna) {
	let bolinha = [...bolinhaDefault]
	for ( let x = 0; x < bolinhaDefault.length; x+=6) {
		bolinha[x] += coluna*deslocamento
		bolinha[x+1] -= linha*deslocamento
	}
	return bolinha;
}

function removerBolinha(x, y) {
	campoBolinhas[getObjArrayPos(x,y)].ativo = false
}

function formatarIndices(indices) {
	for(let x=0; x < indices.length; x++) {
		indices[x] += qntObjetos*24
	}
	return indices
}

function criarIndicesQuadrado() { 
	let indices = [...indicesDefault]
	return indices
}

function criarTodasBolinhas() {
	for (let i=0; i < 3; i++) {
		for (let j=0; j < 7; j++) {
			// Para cada bolinha, criamos seu buffer com 
			// seus vertices e inserimos no boxVertices,
			// adicionando também seus indices
			let novaBolinha = criarBolinha(i,j)
			let bolinhaObj = {
				id: i*3+j,
				ativo: true,
				vertices: [...novaBolinha],
				indices: [...criarIndicesQuadrado()] 
			}
			listaObjetos.push(bolinhaObj)
			campoBolinhas.push(bolinhaObj)
			
		}	
	}
}

// Retorna a posição inicial de um objeto no vetor de vertices baseado nas coordenadas X e Y
function getObjArrayPos(x,y) {
	return x + y*7;
}

function mover(tecla) {

	// Se já estamos nos movendo, ignore o movimento.
	if (andando==true)
		return;

	let modX, modY;
	
	if (tecla === 'w') {
		offset = 1
		movRestante = deslocamento
		incremento = 0.1
		modY = posicaoPacman[1] - 1
	} else if (tecla === 'a') {
		offset = 0
		movRestante = deslocamento
		incremento = -0.1
		modX = posicaoPacman[0] -1 

	} else if (tecla === 's') {
		offset  = 1 
		movRestante = deslocamento
		incremento = -0.1
		modY = posicaoPacman[1] +1
	} else if (tecla === 'd') {
		offset  = 0 
		movRestante = deslocamento
		incremento = 0.1
		modX = posicaoPacman[0]+1
	} else {
		return
	}

	if(modX>6 || modX<0 || modY>2 || modY<0) {
		movRestante = 0
		return
	}
	if (modX != undefined)
		posicaoPacman[0] = modX + 0
	else if (modY != undefined)
	posicaoPacman[1] = modY + 0


	/* Movimento da Pyramid */
	// Seleciona movimento
	movimentoPyramid();

	andando = true
}

// Prepara a Cena e configura o canvas com o openGL
function setupScene (boxVertices, boxIndices) {

	var canvas = document.getElementById('game-surface');
	gl = canvas.getContext('webgl');

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	// Criação dos Shaders
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);



	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(colorAttribLocation,3,gl.FLOAT,gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,3 * Float32Array.BYTES_PER_ELEMENT);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix); 
	mat4.lookAt(viewMatrix, [cx, cy, cz], [0, 0, 0], [0, 1, 0]); // câmera que seta
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
}

function moverPacman () {
	// Itera pelos pontos do pacman, alterando apenas o X ou Y 
	// e incrementando os valores baseados com o movimento atual
	for(let i = offset; i < tamanhoPacman && movRestante > 0; i++ ) {
		if(i % 6 == offset) 
			pacManVertices[i] = pacManVertices[i] + incremento
	}

	let movRestanteFix = Math.abs(movRestante.toFixed(1))

	if (movRestanteFix == 0) {
		// Se tem uma bolinha na posição atual do pacman, remova ela
		if(campoBolinhas[getObjArrayPos(posicaoPacman[0],posicaoPacman[1])] != null)
			removerBolinha(posicaoPacman[0], posicaoPacman[1])

		andando = false
	} 
	// Caso contrário, continuamos o movimento
	else {
		movRestante-= 0.1;
	}
}

function moverPyramid () {
	// Itera pelos pontos do pacman, alterando apenas o X ou Y 
	// e incrementando os valores baseados com o movimento atual
	for(let i = offsetPyramid; i < tamanhoPacman && movRestantePyramid > 0; i++ ) {
		if(i % 6 == offsetPyramid) 
			pyramidVertices[i] = pyramidVertices[i] + incrementoPy
	}

	let movRestanteFix = Math.abs(movRestantePyramid.toFixed(1))

	if (movRestanteFix == 0) {
		andandoPyramid = false
	} 
	// Caso contrário, continuamos o movimento
	else {
		movRestantePyramid -= 0.1;
	}
}

function movimentoPyramid () {
	let i;
	let dir;
	let mov;
	do {
		dir = getRndInteger(0, 1);
		mov = getRndInteger(-1, 1);
		i = posicaoPyramid[dir] + mov;
		console.log(dir + " " + i);
	} while(i < 0 || (dir == 0 && i > 7) || (dir == 1 && i > 3) || mov == 0);
	posicaoPyramid[dir] += mov;
	offsetPyramid = dir;
	movRestantePyramid = deslocamento;

	if(mov > 0){
		incrementoPy = 0.1;
	}
	else{
		incrementoPy = -0.1;
	}
	andandoPyramid = true;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function alterarCamera(e){

	if(e.target.id == 'camera-cima'){
		cx = 0;
		cy = 0;
		cz = 20;
	}

	if(e.target.id == 'camera-lado'){
		cx = -12;
		cy = 10;
		cz = 20;
	}

	if(e.target.id == 'camera-tab'){
		cx = 0;
		cy = -15;
		cz = 12;
	}

	setupScene(boxVertices, boxIndices);
}

//alterando cameras
const btnCamCima = document.getElementById("camera-cima");
btnCamCima.addEventListener("click", alterarCamera);

const cameraLado = document.getElementById("camera-lado");
cameraLado.addEventListener("click", alterarCamera);

const cameraTab = document.getElementById("camera-tab");
cameraTab.addEventListener("click", alterarCamera);