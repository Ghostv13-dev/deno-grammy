import { Bot } from "https://deno.land/x/grammy@v1.20.3/mod.ts";

import { handleStart }     from "./handlers/start.ts";
import { handleMessage }   from "./handlers/message.ts";

import { handleCommunity, handleCommunityCallback } from "./handlers/community.ts";
import { handleSupport,   handleSupportCallback   } from "./handlers/support.ts";
import { handleBroadcast, handleBroadcastCallback } from "./handlers/broadcast.ts";
import { handleScheduler, handleSchedulerCallback } from "./handlers/scheduler.ts";
import { handleAnalytics, handleAnalyticsCallback } from "./handlers/analytics.ts";
import { handleSettings,  handleSettingsCallback  } from "./handlers/settings.ts";
import { runSchedulerTick } from "./handlers/scheduler.ts";

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "");

// ── Commands ──────────────────────────────────────────────
bot.command("start", handleStart);

// ── Main menu reply keyboard buttons ─────────────────────
bot.hears("👥 Community", handleCommunity);
bot.hears("🎫 Support",   handleSupport);
bot.hears("📢 Broadcast", handleBroadcast);
bot.hears("⏰ Scheduler", handleScheduler);
bot.hears("📊 Analytics", handleAnalytics);
bot.hears("⚙️ Settings",  handleSettings);

// ── Callback query routing ────────────────────────────────
bot.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await handleStart(ctx);
});

bot.callbackQuery(/^community:/,  handleCommunityCallback);
bot.callbackQuery(/^support:/,    handleSupportCallback);
bot.callbackQuery(/^broadcast:/,  handleBroadcastCallback);
bot.callbackQuery(/^scheduler:/,  handleSchedulerCallback);
bot.callbackQuery(/^analytics:/,  handleAnalyticsCallback);
bot.callbackQuery(/^settings:/,   handleSettingsCallback);

// ── All text messages (FSM router + support intake) ───────
bot.on("message:text", handleMessage);

// ── Scheduler tick every 60 seconds ──────────────────────
// On TeleBotHost: replace this interval with a scheduled task.
setInterval(() => runSchedulerTick(bot), 60_000);

// ── Start ─────────────────────────────────────────────────
bot.start();
console.log("STOS running.");
