#!/usr/bin/env python3
import os

# Read the SQLite schema
with open('backend/prisma/schema.prisma', 'r') as f:
    schema = f.read()

# Replace sqlite with postgresql
schema_postgres = schema.replace('provider = "sqlite"', 'provider = "postgresql"')

# Write the PostgreSQL version
with open('backend/prisma/schema.postgres.prisma', 'w') as f:
    f.write(schema_postgres)

print('Created schema.postgres.prisma')
