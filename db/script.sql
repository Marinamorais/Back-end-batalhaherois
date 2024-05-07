--- Criação da tabela de heróis ---

CREATE TABLE herois (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    poder VARCHAR(255) NOT NULL,
    nivel INT NOT NULL,
    hp INTEGER NOT NULL,
    ataque INTEGER NOT NULL,
    defesa INTEGER NOT NULL
);

--- fim da criação da tabela de heróis ---

--- Criação da tabela de histórico de batalhas ---

CREATE TABLE historico (
    id SERIAL PRIMARY KEY,
    vencedor INT NOT NULL,
    perdedor INT NOT NULL,
    data DATE,
    FOREIGN KEY (vencedor) REFERENCES herois(id),
    FOREIGN KEY (perdedor) REFERENCES herois(id)
);

--- Criação dos inserts herois DC ---

INSERT INTO herois (nome, poder, nivel, hp, ataque, defesa) VALUES ('Superman', 'Super força', 100, 850, 95, 90);




SELECT * FROM herois;