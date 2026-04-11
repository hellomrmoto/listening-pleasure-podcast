async function run() {
  try {
    const res = await fetch('https://www.youtube.com/@ListeningPleasurePodcast');
    const text = await res.text();
    const match = text.match(/"externalId":"(UC[^"]+)"/);
    if (match) {
      const channelId = match[1];
      const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
      const rssText = await rssRes.text();
      
      const videoRegex = /<entry>[\s\S]*?<id>yt:video:(.*?)<\/id>[\s\S]*?<title>(.*?)<\/title>/g;
      let vMatch;
      const videos = [];
      while ((vMatch = videoRegex.exec(rssText)) !== null) {
        videos.push({ id: vMatch[1], title: vMatch[2] });
      }
      console.log(JSON.stringify(videos, null, 2));
    } else {
      console.log("Channel ID not found");
    }
  } catch (e) {
    console.error(e);
  }
}
run();
