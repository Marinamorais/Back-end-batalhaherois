const express = require("express");
const { Pool } = require("pg"); // Importa o Pool da biblioteca pg

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: "postgres", // Usuário do PostgreSQL
  host: "localhost",
  database: "batalhas_herois",
  password: "senai564", // Senha do PostgreSQL
  port: 5432, 
});

app.use(express.json());


// Rota para buscar herois
app.get("/herois", async (req, res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM herois");
      res.status(200).send({
        message: "Herois encontrados com sucesso!",
        herois: rows,
      });
    } catch (error) {
      console.error("Erro ao buscar herois", error);
      res.status(500).send("Erro ao buscar herois");
    }
  });

// Rota para buscar herois por id
app.get("/herois/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query("SELECT * FROM herois WHERE id = $1", [
        id,
      ]);
      res.status(200).send({
        message: "Herois encontrados com sucesso!",
        herois: rows,
      });
    } catch (error) {
      console.error("Erro ao buscar herois", error);
      res.status(500).send("Erro ao buscar herois");
    }
  });

// Rota para criar um herois
app.post("/herois", async (req, res) => {
    try {
      const { nome, poder, nivel, hp, ataque, defesa } = req.body;
      const { rows } = await pool.query(
        "INSERT INTO herois (nome, poder, nivel, hp, ataque, defesa) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [nome, poder, nivel, hp, ataque, defesa]
      );
      res.status(201).send({
        message: "Heroi criado com sucesso!",
        herois: rows,
      });
    } catch (error) {
      console.error("Erro ao criar heroi", error);
      res.status(500).send("Erro ao criar heroi");
    }
  });

// Rota para atualizar um herois
app.put("/herois/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, poder, nivel, hp, ataque, defesa } = req.body;
      const { rows } = await pool.query(
        "UPDATE herois SET nome = $1, poder = $2, nivel = $3, hp = $4, ataque = $5, defesa = $6 WHERE id = $7 RETURNING *",
        [nome, poder, nivel, hp, ataque, defesa, id]
      );
      res.status(200).send({
        message: "Heroi atualizado com sucesso!",
        herois: rows,
      });
    } catch (error) {
      console.error("Erro ao atualizar heroi", error);
      res.status(500).send("Erro ao atualizar heroi");
    }
  });

// Rota para deletar um herois
app.delete("/herois/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM herois WHERE id = $1", [id]);
      res.status(200).send("Heroi deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar heroi", error);
      res.status(500).send("Erro ao deletar heroi");
    }
  
});

// Rota para flitrar por nome de herois
app.get("/herois/nome/:nome", async (req, res) => {
    try {
      const { nome } = req.params;
      const { rows } = await pool.query("SELECT * FROM herois WHERE nome = $1", [
        nome,
      ]);
      res.status(200).send({
        message: "Herois encontrados com sucesso!",
        herois: rows,
      });
    } catch (error) {
      console.error("Erro ao buscar heroi", error);
      res.status(500).send("Erro ao buscar herois");
    }
  });
  
// Rota para flitrar por poder de herois
app.get("/herois/poder/:poder", async (req, res) => {
    try {
      const { poder } = req.params;
      const { rows } = await pool.query("SELECT * FROM herois WHERE poder = $1", [
        poder,
      ]);
      res.status(200).send({
        message: "Herois encontrados com sucesso!",
        herois: rows,
      });
    } catch (error) {
      console.error("Erro ao buscar heroi", error);
      res.status(500).send("Erro ao buscar heroi");
    }
  });

  // logica para batalha
  app.get("/batalhar/:idHeroi1/:idHeroi2", async (req, res) => {
    try {
      const { idHeroi1, idHeroi2 } = req.params;
  
      const query = `
        SELECT * FROM herois WHERE id = $1 OR id = $2
      `;
  
      const { rows } = await pool.query(query, [idHeroi1, idHeroi2]);
  
      if (rows.length !== 2) {
        return res.status(404).send("Heróis não encontrados");
      }
  
      const heroi1 = rows[0];
      const heroi2 = rows[1];
  
      let turno = 1;
      while (heroi1.pontosdevida > 0 && heroi2.pontosdevida > 0) {
        let atacante, defensor;
        if (turno % 2 !== 0) {
          atacante = heroi1;
          defensor = heroi2;
        } else {
          atacante = heroi2;
          defensor = heroi1;
        }
  
        // o dano é um valor aleatório entre 0.5 * ataque e 1.5 * ataque
        const dano = Math.floor(Math.random() * (1.5 * atacante.ataque - 0.5 * atacante.ataque)) + 0.5 * atacante.ataque;
        
        defensor.pontosdevida -= Math.max(dano - defensor.defesa, 0);
  
        turno++;
      }
  
      let vencedor, perdedor;
      if (heroi1.pontosdevida <= 0 && heroi2.pontosdevida <= 0) {
        vencedor = "Empate";
      } else if (heroi1.pontosdevida <= 0) {
        vencedor = heroi2;
        perdedor = heroi1;
      } else {
        vencedor = heroi1;
        perdedor = heroi2;
      }
  
      if (vencedor !== "Empate") {
        addHistorico(vencedor, perdedor);
      }
  
      res.status(200).send({
        message: "Batalha realizada com sucesso!",
        vencedor: vencedor,
      });
    } catch (error) {
      console.error("Erro ao realizar batalha", error);
      res.status(500).send("Erro ao realizar batalha");
    }
  });
  
// Função para adicionar histórico de batalha
  const addHistorico = async (vencedor, perdedor) => {
    let data = new Date();
    data = data.toISOString().split("T")[0];
    try {
      await pool.query(
        "INSERT INTO historico (vencedor, perdedor, data) VALUES ($1, $2, $3)",
        [vencedor.id, perdedor.id, data]
      );
    } catch (error) {
      console.error("Erro ao adicionar histórico", error);
    }
  };
  
// Rota para buscar histórico de batalhas
    app.get("/historico", async (req, res) => {
        try {
          const { rows } = await pool.query(
            "SELECT h.nome AS vencedor, h2.nome AS perdedor, data FROM historico JOIN herois h ON h.id = historico.vencedor JOIN herois h2 ON h2.id = historico.perdedor;"
          );
          res.status(200).send({
            message: "Histórico de batalhas encontrado com sucesso!",
            historico: rows,
          });
        } catch (error) {
          console.error("Erro ao buscar histórico", error);
          res.status(500).send("Erro ao buscar histórico");
        }
      });


// Inicializando o servidor
app.listen(PORT, () => {
    console.log(`Server rodando perfeitamente na porta ${PORT}`);
});


// Rota para testar se o servidor está funcionando
app.get("/", (req, res) => {
    res.send("A rota está funcionando perfeitamente!💫");
  });