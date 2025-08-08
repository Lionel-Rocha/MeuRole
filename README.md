# Meu Rolé Carioca
Chega de pensar muito para sair! Esse serviço (API/aplicação web) planeja seus rolés dentro de um orçamento nas proximidades de um local que você desejar.

⚠️ **ATENÇÃO!** Válido apenas para a **cidade** do Rio de Janeiro (ao menos por enquanto!)

<div align="center">

<img src="https://img.shields.io/badge/Node.js-5FA04E?style=flat&logo=nodedotjs&logoColor=fff">
<img src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vuedotjs&logoColor=fff">

</div>

## URLs

**API**: 

**SITE**:

## Como funciona
É possível "calcular" os rolês por três categorias:

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

**2. Vida noturna (bares/restaurantes) - TO DO**

*POST /restaurants*

Mostra bares e restaurantes próximos ao local desejado, no raio escolhido. 

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

**3. Cinemas**

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

## TO-DO:
- [x] Vida noturna - bares e restaurantes
- [ ] Tratamento de erros nas rotas
- [ ] Front-end
