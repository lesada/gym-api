# 🏋️‍♂️ gym-api

### A RESTful API for gym management, built with Fastify, Prisma and TypeScript 💪

---

## 🧪 Technologies

- 🟦 [**TypeScript**](https://www.typescriptlang.org/)
- ⚡ [**Fastify**](https://fastify.dev/)
- 🧬 [**Prisma**](https://www.prisma.io/)
- 📦 [**Zod**](https://zod.dev/)

### 🧰 Dev Tools

- ⚙️ [**TSX**](https://github.com/esbuild-kit/tsx) – Fast TypeScript runtime
- 📦 [**Tsup**](https://tsup.egoist.dev/) – Bundler
- 🎯 [**Biome**](https://biomejs.dev/) – Formatter & linter
- 🧪 [**Vitest**](https://vitest.dev/) – Unit testing framework
- 🛠️ [**Prisma CLI**](https://www.prisma.io/docs/reference/api-reference/command-reference)

---

## 🚀 Getting Started

### ✅ Requirements

- 🔧 [NodeJS](https://nodejs.org/en)
- 🔁 [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/)
- 🗄️ [PostgreSQL](https://www.postgresql.org/) or another DB provider

---

### 📥 Clone the project

```bash
git clone https://github.com/your-username/gym-api.git
cd gym-api
```

---

### 📦 Install dependencies

```bash
pnpm install
# or
npm install
```

---

### ⚙️ Set up environment variables

Create a `.env` file based on the `.env.example` file in the root directory:

---

### 🗃️ Initialize the database

```bash
npx prisma generate
npx prisma migrate dev
```

---

### 🧪 Run in development mode

```bash
pnpm dev
# or
npm run dev
```

---

### 🏗️ Build for production

```bash
pnpm build
# or
npm run build
```

---

### 🧹 Format code with Biome

```bash
pnpm lint
# or
npm run lint
```

---

### ✅ Run tests

```bash
pnpm test
# or
npm run test
```

---

Made for study purposes
