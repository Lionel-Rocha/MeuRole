# Meu Rolé Carioca
Chega de pensar muito para sair! Esse serviço (API/aplicação web) planeja seus rolés dentro de um orçamento nas proximidades de um local que você desejar.

⚠️ **ATENÇÃO!** Válido apenas para a **cidade** do Rio de Janeiro.

<div align="center">

<img src="https://img.shields.io/badge/Adonis.js-%23C48AFF?style=flat&logo=adonisjs">
<img src="https://img.shields.io/badge/Node.js-5FA04E?style=flat&logo=nodedotjs&logoColor=fff">
<!-- <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vuedotjs&logoColor=fff">
<img src="https://img.shields.io/badge/Ionic-%233880FF?style=flat&logo=ionic&logoColor=white"> -->
<img src="https://img.shields.io/badge/Typescript-3d85c6?style=flat&logo=typescript&logoColor=white">

</div>

## URLs

## Como funciona (API)
É possível "calcular" os rolés por três categorias:

**1. Passeios**

*POST /outing*

Recebe opções de passeio no raio desejado no local central exigido.

```
{
"address:"rua/bairro xxx"
"radius":valor inteiro (int),
"duration":duas opções: "whole"/"part",
"budget":valor decimal (float)
}
```

✔️ *EXEMPLO*
```
{
"address:"Botafogo"
"radius":5,
"duration":"part",
"budget":100
}
```

**2. Vida noturna (bares)**

*POST /restaurants/pubAddress*

Mostra bares próximos ao local desejado, no raio escolhido.

```
{
"address":"rua/bairro xxx",
"radius":x
}
```

✔️ *EXEMPLO*
```
{
"address:"Centro"
"radius":5,
}
```

**3. Restaurantes (por tipo)**

*POST /restaurants*

Mostra restaurantes próximos ao local desejado, no raio escolhido.

```
{
"address":"rua/bairro xxx",
"radius":x
}
```

✔️ *EXEMPLO*
```
{
"address:"Centro"
"radius":5,
}
```

**4. Cinemas**

*POST /cinema*

Mostra cinemas na área desejada, no raio escolhido.

```
{
"address":"rua x",
"radius":x
}
```

✔️ *EXEMPLO*
```
{
"address:"Santa Teresa"
"radius":7,
}
```
