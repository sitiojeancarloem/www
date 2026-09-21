# Quando um número maior que zero não prova que algo pode acontecer

## Uma crítica ao uso de probabilidades extremamente pequenas como prova de possibilidade real

### Resumo

Um cálculo de probabilidade sempre começa com escolhas. Primeiro, alguém define o que será considerado possível. Depois, define quais resultados serão contados, como serão agrupados e qual regra será usada para dar peso a cada resultado. Só então aparece um número.

Este artigo explica por que um resultado positivo, como \(10^{-50}\) ou \(10^{-100}\), não prova sozinho que um fato pode ocorrer no mundo real. Em alguns casos, o número positivo apenas repete uma possibilidade que foi colocada no cálculo desde o começo. O cálculo pode estar certo, mas a conclusão tirada dele pode estar errada.

A ideia associada a Émile Borel oferece um critério prático: probabilidades muito pequenas podem ser tratadas como impossibilidades na vida humana, na Terra ou no universo observável. Esse critério não transforma um número positivo em zero matemático. Ele ajuda a separar uma possibilidade escrita no papel de uma possibilidade que merece ser levada a sério no mundo físico.

---

## 1. O problema central

É comum ouvir uma frase parecida com esta:

> “A chance é muito pequena, mas é maior que zero. Portanto, pode acontecer.”

Essa frase parece forte porque usa matemática. Porém, ela pode esconder um erro lógico.

Para calcular a chance de algo, o modelo precisa primeiro aceitar esse “algo” como uma possibilidade. Depois disso, o cálculo pode devolver um número positivo. Usar esse número para provar que a possibilidade existe de verdade pode formar um círculo:

1. a hipótese é aceita como possível;
2. ela recebe um lugar dentro do cálculo;
3. o cálculo produz um número maior que zero;
4. esse número é usado para dizer que a hipótese é possível.

O passo 4 apenas repete o passo 1 em forma de número.

O cálculo não descobriu a possibilidade. Ele apenas mediu o peso que o próprio modelo deu a ela.

---

## 2. Toda matemática começa com premissas

Uma **premissa** é uma ideia aceita no início de um raciocínio. Ela pode ser aceita de forma provisória, apenas para descobrir o que aconteceria se fosse verdadeira.

Uma prova matemática possui esta forma geral:

\[
M \Rightarrow C
\]

Isso significa:

> Se as premissas do modelo \(M\) forem aceitas, então a conclusão \(C\) decorre delas.

A matemática pode mostrar com rigor que a conclusão segue das premissas. Mas o cálculo, sozinho, não prova que as premissas descrevem perfeitamente o mundo real.

Por isso, uma probabilidade deveria ser lida assim:

\[
P(A\mid M)=p
\]

Leia-se:

> A probabilidade do evento \(A\), dentro do modelo \(M\), é \(p\).

O símbolo \(M\) inclui várias escolhas:

- quais resultados serão aceitos;
- quais forças serão consideradas;
- quais forças serão ignoradas;
- qual ordem dos fatos será usada;
- quanto tempo estará disponível;
- quais fatos serão tratados como independentes;
- quantas tentativas poderão ocorrer;
- quais resultados serão tratados como iguais;
- qual regra será usada para distribuir as probabilidades.

Assim, o número obtido não pertence apenas ao fato estudado. Ele pertence à relação entre o fato e o modelo.

---

## 3. Probabilidade é diferente de contagem observada

Há duas ideias que não devem ser misturadas.

### 3.1 Casos admitidos pelo modelo

Em um modelo simples, finito e com resultados de mesmo peso, podemos escrever:

\[
P(A)=\frac{X}{Y}
\]

Nessa expressão:

- \(Y\) é o total de casos aceitos no modelo;
- \(X\) é o total de casos que servem para o evento estudado.

Se o evento foi aceito como possível, então:

\[
X\geq 1
\]

O menor peso positivo será:

\[
P_{\min}=\frac{1}{Y}
\]

Nesse sentido, o modelo precisou reservar ao menos um caso para a hipótese. Se não reservasse, não haveria o que calcular sobre ela.

### 3.2 Ocorrências vistas em uma amostra

Outra coisa é contar quantas vezes o evento apareceu de verdade.

Se foram feitas \(Y\) observações e o evento apareceu \(X_{obs}\) vezes, sua frequência observada é:

\[
f(A)=\frac{X_{obs}}{Y}
\]

Aqui, \(X_{obs}\) pode ser zero.

Exemplo: o número 17 faz parte de uma loteria com 60 números. Ele é uma possibilidade aceita. Porém, pode não aparecer em 100 sorteios.

Nesse caso:

\[
X_{adm}=1
\]

porque o 17 é um resultado admitido, mas:

\[
X_{obs}=0
\]

porque ele não apareceu na amostra.

A possibilidade aceita no modelo e a ocorrência observada são coisas diferentes.

---

## 4. O universo do cálculo não pode ser vazio

Para calcular uma frequência, o total de observações precisa ser maior que zero:

\[
Y>0
\]

Se \(Y=0\), surge uma divisão por zero, que não é definida.

Também não existe um espaço de probabilidade normal com universo vazio, pois o universo total deve ter probabilidade 1:

\[
P(\Omega)=1
\]

Aqui, \(\Omega\) representa o **espaço amostral**, isto é, o conjunto de todos os resultados aceitos pelo modelo.

O ponto importante é simples:

> Um cálculo estatístico não começa do nada. Ele precisa de um universo e de hipóteses definidas.

---

## 5. O vazio não é igual ao conjunto que contém o vazio

Esta diferença evita uma confusão importante:

\[
\varnothing \neq \{\varnothing\}
\]

- \(\varnothing\) é um conjunto sem nenhum elemento.
- \(\{\varnothing\}\) é um conjunto com um elemento, sendo esse elemento o próprio conjunto vazio.

Suas quantidades de elementos são:

\[
|\varnothing|=0
\]

\[
|\{\varnothing\}|=1
\]

Usando uma comparação com um array:

```text
A = [∅]
A[0] = ∅
```

O elemento guardado em `A` é o vazio. Mas o array `A` não está vazio. Ele contém um item.

Essa diferença aparece no exemplo da loteria.

Suponha que existam 60 números e mais um resultado chamado \(X\), com o sentido de “o sorteio não aconteceu”. Então:

\[
\Omega=\{1,2,\ldots,60,X\}
\]

Esse universo possui 61 resultados. Se todos receberem o mesmo peso:

\[
P(\{X\})=\frac{1}{61}
\]

O símbolo \(X\) poderia ser trocado por outro símbolo, até mesmo por \(\varnothing\), desde que fosse usado como nome de um resultado. Porém, o evento “o resultado foi \(X\)” seria \(\{X\}\), um conjunto com um elemento. Ele não seria o evento vazio.

---

## 6. Equiprobabilidade também é uma premissa

**Equiprobabilidade** significa dar o mesmo peso a todos os resultados.

Se existem \(Y\) resultados e todos recebem o mesmo peso, cada um recebe:

\[
\frac{1}{Y}
\]

Mas a igualdade dos pesos também precisa ser assumida ou justificada.

Considere dois dados. Há 36 pares possíveis:

\[
(1,1),(1,2),\ldots,(6,6)
\]

Se os 36 pares forem tratados como igualmente prováveis, a soma 7 aparece em seis pares:

\[
(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)
\]

Assim:

\[
P(7)=\frac{6}{36}
\]

Mas essa resposta depende da decisão de usar os pares como resultados básicos. Se alguém começar diretamente com as onze somas possíveis, de 2 a 12, e declarar todas iguais, obterá:

\[
P(7)=\frac{1}{11}
\]

As duas respostas vêm de modelos diferentes.

Isso mostra que um número não possui uma probabilidade dentro dele. O valor depende de como o problema foi montado.

---

## 7. Um número positivo não prova possibilidade física

Há pelo menos quatro sentidos diferentes para a palavra “possível”.

### 7.1 Possível na linguagem

A ideia pode ser escrita sem uma contradição visível.

### 7.2 Possível dentro do modelo

A hipótese foi colocada no espaço de resultados.

### 7.3 Possível segundo a conta

O modelo deu à hipótese um número maior que zero.

### 7.4 Possível no mundo físico

Existe um processo real, de acordo com as condições do mundo, capaz de produzir o fato.

Esses sentidos não são iguais.

Em especial:

\[
P(A\mid M)>0
\]

significa apenas:

> O modelo \(M\) deu peso positivo ao evento \(A\).

Isso não prova, sozinho, que o evento pode ocorrer fisicamente.

---

## 8. A contaminação mínima do modelo

Neste artigo, a palavra **contaminação** não significa fraude ou má-fé. Significa que o resultado carrega dentro dele as escolhas feitas antes do cálculo.

O modelo precisa incluir o evento para calculá-lo. Em um modelo finito e uniforme, isso pode criar uma quantidade mínima:

\[
P(A\mid M)=\frac{1}{Y}
\]

Se o único caso favorável não foi observado nem demonstrado por um processo real, mas apenas reservado para manter a hipótese no cálculo, o numerador 1 pode representar somente a premissa inicial.

Nesse caso, o resultado positivo não é uma prova nova. Ele é a premissa transformada em fração.

O erro lógico aparece quando alguém diz:

> “O resultado foi maior que zero. Logo, ficou provado que pode acontecer.”

A resposta correta é:

> “O resultado foi maior que zero porque o modelo começou aceitando ao menos um caso favorável. Ainda falta mostrar que esse caso corresponde a um processo real.”

---

## 9. O significado de tender a zero

Considere a sequência:

\[
1,\frac{1}{2},\frac{1}{3},\frac{1}{4},\ldots
\]

Para todo valor finito de \(Y\):

\[
\frac{1}{Y}>0
\]

Mas:

\[
\lim_{Y\to\infty}\frac{1}{Y}=0
\]

Isso significa que a razão fica menor do que qualquer número positivo fixado, desde que \(Y\) cresça bastante.

Na matemática comum, \(1/\infty\) não é uma fração positiva comum. É uma forma informal de falar desse limite, cujo valor é zero.

Porém, o limite zero não apaga o fato de que cada termo finito possuía numerador 1. Por isso, é importante não usar o limite para fingir que a hipótese nunca foi colocada no modelo.

---

## 10. O critério prático ligado a Borel

Émile Borel defendeu que probabilidades muito pequenas podem ser tratadas como impossibilidades para fins práticos. A intenção era separar o que é formalmente maior que zero do que pode ser levado a sério em uma escala humana, terrestre ou cósmica.

Uma escala frequentemente ligada a essa ideia usa valores próximos destes:

- acima de \(10^{-6}\): pode ser comum, conforme o caso;
- perto de \(10^{-15}\): praticamente impossível em escala humana;
- perto de \(10^{-50}\): praticamente impossível em escala terrestre;
- perto de \(10^{-100}\): praticamente impossível na escala do universo observável.

Esses limites devem ser entendidos como critérios práticos, não como um teorema que transforma automaticamente todo número pequeno em zero.

A ideia principal continua valiosa:

> A ciência aplicada não é obrigada a tratar todo número positivo como uma possibilidade física relevante.

---

## 11. A quantidade de tentativas também importa

Uma probabilidade por tentativa não deve ser analisada sozinha.

Se a chance por tentativa é \(p\) e existem \(N\) tentativas independentes, a chance de ao menos uma ocorrência é:

\[
P(\text{ao menos uma})=1-(1-p)^N
\]

Quando \(p\) é muito pequeno, uma aproximação útil é:

\[
P(\text{ao menos uma})\approx Np
\]

Exemplo:

\[
p=10^{-50}
\]

Se houver apenas:

\[
N=10^{20}
\]

então:

\[
Np=10^{-30}
\]

A ocorrência continua desprezível.

Mas se existirem aproximadamente:

\[
N=10^{50}
\]

então a chance total pode deixar de ser pequena.

Por isso, um critério mais forte deve considerar:

- a chance por tentativa;
- o número máximo de tentativas;
- o tempo disponível;
- quantas tentativas podem ocorrer ao mesmo tempo;
- os limites de matéria, energia e processamento;
- se as tentativas são realmente independentes.

Um corte como \(10^{-100}\) é muito conservador para muitos usos. Mesmo assim, deve ser aplicado à chance total do evento no cenário físico estudado, e não apenas a uma fração solta.

---

## 12. O exemplo da loteria

Imagine uma loteria com 60 números.

Se um único número será retirado e todos os números possuem o mesmo peso:

\[
P(n)=\frac{1}{60}
\]

Agora imagine a chance de uma pessoa ganhar sozinha o prêmio máximo muitas vezes em sequência.

Se a chance de vencer uma vez é \(p\), e as vitórias forem independentes, a chance de vencer vinte vezes seguidas será:

\[
p^{20}
\]

Mesmo uma chance pequena se torna muito menor quando várias etapas independentes precisam acontecer em ordem.

Esse exemplo ajuda a perceber por que a frase “mas a chance não é zero” pode perder todo valor prático.

Por outro lado, a multiplicação só é válida se as etapas forem realmente independentes. Se uma etapa muda ou facilita a próxima, é necessário usar probabilidades condicionais, isto é, chances que dependem do que já aconteceu:

\[
P(A_1\cap A_2)=P(A_1)P(A_2\mid A_1)
\]

---

## 13. O exemplo do xadrez

O número de Shannon, criado para mostrar a grande complexidade do xadrez, é da ordem de:

\[
10^{120}
\]

Esse valor representa uma estimativa do número de partidas possíveis, não uma probabilidade negativa.

Se todas as partidas fossem tratadas como de mesmo peso, a chance de uma partida exata, escolhida antes do jogo, seria aproximadamente:

\[
10^{-120}
\]

Mas há uma diferença decisiva:

\[
P(\text{alguma partida})=1
\]

Enquanto:

\[
P(\text{uma partida exata, definida antes})\approx10^{-120}
\]

Quando duas pessoas jogam, alguma partida obrigatoriamente acontece. Depois do jogo, não é correto olhar para a sequência que ocorreu e dizer que sua baixa chance individual torna o fato impossível.

Esse erro é chamado aqui de **escolha posterior**, isto é, escolher o alvo depois de conhecer o resultado.

O critério de impossibilidade prática funciona melhor quando o acontecimento foi definido antes da observação.

---

## 14. Matemática correta não garante modelo correto

Devemos separar três perguntas:

### 14.1 A conta está correta?

Exemplo:

\[
\frac{1}{10^{50}}=10^{-50}
\]

Sim, a conta está correta.

### 14.2 O resultado segue das premissas?

Se o modelo realmente possui \(10^{50}\) casos de mesmo peso e exatamente um caso favorável, sim.

### 14.3 As premissas representam o mundo real?

Essa pergunta não é respondida apenas pela divisão.

Ainda seria necessário verificar:

- por que existem exatamente \(10^{50}\) casos;
- por que eles possuem o mesmo peso;
- por que existe um caso favorável;
- se esse caso foi demonstrado ou apenas imaginado;
- se o processo físico pode realizar as tentativas;
- se o tempo e os recursos são suficientes;
- se foram ignoradas relações importantes.

Por isso:

\[
\text{conta correta}\neq\text{modelo correto}\neq\text{conclusão correta sobre o mundo}
\]

---

## 15. Quando um número muito pequeno deve levar à revisão do modelo

Se um acontecimento for observado, mas o modelo disser:

\[
P(A\mid M)<10^{-100}
\]

não é sensato aceitar imediatamente que ocorreu um fato quase impossível.

Primeiro, deve-se revisar:

- o modelo;
- os dados;
- a forma de medir;
- a independência das etapas;
- a escolha do evento;
- a possibilidade de erro;
- a possibilidade de fraude;
- a existência de um processo que favoreça o resultado.

Em ciência, um resultado extremamente improvável pode ser sinal de que o modelo está incompleto ou errado.

Assim, um número muito pequeno pode servir para rejeitar um modelo específico. Ele não precisa provar que o fato observado viola toda forma possível de explicação.

---

## 16. O exemplo da origem da vida

A origem da vida é um tema importante, difícil e ainda aberto. Ele serve aqui apenas como exemplo do problema lógico, não como tema principal do artigo.

Fred Hoyle ficou conhecido por uma estimativa próxima de:

\[
10^{-40000}
\]

para a formação conjunta, em uma tentativa aleatória, de milhares de enzimas necessárias à vida no modelo analisado por ele. Há também outras estimativas muito diferentes. Isso mostra que os valores dependem fortemente das premissas escolhidas.

Se um modelo exigir que uma célula completa surja de uma só vez, por escolhas independentes e sem guardar resultados intermediários, a chance calculada será extremamente pequena.

Mas outros modelos propõem etapas com:

- auto-organização, isto é, partes que formam estruturas por suas propriedades naturais;
- catálise, isto é, substâncias que aceleram reações;
- compartimentos, como pequenas bolsas formadas por moléculas;
- retenção de resultados intermediários;
- seleção de estruturas mais estáveis;
- vários caminhos capazes de produzir funções parecidas;
- etapas que acontecem ao mesmo tempo;
- influência do ambiente sobre as etapas seguintes.

Esses fatores não provam que qualquer teoria sobre a origem da vida seja verdadeira. Também não provam que a probabilidade seja alta. Eles mostram apenas que modelos diferentes produzem números diferentes.

A conclusão correta é:

> Se um modelo exige uma sequência determinada de fatos independentes e sua chance total continua abaixo de um limite cósmico mesmo após todas as tentativas possíveis, esse modelo deve ser tratado como inviável.

Isso não permite concluir, sem análise adicional, que toda explicação alternativa também foi refutada.

O ponto geral permanece:

> Um número positivo não salva um modelo apenas porque é maior que zero.

---

## 17. Um critério conservador de impossibilidade prática

Com base em toda a análise, pode-se propor o seguinte critério:

> Se um acontecimento foi definido antes da observação, depende de combinações aleatórias, não possui processo conhecido que o favoreça, e sua chance total permanece abaixo de \(10^{-100}\) mesmo após considerar todas as tentativas fisicamente possíveis, ele deve ser tratado como impossível para fins científicos ligados ao universo observável.

Em símbolos:

\[
P_{total}(A\mid M)=1-(1-p)^N<10^{-100}
\]

Nesse caso, a classificação prática seria:

\[
A\approx\text{impossível no universo observado}
\]

O símbolo \(\approx\) indica uma igualdade prática, não uma igualdade matemática exata.

Esse critério não afirma que \(10^{-100}=0\). Ele afirma que a diferença não tem utilidade física no cenário estudado.

---

## 18. Quando o critério não deve ser usado de forma automática

Um número muito pequeno não basta, sozinho, para rejeitar qualquer situação. Antes, é necessário verificar:

1. O evento foi definido antes ou depois do resultado?
2. Algum resultado precisava acontecer de qualquer forma?
3. O número representa uma única tentativa ou todas as tentativas possíveis?
4. As tentativas são independentes?
5. As etapas guardam resultados anteriores?
6. Há seleção, memória ou correção de erros?
7. Existem muitos caminhos que levam ao mesmo resultado útil?
8. O numerador foi observado ou apenas colocado no modelo?
9. O denominador representa possibilidades físicas ou apenas combinações escritas?
10. O resultado está sendo usado para provar a premissa que o próprio cálculo recebeu?

Se a resposta à última pergunta for “sim”, existe um raciocínio circular.

---

## 19. A pergunta mais importante: de onde vieram os números?

Diante de uma afirmação como:

\[
P(A)=10^{-50}
\]

não basta perguntar se a divisão está correta.

É preciso perguntar:

### De onde veio o numerador?

- Foi observado?
- Foi demonstrado por um processo real?
- Foi apenas reservado porque a hipótese precisava estar no modelo?

### De onde veio o denominador?

- É uma quantidade física de tentativas?
- É uma lista de combinações abstratas?
- Todos os casos podem realmente acontecer?
- Todos possuem o mesmo peso?

### De onde veio a regra do cálculo?

- As etapas são independentes?
- A ordem foi escolhida antes?
- O processo guarda resultados intermediários?
- Existem caminhos alternativos?

Essas perguntas são mais importantes do que a quantidade de zeros depois da vírgula.

---

## 20. Conclusão

A estatística é uma ferramenta muito útil. O problema não está nela. O problema está em esquecer que todo cálculo começa com escolhas.

Para calcular uma hipótese, o modelo precisa primeiro aceitá-la como hipótese. Em um modelo simples, isso pode gerar um peso mínimo de \(1/Y\). Se esse peso mínimo for depois usado como prova de que a hipótese é real, o raciocínio se torna circular.

Por isso:

\[
P(A\mid M)>0
\]

não significa automaticamente:

\[
A\text{ pode acontecer no mundo físico}
\]

Significa apenas:

> O modelo \(M\) deu à hipótese \(A\) um peso maior que zero.

Probabilidades extremamente pequenas exigem cuidado ainda maior. Quando o número fica abaixo de limites práticos como \(10^{-50}\) ou \(10^{-100}\), a frase “mas não é zero” perde força científica. É necessário mostrar um processo real, um número suficiente de tentativas e premissas bem justificadas.

Quando isso não existe, o número positivo pode ser apenas a sombra da hipótese colocada no cálculo desde o começo.

A regra final é simples:

> **Um número matemático pode estar correto sem provar que o modelo representa a realidade.**

E uma segunda regra completa a primeira:

> **Quanto menor e mais extremo for o resultado, maior deve ser a revisão das premissas antes de tratá-lo como uma possibilidade real.**

---

## Referências e notas de leitura

1. Borel, Émile. *Probability and Certainty*. O autor discute o uso prático de certeza e impossibilidade para probabilidades extremamente pequenas.
2. Shannon, Claude E. “Programming a Computer for Playing Chess”. O trabalho apresenta a estimativa que ficou conhecida como número de Shannon, próxima de \(10^{120}\) partidas.
3. Kolmogorov, Andrey N. *Foundations of the Theory of Probability*. Base moderna dos axiomas de probabilidade.
4. Spiegel, David S.; Turner, Edwin L. “Life might be rare despite its early emergence on Earth”. Mostra como conclusões sobre a origem da vida podem depender fortemente das premissas estatísticas iniciais.
5. Scharf, Caleb; Cronin, Leroy. “Quantifying the origins of life on a planetary scale”. Discute fatores necessários para tentar medir eventos ligados à origem da vida em escala planetária.
6. Deamer, David. “Protocells and the Path to Minimal Life”. Apresenta pesquisas sobre etapas químicas e estruturas anteriores às células completas.

### Nota de cuidado

Os limites \(10^{-50}\) e \(10^{-100}\) são usados neste artigo como referências práticas e conservadoras. Eles não são zeros matemáticos nem substituem a análise do modelo, do número de tentativas e dos processos físicos envolvidos.
