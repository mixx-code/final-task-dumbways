import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "final-task",
    password: "rizki",
    port: 5432
})

export default pool