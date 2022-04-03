import User from "../models/User";
import UserXpData from "../types/UserXpData";

export function addXp(user: User): UserXpData {
  const randomXp = Math.floor(Math.random() * 13) + 1;
  user.increment("messages");
  user.increment("xp", { by: randomXp });

  const userLevel = user.get("level");
  const userXp = user.get("xp");
  const nextLevelXp = userLevel ** 2 * 300;

  if (userXp >= nextLevelXp) {
    user.increment("level");
    return { levelUp: true, ...getXpData(user) };
  }
  return getXpData(user);
}

export function getXpData(user: User): UserXpData {
  const level = user.get("level");
  const xp = user.get("xp");
  const messages = user.get("messages");

  const nextLevelXp = level ** 2 * 300;
  const prevLevelXp = (level - 1) ** 2 * 300;
  const percentage = Math.round(((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100);

  return {
    level,
    xp,
    messages,
    percentage,
  };
}
