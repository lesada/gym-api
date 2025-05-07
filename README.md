# 🏋️‍♂️ gym-api

### A RESTful API for gym management, built with Fastify, Prisma and TypeScript 💪

---

## 🧪 Technologies

- 🟦 [**TypeScript**](https://www.typescriptlang.org/)
- ⚡ [**Fastify**](https://fastify.dev/)
- 🧬 [**Prisma**](https://www.prisma.io/)
- 🔐 [**bcryptjs**](https://github.com/dcodeIO/bcrypt.js)
- 📦 [**Zod**](https://zod.dev/)
- 🌿 [**Dotenv**](https://www.npmjs.com/package/dotenv)

### 🧰 Dev Tools

- ⚙️ [**TSX**](https://github.com/esbuild-kit/tsx) – Fast TypeScript runtime
- 📦 [**Tsup**](https://tsup.egoist.dev/) – Bundler
- 🎯 [**Biome**](https://biomejs.dev/) – Formatter & linter
- 🧪 [**Vitest**](https://vitest.dev/) – Unit testing framework
- 📊 [**Vitest Coverage**](https://vitest.dev/guide/coverage.html) – Code coverage
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

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_database_url_here"
```

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

### 🚀 Start the production server

```bash
pnpm start
# or
npm run start
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

### 📊 Run tests with coverage

```bash
pnpm coverage
# or
npm run coverage
```

---



---

Made for study purposes
