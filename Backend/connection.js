const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_khRW6qHpe1dn@ep-floral-rice-a1gkfpbh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

module.exports = pool;
