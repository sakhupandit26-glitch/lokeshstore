export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const botToken = process.env.BOT_TOKEN;
    const channelId = process.env.CHANNEL_ID;

    if (!botToken || !channelId) {
      throw new Error("BOT_TOKEN or CHANNEL_ID missing");
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/createChatInviteLink`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: channelId,
          creates_join_request: true
        })
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      console.error("Telegram API error:", result);

      return res.status(500).json({
        error: "Could not create invite link"
      });
    }

    return res.status(200).json({
      success: true,
      invite_link: result.result.invite_link
    });

  } catch (error) {
    console.error("Create invite error:", error.message);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
