// Require the necessary discord.js classes
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, Events, IntentsBitField, ActivityType} = require('discord.js');
const { token, clientId,randomChatter, praiseMessages,responses,randomRemarks,randomReplies,jokes,features} = require('./config.json');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    IntentsBitField.Flags.Guilds,
    GatewayIntentBits.GuildPresences,
  ],
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
const cooldowns = new Map(); // 儲存冷卻時間
const cooldownTimes = {
  default: 3000,      // 其他指令的冷卻時間為 3 秒
  '選號': 300000,     // '選號 發起挑戰' 指令的冷卻時間為 3 分鐘
  '發起挑戰': 300000
};
const commands = [
  new SlashCommandBuilder().setName('功能').setDescription('回覆使用者目前可用功能'),
  new SlashCommandBuilder().setName('你誰').setDescription('藍頭究竟是何許人也?'),
  new SlashCommandBuilder().setName('時間').setDescription('回覆使用者所在地時間'),
  new SlashCommandBuilder().setName('笑話').setDescription('回覆一個隨機笑話'),
  new SlashCommandBuilder().setName('幹話').setDescription('回覆隨機幹話'),
  new SlashCommandBuilder().setName('王曉明').setDescription('作者...'),
  new SlashCommandBuilder().setName('發起挑戰').setDescription('跟藍頭比拼嘴砲，最後看誰獲勝'),
  new SlashCommandBuilder().setName('2024倒數').setDescription('顯示距離2025還有幾天幾小時幾分幾秒'),
  new SlashCommandBuilder().setName('意見回饋').setDescription('提供意見回饋連結'),
  new SlashCommandBuilder().setName('抽獎').setDescription('從伺服器成員中抽出幸運兒')
  .addIntegerOption(option => option.setName('人數').setDescription('抽出人數').setRequired(true))
  .addStringOption(option => option.setName('獎品').setDescription('抽獎的獎品').setRequired(true)),
  new SlashCommandBuilder().setName('遊戲配對').setDescription('查詢伺服器內正在玩指定遊戲的成員')
  .addStringOption(option =>option.setName('遊戲名稱').setDescription('輸入要查詢的遊戲名稱').setRequired(true)),
  new SlashCommandBuilder().setName('選號').setDescription('在一個範圍內,隨機選號')
 .addIntegerOption(option => option.setName('起始值').setDescription('範圍起始值').setRequired(true))
 .addIntegerOption(option => option.setName('結束值').setDescription('範圍結束值').setRequired(true))
 .addIntegerOption(option => option.setName('選取數量').setDescription('隨機選出的數量').setRequired(true)),
  new SlashCommandBuilder().setName('日期查詢').setDescription('查詢某個日期與今天的時間差')
 .addIntegerOption(option =>option.setName('年').setDescription('請輸入西元年份 ').setRequired(true))
 .addIntegerOption(option =>option.setName('月').setDescription('請輸入月份 (1-12)').setRequired(true))
 .addIntegerOption(option =>option.setName('日').setDescription('請輸入日期 (1-31)').setRequired(true))
].map(command => command.toJSON());
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;
  const { commandName, user } = interaction;
  // 初始化該用戶的冷卻時間物件
  if (!cooldowns.has(user.id)) {
    cooldowns.set(user.id, {});
  }
  const userCooldowns = cooldowns.get(user.id);
  const cooldownTime = cooldownTimes[commandName] || cooldownTimes.default;
  // 檢查冷卻時間
  if (userCooldowns[commandName] && Date.now() - userCooldowns[commandName] < cooldownTime) {
    const remainingTime = cooldownTime - (Date.now() - userCooldowns[commandName]);
    return interaction.reply({
      content: `急什麼...你必須等 ${Math.ceil(remainingTime / 1000)} 秒後才能再次執行指令。`,
      ephemeral: true
    });
  }
  // 設定新的冷卻時間
  userCooldowns[commandName] = Date.now();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (commandName === '你誰') {
    const randomResponse = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    await interaction.reply(randomResponse);
  } 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
else if (commandName === '幹話') {
  await interaction.reply(randomRemarks[Math.floor(Math.random() * randomRemarks.length)]);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
else if (commandName === '笑話') { // 處理笑話指令
  const randomJoke =jokes[Math.floor(Math.random() * jokes.length)];
  await interaction.reply(randomJoke);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
else if (commandName === '王曉明') { // 處理笑話指令
  const randomJoke =praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
  await interaction.reply(randomJoke);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
else if (commandName === '意見回饋') {
  await interaction.reply({
    content: '請提供意見回饋至：https://discord.gg/pQCSyXxD2V',
    ephemeral: true,
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
else if (commandName === '功能') {
  // 動態抓取所有已註冊的斜線指令
  const slashCommands = commands.map(command => `\`/${command.name}\``).join(', ');
  features.push(`4. 支援的指令有：${slashCommands}`);
  await interaction.reply({
    content: `目前藍頭支援的功能有：\n${features.join('\n')}`,
    ephemeral: true,
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
else if (commandName === '時間') {
  const userTime = new Intl.DateTimeFormat('zh-TW', {
    timeZone: interaction.user.locale || 'Asia/Taipei',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date());

  await interaction.reply({
    content: `你所在地的時間是：${userTime}`,
    ephemeral: true
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (commandName === '2024倒數') {
  const now = new Date();
  const endOfYear = new Date('2025-01-01T00:00:00Z'); // 2025 年 1 月 1 日的 UTC 時間
  // 檢查是否已經是 2025 年
  if (now >= endOfYear) {
    return interaction.reply({
      content: '該指令已過期，無法使用，因為已經是 2025 年！ 🎉',
      ephemeral: true // 只顯示給使用者
    });
  }
  // 計算距離 2025 年的時間
  const timeDiff = endOfYear - now; // 毫秒差距
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);  
  const countdownMessage = `距離 2025 還有：**${days}天 ${hours}小時 ${minutes}分 ${seconds}秒** 🎆`;
  await interaction.reply({
    content: countdownMessage,
    ephemeral: true // 只顯示給使用者
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
else if (commandName === '選號') {
  const start = interaction.options.getInteger('起始值');
  const end = interaction.options.getInteger('結束值');
  const count = interaction.options.getInteger('選取數量');
  // 驗證選取數量是否大於零
  if (count <= 0) {
    return await interaction.reply({
      content: '請選擇大於零的數量。',
      ephemeral: true
    });
  }
  // 驗證起始值和結束值是否正確
  if (start > end || start < 0 || end < 0) {
    return await interaction.reply({
      content: '請確保起始值小於結束值，且兩者皆為非負數。',
      ephemeral: true
    });
  }
  // 驗證數量是否大於500
  if (count > 500) {
    return await interaction.reply({
      content: '請選擇不超過500的數量。',
      ephemeral: true
    });
  }
  // 驗證範圍內是否有足夠的數字
  if (end - start + 1 < count) {
    return await interaction.reply({
      content: '範圍內的數字數量不足以選出指定數量的隨機數字。請調整範圍或數量。',
      ephemeral: true
    });
  } else {
    await interaction.reply('正在選取隨機號碼...');
    const randomNumbers = generateRandomNumbers(start, end, count);
    let currentChunk = '';
    for (let i = 0; i < randomNumbers.length; i++) {
      const number = randomNumbers[i];
      if (currentChunk.length + number.toString().length + 2 > 2000) {
        await interaction.followUp(currentChunk);
        currentChunk = `${number}`;
      } else {
        currentChunk += (currentChunk.length === 0 ? '' : ', ') + number;
      }
    }
    if (currentChunk.length > 0) {
      await interaction.followUp(currentChunk);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
else if (commandName === '抽獎') {
  // 檢查是否是在伺服器內執行
  if (!interaction.guild) {
    await interaction.reply({
      content: '此指令無法在私人訊息中使用，請在伺服器中執行。',
      ephemeral: true // 僅顯示給使用者
    });
    return;
  }
  const numWinners = interaction.options.getInteger('人數');
  const prize = interaction.options.getString('獎品');
  const guild = interaction.guild;
  const members = await guild.members.fetch();
  const eligibleMembers = members.filter(member => !member.user.bot).map(member => member.user.username);

  if (numWinners <= 0) {
    await interaction.reply({
      content: '抽出人數必須大於0。',
      ephemeral: true
    });
    return;
  }
  if (prize.length > 3000) {
    await interaction.reply({
      content: '獎品名稱不能超過30字。',
      ephemeral: true
    });
    return;
  }
  if (eligibleMembers.length < numWinners) {
    await interaction.reply({
      content: '參與抽獎的人數不足。',
      ephemeral: true
    });
  } else {
    const winners = drawWinners(eligibleMembers, numWinners);
    const winnersList = `恭喜以下幸運兒贏得 ${prize}：${winners.join(', ')}`;
    const chunks = winnersList.match(/.{1,2000}/g) || [];
    for (const chunk of chunks) {
      await interaction.reply(chunk);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  else if (commandName === '發起挑戰') {
      // 檢查是否是在伺服器內執行
  if (!interaction.guild) {
    await interaction.reply({
      content: '此指令無法在私人訊息中使用，請在伺服器中執行。',
      ephemeral: true // 僅顯示給使用者
    });
    return;
  }
    let botCounter = 0;
    await interaction.reply(`<@${interaction.user.id}> ${responses[botCounter]}`);
    const filter = response => response.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });
    collector.on('collect', async () => {
      if (botCounter < responses.length - 1) {
        botCounter++;
        const botReply = responses[botCounter];
        await interaction.followUp(`<@${interaction.user.id}> ${botReply}`);
        collector.resetTimer(); // 重設計時器
      } else {
        collector.stop();  // 如果回應已經結束，停止收集
        await interaction.followUp(`<@${interaction.user.id}> 你才是最強嘴炮王...我會再回來的!||我的回覆只有6句╥﹏╥||`);
      }
    });
    collector.on('end', async (collected, reason) => {
      if (reason === 'time' || collected.size === 0) {
        await interaction.followUp(`<@${interaction.user.id}> 啊哈!我贏了，練練再來吧!||下次記得在30秒內回覆我喔・ω・`);
      }
    });
  }
  function generateRandomNumbers(start, end, count) {
    const numbers = [];
    while (numbers.length < count) {
      const number = Math.floor(Math.random() * (end - start + 1)) + start;
      if (!numbers.includes(number)) {
        numbers.push(number);
      }
    }
    return numbers;
  } 
  function drawWinners(members, numWinners) {
    const winners = [];
    for (let i = 0; i < numWinners; i++) {
      const winner = members[Math.floor(Math.random() * members.length)];
      winners.push(winner);
    }
    return winners;
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
if (commandName === '日期查詢') {
  const year = interaction.options.getInteger('年');
  const month = interaction.options.getInteger('月');
  const day = interaction.options.getInteger('日');
  // 構建日期物件
  const queryDate = new Date(year, month - 1, day);
  // 驗證日期是否有效
  if (isNaN(queryDate.getTime()) || queryDate.getFullYear() !== year || queryDate.getMonth() + 1 !== month || queryDate.getDate() !== day) {
    return interaction.reply({
      content: `無效的日期，請確認輸入的年月日是否正確！`,
      ephemeral: true // 僅顯示給使用者
    });
  }
  // 取得現在時間
  const now = new Date();
  if (queryDate < now) {
    return interaction.reply({
      content: `日期 ${year}-${month}-${day} 已經過去，請查詢未來的日期！`,
      ephemeral: true // 僅顯示給使用者
    });
  }
  // 計算時間差
  const timeDiff = queryDate - now;
  // 換算成日數與餘數
  const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const totalYears = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  // 換算餘數
  const totalHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const totalMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const totalSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  // 根據條件顯示結果
  let responseMessage = '';
  if (totalDays > 365) {
    const totalMonths = Math.floor(remainingDaysAfterYears / 30); // 粗略估算每月30天
    const remainingDays = remainingDaysAfterYears % 30;
    responseMessage = `距離 ${year}-${month}-${day} 還有：**${totalYears}年 ${totalMonths}月 ${remainingDays}天 ${totalHours}小時 ${totalMinutes}分 ${totalSeconds}秒** 🎉`;
  } else {
    responseMessage = `距離 ${year}-${month}-${day} 還有：**${totalDays}天 ${totalHours}小時 ${totalMinutes}分 ${totalSeconds}秒** 🎉`;
  }
  await interaction.reply({
    content: responseMessage,
    ephemeral: true // 僅顯示給使用者
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
else if (commandName === '遊戲配對') {
  // 檢查是否是在伺服器內執行
  if (!interaction.guild) {
    await interaction.reply({
      content: '此指令無法在私人訊息中使用，請在伺服器中執行。',
      ephemeral: true // 僅顯示給使用者
    });
    return;
  }

  // 取得使用者輸入的遊戲名稱
  const inputGameName = interaction.options.getString('遊戲名稱').toLowerCase();

  // 檢查是否有輸入遊戲名稱
  if (!inputGameName) {
    await interaction.reply({
      content: '請輸入遊戲名稱以進行配對。',
      ephemeral: true, // 僅發送給使用者
    });
    return;
  }

  // 檢查遊戲名稱字數是否超過 30 字
  if (inputGameName.length > 30) {
    await interaction.reply({
      content: '遊戲名稱不能超過 30 個字，請重新輸入。',
      ephemeral: true, // 僅發送給使用者
    });
    return;
  }

  // 初始化遊戲玩家列表
  const matchingPlayers = [];
  const matchedGames = new Set();

  // 取得所有成員並進行遊戲檢測
  const members = await interaction.guild.members.fetch();
  members.forEach(member => {
    // 跳過機器人
    if (member.user.bot) return;

    // 檢查成員是否有遊戲活動
    if (member.presence && member.presence.activities.length > 0) {
      member.presence.activities.forEach(activity => {
        if (activity.type === 0) { // 0 代表遊戲活動 (Playing a Game)
          const gameName = activity.name.toLowerCase();
          // 如果遊戲名稱包含輸入字串，則視為匹配
          if (gameName.includes(inputGameName)) {
            matchingPlayers.push(`${member.user.tag} 正在玩 **${activity.name}**`);
            matchedGames.add(activity.name); // 儲存匹配到的遊戲名稱
          }
        }
      });
    }
  });

  // 構建回覆訊息
  let replyMessage = '';
  if (matchingPlayers.length === 0) {
    replyMessage = `目前伺服器中沒有任何人正在玩包含 **${inputGameName}** 的遊戲。`;
  } else {
    replyMessage = `找到的相關遊戲名稱：\n${[...matchedGames].join(', ')}\n\n`;
    replyMessage += `正在玩相關遊戲的玩家：\n${matchingPlayers.join('\n')}`;
  }

  // 回覆訊息
  await interaction.reply({
    content: replyMessage,
    ephemeral: true, // 僅發送給使用者
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on('messageCreate', message => {
  // 檢查訊息是否由機器人發送，若是則不回應
  if (message.author.bot) return;
  // 回應引用的訊息 - 優先處理
  if (message.reference && message.mentions.repliedUser && client.user.id === message.mentions.repliedUser.id) {
    message.reply(randomChatter[Math.floor(Math.random() * randomChatter.length)]);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const presence = {
  activities: [{ name: '成為嘴炮王', type: ActivityType.Competing }],
  status: 'online',  // 設定為在線狀態
};
client.once('ready', async () => {
  console.log(`已登入為 ${client.user.tag}!`);
  await new REST({ version: '10' }).setToken(token).put(
    Routes.applicationCommands(clientId),
    { body: commands }
  );
  // 使用已定義的 presence 設定機器人狀態
  client.user.setPresence(presence);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on('messageDelete', async (deletedMessage) => {
  if (deletedMessage.author.bot) return;
  try {
    await deletedMessage.channel.send(`<@${deletedMessage.author.id}> 一言既出駟馬難追, 還敢收回阿!`);
  } catch (error) {
    console.error('錯誤發送訊息:', error);
  }
});
client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (newMessage.author.bot || oldMessage.content === newMessage.content) return;
  try {
    await newMessage.reply("還敢偷改阿");
  } catch (error) {
    console.error('錯誤發送訊息:', error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WebSocket Close Codes 的解釋
const WebSocketCloseCodes = {
  1000: '正常關閉',
  1001: '伺服器終止連線（通常是重啟或維護）',
  1006: '異常關閉（網路問題或伺服器中斷）',
  4000: '未知的 Discord 錯誤',
  4004: '無效的 token',
  4014: '被強制下線（可能是帳號重複登入）',
  1009: '訊息過大',
  1011: '伺服器內部錯誤',
};

// 捕捉斷線事件
client.on('shardDisconnect', (event) => {
  const disconnectCode = event.code || '未知';
  const disconnectReason = WebSocketCloseCodes[disconnectCode] || '未知原因';

  console.error(`機器人 ${client.user.username} 斷線，原因: ${disconnectReason}（錯誤碼: ${disconnectCode}），正在嘗試重新連線...`);
  restartBot();
});

// 捕捉正在重新連線的事件
client.on('shardReconnecting', () => {
  console.log(`機器人 ${client.user.username} 正在重新連線...`);
});

// 捕捉恢復連線的事件
client.on('shardResume', () => {
  console.log(`機器人 ${client.user.username} 成功恢復連線。`);
});

// 捕捉 Discord.js API 錯誤
client.on('error', async (error) => {
  console.error(`機器人 ${client.user.username} 發生 Discord API 錯誤: ${error.message}`);
  const serverInfo = await fetchServerInfo();
  console.log(`錯誤發生於功能: Discord API 錯誤\n伺服器名稱: ${serverInfo.serverName}\n擁有者名稱: ${serverInfo.ownerTag}`);
  restartBot();
});

// 捕捉 WebSocket 錯誤
client.on('shardError', async (error) => {
  console.error(`機器人 ${client.user.username} 遇到 WebSocket 錯誤: ${error.message}`);
  const serverInfo = await fetchServerInfo();
  console.log(`錯誤發生於功能: WebSocket 連線\n伺服器名稱: ${serverInfo.serverName}\n擁有者名稱: ${serverInfo.ownerTag}`);
  restartBot();
});

// 定義重新啟動機器人函數
function restartBot() {
  console.log('正在重新啟動機器人...');
  client.destroy(); // 關閉當前連線

  // 延遲 5 秒後重新啟動機器人
  setTimeout(() => {
    client.login(token)
      .then(() => console.log('機器人重新啟動成功！'))
      .catch(err => console.error('重新啟動失敗:', err));
  }, 5000);
}

// 定義取得伺服器資訊函數
async function fetchServerInfo() {
  try {
    // 如果沒有任何伺服器，返回預設訊息
    if (client.guilds.cache.size === 0) {
      return { serverName: '未知伺服器', ownerTag: '未知擁有者' };
    }

    // 取得第一個伺服器並獲取其擁有者資訊
    const guild = client.guilds.cache.first();
    const owner = await guild.fetchOwner();
    return {
      serverName: guild.name || '未知伺服器',
      ownerTag: owner.user.tag || '未知擁有者',
    };
  } catch (error) {
    console.error('取得伺服器資訊失敗:', error.message);
    return { serverName: '未知伺服器', ownerTag: '未知擁有者' };
  }
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Log in to Discord with your client's token
client.login(token);
