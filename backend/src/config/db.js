const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for Atlas SRV queries on macOS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
    // fallback
}

async function main(primaryUri) {
    const uri = primaryUri || process.env.DB_CONNECT_STRING || 'mongodb://127.0.0.1:27017/CodeBlaze';

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            family: 4
        });
        console.log(`✅ MongoDB Connected to: ${uri.includes('@') ? 'Atlas Cluster' : uri}`);
    } catch (primaryErr) {
        console.warn(`⚠️ Primary MongoDB connection failed (${primaryErr.message}). Attempting local fallback...`);
        const localUri = 'mongodb://127.0.0.1:27017/CodeBlaze';
        await mongoose.connect(localUri, {
            serverSelectionTimeoutMS: 5000,
            family: 4
        });
        console.log(`✅ MongoDB Connected (Local Fallback): ${localUri}`);
    }
}

module.exports = main;
