import { CommandInteractionOptionResolver, Guild, GuildMember, TextBasedChannel, TextChannel } from "discord.js";

export default interface CommandProps {
  guild: Guild;
  channel: TextChannel;
  member: GuildMember;
  options: Omit<CommandInteractionOptionResolver, "getMessage" | "getFocused">;
}
