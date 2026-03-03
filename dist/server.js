// server.ts
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// src/routes/transactions.ts
import { Router } from "express";

// src/schemas/Products.ts
import { Schema, model } from "mongoose";
var productSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  categoryId: { type: Number, required: true, ref: "Categorie" }
}, {
  timestamps: true,
  versionKey: false
  //Quitar __v
});
var productModel = model("Product", productSchema);

// src/schemas/Transaction.ts
import { model as model2, Schema as Schema2 } from "mongoose";
var transactionsSchema = new Schema2({
  productId: { type: Number, required: true, ref: "Product" },
  type: { type: String, required: true, enum: ["IN", "OUT"] },
  quantity: { type: Number, required: true }
}, {
  timestamps: true,
  versionKey: false
});
var transactionModel = model2("Transaction", transactionsSchema);

// src/models/mongoDB/inventory.ts
var InventoryModel = class {
  async addTransaction(productId, type, quantity) {
    const stockChange = type === "IN" ? Number(quantity) : -Number(quantity);
    const updatedProduct = await productModel.findOneAndUpdate(
      { id: Number(productId) },
      { $inc: { stock: stockChange } },
      // $inc suma (o resta si es negativo) automáticamente
      { new: true }
      // Esto nos devuelve el producto YA actualizado
    );
    if (!updatedProduct) {
      throw new Error("Producto no encontrado");
    }
    const nuevaTransaccion = await transactionModel.create({
      productId: Number(productId),
      type,
      quantity: Number(quantity)
    });
    return nuevaTransaccion;
  }
  async getInventoryValue() {
    const result = await productModel.aggregate([
      {
        // 1. Unimos (Join) con la colección de categorías
        $lookup: {
          from: "categories",
          // nombre de la colección en la DB
          localField: "categoryId",
          foreignField: "id",
          as: "categoryDetails"
        }
      },
      { $unwind: "$categoryDetails" },
      {
        // 2. Calculamos el valor por cada producto aplicando el descuento
        $project: {
          totalProductValue: {
            $multiply: [
              "$stock",
              {
                $multiply: [
                  "$price",
                  { $subtract: [1, { $divide: ["$categoryDetails.discount", 100] }] }
                ]
              }
            ]
          }
        }
      },
      {
        // 3. Sumamos todo en un solo gran total
        $group: {
          _id: null,
          totalInventoryValue: { $sum: "$totalProductValue" }
        }
      }
    ]);
    return result.length > 0 ? result[0].totalInventoryValue : 0;
  }
  async getTransactionsById(productId) {
    const transactions = await transactionModel.find({ productId: Number(productId) }).lean();
    return transactions;
  }
  async getProductsLowStock() {
    const products = await productModel.find({
      stock: { $lt: 5 }
    }).sort({ stock: 1 }).lean();
    return products;
  }
};

// src/controllers/inventoryController.ts
var InventoryController = class {
  inventoryModel;
  constructor() {
    this.inventoryModel = new InventoryModel();
  }
  addTransaction = async (req, res) => {
    const { productId, type, quantity } = req.body;
    try {
      const transaction = await this.inventoryModel.addTransaction(productId, type, quantity);
      res.json(transaction);
    } catch (e) {
      res.status(400).json({
        success: false,
        error: e instanceof Error ? e.message : "Error desconocido"
      });
    }
  };
  getInventoryValue = async (req, res) => {
    try {
      const inventoryValue = await this.inventoryModel.getInventoryValue();
      res.json({ InventoryValue: inventoryValue });
    } catch (e) {
      res.status(400).json({
        success: false,
        error: e instanceof Error ? e.message : "Error desconocido"
      });
    }
  };
  getTransactionsById = async (req, res) => {
    const { productId } = req.params;
    try {
      const results = await this.inventoryModel.getTransactionsById(Number(productId));
      res.status(200).json(results);
    } catch (e) {
      res.status(400).json({
        success: false,
        error: e instanceof Error ? e.message : "Error desconocido"
      });
    }
  };
  getProductsLowStock = async (req, res) => {
    try {
      const products = await this.inventoryModel.getProductsLowStock();
      res.status(200).json(products);
    } catch (e) {
      res.status(400).json({
        success: false,
        error: e instanceof Error ? e.message : "Error desconocido"
      });
    }
  };
};
var inventoryController = new InventoryController();

// src/validators/transactionValidations.ts
import { z } from "zod";
var transactionValidation = z.object({
  productId: z.number("El product id es requerido"),
  type: z.enum(["OUT", "IN"], "Solo se admiten los valores OUT y IN"),
  quantity: z.number("El quantity debe ser mayor a 1").min(1, "La cantidad minima es 1")
});

// src/middlewares/inventory.middleware.ts
import { z as z2 } from "zod";
var validateTransaction = (req, res, next) => {
  const { productId, type, quantity } = req.body;
  try {
    const validateData = transactionValidation.parse({ productId, type, quantity });
    next();
  } catch (e) {
    if (e instanceof z2.ZodError) {
      return res.status(400).json({
        message: "Datos Invalidos",
        errors: e.flatten().fieldErrors
      });
    }
  }
};

// src/routes/transactions.ts
var createTransactionsRouter = () => {
  const transactionsRouter = Router();
  transactionsRouter.post("/", validateTransaction, inventoryController.addTransaction);
  return transactionsRouter;
};

// src/routes/stats.ts
import { Router as Router2 } from "express";

// src/middlewares/auth.middleware.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "lameramerasabortaquera";
var verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inv\xE1lido o expirado." });
  }
};

// src/routes/stats.ts
var createStatsRouter = () => {
  const statsRouter = Router2();
  statsRouter.use(verifyToken);
  statsRouter.get("/inventory-value", inventoryController.getInventoryValue);
  statsRouter.get("/movement-history/:productId", inventoryController.getTransactionsById);
  return statsRouter;
};

// src/routes/products.ts
import { Router as Router3 } from "express";
var createProductsRouter = () => {
  const productsRouter = Router3();
  productsRouter.get("/low-stock", inventoryController.getProductsLowStock);
  return productsRouter;
};

// src/config/db.ts
import mongoose from "mongoose";
import dns from "dns";
var connectDB = async () => {
  let isConnected = false;
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  console.log(`Tu uri es: ${process.env.MONGO_URI}`);
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`\u2705 MongoDB Connected: ${connection.connection.host}`);
    isConnected = true;
  } catch (e) {
    console.error(`\u274C Error: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  }
};

// src/routes/auth.ts
import { Router as Router4 } from "express";

// src/schemas/Users.ts
import { Schema as Schema3, model as model3 } from "mongoose";
var userSchema = new Schema3({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "admin" }
}, {
  timestamps: true,
  versionKey: false
});
var userModel = model3("User", userSchema);

// src/models/mongoDB/user.ts
import bcrypt from "bcrypt";
import jwt2 from "jsonwebtoken";
var JWT_SECRET2 = process.env.JWT_SECRET || "lameramerasabortaquera";
var UserModel = class {
  async register(username, email, password, role) {
    if (!username || !email || !password || !role) {
      throw new Error("Error en alguno de los campos");
    }
    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) throw new Error("El username o correo ya esta ocupado");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      role
    });
    return { Message: "Usuario registrado con exito", data: { username: newUser.username, role: newUser.role } };
  }
  async login(username, password) {
    const user = await userModel.findOne({ username }).lean();
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error("Credenciales inv\xE1lidas");
    }
    const token = jwt2.sign(
      { id: user?._id, role: user?.role },
      JWT_SECRET2,
      { expiresIn: "2h" }
    );
    return { message: "Loggeado con exito", token };
  }
};

// src/validators/userValidations.ts
import { z as z3 } from "zod";
var userValidation = z3.object({
  username: z3.string().min(3, "El username debe tener al menos 3 caracteres").max(20, "El username es demasiado largo"),
  email: z3.email("Formato de email invalido"),
  password: z3.string().min(5, "La contrase\xF1a debe tener al menos 5 caracteres"),
  role: z3.enum(["admin", "user"]).default("admin")
});
var loginValidation = userValidation.pick({
  username: true,
  password: true
});

// src/controllers/userController.ts
import z4 from "zod";
var UserController = class {
  usersModel;
  constructor() {
    this.usersModel = new UserModel();
  }
  register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      const validateData = userValidation.parse({ username, email, password, role });
      const result = await this.usersModel.register(validateData.username, validateData.email, validateData.password, validateData.role);
      res.status(201).json(result);
    } catch (e) {
      if (e instanceof z4.ZodError) {
        return res.status(400).json({
          message: "Datos Invalidos",
          errors: e.flatten().fieldErrors
        });
      }
      const errorMessage = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ message: errorMessage });
    }
  };
  login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const validateData = loginValidation.parse({ username, password });
      const result = await this.usersModel.login(validateData.username, validateData.password);
      res.status(200).json(result);
    } catch (e) {
      if (e instanceof z4.ZodError) {
        return res.status(400).json({
          message: "Credenciales invalidas"
        });
      }
      res.status(401).json({ message: e.message });
    }
  };
};

// src/routes/auth.ts
var userController = new UserController();
var createAuthRouter = () => {
  const authRouter = Router4();
  authRouter.post("/register", userController.register);
  authRouter.post("/login", userController.login);
  return authRouter;
};

// server.ts
dotenv.config();
var app = express();
var port = process.env.PORT || 3e3;
app.use(express.json());
app.use(cors());
connectDB();
var swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "The Inventory Hub API",
      version: "1.0.0",
      description: "API para la gesti\xF3n de inventarios - Fullstack Project",
      contact: {
        name: "Ivan"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desarrollo (Docker)"
      }
    ]
  },
  // 2. Ruta a los archivos que contienen las anotaciones
  apis: ["./server.ts", "./src/routes/*.ts"]
};
console.log("ya entre");
var swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/auth", createAuthRouter());
app.use("/transactions", createTransactionsRouter());
app.use("/stats", createStatsRouter());
app.use("/products", createProductsRouter());
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
