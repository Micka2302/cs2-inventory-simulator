/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { DATABASE_URL } from "./env.server";
import { singleton } from "./singleton.server";

function parseMySqlUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
  };
}

const prisma = singleton("prisma", () => {
  const cfg = parseMySqlUrl(DATABASE_URL);

  const adapter = new PrismaMariaDb({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    // option montrée dans les notes Prisma, et utile pour éviter les soucis de pool
    connectionLimit: 10,
  });

  return new PrismaClient({ adapter, log: [] });
});

export { prisma };
