# Meu Rolé Carioca
Chega de pensar muito para sair! Esse serviço (API/aplicação web) planeja seus rolés dentro de um orçamento nas proximidades de um local que você desejar.

⚠️ **ATENÇÃO!** Válido apenas para a **cidade** do Rio de Janeiro.

<div align="center">

<img src="https://img.shields.io/badge/Node.js-5FA04E?style=flat&logo=nodedotjs&logoColor=fff">
<img src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vuedotjs&logoColor=fff">
<img src="https://img.shields.io/badge/Ionic-%233880FF?style=flat&logo=ionic&logoColor=white">
<img src="https://img.shields.io/badge/Typescript-3d85c6?style=flat&logo=typescript&logoColor=white">

</div>

## URLs

**API**: https://meurolecarioca.onrender.com

**SITE**: https://meu-role.vercel.app

## Atualizações futuras

- [x] Front-end: modal de informações sobre os restaurantes recomendados
- [ ] Front-end: página de busca de bares (vida noturna)
- [ ] Front-end: restaurantes junto à recomendação de rolé de duração parcial/dia inteiro

### v0.2

- [ ] Banco de dados: adicionar instagram dos restaurantes
- [ ] Banco de dados: adicionar foto dos pontos turísticos
- [ ] Back-end: refletir mudanças
- [ ] Front-end: refletir mudanças
- [ ] Front-end: restaurantes - cards de recomendados menores (para computador)


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