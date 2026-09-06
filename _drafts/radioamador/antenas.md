# Antenas

Equiapmetnos não obrigatóriso mas importantes: **NanoVNA** (permite analisar desepenho, eficiência e sintonia correta da antena).

## Tipos de Antenas

| **Família**                          | **Forma / Montagem**                                                                | **Variações**                                                                        | **Faixa típica** | **Ganho médio (dBi)** | **Polarização**         | **Complexidade** | **Características / Observações**                                                             |
| ------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------- | --------------------- | ----------------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| **Verticais**                        | Haste reta montada verticalmente, geralmente sobre mastro ou base com radiais.      | Plano Terra (¼λ, ½λ), 5/8λ, Colinear, J-Pole, Slim Jim, Flowerpot                    | VHF / UHF        | 2–6                   | Vertical                | ★★               | Omnidirecionais; simples e eficientes; ideais para uso fixo ou em repetidoras.                |
| **Dipolo**                           | Dois braços horizontais alinhados; suspenso entre suportes ou em torre.             | Dipolo clássico (½λ), Dipolo dobrado, Inverted-V, Dipolo multibanda, Dipolo rotativo | HF / VHF         | 2–3                   | Horizontal              | ★★               | Base da maioria das antenas; fácil ajuste; bom desempenho em HF.                              |
| **Antenas de Fio**                   | Fio estendido ou suspenso, preso por isoladores; montagem simples e leve.           | End-Fed Half Wave (EFHW), Long Wire, Random Wire + Unun, Zeppelin (Zepp)             | HF               | 1–2                   | Horizontal ou inclinada | ★                | Muito simples e portáteis; dependem de acoplador; ideais para operação de campo.              |
| **Loop**                             | Fio ou tubo formando um laço fechado (circular, quadrado ou triangular).            | Magnetic Loop, Delta Loop, Quad Loop                                                 | HF / VHF         | 1–3                   | Horizontal ou Vertical  | ★★★              | Compactas e silenciosas; boas para locais com pouco espaço.                                   |
| **Direcionais (Arrays)**             | Estrutura com múltiplos elementos paralelos montados em um boom (haste central).    | Yagi-Uda, Log-periódica, Moxon Rectangle, Quad (Cubical Quad)                        | HF / VHF / UHF   | 6–12                  | Horizontal              | ★★★★             | Alto ganho e diretividade; requerem torre e rotor; usadas em DX.                              |
| **Especiais / Experimentais**        | Formas variadas: cones, hélices, painéis planos ou grades suspensas.                | Discone, Helicoidal, Patch (Microstrip), Curtain Array, Rhombic                      | HF / VHF / UHF   | 0–15                  | Variável                | ★★★★★            | Aplicações específicas: larga banda, satélite, micro-ondas e comunicações de longa distância. |
| **Verticais de Fio / Portáteis**     | Fio ou tubo montado verticalmente, com ou sem radiais inclinados; portátil.         | T2LT, Verticais telescópicas, Verticais com radiais inclinados                       | HF / VHF         | 1–4                   | Vertical                | ★                | Leves e rápidas de instalar; perfeitas para uso temporário e QRP.                             |
| **Multielemento HF (Arrays de Fio)** | Múltiplos fios longos suspensos em grandes estruturas, formando feixes direcionais. | Beverage, Vee Beam, Rhombic, Curtain (dipolos em matriz)                             | HF               | 8–15                  | Horizontal              | ★★★★★            | Antenas enormes, altíssimo ganho; usadas para DX e recepção a longa distância.                |
{: data-jcem-caption="Tipos de antenas" }

### Notas rápidas

- HF (High Frequency): 3–30 MHz
- VHF (Very High Frequency): 30–300 MHz
- UHF (Ultra High Frequency): 300–3000 MHz
- Ganho (dBi): valores médios; dependem do projeto e altura de instalação.
- Complexidade: considera construção, ajuste e necessidade de suporte mecânico.

## 📡 Melhores Antenas DIY por Tipo, Cenário e Direcionalidade

| Tipo / Cenário                 | **F**ixa ou **M**óvel | Melhor antena DIY                | Modelos / Projetos Populares (DIY)                                                                                                                                                                                                     | Abertura (°) | Vantagem principal                            | Casamento / Ajuste                   | Dificuldade | Faixas              |     |
| ------------------------------ | ------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------- | ------------------------------------ | ----------- | ------------------- | --- |
| **DX – Portátil**              | M                  | **End-Fed Half-Wave (EFHW)**     | • [49:1 QRP EFHW](https://www.youtube.com/watch?v=SBrc1DpMk_w)<br>• [QRPGuys EFHW](https://www.youtube.com/watch?v=AfWvdS8uiLs)<br>• [PAC-12](https://www.youtube.com/watch?v=5FvcCXPVy6c)                                             | ~360°        | Leve, multibanda, ideal para campo            | Unun 49:1 + choke                    | ★★          | HF 80–10 m (+6 m)   |     |
| **DX (geral)**          | F                  | **Dipolo Inverted-V Multibanda** | • [Fan Dipole](https://www.youtube.com/watch?v=7za6gPWcNng)<br>• [OCF (Windom)](https://www.youtube.com/watch?v=7za6gPWcNng)<br>• [Inverted-V com balun 1:1](https://www.youtube.com/watch?v=7za6gPWcNng)                              | ~270°        | Rendimento alto, baixo custo                  | Balun 1:1                            | ★★          | HF 80–10 m (+6 m)   |     |
| **DX (direcional)**     | F                  | **Yagi HF (beam)**               | • [3-elementos 20 m](https://www.youtube.com/watch?v=7Dy8j5XnF6o)<br>• [Hexbeam (compacta)](https://www.youtube.com/watch?v=7Dy8j5XnF6o)<br>• [Spiderbeam](https://www.youtube.com/watch?v=7Dy8j5XnF6o)                                | ~60–70°      | Alto ganho e diretividade                     | Balun 1:1 ou 4:1                     | ★★★★        | Banda HF específica |     |
| **DX (amplo espectro)** | F                  | **Log-Periódica HF**             | • [LPDA 13-30 MHz (ARRL)](https://www.youtube.com/watch?v=7Dy8j5XnF6o)<br>• [K6STI Compact LPDA](https://www.youtube.com/watch?v=7Dy8j5XnF6o)                                                                                          | ~60–70°      | Multibanda sem acoplador                      | Alimentação direta                   | ★★★★        | HF 40–10 m          |     |
| **VHF/UHF – Portátil**         | M                  | **J-Pole / Slim Jim Dual-Band**  | • [Slim Jim PVC](https://www.youtube.com/watch?v=TwwbvJNmzUU)<br>• [OSJ 146/446 MHz](https://www.youtube.com/watch?v=TwwbvJNmzUU)<br>• [Copper J-Pole](https://www.youtube.com/watch?v=TwwbvJNmzUU)                                    | ~360°        | Simples, robusta, ótimo ganho                 | Ajuste direto ou choke 1:1           | ★★          | 2 m + 70 cm         | —   |
| **VHF/UHF (omni)**      | F / M                | **Colinear Vertical 5/8 λ**      | • [N9TAX Colinear Coax](https://www.youtube.com/watch?v=-NlBPcG28NE)<br>• [Flowerpot Antenna](https://www.youtube.com/watch?v=-NlBPcG28NE)<br>• [Franklin 5/8λ Stack](https://www.youtube.com/watch?v=-NlBPcG28NE)                     | ~360°        | Excelente cobertura local                     | Sem balun (rádiais + choke)          | ★★          | 2 m + 70 cm         |     |
| **VHF/UHF (econômica)** | F / M                | **Plano Terra (¼ λ)**            | • [Ground Plane 2 m (fio + conector SO-239)](https://www.youtube.com/watch?v=XeVdLRh2lxY)<br>• [GP Dual Band com bobina](https://www.youtube.com/watch?v=XeVdLRh2lxY)<br>• [VHF ¼ λ Inox](https://www.youtube.com/watch?v=XeVdLRh2lxY) | ~360°        | Extremamente simples e barata                 | Sem balun (rádiais + choke opcional) | ★           | 2 m + 70 cm         |     |
| **VHF/UHF – Direcional**       | F / M                | **Yagi 2 m / 70 cm**             | • [DK7ZB 2m/70cm](https://www.youtube.com/watch?v=cD8dWC13ckU)<br>• [Arrow Dual Band Yagi](https://www.youtube.com/watch?v=cD8dWC13ckU)<br>• [WA5VJB Cheap Yagi](https://www.youtube.com/watch?v=cD8dWC13ckU)                          | ~45–60°      | Alto ganho, ideal para repetidoras e satélite | Balun 1:1                            | ★★★         | 2 m + 70 cm         |     |
{: data-jcem-caption="Melhores antenas DIY por tipo, cenário e direcionalidade" }

---

#### ℹ️ O que significa a coluna **“Casamento / Ajuste”**

Esta coluna indica **como a antena é casada eletricamente** com o transmissor e o cabo coaxial (geralmente 50 Ω), garantindo **baixa ROE/SWR** e máxima transferência de potência.
Em resumo:

- **Balun (Balance-Unbalance)** — usado em antenas simétricas (ex.: dipolo) para adaptar alimentação coaxial (desbalanceada).
- **Unun (Unbalance-Unbalance)** — usado em antenas assimétricas (ex.: end-fed), para adaptar impedância alta (≈2–3 kΩ → 50 Ω).
- **Choke / Bobina de modo comum** — suprime correntes indesejadas no coax e reduz ruído/interferência.
- **Ajuste direto** — antenas naturalmente próximas a 50 Ω, sem necessidade de transformador (ex.: J-pole, collinear bem construída).
- **Radiais** — fios condutores usados em verticais (ou ground-plane) para estabilizar o plano de terra e melhorar o rendimento.

Um bom casamento reduz o VSWR e melhora o rendimento geral da transmissão.

### Alternativas pagas com provavel melhor relação custo/benefícios

| Tipo / Cenário                  | Antena Comercial                              | Abertura (°) | Vantagem principal                                            | Outras faixas atendidas   | Análises                                            |
| ------------------------------- | --------------------------------------------- | ------------------------------------------------------------- | ------------------------ | --------------------------- | --------------------------------------------------- |
| **DX – Portátil**               | [Comet HFJ‑350M 3‑50 MHz]()                   | ~360°                | Multibanda portátil HF (3-50 MHz)                             | HF 80-10m + 6m                                     |                                                     |
| **DX – Fixa**                   | [Super Antena MP1C Todas‑Bandas HF/VHF]()     | ~360°                | Cobre várias bandas HF/VHF; estação fixa                      | HF + VHF                                           |                                                     |
| **DX – Fixa (direcional)**      | [Super Antena MR4010 Vertical Radial HF]()    | ~360°                | Vertical multibanda HF + radiais; menor necessidade de espaço | HF (40-10m)                                        | Review melhor vertical HF ([hamradioplanet.com][1]) |
| **VHF/UHF – Portátil**          | [Yaesu ATAS‑120A Ativa Portátil]()            | ~360°                | Antena portátil/veicular que cobre HF + VHF (algumas bandas)  | HF + VHF + UHF (algumas) | —                           |                                                     |
| **VHF/UHF – Fixa (omni)**       | [Antena Base VHF 5/8λ FM Rádio Comunitária]() | ~360°                | Cobertura omni em VHF base, custo‐benefício bom               | VHF + UHF próxima                                  |                                                     |
| **VHF/UHF – Fixa (direcional)** | [HYS Yagi UHF 400‑470 MHz 5 Elementos]()      | ~45-60°              | Yagi de alto ganho para UHF, direção específica               | UHF (400-470 MHz)                                  |                                                     |
{: data-jcem-caption="Alternativas comerciais por tipo e cenário" }

[1]: https://hamradioplanet.com/best-vertical-antenna-for-ham-radio-top-picks-and-expert-tips-in-2023/?utm_source=chatgpt.com "Best Vertical Antenna for Ham Radio- Ham Radio Planet"
