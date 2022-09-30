# PacGuy™

Projeto desenvolvido para a disciplina de Processamento Gráfico (2022-1)

<h3>Membros do Grupo:</h3>
792172 - Caio Brandini<br> 
792200 - Marcus Vinicius<br>
792208 - Maurício Cândido<br>
792211 - Michel Ribeiro<br>

<h4></h4>

<h4>====== Como jogar ======</h4>
Use as teclas W A S D para controlar o Pacman (quadrado dourado) pelo campo, tentando comer todos os pontos para vencer.<Br> A cada movimento realizado, o 
fantasma (prisma) também se moverá, e se entrar em contato com o Pacman, ele é derrotado e perde o jogo, a não ser que tenha sido coletado o POWERUP, 
neste caso você pode comer o fantasma durante um curto período de tempo (visualizado pela coloração avermelhada do Pacman). <br>
Além disso, é possível alterar a câmera durante a jogatina, bastando apertar nos botões localizados abaixo do campo.

<h4>====== Características implementadas ======</h4>
Foi implementada uma cena com vários objetos para a composição do jogo (pacman, fantasma, campo, powerup, pontos), que são inseridos na cena à partir
de um modelo inicial de cada objeto feito com seus vértices. A movimentação dos objetos é feita por uma adição/subtração dos vértices baseado na 
posição do objeto no grid do campo (7X3).
