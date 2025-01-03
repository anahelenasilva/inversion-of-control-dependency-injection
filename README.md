# anotacoes para o post no blog

# Inversion of Control, Dependency Injection e Dependency Inversion

usecase vs services (to-do: melhorar essa escrita)

- usecase: sempre vai ter uma responsabilidade única (ex: um usecase que só faz executa a finalização de um pedido); o método dentro dele vai chamar `execute`, utiliza o Single Responsability Principle.
- services: pode ter mais de uma responsabilidade (ex: um service que faz a finalização do pedido, envia um email, lista as orders); o método dentro dele pode ser `placeOrder`, `sendOrderMail`, `listOrders`, etc; a desvantagem é que a classe pode ficar muito grande, com muitos métodos e muitas responsabilidades; um service também pode ser uma classe que interage com serviços externos, por exemplo um provedor de pagamentos para interagir com a api.

## Source Code Dependency e Flow of Control

### Source Code Dependency

É a direção em que as dependências do código vão:
-> http (fastify)
-> PlaceOrderUseCase
-> DynamoDBOrderRepository
-> DynamoClient
-> SQSGateway
-> SQSClient
-> SESGateway
-> SESClient

### Flow of Control

Fluxo de controle da execução do código, ou seja, a ordem em que as funções são chamadas em runtime. No exemplo acima, o fluxo de controle é o mesmo do soruce code dependency, ou seja, o Flow of Control está na mesma direção que Source Code Dependency, conforme também ilustrado na imagem abaixo.

![Flow of Control e Source Code Dependency na mesma direção](docs/foc-scd-1.png)

## Inversion of Control (IoC)

Ao invés do usecase instanciar as suas dependências, ele apenas recebe as dependências como parâmetros. O IoC é uma técnica que permite inverter o controle de execução de um sistema, ou seja, o controle é passado para um framework ou container que vai instanciar as dependências e passar para o usecase. O usecase ainda executa as dependências, mas não sabe de onde vem as dependências, ele só sabe que elas vão ser passadas para ele.
Podemos usar o princípio de Hollywood como exemplo: "Don't call us, we'll call you"

![Inversion of Control (IoC)](docs/foc-scd-2.png)

### Dependency Injection (DI)

É um design pattern que permite injetar as dependências de uma classe em tempo de execução. O objetivo é desacoplar as dependências de uma classe, permitindo que elas sejam substituídas por outras dependências em tempo de execução. O uso de DI permite que as dependências sejam passadas para a classe que as utiliza, ao invés de serem instanciadas dentro da classe. Podemos dizer que é uma maneira de inverter o Flow of Control.

Em programação orientada a objeto, os relacionamentos entre classes executam um papel crucial na definição de como os objetos interagem uns com os outros. Existem alguns mecanismos para modelar esses relacionamentos como association, aggregation e composition.

**Composition**: o ciclo de vida de um objeto nasce (é instanciado) e morre (é destruído) dentro de um contexto, ou seja, se o objeto pai não existir, o objeto filho também não existirá. Por exemplo: ao instanciar um objeto do tipo `Order` dentro do usecase `PlaceOrder`, estamos dizendo que o objeto `Order` só existe dentro do contexto do usecase `PlaceOrder`.

**Aggregation**: o ciclo de vida de um objeto não depende do objeto pai, ou seja, se o objeto pai for destruído, o objeto filho ainda pode existir. Por exemplo: ao receber as dependências `DynamoDBOrderRepository`, `SQSGateway` e `SESGateway` no construtor do usecase `PlaceOrder`, estamos dizendo que essas dependências podem existir fora do contexto do usecase `PlaceOrder`, ou seja, podemos ter um `DynamoDBOrderRepository` sem um `PlaceOrder`, podemos usar o `DynamoDBOrderRepository` em outro lugar.

**Association**: é o relacionamento "has-a" (tem um), ou seja, o usecase `PlaceOrder` tem uma associação com o `DynamoDBOrderRepository`, tem um `DynamoDBOrderRepository`, indepdente se ele foi criado como uma composição ou se foi injetado como uma agregação.

![Association, Aggregation e Composition](docs/association-aggregation-composition.png)

## Dependency Inversion Principle (DIP)

"High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions."

High-level modules -> regras de negócio, código mais "puro", o código mais alto nível da aplicação, que não depende de detalhes de implementação. Exemplo: para fazer uma order, é necessário inserir no banco de dados, enviar um email, etc, mas não importa como essas ações são executadas. O high-level module seria o usecase `PlaceOrder`.
Low-level modules -> detalhes de implementação, como o banco de dados, envio de email, etc. Exemplo: `DynamoDBOrderRepository`, `SQSGateway`, `SESGateway`.

![DIP aplicado](dip.png)

## Factory Pattern

É um padrão de design que permite criar instâncias de objetos sem especificar a classe exata do objeto que será criado. O Factory Pattern define uma interface para criar objetos, mas deixa a implementação da criação de objetos para as classes filhas. O Factory Pattern é usado quando queremos criar um objeto sem expor a lógica de criação do objeto para o cliente.