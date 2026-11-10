import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

const FILE = path.join(process.cwd(), "data", "users.json");

type User = { username: string; hash: string };

async function save(user: User) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(user, null, 2));
}

async function load(): Promise<User> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    // Akun awal, dibuat otomatis sekali saja
    const user = { username: "ricardo090606", hash: bcrypt.hashSync("12345", 10) };
    await save(user);
    return user;
  }
}

export async function verifyUser(username: string, password: string) {
  const user = await load();
  if (username !== user.username) return false;
  return bcrypt.compare(password, user.hash);
}

export async function changePassword(
  username: string,
  current: string,
  next: string
) {
  const user = await load();
  if (username !== user.username) return false;
  if (!(await bcrypt.compare(current, user.hash))) return false;
  await save({ username, hash: bcrypt.hashSync(next, 10) });
  return true;
}