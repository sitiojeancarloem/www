---
title: SSL/TLS e Certificate Authority
date: 2015-10-04 18:12:35
last_modified_at: 2019-01-30 06:22:45
published: false
wp_status: publish
wp_post_id: 1582
wp_post_type: post
wp_slug: ssl-tls-e-certificate-authority
author: jeancarlo
categories: 
  - Profissional
  - "Programação"
tags: 
  - aes
  - apache
  - criptografia
  - hash
  - lighttpd
  - nginx
  - openssl
  - pki
  - rsa
  - "segurança"
  - servidor
  - ssl
  - tls
reconstruction:
  primary_source: wordpress_wxr_2023_08_09
  content_sha256: 912a79dc803bf89a2731fecce84b2092bf6e0507c1f2311f733dea92777614e2
  source_urls: 
  - https://blog.jeancarloem.com/ssl-tls-e-certificate-authority/
excerpt: "Aprenda a criar um Certificado de Autoridade (CA), e também um certificado SSL/TLS auto assinado (self-signed). Veja as vantagens e desvantagens entre um certificado próprio e um comprado; e como configurar um servidor WEB Apache, Nginx e Lighttpd."
---

JCEM\_COMMENT\_0\_TOKEN

Certificado \[\[wm:w:Transport\_Layer\_Security|TLS\]\] (ou seu predecessor SSL) é um certificado usado para criptografar \[\[wm:w:Criptografia de chave pública|assimétricamente\]\] a comunicação entre navegador e servidor. Este método também chamado de \[\[wm:w:Infraestrutura\_de\_Chaves\_Públicas|Infraestrutura de Chave Pública (PKI)\]\] foi originalmente criado pela \[\[wm:w:Netscape|Netscape\]\] em 1992, com três atualizações, sendo a última, v3, em 1995; posteriormente, com o desaparecimento da Netscape, o \[\[wm:w:Internet\_Engineering\_Task\_Force|IETF\]\] padronizou a primeira versão do TLS - sucessor do SSL - no RFC 2246, RFC 4346, e a última 1.3 em RFC 5246 \[ref\]https://www.zytrax.com/tech/survival/ssl.html\[/ref\]. Embora ainda hoje o nome SSL continue a ser usado - provavelmente por questão de "estética", na verdade a maioria - se não todos - os sites da atualidade usam certificado TLS, já que grande parte dos navegadores não aceitam mais o original SSL como seguro.

JCEM\_COMMENT\_1\_TOKEN JCEM\_COMMENT\_2\_TOKEN

# Começo de Conversa

JCEM\_COMMENT\_3\_TOKEN JCEM\_COMMENT\_4\_TOKEN

Por ainda ser usual, continuaremos a tratar do certificado pelo nome SSL.

JCEM\_COMMENT\_5\_TOKEN JCEM\_COMMENT\_6\_TOKEN

Existem duas formas de obter um certificado, a primeira seria criar seu próprio certificado (self-signed), a segunda seria adquirir um de uma \[\[wm:w:Autoridade\_de\_Certificação|Autoridade Certificadora (CA)\]\].

JCEM\_COMMENT\_7\_TOKEN JCEM\_COMMENT\_8\_TOKEN

## Certificado assinado por CA competente

JCEM\_COMMENT\_9\_TOKEN JCEM\_COMMENT\_10\_TOKEN

Quando se adquire um certificado de uma autoridade - o que geralmente tem custo - este certificado SSL é assinado por um outro certificado (CA) pertencente à autoridade, através do qual os navedores podem identificar a procedência e garantir, por exemplo, que a conexão com um dado site é legitima, ou seja, não há interceptações. É simploriamente assim, imagine que você comprou um certificado para o domínio *meudominio.com* de uma autoridade qualquer; quando o navegador recebe seu certificado, verifica a informação do nome de domínio para o qual ele foi emitido, neste caso *meudominio.com*. Ciente de que uma autoridade é confiável e de que emitirá apenas um único certificado para cada domínio é possível determinar se a conexão realmente está sendo feita com o verdadeiro destinatário (*meudominio.com*) sem interceptações. Já com um certificado auto assinado não há como ter certeza, pois embora seja possível conferir o site acessado com a informação presente no SSL, não é possível ter certeza que este certificado pertença realmente aquele site, pois há chance de um \[\[wm:w:Cracker|cracker\]\] interceptar a comunicação, e repassar um outro certificado com as mesmas informações - já que qualquer um pode criar um - e você acreditaria estar seguro, quando na verdade não está. Perceba que ter um certificado emitido por uma autoridade implica em aumento real de segurança.

JCEM\_COMMENT\_11\_TOKEN JCEM\_COMMENT\_12\_TOKEN

**Vantagens**: Certificados Reconhecidos pela maioria - se não todos os navegadores.  
**Desvantagem**: Em geral há custo, e costumam ser elevados, principalmente ser possuírem \[\[wm:w:Certificado\_de\_Validação\_Avançada|EV\]\].

JCEM\_COMMENT\_13\_TOKEN JCEM\_COMMENT\_14\_TOKEN

## Certificado auto assinado

JCEM\_COMMENT\_15\_TOKEN JCEM\_COMMENT\_16\_TOKEN

Já o certificado auto assinado você mesmo cria, e, portanto, não é assinado por uma autoridade. E isso implica que, embora as informações tramitadas entre servidor e cliente sejam seguramente criptografadas, o navegador, por não possuir o CA, não confiará que a conexão é de fato segura, emitindo um aviso ao usuário justamente por não haver como identificar se a conexão foi interceptada. Uma solução parcial para o aviso, seria instalar manualmente um CA próprio em cada navegador de cada um dos usuários, mas apenas resolveria o problema do aviso, e não da identificação de interceptações.

JCEM\_COMMENT\_17\_TOKEN JCEM\_COMMENT\_18\_TOKEN

**Vantagens**: Sem qualquer custo. Faça como quiser e quantos quiser, inclusive com criptografia mais fortes.  
**Desvantagem**: Os usuários serão alertados de que a conexão pode não ser segura. Não há como os usuários identificarem interceptações da rede.

JCEM\_COMMENT\_19\_TOKEN JCEM\_COMMENT\_20\_TOKEN

## Chave Privada

JCEM\_COMMENT\_21\_TOKEN JCEM\_COMMENT\_22\_TOKEN

A chave privada pode ser de **1024**, **2048**, **4096** bits, e já há boatos que num futuro próximo navegadores irão suportar **8192** bits também - se já não é uma realidade. Contudo, enquanto 1024 bits é considerada fraco, 4096 bits exige um maior processamento, e consequente aumento no consumo de recursos e de tempo. Existem um "consenso" de que 2048 bits é o suficiente. Na verdade, há testes - só li a respeito, mas nunca tive acesso direto à eles - que indicam que o tempo necessário para quebrar uma chave de 2048 bits seria de vário anos, mesmo em computadores quânticos, e portanto aceitável como uma opção de segurança equilibrada. Mas não se convença pelo "consenso". Avalie a importância dos dados que serão tramitados e pondere sobre os recursos utilizados e decida por você mesmo se realmente vale a pena. Se você tiver dados tão sensíveis que se vazados poderiam causar um Armagedom ou a 3º guerra mundial, exagerar nunca será demais. Neste artigo será usado chave privada com tamanho de 4096 bits para todos os certificados.

JCEM\_COMMENT\_23\_TOKEN JCEM\_COMMENT\_24\_TOKEN

## Hash

JCEM\_COMMENT\_25\_TOKEN JCEM\_COMMENT\_26\_TOKEN

Em qualquer certificado SSL, inclusive CA, é possível especificar a hash a ser usada, para tanto basta informar **\-sha1**, **\-sha256**, **\-sha384** ou **\-sha512** no comando. É altamente recomendado a utilização de sha256 ou superior haja visto o disposto \[\[https://googleonlinesecurity.blogspot.co.uk/2014/09/gradually-sunsetting-sha-1.html|aqui\]\]. Neste artigo será usado -sha512 em todos os certificados.

JCEM\_COMMENT\_27\_TOKEN JCEM\_COMMENT\_28\_TOKEN

# Procedimentos Prévios

JCEM\_COMMENT\_29\_TOKEN JCEM\_COMMENT\_30\_TOKEN

Neste artigo será demonstrada como criar um certificado auto assinado (self-signed) e também como criar seu próprio CA (que deve ser instalado no cliente) e usá-lo para assinar seu próprio SSL.

JCEM\_COMMENT\_31\_TOKEN JCEM\_COMMENT\_32\_TOKEN

## Instalar Openssl

JCEM\_COMMENT\_33\_TOKEN JCEM\_COMMENT\_34\_TOKEN

\[\[https://www.openssl.org|Openssl\]\] é uma implementação open-source do protocolo SSl/TLS, necessário para gerar os certificados. Para que o certificado seja TLS é necessário instalar a versão 1.0.1 ou posterior. É possível obter informações detalhadas da instalação da \[\[https://wiki.openssl.org/index.php/Compilation\_and\_Installation|documentação oficial\]\].

JCEM\_COMMENT\_35\_TOKEN JCEM\_COMMENT\_36\_TOKEN

### Instalar no Windows

JCEM\_COMMENT\_37\_TOKEN JCEM\_COMMENT\_38\_TOKEN

Se você utiliza o windows, deve baixar o instalador \[\[https://www.openssl.org/community/binaries.html|aqui\]\].

JCEM\_COMMENT\_39\_TOKEN JCEM\_COMMENT\_40\_TOKEN

-   ![](https://blog.jeancarloem.com/wp-content/uploads/2015/10/OpenSSLWin64Install-1.jpg)
    
-   ![](https://blog.jeancarloem.com/wp-content/uploads/2015/10/OpenSSLWin64Install-4.jpg)
    
-   ![](https://blog.jeancarloem.com/wp-content/uploads/2015/10/OpenSSLWin64Install-3.jpg)
    
-   ![](https://blog.jeancarloem.com/wp-content/uploads/2015/10/OpenSSLWin64Install-6.jpg)
    
-   ![](https://blog.jeancarloem.com/wp-content/uploads/2015/10/OpenSSLWin64Install-2.jpg)
    
-   ![](https://blog.jeancarloem.com/wp-content/uploads/2015/10/OpenSSLWin64Install-5.jpg)
    
-   ![Passo-a-passo instalação openssl no windows.](https://blog.jeancarloem.com/wp-content/uploads/2015/10/OpenSSLWin64Install-7.jpg)
    
    Passo-a-passo instalação openssl no windows.
    
-   ![Passo-a-Passo](https://blog.jeancarloem.com/wp-content/uploads/2015/10/OpenSSLWin64Install-8.jpg)
    
    Passo-a-passo instalação windows.
    

JCEM\_COMMENT\_41\_TOKEN JCEM\_COMMENT\_42\_TOKEN

### Instalar no Linux

JCEM\_COMMENT\_43\_TOKEN JCEM\_COMMENT\_44\_TOKEN

yum update
yum install openssl

JCEM\_COMMENT\_45\_TOKEN JCEM\_COMMENT\_46\_TOKEN

sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get install openssl

JCEM\_COMMENT\_47\_TOKEN JCEM\_COMMENT\_48\_TOKEN

Se por alguma razão qualquer, os comandos supra não derem certo, tente a instalação manual:

JCEM\_COMMENT\_49\_TOKEN JCEM\_COMMENT\_50\_TOKEN

\# cria um diretório para abrigar os arquivos da instalação
cd ~
mkdir openssl
cd openssl

# baixe a última versão
wget https://www.openssl.org/source/openssl-1.0.2d.tar.gz

# descompacte e acesse o diretório
tar zxf openssl-1.0.2d.tar.gz
cd openssl-1.0.2d

# instale
./config --prefix=/usr/
make
sudo make install 

JCEM\_COMMENT\_51\_TOKEN JCEM\_COMMENT\_52\_TOKEN

# Criando Certificate Authority - CA

JCEM\_COMMENT\_53\_TOKEN JCEM\_COMMENT\_54\_TOKEN

Como já explicado, a Autoridade Certificadora é na verdade um certificado utilizado para assinar outros certificados. Através desta assinatura é que os navegadores identificam se um certificado enviado por um site qualquer é ou não confiável. Dentre as autoridades certificadores, algumas das mais conhecidas são: os gratuitos \[\[https://CAcert.org|CAcert.org\]\] e \[\[https://en.wikipedia.org/wiki/Let%27s\_Encrypt|Lets Encryt\]; e os pagos \[\[https://www.comodo.com/|Comodo\]\], \[\[https://www.digicert.com/|DigiCert\]\], \[\[https://www.globalsign.com/pt-br/|GlobalSign\]\] e \[\[https://www.verisign.com/|Verisign\]\]; dentre outros.

JCEM\_COMMENT\_55\_TOKEN JCEM\_COMMENT\_56\_TOKEN

Para que o navegador considere o certificado de um site como confiável ele irá "conferir" a assinatura junto à um dos certificados (CA) instalados no sistema. Neste artigo iremos ensinar como criar um CA, ressalvando, que um CA não terá vantagem se não for instalado no cliente e disponibilizado nos navegadores - o que geralmente tem um custo elevado, ou depende de acesso ao computador do cliente. Neste sentido, se você deseja apenas criar um certificado SSL auto assinado (self-signed), pode pular este capítulo.

JCEM\_COMMENT\_57\_TOKEN JCEM\_COMMENT\_58\_TOKEN

Um CA é composto dos seguintes arquivos:

JCEM\_COMMENT\_59\_TOKEN JCEM\_COMMENT\_60\_TOKEN

<table class="wp-block-table zebra titulo"><tbody><tr><td>Arquivo</td><td>Conteúdo</td><td>Secreto</td></tr><tr><td>CA.key</td><td>Chave Privada</td><td>Sim</td></tr><tr><td>CA.pem</td><td>Certificado</td><td>Não</td></tr></tbody></table>

JCEM\_COMMENT\_61\_TOKEN JCEM\_COMMENT\_62\_TOKEN

## Gerar a Chave Privada

JCEM\_COMMENT\_63\_TOKEN JCEM\_COMMENT\_64\_TOKEN

**A Chave é uma informação secreta. Ela deve ser protegida e não deve estar acessível livremente. É equivalente à senha, então proteja-a.**

JCEM\_COMMENT\_65\_TOKEN JCEM\_COMMENT\_66\_TOKEN

$ openssl genrsa -aes256 -out CA.key 4096 -sha512
Generating RSA private key, 4096 bit long modulus
......++
.......................................++
e is 65537 (0x10001)
Enter pass phrase for CA.key:
Verifying - Enter pass phrase for CA.key:

JCEM\_COMMENT\_67\_TOKEN JCEM\_COMMENT\_68\_TOKEN

$ openssl genrsa -out CA.key 4096 -sha512

JCEM\_COMMENT\_69\_TOKEN JCEM\_COMMENT\_70\_TOKEN

## Criar Certificado CA

JCEM\_COMMENT\_71\_TOKEN JCEM\_COMMENT\_72\_TOKEN

No comando abaixo será gerado o certificado SSL denominado **CA.pem**, assinado por si só. É ele que vai agir como o nosso certificado raiz. O interessante sobre Autoridade Certificadora é que o certificado raiz ele é **auto assinado**.

JCEM\_COMMENT\_73\_TOKEN JCEM\_COMMENT\_74\_TOKEN

No script você será solicitado a preencher informações a respeito da autoridade.

JCEM\_COMMENT\_75\_TOKEN JCEM\_COMMENT\_76\_TOKEN

openssl req -x509 -new -nodes -key CA.key -days 1024 -out CA.pem -sha512

JCEM\_COMMENT\_77\_TOKEN JCEM\_COMMENT\_78\_TOKEN

openssl req -x509 -new -nodes -key CA.key -out CA.pem -sha512

JCEM\_COMMENT\_79\_TOKEN JCEM\_COMMENT\_80\_TOKEN

Pronto! Agora você deve instalar este CA no sistema dos clientes.

JCEM\_COMMENT\_81\_TOKEN JCEM\_COMMENT\_82\_TOKEN

# Criando um Certificado SSL

JCEM\_COMMENT\_83\_TOKEN JCEM\_COMMENT\_84\_TOKEN

Um certificado SSL é composto dos seguintes arquivos:

JCEM\_COMMENT\_85\_TOKEN JCEM\_COMMENT\_86\_TOKEN

<table class="wp-block-table zebra titulo"><tbody><tr><td>Arquivo</td><td>Conteúdo</td><td>Secreto</td></tr><tr><td>meusite.com.key</td><td>Chave Privada</td><td>Sim</td></tr><tr><td>meusite.com.csr</td><td>Requisição de Assinatura de certificado</td><td>Não</td></tr><tr><td>meusite.com.crt</td><td>Certificado Assinado</td><td>Não</td></tr></tbody></table>

JCEM\_COMMENT\_87\_TOKEN JCEM\_COMMENT\_88\_TOKEN

## Gerar Chave Privada

JCEM\_COMMENT\_89\_TOKEN JCEM\_COMMENT\_90\_TOKEN

Este passo não se distingue do realizado na criação do CA, exceto que neste caso encriptação da chave privada (comando -aes256) é opcional, embora a chave continue sendo sigilosa.

JCEM\_COMMENT\_91\_TOKEN JCEM\_COMMENT\_92\_TOKEN

Para tanto faça:

JCEM\_COMMENT\_93\_TOKEN JCEM\_COMMENT\_94\_TOKEN

openssl genrsa -out meusite.com.key 4096 -sha512

JCEM\_COMMENT\_95\_TOKEN JCEM\_COMMENT\_96\_TOKEN

OU

JCEM\_COMMENT\_97\_TOKEN JCEM\_COMMENT\_98\_TOKEN

openssl genrsa -aes256 -out meusite.com.key 4096 -sha512

JCEM\_COMMENT\_99\_TOKEN JCEM\_COMMENT\_100\_TOKEN

**Vantagem**: Protegida por senha, diminui exposição à risco de acesso indevido.  
**Desvantagem**: Somente será possível utilizá-la com impostação de senha. E eu desconheço uma forma de usar um chave encriptada no apache (por favor, se você souber é bem-vindo à contribuir).

JCEM\_COMMENT\_101\_TOKEN JCEM\_COMMENT\_102\_TOKEN

## Gerar Pedido de Assinatura

JCEM\_COMMENT\_103\_TOKEN JCEM\_COMMENT\_104\_TOKEN

Agora, é necessário gerar o Certificate Signing Request (CSR) - Solicitação de Assinatura de certificado.

JCEM\_COMMENT\_105\_TOKEN JCEM\_COMMENT\_106\_TOKEN

openssl req -new -key meusite.com.key -out meusite.com.csr -sha512

JCEM\_COMMENT\_107\_TOKEN JCEM\_COMMENT\_108\_TOKEN

## Assinar o Certificado

JCEM\_COMMENT\_109\_TOKEN JCEM\_COMMENT\_110\_TOKEN

Agora criaremos o certificado assinador (CRT) que será o arquivo utilizado no servidor web, juntamente o arquivo *.key*. Neste exemplo definiremos a validade do certificado para 365 dias, caso você queira deixar ilimitado basta remover esta informação.

JCEM\_COMMENT\_111\_TOKEN JCEM\_COMMENT\_112\_TOKEN

openssl x509 -req -in meusite.com.csr -CA CA.pem -CAkey CA.key -CAcreateserial -out meusite.com.crt -days 365  -sha512

JCEM\_COMMENT\_113\_TOKEN JCEM\_COMMENT\_114\_TOKEN

OU

JCEM\_COMMENT\_115\_TOKEN JCEM\_COMMENT\_116\_TOKEN

openssl x509 -req -in meusite.com.csr -signkey meusite.com.key -out meusite.com.crt -days 365  -sha512

JCEM\_COMMENT\_117\_TOKEN JCEM\_COMMENT\_118\_TOKEN

Pronto! Você já tem um certificado SSL para utilização em seu servidor web. Nos próximos capítulos serão demonstradas as configuração básicas do SSL em três servidores WEB: Apache, gnix e lhttpd.

JCEM\_COMMENT\_119\_TOKEN JCEM\_COMMENT\_120\_TOKEN

# Configurando o servidor WEB

JCEM\_COMMENT\_121\_TOKEN JCEM\_COMMENT\_122\_TOKEN

Os exemplos a seguir são apenas demonstrações, e podem não ser verdadeiramente funcionais e/ou atender todas as possibilidades, servindo apenas como orientador de configuração.

JCEM\_COMMENT\_123\_TOKEN JCEM\_COMMENT\_124\_TOKEN

## Apache

JCEM\_COMMENT\_125\_TOKEN JCEM\_COMMENT\_126\_TOKEN

\[\[wm:w:Servidor\_Apache|Apache\]\] é o servidor web open-source mais bem-sucedido, e um dos mais usados pelo mundo afora. Extremamente robusto e com recursos que não deixam a desejar em nada. Em contrapartida, acaba por ser um servidor que ocupa muitos recursos, como memória. Para habilitar o SSL no apache é necessário adicionar estas linhas ao VirtualHost da porta 443:

JCEM\_COMMENT\_127\_TOKEN JCEM\_COMMENT\_128\_TOKEN

SSLEngine on
SSLCertificateFile "/path/to/meusite.com.crt"
SSLCertificateKeyFile "/path/to/meusite.com.key"
SSLCertificateChainFile "/path/to/meusite.com.crt"

JCEM\_COMMENT\_129\_TOKEN JCEM\_COMMENT\_130\_TOKEN

O seu virtualhost deverá ficar parecido com este:

JCEM\_COMMENT\_131\_TOKEN JCEM\_COMMENT\_132\_TOKEN

  
  ServerAdmin eumesmo@localhost
  DocumentRoot "/path/to/documentroot"
  ServerName meusite.com
  ServerAlias www.meusite.com

  ErrorLog "logs/meusite.com.log"
  CustomLog "logs/meusite.com.log" common
    
  SSLEngine on
  SSLCertificateFile "/path/to/meusite.com.crt"
  SSLCertificateKeyFile "/path/to/meusite.com.key"
  SSLCertificateChainFile "/path/to/meusite.com.crt"
          
  <Directory "/path/to/documentroot">
    Options -Indexes FollowSymLinks Includes ExecCGI SymLinksIfOwnerMatch

    AllowOverride all
    Require all granted

    Order allow,deny
    Allow from all
    RewriteEngine on    
    

JCEM\_COMMENT\_133\_TOKEN JCEM\_COMMENT\_134\_TOKEN

Se você desejar impedir acesso inseguro ao seu site, crie um redirecionamento permanente no virtualhost da porta 80, semelhante ao seguinte:

JCEM\_COMMENT\_135\_TOKEN JCEM\_COMMENT\_136\_TOKEN

  
  ServerAdmin eumesmo@localhost
  ServerName meusite.com
  ServerAlias www.meusite.com

  Redirect permanent /secure https://www.meusite.com

JCEM\_COMMENT\_137\_TOKEN JCEM\_COMMENT\_138\_TOKEN

## Lighttpd

JCEM\_COMMENT\_139\_TOKEN JCEM\_COMMENT\_140\_TOKEN

\[\[wm:w:lighttpd|Lighttpd\]\] é um servidor web enxuto, mas igualmente robusto, usado principalmente por sua alta performance em comparação com o apache, indicado principalmente para lowndbox (servidor de baixo custo) e alguns VPSs. Para mais informações e/ou documentação do lighttpd a respeito de SSL \[\[https://redmine.lighttpd.net/projects/1/wiki/docs\_ssl|clique aqui\]\].

JCEM\_COMMENT\_141\_TOKEN JCEM\_COMMENT\_142\_TOKEN

Lighttpd necessita de um arquivo a mais, o **.pem**. Este é arquivo é junção da chave (.key) com o certificado (.crt). Para criar o arquivo **.pem**, no shell utilize o comando \[\[https://www.uniriotec.br/~morganna/guia/cat.html|cat\]\] como a seguir:

JCEM\_COMMENT\_143\_TOKEN JCEM\_COMMENT\_144\_TOKEN

cat meusite.com.key meusite.com.crt > meusite.com.pem

JCEM\_COMMENT\_145\_TOKEN JCEM\_COMMENT\_146\_TOKEN

$SERVER\["socket"\] == "meusite.com:443" {
  # habilita SSL
  ssl.engine = "enable"

  # o arquivo que possui a chave e o certificado juntos
  ssl.pemfile = "/path/to/meusite.com.pem"

  # se você usou um CA, necessita deste arquivo
  ssl.ca-file = "/path/to/CA.crt" 

  server.name = "meusite.com"
  server.document-root = "/path/to/documentroot"

  server.errorlog = "/var/log/logs/meusite.com.log"
  accesslog.filename = "/var/log/logs/meusite.com.acesslog"
}

JCEM\_COMMENT\_147\_TOKEN JCEM\_COMMENT\_148\_TOKEN

**NOTA:** Lembre-se que o .pem conterá o key, e portanto deve ser igualmente protegido.

JCEM\_COMMENT\_149\_TOKEN JCEM\_COMMENT\_150\_TOKEN

Se você desejar impedir acesso inseguro ao seu site, crie um redirecionamento permanente para https:

JCEM\_COMMENT\_151\_TOKEN JCEM\_COMMENT\_152\_TOKEN

$HTTP\["scheme"\] == "http" {
  $HTTP\["host"\] == "meusite.com" {
    url.redirect = ("^/phpmyadmin/.\*" => "https://sth.example.com$0")
  }
}

JCEM\_COMMENT\_153\_TOKEN JCEM\_COMMENT\_154\_TOKEN

## Nginx

JCEM\_COMMENT\_155\_TOKEN JCEM\_COMMENT\_156\_TOKEN

\[\[wm:w:Nginx|Nginx\]\] é um servidor prox httpd e reverso, com alguns recursos a menos que o apache, mas bem mais leve. Por ser um servidor web rápido, leve, e com inúmeras possibilidades de configuração para melhor performance, acaba sendo outra boa uma escolha para lowendbox (servidor de baixo custo) e alguns VPSs. Para a documentação oficial a respeito de SSL \[\[https://nginx.org/en/docs/http/configuring\_https\_servers.html#single\_http\_https\_server|clique aqui\]\].

JCEM\_COMMENT\_157\_TOKEN JCEM\_COMMENT\_158\_TOKEN

$HTTP\["scheme"\] == "http" {
  server {
    listen 80;
    listen \[::\]:80;
    listen 443 ssl default\_server ssl;

    root /path/to/documentroot
    index index.php index.html index.htm;
    server\_name meusite.com www.meusite.com;

    ssl\_certificate /path/to/meusite.com.crt;
    ssl\_certificate\_key /path/to/meusite.com.key;
    
    # Força SSL
    if ($ssl\_protocol = "") {
       rewrite ^   "https://$server\_name$request\_uri?" permanent;
    }
  }
}

JCEM\_COMMENT\_159\_TOKEN JCEM\_COMMENT\_160\_TOKEN

# Referências

JCEM\_COMMENT\_161\_TOKEN JCEM\_COMMENT\_162\_TOKEN \[references\] JCEM\_COMMENT\_163\_TOKEN
