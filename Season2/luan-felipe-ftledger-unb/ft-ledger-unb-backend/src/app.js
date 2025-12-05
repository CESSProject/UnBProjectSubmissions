// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🔐 Auth / Banco
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(morgan("dev"));

// Em DEV, libera CORS sem restrição (simples e funciona)
app.use(cors());

// Para receber JSON (login/cadastro) e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Infra de caminho ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
//  BANCO (SQLite)
// =====================
const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

const DB_PATH = path.join(dataDir, "auth.db");

const sqlite = sqlite3.verbose();
const db = new sqlite.Database(DB_PATH);

db.serialize(() => {
  // Tabela de usuários (login)
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      matricula TEXT UNIQUE NOT NULL,
      course TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'aluno'
    )
  `,
    (err) => {
      if (err) {
        console.error("Erro ao criar tabela users:", err);
      } else {
        console.log("Tabela users ok.");
      }
    }
  );

  // Tabela de histórico de uploads
  db.run(
    `
    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      sha256 TEXT NOT NULL,
      category TEXT NOT NULL,
      fid_local TEXT,
      fid_cess TEXT,
      deoss_ok INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
    (err) => {
      if (err) {
        console.error("Erro ao criar tabela uploads:", err);
      } else {
        console.log("Tabela uploads ok.");
      }
    }
  );
});

// 🔐 segredo do JWT (em produção, usar variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || "ft-ledger-unb-dev-secret";

// cria um admin padrão se não existir
function seedAdminUser() {
  const adminEmail = "admin@unb.br";
  const adminPassword = "senha123"; // você pode mudar depois

  db.get("SELECT id FROM users WHERE email = ?", [adminEmail], (err, row) => {
    if (err) {
      console.error("Erro ao verificar admin:", err);
      return;
    }
    if (row) {
      console.log("Admin padrão já existe.");
      return;
    }

    const passwordHash = bcrypt.hashSync(adminPassword, 10);

    db.run(
      `
      INSERT INTO users (
        email,
        password_hash,
        first_name,
        last_name,
        matricula,
        course,
        role
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        adminEmail,
        passwordHash,
        "Admin",
        "Padrão",
        "000000000",
        "Engenharia de Redes de Comunicação",
        "admin",
      ],
      (insertErr) => {
        if (insertErr) {
          console.error("Erro ao criar admin padrão:", insertErr);
        } else {
          console.log(
            `Admin padrão criado: ${adminEmail} / ${adminPassword}`
          );
        }
      }
    );
  });
}

seedAdminUser();

// =====================
//  MIDDLEWARE auth
// =====================
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload: { sub, email, role, iat, exp }
    req.user = payload;
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

// =====================
//  ROTAS
// =====================

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// --- Login real: POST /auth/login ---
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "E-mail e senha são obrigatórios." });
  }

  db.get(
    `
    SELECT
      id,
      email,
      password_hash,
      role,
      first_name,
      last_name,
      matricula,
      course
    FROM users
    WHERE email = ?
  `,
    [email],
    (err, user) => {
      if (err) {
        console.error("Erro no banco:", err);
        return res.status(500).json({ error: "Erro interno." });
      }

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const ok = bcrypt.compareSync(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const token = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          matricula: user.matricula,
          course: user.course,
        },
      });
    }
  );
});

// --- Cadastro: POST /auth/register ---
app.post("/auth/register", (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    matricula,
    course,
  } = req.body;

  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !matricula ||
    !course
  ) {
    return res
      .status(400)
      .json({ error: "Todos os campos são obrigatórios." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "A senha deve ter pelo menos 6 caracteres." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  db.run(
    `
    INSERT INTO users (
      email,
      password_hash,
      first_name,
      last_name,
      matricula,
      course,
      role
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [email, passwordHash, firstName, lastName, matricula, course, "aluno"],
    function (err) {
      if (err) {
        console.error("Erro ao registrar usuário:", err);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({
            error: "E-mail ou matrícula já cadastrados.",
          });
        }
        return res.status(500).json({ error: "Erro interno." });
      }

      const userId = this.lastID;

      const token = jwt.sign(
        { sub: userId, email, role: "aluno" },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.status(201).json({
        token,
        user: {
          id: userId,
          email,
          role: "aluno",
          firstName,
          lastName,
          matricula,
          course,
        },
      });
    }
  );
});

// =====================
//  Upload + DeOSS (CESS)
// =====================
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Armazenamento em memória -> calculamos SHA antes de salvar
const upload = multer({ storage: multer.memoryStorage() });

// Protegido com requireAuth: precisa estar logado pra fazer upload
app.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "file ausente" });
    }

    const userId = req.user.sub; // id do usuário logado (vem do token)
    const category = req.body.category || "desconhecido";

    // 1) Calcula SHA-256 do arquivo
    const sha256 = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    // 2) Salva localmente usando o SHA como fid "local"
    const fidLocal = sha256;
    const ext = path.extname(req.file.originalname || "");
    const outPath = path.join(UPLOAD_DIR, fidLocal + ext);
    fs.writeFileSync(outPath, req.file.buffer);

    // Resposta base (parte local)
    const payload = {
      fid: fidLocal,
      name: req.file.originalname,
      size: req.file.size,
      mime: req.file.mimetype,
      sha256,
      saved: true,
    };

    // Variáveis para guardar resultado da CESS
    let deossOk = false;
    let deossFid = null;

    // 3) Tentar enviar também para o DeOSS (CESS)
    const gw = (process.env.DEOSS_GATEWAY_URL || "").replace(/\/$/, "");
    const territory = process.env.DEOSS_TERRITORY;
    const account = process.env.DEOSS_ACCOUNT;
    const message = process.env.DEOSS_MESSAGE;
    const signature = process.env.DEOSS_SIGNATURE;

    if (gw && territory && account && message && signature) {
      try {
        // Em Node 18+ temos Blob e FormData globais (via undici)
        const blob = new Blob([req.file.buffer], {
          type: req.file.mimetype || "application/octet-stream",
        });

        const form = new FormData();
        form.append("file", blob, req.file.originalname || "file.bin");

        const deossResp = await fetch(`${gw}/file`, {
          method: "PUT",
          headers: {
            Territory: territory,
            Account: account,
            Message: message,
            Signature: signature,
          },
          body: form,
        });

        const text = await deossResp.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          json = null;
        }

        if (!deossResp.ok) {
          console.error("DeOSS upload falhou:", deossResp.status, text);
          payload.deoss = {
            ok: false,
            status: deossResp.status,
            error: text,
          };
        } else {
          console.log("DeOSS upload OK:", json || text);
          deossFid = json?.fid || json?.data?.fid || null;
          deossOk = true;

          payload.deoss = {
            ok: true,
            fid: deossFid,
            raw: json || text,
          };
        }
      } catch (err) {
        console.error("Erro chamando DeOSS:", err);
        payload.deoss = {
          ok: false,
          error: "falha ao chamar DeOSS",
        };
      }
    } else {
      // Caso falte alguma env, não quebra o upload local
      payload.deoss = {
        ok: false,
        error: "DEOSS não configurado no .env",
      };
    }

    // 4) Salvar metadados no banco (SQLite -> tabela uploads)
    db.run(
      `
      INSERT INTO uploads (
        user_id,
        filename,
        size_bytes,
        sha256,
        category,
        fid_local,
        fid_cess,
        deoss_ok
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        userId,
        req.file.originalname,
        req.file.size,
        sha256,
        category,
        fidLocal,
        deossFid,
        deossOk ? 1 : 0,
      ],
      function (err) {
        if (err) {
          console.error("Erro ao salvar upload no banco:", err);
          return res
            .status(500)
            .json({ error: "Falha ao registrar upload no banco." });
        }

        const uploadId = this.lastID;
        const uploadedAt = new Date().toISOString();

        const uploadMeta = {
          id: uploadId,
          name: req.file.originalname,
          size: req.file.size,
          sha256,
          category,
          fidLocal,
          fidCess: deossFid,
          deossOk,
          uploadedAt,
        };

        return res.json({
          ...payload,
          upload: uploadMeta,
        });
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "falha no upload" });
  }
});

// =====================
//  Histórico de uploads
// =====================
app.get("/uploads", requireAuth, (req, res) => {
  const userId = req.user.sub;

  db.all(
    `
    SELECT
      id,
      filename   AS name,
      size_bytes AS size,
      sha256,
      category,
      fid_local  AS fidLocal,
      fid_cess   AS fidCess,
      deoss_ok   AS deossOk,
      created_at AS uploadedAt
    FROM uploads
    WHERE user_id = ?
    ORDER BY datetime(created_at) DESC
  `,
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Erro ao carregar histórico de uploads:", err);
        return res
          .status(500)
          .json({ error: "Erro ao carregar histórico de uploads." });
      }

      const normalized = rows.map((r) => ({
        ...r,
        deossOk: !!r.deossOk,
      }));

      return res.json(normalized);
    }
  );
});

// =====================
//  Download local por fid_local (SHA-256)
//  Usado pelo botão "Baixar arquivo" do Portal
//  (rota simples, sem auth)
// =====================
app.get("/download/:fid", (req, res) => {
  const fid = req.params.fid;
  const files = fs.readdirSync(UPLOAD_DIR);
  const found = files.find((f) => f.startsWith(fid));
  if (!found) return res.status(404).send("not found");
  return res.sendFile(path.join(UPLOAD_DIR, found));
});

// =====================
//  Start
// =====================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));


